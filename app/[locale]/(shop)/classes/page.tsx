import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

export const dynamic = 'force-dynamic'

export default async function ClassesPage({ params }: PageProps<'/[locale]/classes'>) {
  const { locale } = await params
  const t = await getTranslations('classes')

  const classes = [
    {
      num:      '01',
      titleKey: 'childrenTitle' as const,
      descKey:  'childrenDesc' as const,
      ageKey:   'childrenAge' as const,
      schedKey: 'childrenSchedule' as const,
    },
    {
      num:      '02',
      titleKey: 'adultsTitle' as const,
      descKey:  'adultsDesc' as const,
      ageKey:   'adultsAge' as const,
      schedKey: 'adultsSchedule' as const,
    },
  ]

  return (
    <main className="bg-navy min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <Reveal>
          <p className="text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-gold/50 mb-5 sm:mb-7">
            Vol D&apos;Oiseau — {t('studio')}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.06em] text-cream leading-[1.05] mb-6 sm:mb-8">
            {t('hero')}
          </h1>
          <div className="w-14 h-px bg-gradient-to-r from-gold to-transparent mb-6 sm:mb-8" />
          <p className="text-cream/55 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-light">
            {t('heroSub')}
          </p>
        </Reveal>
      </section>

      {/* ── Classes ──────────────────────────────────────── */}
      {classes.map((cls, i) => (
        <section
          key={cls.num}
          className={`px-5 sm:px-8 py-14 sm:py-20 border-t border-gold/10 ${
            i % 2 === 1 ? 'bg-navy-deep' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 sm:gap-16 items-start">

                {/* Left — number + title + description */}
                <div>
                  <span className="font-display text-[72px] sm:text-[100px] md:text-[130px] leading-none text-gold/8 select-none block -mb-4 sm:-mb-6">
                    {cls.num}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] text-cream mb-4 sm:mb-5">
                    {t(cls.titleKey)}
                  </h2>
                  <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold/50 mb-5 sm:mb-7">
                    {t(cls.ageKey)}
                  </p>
                  <p className="text-cream/65 text-sm sm:text-base leading-relaxed max-w-lg">
                    {t(cls.descKey)}
                  </p>
                </div>

                {/* Right — specs + CTA */}
                <div className="border border-gold/15 p-6 sm:p-8 space-y-6">
                  {/* Schedule */}
                  <div>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-gold/45 mb-1.5">
                      {t('schedule')}
                    </p>
                    <p className="text-cream text-sm sm:text-base font-display tracking-wide">
                      {t(cls.schedKey)}
                    </p>
                  </div>
                  <div className="h-px bg-gold/10" />
                  {/* Duration */}
                  <div>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-gold/45 mb-1.5">
                      {t('length')}
                    </p>
                    <p className="text-cream text-sm sm:text-base font-display tracking-wide">
                      {t('duration')}
                    </p>
                  </div>
                  <div className="h-px bg-gold/10" />
                  {/* Course length */}
                  <div>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-gold/45 mb-1.5">
                      {t('courseLength')}
                    </p>
                    <p className="text-cream text-sm sm:text-base font-display tracking-wide">
                      {t('sessions')}
                    </p>
                  </div>
                  <div className="h-px bg-gold/10" />
                  {/* Location */}
                  <div>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-gold/45 mb-1.5">
                      {t('location')}
                    </p>
                    <p className="text-cream text-sm sm:text-base font-display tracking-wide">
                      {t('location_value')}
                    </p>
                  </div>
                  {/* CTA */}
                  <Link
                    href={`/${locale}/contact`}
                    className="block text-center text-[10px] tracking-widest uppercase font-medium text-navy-deep py-3.5 mt-2 transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
                  >
                    {t('enquire')} →
                  </Link>
                </div>

              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ── Curriculum strip ─────────────────────────────── */}
      <section className="px-5 sm:px-8 py-14 sm:py-20 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-16">
              <div className="flex-shrink-0">
                <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-2">
                  {t('curriculum_title')}
                </p>
                <div className="w-8 h-px bg-gold/40" />
              </div>
              <p className="text-cream/60 text-sm sm:text-base leading-relaxed">
                {t('curriculum')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 border-t border-gold/10 bg-navy-deep">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-4">
                  — {t('studio')} —
                </p>
                <h2 className="font-display text-2xl sm:text-4xl md:text-5xl tracking-[0.07em] text-cream mb-3">
                  {t('interested')}
                </h2>
                <p className="text-cream/45 text-xs sm:text-sm leading-relaxed max-w-md">
                  {t('infoText')}
                </p>
              </div>
              <Link
                href={`/${locale}/contact`}
                className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 text-[10px] tracking-widest uppercase font-medium text-navy-deep transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
              >
                {t('contactUs')} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}
