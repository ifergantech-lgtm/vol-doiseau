'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'

/**
 * A real Verlet cloth linked to the bird: the bird sweeps left→right and the
 * navy-satin sheet is unpinned column by column just behind it, peeling off and
 * falling under gravity — so the bird appears to draw the cloth away and drop
 * it, uncovering the site behind the transparent canvas.
 */

const SWEEP_START = 0.3 // s before the bird starts crossing
const SWEEP_DUR = 2.3 // s for the bird to cross + peel the cloth
const MAX_LIFE = 4.6 // s safety cap
const FIXED_DT = 1 / 60

interface ClothSim {
  geometry: THREE.BufferGeometry
  pos: Float32Array
  prev: Float32Array
  pinned: Uint8Array
  constraints: { a: number; b: number; rest: number }[]
  H: number
  cols: number
}

function buildSim(W: number, H: number, cols: number, rows: number): ClothSim {
  const nx = cols + 1
  const ny = rows + 1
  const count = nx * ny
  const pos = new Float32Array(count * 3)
  const prev = new Float32Array(count * 3)
  const pinned = new Uint8Array(count)
  const uv = new Float32Array(count * 2)

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i
      const x = -W / 2 + (i / cols) * W
      const y = H / 2 - (j / rows) * H
      const z = Math.sin(i * 0.6) * 0.12 + Math.sin(j * 0.5) * 0.1
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z
      prev[k * 3] = x; prev[k * 3 + 1] = y; prev[k * 3 + 2] = z
      pinned[k] = j === 0 ? 1 : 0 // top row pinned; released L→R as the bird passes
      uv[k * 2] = i / cols; uv[k * 2 + 1] = 1 - j / rows
    }
  }

  const constraints: { a: number; b: number; rest: number }[] = []
  const dx = W / cols
  const dy = H / rows
  const diag = Math.hypot(dx, dy)
  const add = (a: number, b: number, rest: number) => constraints.push({ a, b, rest })
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i
      if (i < nx - 1) add(k, k + 1, dx)
      if (j < ny - 1) add(k, k + nx, dy)
      if (i < nx - 1 && j < ny - 1) {
        add(k, k + nx + 1, diag)
        add(k + 1, k + nx, diag)
      }
    }
  }

  const indices: number[] = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * nx + i
      indices.push(k, k + nx, k + 1, k + 1, k + nx, k + nx + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return { geometry, pos, prev, pinned, constraints, H, cols }
}

interface ClothProps {
  onReveal: () => void
  onDone: () => void
  freezeAt?: number
  birdRef: RefObject<HTMLImageElement | null>
}

function positionBird(el: HTMLImageElement | null, front: number) {
  if (!el) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const x = front * (vw + 120) - 60 // travels fully across, entering/leaving off-screen
  const y = vh * 0.16 + Math.sin(Math.min(front, 1) * Math.PI) * -vh * 0.06 // gentle arc
  const rot = -8 + front * 20
  el.style.transform = `translate(${x - 48}px, ${y - 48}px) rotate(${rot}deg)`
  el.style.opacity = String(front < 0.04 ? front / 0.04 : front > 0.97 ? Math.max(0, (1.05 - front) / 0.08) : 1)
}

function Cloth({ onReveal, onDone, freezeAt, birdRef }: ClothProps) {
  const { viewport } = useThree()
  const W = viewport.width * 1.25
  const H = viewport.height * 1.25
  const mobile = typeof window !== 'undefined' && window.innerWidth < 640
  const cols = mobile ? 18 : 30
  const rows = mobile ? 12 : 20

  const sim = useMemo(() => buildSim(W, H, cols, rows), [W, H, cols, rows])
  const elapsed = useRef(0)
  const revealed = useRef(false)
  const done = useRef(false)
  const frozen = useRef(false)

  function progress() {
    return Math.min(Math.max((elapsed.current - SWEEP_START) / SWEEP_DUR, 0), 1)
  }

  function step(dt: number) {
    const { pos, prev, pinned, constraints, H } = sim
    elapsed.current += dt
    const p = progress()
    const front = p * 1.06 // bird leads the peel slightly

    if (p > 0 && !revealed.current) {
      revealed.current = true
      onReveal()
    }

    // unpin the top row column-by-column as the bird passes; kick each free
    for (let i = 0; i <= cols; i++) {
      if (pinned[i] && front >= i / cols) {
        pinned[i] = 0
        prev[i * 3 + 1] = pos[i * 3 + 1] - H * 0.05 // flick up where the bird grabs
        prev[i * 3 + 2] = pos[i * 3 + 2] - 0.6 // toward camera
      }
    }

    const g = -H * 0.95
    const gdt2 = g * dt * dt
    const damp = 0.985
    const t = elapsed.current

    for (let k = 0; k < pinned.length; k++) {
      if (pinned[k]) continue
      const ix = k * 3
      for (let c = 0; c < 3; c++) {
        const cur = pos[ix + c]
        let next = cur + (cur - prev[ix + c]) * damp
        if (c === 1) next += gdt2
        if (c === 2) next += Math.sin(t * 3 + pos[ix] * 0.8 + pos[ix + 1]) * 0.012
        prev[ix + c] = cur
        pos[ix + c] = next
      }
    }

    for (let iter = 0; iter < 3; iter++) {
      for (let n = 0; n < constraints.length; n++) {
        const { a, b, rest } = constraints[n]
        const ax = a * 3
        const bx = b * 3
        const ddx = pos[bx] - pos[ax]
        const ddy = pos[bx + 1] - pos[ax + 1]
        const ddz = pos[bx + 2] - pos[ax + 2]
        const d = Math.hypot(ddx, ddy, ddz) || 1e-6
        const diff = ((d - rest) / d) * 0.5
        const ox = ddx * diff, oy = ddy * diff, oz = ddz * diff
        if (!pinned[a]) { pos[ax] += ox; pos[ax + 1] += oy; pos[ax + 2] += oz }
        if (!pinned[b]) { pos[bx] -= ox; pos[bx + 1] -= oy; pos[bx + 2] -= oz }
      }
    }
  }

  function commit() {
    sim.geometry.attributes.position.needsUpdate = true
    sim.geometry.computeVertexNormals()
  }

  useFrame((_, rawDelta) => {
    if (done.current) return

    if (freezeAt != null) {
      if (frozen.current) return
      let guard = 0
      while (elapsed.current < freezeAt && guard < 3000) { step(FIXED_DT); guard++ }
      commit()
      positionBird(birdRef.current, progress() * 1.06)
      frozen.current = true
      return
    }

    step(Math.min(rawDelta, 1 / 30))
    commit()
    positionBird(birdRef.current, progress() * 1.06)

    let topMost = -Infinity
    const { pos, pinned, H } = sim
    for (let k = 0; k < pinned.length; k++) topMost = Math.max(topMost, pos[k * 3 + 1])
    if ((progress() >= 1 && topMost < -H / 2) || elapsed.current > MAX_LIFE) {
      done.current = true
      onDone()
    }
  })

  return (
    <mesh geometry={sim.geometry}>
      <meshPhysicalMaterial
        color="#181d38"
        roughness={0.62}
        metalness={0}
        sheen={1}
        sheenRoughness={0.32}
        sheenColor={'#c9a84c'}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

interface ClothCanvasProps {
  onReveal: () => void
  onDone: () => void
  freezeAt?: number
  birdRef: RefObject<HTMLImageElement | null>
}

export default function ClothCanvas({ onReveal, onDone, freezeAt, birdRef }: ClothCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3, 4, 6]} intensity={1.5} />
      <directionalLight position={[4, -2, 3]} intensity={0.4} color={'#c9a84c'} />
      <Cloth onReveal={onReveal} onDone={onDone} freezeAt={freezeAt} birdRef={birdRef} />
    </Canvas>
  )
}
