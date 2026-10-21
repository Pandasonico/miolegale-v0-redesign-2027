'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Gli script dei calcolatori dichiarano variabili globali con `let`/`const`: rieseguirli nello
 * stesso documento (navigazione client, Fast Refresh, anteprima in iframe) genera
 * "Identifier has already been declared". Con `var` la ridichiarazione è lecita.
 */
function toReRunnable(code: string) {
  return code.replace(/^(let|const)\s/gm, 'var ')
}

const optionValues = (select: HTMLSelectElement) => Array.from(select.options).map((o) => o.value)

function isDateTriplet(day: HTMLSelectElement, month: HTMLSelectElement, year: HTMLSelectElement) {
  const days = optionValues(day)
  const months = optionValues(month)
  const years = optionValues(year)
  return (
    days.length >= 28 &&
    days.length <= 31 &&
    days.every((v) => /^\d{1,2}$/.test(v)) &&
    months.length === 12 &&
    months.every((v) => /^\d{1,2}$/.test(v)) &&
    years.length >= 2 &&
    years.every((v) => /^\d{4}$/.test(v))
  )
}

function enhanceDateTriplet(day: HTMLSelectElement, month: HTMLSelectElement, year: HTMLSelectElement) {
  const selects = [day, month, year]
  const years = optionValues(year).map(Number)
  const pad = (value: string) => value.padStart(2, '0')
  const toIso = () => `${year.value}-${pad(month.value)}-${pad(day.value)}`

  const wrapper = day.parentElement
  const label = wrapper?.parentElement?.querySelector<HTMLElement>(':scope > span, :scope > label')
  if (label) label.textContent = (label.textContent ?? '').replace(/\s*\(giorno\/mese\/anno\)/i, '')

  const input = document.createElement('input')
  input.type = 'date'
  input.lang = 'it'
  input.className = 'wp-date-input'
  input.min = `${Math.min(...years)}-01-01`
  input.max = `${Math.max(...years)}-12-31`
  input.value = toIso()
  input.setAttribute('aria-label', label?.textContent?.trim() || 'Data')

  for (const select of selects) {
    select.dataset.dateSource = 'true'
    select.hidden = true
    select.tabIndex = -1
    select.setAttribute('aria-hidden', 'true')
    select.addEventListener('change', () => {
      const value = toIso()
      if (input.value !== value) input.value = value
    })
  }

  input.addEventListener('change', () => {
    const [y, m, d] = input.value.split('-')
    if (!y || !optionValues(year).includes(y)) return
    year.value = y
    month.value = optionValues(month).find((v) => Number(v) === Number(m)) ?? month.value
    day.value = optionValues(day).find((v) => Number(v) === Number(d)) ?? day.value
    for (const select of selects) select.dispatchEvent(new Event('change', { bubbles: true }))
  })

  year.after(input)
}

/**
 * Mostra il corpo di una pagina WordPress e ne esegue gli script (React non lo fa da solo).
 *
 * `afterForm` viene mostrato subito dopo il primo `<form>` della pagina, senza dividere l'HTML:
 * un segnaposto vuoto è inserito nel markup e il contenuto vi entra tramite portal.
 */
export function WpCalculator({ html, afterForm }: { html: string; afterForm?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [adTarget, setAdTarget] = useState<Element | null>(null)
  const hasAfterForm = Boolean(afterForm)
  // Il browser converte \r\n in \n: normalizzare evita il mismatch di idratazione.
  const markup = useMemo(() => {
    const normalized = html.replace(/\r\n?/g, '\n')
    return hasAfterForm
      ? normalized.replace('</form>', '</form><div data-after-form class="wp-calc-ad"></div>')
      : normalized
  }, [html, hasAfterForm])

  useEffect(() => {
    setAdTarget(ref.current?.querySelector('[data-after-form]') ?? null)
  }, [markup])

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const pending = Array.from(root.querySelectorAll<HTMLScriptElement>('script')).filter((s) => !s.dataset.executed)

    for (const original of pending) {
      const script = document.createElement('script')
      for (const attr of Array.from(original.attributes)) script.setAttribute(attr.name, attr.value)
      script.text = toReRunnable(original.text)
      script.dataset.executed = 'true'
      original.replaceWith(script)
    }
  }, [html])

  // I tre menu giorno/mese/anno diventano un solo campo data nativo (calendario o rotella su mobile).
  // I menu originali restano nel DOM, nascosti e sincronizzati, perché gli script dei calcolatori li leggono.
  useEffect(() => {
    const root = ref.current
    if (!root) return
    for (const day of Array.from(root.querySelectorAll<HTMLSelectElement>('select'))) {
      const month = day.nextElementSibling
      const year = month?.nextElementSibling
      if (!(month instanceof HTMLSelectElement) || !(year instanceof HTMLSelectElement)) continue
      if (!isDateTriplet(day, month, year) || day.dataset.dateSource) continue
      enhanceDateTriplet(day, month, year)
    }
  }, [markup])

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
