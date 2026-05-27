import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

export default function ClassesPage() {
  const t = useTranslations('classes')

  const classes = [
    {
      id: 'children',
      titleKey: 'childrenTitle',
      descriptionKey: 'childrenDesc',
      ageKey: 'childrenAge',
      scheduleKey: 'childrenSchedule',
      durationKey: 'duration',
      sessionsKey: 'sessions',
    },
    {
      id: 'adults',
      titleKey: 'adultsTitle',
      descriptionKey: 'adultsDesc',
      ageKey: 'adultsAge',
      scheduleKey: 'adultsSchedule',
      durationKey: 'duration',
      sessionsKey: 'sessions',
    },
  ]

  return (
    <main className="bg-navy">
      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-6">
        <Reveal>
          <div className="text-center space-y-3 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-display tracking-[0.1em] uppercase text-cream leading-tight">
              {t('hero')}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-cream/60 max-w-2xl mx-auto leading-relaxed">
              {t('heroSub')}
            </p>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* Classes Grid */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="group relative overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-300"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-5">
                  {/* Header */}
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-display tracking-[0.1em] uppercase text-gold">
                      {t(classItem.titleKey)}
                    </h2>
                    <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-cream/50">
                      {t(classItem.ageKey)}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-cream/70 leading-relaxed">
                    {t(classItem.descriptionKey)}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                    {/* Schedule */}
                    <div className="space-y-1">
                      <p className="text-[9px] sm:text-xs tracking-[0.2em] uppercase text-gold/60">
                        {t('schedule')}
                      </p>
                      <p className="text-[11px] sm:text-xs md:text-sm text-cream/80 leading-snug">
                        {t(classItem.scheduleKey)}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                      <p className="text-[9px] sm:text-xs tracking-[0.2em] uppercase text-gold/60">
                        {t('length')}
                      </p>
                      <p className="text-[11px] sm:text-xs md:text-sm text-cream/80">
                        {t(classItem.durationKey)}
                      </p>
                    </div>

                    {/* Sessions */}
                    <div className="space-y-1">
                      <p className="text-[9px] sm:text-xs tracking-[0.2em] uppercase text-gold/60">
                        {t('courseLength')}
                      </p>
                      <p className="text-[11px] sm:text-xs md:text-sm text-cream/80">
                        {t(classItem.sessionsKey)}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-3 sm:pt-4 border-t border-gold/10">
                    <Link
                      href="/contact"
                      className="inline-block text-[9px] sm:text-xs tracking-[0.2em] uppercase text-gold hover:text-cream transition-colors py-2 sm:py-2.5 px-3 sm:px-5 border border-gold/30 hover:border-gold/60 group-hover:bg-gold/10 transition-all duration-300 whitespace-nowrap"
                    >
                      {t('enquire')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 p-4 sm:p-6 md:p-10 space-y-3 sm:space-y-5">
              <h3 className="text-base sm:text-lg md:text-xl font-display tracking-[0.1em] uppercase text-gold">
                {t('interested')}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-cream/70 leading-relaxed max-w-3xl">
                {t('infoText')}
              </p>
              <Link
                href="/contact"
                className="inline-block text-[9px] sm:text-xs tracking-[0.2em] uppercase text-cream hover:text-gold transition-colors py-2 sm:py-2.5 px-3 sm:px-5 border border-cream/40 hover:border-gold transition-all duration-300"
              >
                {t('contactUs')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
