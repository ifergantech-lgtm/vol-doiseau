/**
 * AmbientGlow — drop-in decorative motion layer for a section.
 * Renders 1–2 slowly drifting gold aurora orbs plus a few rising gold
 * particles. Pure CSS animations (no JS), pointer-events-none.
 *
 * The PARENT element must be `position: relative` and `overflow-hidden`.
 */

const PARTICLE_SETS = {
  light: [
    { left: '18%', size: 2, duration: '10s', delay: '0s' },
    { left: '52%', size: 1.5, duration: '13s', delay: '3s' },
    { left: '81%', size: 1, duration: '9s', delay: '5s' },
  ],
  rich: [
    { left: '10%', size: 2, duration: '11s', delay: '0s' },
    { left: '30%', size: 1.5, duration: '9s', delay: '2.2s' },
    { left: '48%', size: 1, duration: '13s', delay: '4.5s' },
    { left: '67%', size: 2, duration: '10s', delay: '1.4s' },
    { left: '88%', size: 1.5, duration: '12s', delay: '3.6s' },
  ],
}

interface AmbientGlowProps {
  /** Number of decorative particles. Default 'light'. */
  density?: 'light' | 'rich'
  /** Where the larger orb sits. Default 'top-right'. */
  orb?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const ORB_POS: Record<string, React.CSSProperties> = {
  'top-right': { top: '6%', right: '8%' },
  'top-left': { top: '8%', left: '6%' },
  'bottom-right': { bottom: '8%', right: '6%' },
  'bottom-left': { bottom: '10%', left: '8%' },
}

export default function AmbientGlow({ density = 'light', orb = 'top-right' }: AmbientGlowProps) {
  const particles = PARTICLE_SETS[density]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Large drifting orb */}
      <div
        className="absolute rounded-full animate-aurora"
        style={{
          ...ORB_POS[orb],
          width: 'clamp(220px, 30vw, 420px)',
          height: 'clamp(220px, 30vw, 420px)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.16) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      {/* Small counter orb */}
      <div
        className="absolute rounded-full animate-aurora"
        style={{
          bottom: '12%',
          left: orb.includes('left') ? '60%' : '10%',
          width: 'clamp(120px, 16vw, 240px)',
          height: 'clamp(120px, 16vw, 240px)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '-8s',
        }}
      />
      {/* Rising particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold"
          style={{
            bottom: '6%',
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            animation: `particle-rise ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
