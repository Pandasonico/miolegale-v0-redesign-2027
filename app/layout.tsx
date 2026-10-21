import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google'
import Script from 'next/script'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { MobileTabBar } from '@/components/layout/mobile-tab-bar'
import { SITE } from '@/lib/site'
import './globals.css'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
})
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'MioLegale – Banca dati giuridica, calcolatori legali e AI',
    template: '%s | MioLegale',
  },
  description:
    'Massime, sentenze, norme e guide di diritto. Calcolatori legali gratuiti (interessi, contributo unificato, termini) e assistente AI giuridico.',
  openGraph: { siteName: 'MioLegale', locale: 'it_IT', type: 'website' },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#173f71',
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${plexSans.variable} ${plexSerif.variable} bg-background`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] antialiased lg:pb-0"
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <MobileTabBar />
        {ADSENSE_CLIENT && (
          <Script
            id="adsense"
            async
            strategy="lazyOnload"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
