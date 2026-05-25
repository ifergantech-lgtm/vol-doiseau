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
      <section className="py-16 sm:py-24 md:py-28 px-5 sm:px-6 text-center border-b border-gold/10 animate-fade-in-down">
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-4">Vol D&apos;Oiseau</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.12em] uppercase text-cream mb-4">
          {t('title')}
        </h1>
        <p className="text-cream/55 text-sm tracking-wide max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
        <div className="mt-6 w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <Reveal stagger className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {/* Children */}
          <div className="group relative border border-gold/10 p-6 sm:p-8 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(201,168,76,0.2)] overflow-hidden">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mb-4 group-hover:text-gold transition-colors">01</p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-[0.12em] uppercase text-cream mb-4 group-hover:text-gold transition-colors">
              {t('children_title')}
            </h2>
            <div className="w-8 h-px bg-gold/30 mb-6 group-hover:w-16 transition-all duration-500" />
            <dl className="space-y-4 text-sm text-cream/60">
              <div>
                <dt className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-1">{t('schedule')}</dt>
                <dd className="font-display text-base">{childrenSchedule}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-1">{t('duration')}</dt>
                <dd>{t('sessions')}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-1">{t('location')}</dt>
                <dd>{t('location_value')}</dd>
              </div>
            </dl>
          </div>

          {/* Adults */}
          <div className="group relative border border-gold/10 p-6 sm:p-8 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(201,168,76,0.2)] overflow-hidden">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mb-4 group-hover:text-gold transition-colors">02</p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-[0.12em] uppercase text-cream mb-4 group-hover:text-gold transition-colors">
              {t('adults_title')}
            </h2>
            <div className="w-8 h-px bg-gold/30 mb-6 group-hover:w-16 transition-all duration-500" />
            <dl className="space-y-4 text-sm text-cream/60">
              <div>
                <dt className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-1">{t('schedule')}</dt>
                <dd className="font-display text-base">{adultsSchedule}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-1">{t('duration')}</dt>
                <dd>{t('sessions')}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-1">{t('location')}</dt>
                <dd>{t('location_value')}</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>

      {/* Curriculum */}
      <section className="py-14 sm:py-16 px-5 sm:px-6 bg-navy-deep border-y border-gold/10">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-xl sm:text-2xl tracking-[0.15em] uppercase text-cream mb-4">
              {t('curriculum_title')}
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="text-cream/55 text-sm sm:text-base leading-relaxed">{t('curriculum')}</p>
          </div>
        </Reveal>
      </section>

      {/* Enquiry form */}
      <section className="py-16 sm:py-24 px-5 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-2xl sm:text-3xl tracking-[0.15em] uppercase text-cream text-center mb-3">
              {t('enquire')}
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10" />
            <EnquiryForm enquiryType="class" />
          </div>
        </Reveal>
      </section>
    </div>
  )
}
