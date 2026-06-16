import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import Marquee from '@/components/Marquee'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import ScrollProgress from '@/components/ScrollProgress'
import IntroOverlay from '@/components/IntroOverlay'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33781721617'

  return (
    <NextIntlClientProvider messages={messages}>
      <IntroOverlay />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Marquee items={["Vol D'Oiseau", 'Paris', 'Tel Aviv', 'Haute Couture', 'Sur Mesure']} />
      <Footer />
      <BottomNav />
      <FloatingWhatsApp number={whatsappNumber} label="WhatsApp" />
    </NextIntlClientProvider>
  )
}
