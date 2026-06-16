/**
 * generate-logo.js — one-off asset generator.
 * From "public/logo bird final.png" (gold bird on navy) produce:
 *   1. public/logo-bird.png  — same bird, navy background removed (transparent)
 *   2. public/logo-bird.svg  — vector trace of the bird, filled with the gold gradient
 *   3. public/logo-bird-preview.png — SVG rasterised, just to eyeball the trace
 *
 * Run from the vol-doiseau folder: node generate-logo.js
 * (potrace is installed with --no-save; not a project dependency.)
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { Potrace } = require('potrace')

const SRC = path.join(__dirname, 'public', 'logo bird final.png')
const PUB = path.join(__dirname, 'public')

async function main() {
  // ── 1. Transparent PNG: navy → transparent via luminance-based alpha ──
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.from(data)
  const LO = 55, HI = 105 // luminance band for soft edges
  for (let i = 0; i < out.length; i += channels) {
    const lum = 0.2126 * out[i] + 0.7152 * out[i + 1] + 0.0722 * out[i + 2]
    let a = (lum - LO) / (HI - LO)
    a = a < 0 ? 0 : a > 1 ? 1 : a
    out[i + 3] = Math.round(a * out[i + 3])
  }
  await sharp(out, { raw: { width, height, channels } }).png().toFile(path.join(PUB, 'logo-bird.png'))
  console.log(`✓ public/logo-bird.png  (${width}x${height}, transparent)`)

  // ── 2. Vector trace: foreground = the bright bird ──
  await new Promise((resolve, reject) => {
    const tracer = new Potrace({
      blackOnWhite: false, // trace the LIGHT areas (gold bird), not the dark bg
      threshold: 92,
      turdSize: 60,        // ignore specks smaller than this (px area)
      optCurve: true,
      optTolerance: 0.4,
      turnPolicy: 'minority',
    })
    tracer.loadImage(SRC, (err) => {
      if (err) return reject(err)
      const pathTag = tracer.getPathTag('url(#goldGrad)')
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Vol D'Oiseau">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8c97a"/>
      <stop offset="45%" stop-color="#c9a84c"/>
      <stop offset="100%" stop-color="#b8860b"/>
    </linearGradient>
  </defs>
  ${pathTag}
</svg>
`
      fs.writeFileSync(path.join(PUB, 'logo-bird.svg'), svg)
      console.log('✓ public/logo-bird.svg  (vector)')
      resolve()
    })
  })

  // ── 3. Preview: rasterise the SVG so we can eyeball the trace ──
  await sharp(path.join(PUB, 'logo-bird.svg'), { density: 200 })
    .resize(400, 400, { fit: 'contain', background: { r: 26, g: 31, b: 58, alpha: 1 } })
    .png()
    .toFile(path.join(PUB, 'logo-bird-preview.png'))
  console.log('✓ public/logo-bird-preview.png  (preview on navy)')
}

main().catch((e) => { console.error(e); process.exit(1) })
