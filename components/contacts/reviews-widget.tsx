'use client'

import { useEffect, useRef } from 'react'

// Il loader di Trustindex inserisce il widget accanto al proprio <script>,
// quindi va montato dentro il contenitore e non in fondo al body.
export function ReviewsWidget({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container || container.childElementCount > 0) return
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    container.appendChild(script)
    return () => {
      container.replaceChildren()
    }
  }, [src])

  return <div ref={ref} className="min-h-24" />
}
