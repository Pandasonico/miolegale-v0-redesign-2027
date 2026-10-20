'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    __wpCalculatorScriptsRan?: boolean
  }
}

/**
 * Mostra il corpo di una pagina WordPress e ne esegue gli script (React non lo fa da solo).
 * Gli script dei calcolatori dichiarano variabili globali: rieseguirli nello stesso documento
 * darebbe errore, quindi dopo una navigazione client la pagina viene ricaricata una volta.
 */
export function WpCalculator({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const pending = Array.from(root.querySelectorAll<HTMLScriptElement>('script')).filter((s) => !s.dataset.executed)
    if (pending.length === 0) return

    if (window.__wpCalculatorScriptsRan) {
      window.location.reload()
      return
    }
    window.__wpCalculatorScriptsRan = true

    for (const original of pending) {
      const script = document.createElement('script')
      for (const attr of Array.from(original.attributes)) script.setAttribute(attr.name, attr.value)
      script.text = original.text
      script.dataset.executed = 'true'
      original.replaceWith(script)
    }
  }, [html])

  // I form di WordPress inviano i dati alla pagina stessa: il calcolo avviene già in JavaScript.
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const block = (event: Event) => event.preventDefault()
    root.addEventListener('submit', block)
    return () => root.removeEventListener('submit', block)
  }, [])

  return <div ref={ref} className="wp-content wp-calc" dangerouslySetInnerHTML={{ __html: html }} />
}
