'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

type Variant = 'leaderboard' | 'rectangle' | 'skyscraper' | 'in-article' | 'in-feed'

// Altezze riservate in anticipo: l'annuncio non sposta il contenuto quando arriva (CLS = 0).
const SIZES: Record<Variant, string> = {
  leaderboard: 'min-h-[100px] md:min-h-[90px]',
  rectangle: 'min-h-[250px]',
  skyscraper: 'min-h-[600px]',
  'in-article': 'min-h-[250px]',
  'in-feed': 'min-h-[120px]',
}

export function AdSlot({
  slot,
  variant = 'rectangle',
  className,
  fill = false,
}: {
  /** ID dello slot AdSense (data-ad-slot). */
  slot?: string
  variant?: Variant
  className?: string
  /** Lo spazio annuncio si allunga fino a occupare tutta l'altezza del contenitore. */
  fill?: boolean
}) {
  const ref = useRef<HTMLModElement>(null)
  const live = Boolean(ADSENSE_CLIENT && slot)

  useEffect(() => {
    const el = ref.current
    if (!live || !el) return
    // Richiede l'annuncio solo quando lo slot si avvicina allo schermo: pagina iniziale più leggera.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || el.dataset.adsbygoogleStatus) return
        observer.disconnect()
        try {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {
          // AdSense può rifiutare il push se lo slot ha larghezza zero.
        }
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [live])

  return (
    <aside
      aria-label="Annuncio"
      className={cn(
        'flex w-full flex-col gap-2 border-y border-border py-3',
        variant === 'skyscraper' && 'hidden lg:flex',
        fill && 'flex-1',
        className,
      )}
    >
      <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">Annuncio</span>
      {live ? (
        <ins
          ref={ref}
          className={cn('adsbygoogle block w-full', SIZES[variant], fill && 'flex-1')}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={variant === 'in-article' || variant === 'in-feed' ? 'fluid' : 'auto'}
          data-ad-layout={variant === 'in-article' ? 'in-article' : undefined}
          data-full-width-responsive="true"
        />
      ) : (
        <div className={cn('w-full rounded-md bg-muted', SIZES[variant], fill && 'flex-1')} aria-hidden />
      )}
    </aside>
  )
}
