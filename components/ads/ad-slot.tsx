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

const SIZES: Record<Variant, string> = {
  leaderboard: 'min-h-[90px] md:min-h-[90px]',
  rectangle: 'min-h-[250px]',
  skyscraper: 'min-h-[600px]',
  'in-article': 'min-h-[280px]',
  'in-feed': 'min-h-[120px]',
}

export function AdSlot({
  slot,
  variant = 'rectangle',
  className,
}: {
  /** ID dello slot AdSense (data-ad-slot). */
  slot?: string
  variant?: Variant
  className?: string
}) {
  const ref = useRef<HTMLModElement>(null)
  const live = Boolean(ADSENSE_CLIENT && slot)

  useEffect(() => {
    if (!live || !ref.current || ref.current.dataset.adsbygoogleStatus) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense può rifiutare il push se lo slot non è ancora visibile.
    }
  }, [live])

  return (
    <aside aria-label="Pubblicità" className={cn('flex w-full flex-col items-center gap-1', className)}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Pubblicità</span>
      {live ? (
        <ins
          ref={ref}
          className={cn('adsbygoogle block w-full', SIZES[variant])}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={variant === 'in-article' ? 'fluid' : 'auto'}
          data-ad-layout={variant === 'in-article' ? 'in-article' : undefined}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className={cn(
            'flex w-full items-center justify-center rounded-md border border-dashed border-input bg-muted text-xs text-muted-foreground',
            SIZES[variant],
          )}
        >
          Spazio AdSense · {variant}
        </div>
      )}
    </aside>
  )
}
