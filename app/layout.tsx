import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, Public_Sans } from 'next/font/google'
import Script from 'next/script'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { AiFab } from '@/components/layout/ai-fab'
import { MobileTabBar } from '@/components/layout/mobile-tab-bar'
import { SITE } from '@/lib/site'
import './globals.css'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
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

/**
 * MioLegale.it - Gestione widget Google Funding Choices
 * Nasconde:
 * - Widget flottante desktop (#ft-floating-toolbar)
 * - Link automatico mobile (.ipr-container)
 * Utilizza MutationObserver, senza polling.
 */
const FC_WIDGET_HIDER = `(()=>{"use strict";const s="#ft-floating-toolbar, .ipr-container",r=new WeakSet,f=new WeakSet;function a(e){try{e.contentDocument&&o(e.contentDocument)}catch(t){}}function n(e){if(!e||![1,9,11].includes(e.nodeType))return;if(e.nodeType===1&&e.matches(s)){e.remove();return}if(!e.querySelectorAll)return;e.querySelectorAll(s).forEach(t=>t.remove());function i(t){t.shadowRoot&&o(t.shadowRoot);if(t.tagName==="IFRAME"){if(!f.has(t)){f.add(t);t.addEventListener("load",()=>a(t))}a(t)}}e.nodeType===1&&i(e);e.querySelectorAll("*").forEach(i)}function o(e){if(r.has(e))return;r.add(e);new MutationObserver(t=>{for(const c of t)for(const d of c.addedNodes)n(d)}).observe(e,{childList:true,subtree:true});n(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>o(document),{once:true}):o(document)})();`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${plexSans.variable} ${publicSans.variable} bg-background`}
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
        <AiFab />
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
        <Script id="fc-widget-hider" strategy="afterInteractive">
          {FC_WIDGET_HIDER}
        </Script>
      </body>
    </html>
  )
}
