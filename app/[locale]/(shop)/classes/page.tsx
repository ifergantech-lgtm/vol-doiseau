import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import EnquiryForm from '@/components/EnquiryForm'
import Reveal from '@/components/Reveal'
import { getLocalizedText, type Locale } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClassesPage({ params }: PageProps<'/[locale]/classes'>) {
  const { locale } = await params
  const t = await getTranslations('classes')

  const supabase = await createClient()
  const { data: classInfo } = await supabase
    .from('class_info')
    .select('*')
    .eq('id', 1)
    .single()

  const childrenSchedule = classInfo
    ? getLocalizedText(classInfo.children_schedule, locale as Locale)
    : t('schedule_children')
  const adultsSchedule = classInfo
    ? getLocalizedText(classInfo.adults_schedule, locale as Locale)
    : t('schedule_adults')

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-12 sm:py-20 md:py-28 px-5 sm:px-6 text-center border-b border-gold/10 animate-fade-in-down">
        <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3 sm:mb-4">Vol D&apos;Oiseau</p>
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-[0.12em] uppercase text-cream mb-3 sm:mb-4 leading-[1.2]">
          {t('title')}
        </h1>
        <p className="text-cream/55 text-sm sm:text-base tracking-wide max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
        <div className="mt-5 sm:mt-6 w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
      </section>

      {/* Studio Section — integrated layout */}
      <section className="py-12 sm:py-20 md:py-24 px-5 sm:px-6 bg-navy-deep border-b border-gold/10">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            <h3 className="font-display text-xl sm:text-3xl tracking-[0.15em] uppercase text-cream text-center mb-3 sm:mb-4 leading-[1.2]">
              {t('studio')}
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8 sm:mb-12" />

            {/* Children Classes + Images */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 items-center">
              <Reveal>
                <div className="space-y-2">
                  <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mb-3 sm:mb-4">01</p>
                  <h2 className="font-display text-xl sm:text-3xl tracking-[0.12em] uppercase text-cream mb-4 sm:mb-6 leading-[1.2]">
                    {t('children_title')}
                  </h2>
                  <div className="w-8 h-px bg-gold/30 mb-6 sm:mb-8" />
                  <dl className="space-y-4 sm:space-y-5 text-sm text-cream/60">
                    <div>
                      <dt className="text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-2">{t('schedule')}</dt>
                      <dd className="font-display text-base text-cream">{childrenSchedule}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-2">{t('duration')}</dt>
                      <dd className="text-cream">{t('sessions')}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-2">{t('location')}</dt>
                      <dd className="text-cream">{t('location_value')}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
              <Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group relative overflow-hidden aspect-square border border-gold/20 hover:border-gold/50 transition-colors duration-500">
                    <img
                      src="/shop-photos/IMG_20260524_111022.jpg"
                      alt="Sewing studio workspace"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="group relative overflow-hidden aspect-square border border-gold/20 hover:border-gold/50 transition-colors duration-500">
                    <img
                      src="/shop-photos/IMG_20260524_111033.jpg"
                      alt="Sewing machines and tools"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Adults Classes + Images */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:order-2">
                  <div className="group relative overflow-hidden aspect-square border border-gold/20 hover:border-gold/50 transition-colors duration-500">
                    <img
                      src="/shop-photos/IMG_20260524_111049.jpg"
                      alt="Class workspace detail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="group relative overflow-hidden aspect-square border border-gold/20 hover:border-gold/50 transition-colors duration-500">
                    <img
                      src="/shop-photos/IMG_20260524_111110.jpg"
                      alt="Studio environment"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </Reveal>
              <Reveal>
                <div className="space-y-2 md:order-1">
                  <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mb-3 sm:mb-4">02</p>
                  <h2 className="font-display text-xl sm:text-3xl tracking-[0.12em] uppercase text-cream mb-4 sm:mb-6 leading-[1.2]">
                    {t('adults_title')}
                  </h2>
                  <div className="w-8 h-px bg-gold/30 mb-6 sm:mb-8" />
                  <dl className="space-y-4 sm:space-y-5 text-sm text-cream/60">
                    <div>
                      <dt className="text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-2">{t('schedule')}</dt>
                      <dd className="font-display text-base text-cream">{adultsSchedule}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-2">{t('duration')}</dt>
                      <dd className="text-cream">{t('sessions')}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-2">{t('location')}</dt>
                      <dd className="text-cream">{t('location_value')}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Curriculum */}
      <section className="py-12 sm:py-16 px-5 sm:px-6 bg-navy-deep border-y border-gold/10">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-lg sm:text-2xl tracking-[0.15em] uppercase text-cream mb-3 sm:mb-4 leading-[1.2]">
              {t('curriculum_title')}
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-5 sm:mb-6" />
            <p className="text-cream/55 text-sm sm:text-base leading-relaxed">{t('curriculum')}</p>
          </div>
        </Reveal>
      </section>

      {/* Enquiry form */}
      <section className="py-12 sm:py-20 md:py-24 px-5 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl sm:text-3xl tracking-[0.15em] uppercase text-cream text-center mb-3 sm:mb-4 leading-[1.2]">
              {t('enquire')}
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8 sm:mb-10" />
            <EnquiryForm enquiryType="class" />
          </div>
        </Reveal>
      </section>
    </div>
  )
}
