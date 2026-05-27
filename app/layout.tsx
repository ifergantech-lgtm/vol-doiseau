import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vol D\'oiseau — Boutique Mode Tel Aviv',
  description: 'Robes de soirée et robes de mariée de luxe — vente et location. Tel Aviv, King George 6.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-navy text-cream antialiased">{children}</body>
    </html>
  )
}
