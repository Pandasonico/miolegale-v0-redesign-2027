'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

declare global {
  interface Window {
    __wpCalculatorScriptsRan?: boolean
  }
}

/**
 * Mostra il corpo di una pagina WordPress e ne esegue gli script (React non lo fa da solo).
 * Gli script dei calcolatori dichiarano variabili globali: rieseguirli nello stesso documento
 * darebbe errore, quindi dopo una navigazione client la pagina viene ricaricata una volta.
 *
 * `afterForm` viene mostrato subito dopo il primo `<form>` della pagina, senza dividere l'HTML:
 * un segnaposto vuoto è inserito nel markup e il contenuto vi entra tramite portal.
 */
export function WpCalculator({ html, afterForm }: { html: string; afterForm?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [adTarget, setAdTarget] = useState<Element | null>(null)
  const hasAfterForm = Boolean(afterForm)
  const markup = useMemo(
    () => (hasAfterForm ? html.replace('</form>', '</form><div data-after-form class="wp-calc-ad"></div>') : html),
    [html, hasAfterForm],
  )

  useEffect(() => {
    setAdTarget(ref.current?.querySelector('[data-after-form]') ?? null)
  }, [markup])

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

  return (
    <>
      <div ref={ref} className="wp-content wp-calc" dangerouslySetInnerHTML={{ __html: markup }} />
      {adTarget && afterForm ? createPortal(afterForm, adTarget) : null}
    </>
  )
}
