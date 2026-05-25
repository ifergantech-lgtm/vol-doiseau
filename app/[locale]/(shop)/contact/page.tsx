import { getTranslations } from 'next-intl/server'
import EnquiryForm from '@/components/EnquiryForm'
import Reveal from '@/components/Reveal'
import { getWhatsAppUrl } from '@/lib/utils'

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  await params
  const t = await getTranslations('contact')
  const whatsappUrl = getWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33781721617')

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

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20 md:py-24 grid md:grid-cols-2 gap-12 md:gap-16">
        {/* Form */}
        <Reveal>
          <div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.12em] uppercase text-cream mb-8">
              {t('title')}
            </h2>
            <EnquiryForm enquiryType="general" />
          </div>
        </Reveal>

        {/* Info */}
        <Reveal stagger className="space-y-8 sm:space-y-10">
          {/* WhatsApp */}
          <div>
            <h3 className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-4">WhatsApp</h3>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-4 border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold transition-all text-xs tracking-widest uppercase group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('whatsapp_cta')}
            </a>
          </div>

          {/* Phone */}
          <div>
            <h3 className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">Tel</h3>
            <a
              href="tel:0502290718"
              className="text-cream/75 hover:text-gold transition-colors text-base sm:text-lg tracking-wide font-display"
            >
              050-229-0718
            </a>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">{t('address')}</h3>
            <p className="text-cream/75 text-sm sm:text-base font-display tracking-wide">King George 6, Tel Aviv</p>
          </div>

          {/* Map */}
          <div className="aspect-video border border-gold/10 overflow-hidden rounded-sm hover:border-gold/30 transition-colors duration-500">
            <iframe
              src="https://maps.google.com/maps?q=King+George+6+Tel+Aviv&output=embed"
              className="w-full h-full grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
              loading="lazy"
              title="Vol D'Oiseau location"
            />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
