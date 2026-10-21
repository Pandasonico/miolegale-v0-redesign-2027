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

function isMonthYearPair(month: HTMLSelectElement, year: HTMLSelectElement) {
  const months = optionValues(month)
  const years = optionValues(year)
  return (
    months.length === 12 &&
    months.every((v) => /^\d{1,2}$/.test(v)) &&
    years.length >= 2 &&
    years.every((v) => /^\d{4}$/.test(v))
  )
}

const pad = (value: string) => value.padStart(2, '0')

/**
 * Sostituisce i menu giorno/mese/anno (o mese/anno) con un solo campo data nativo.
 * I menu originali restano nel DOM, nascosti e sincronizzati, perché gli script dei calcolatori li leggono.
 * Se il browser non supporta il tipo di campo richiesto, i menu originali restano visibili.
 */
function enhanceDateSelects(kind: 'date' | 'month', year: HTMLSelectElement, month: HTMLSelectElement, day?: HTMLSelectElement) {
  const input = document.createElement('input')
  input.type = kind
  if (input.type !== kind) return

  const selects = day ? [day, month, year] : [month, year]
  const years = optionValues(year).map(Number)
  const toValue = () =>
    kind === 'date' && day
      ? `${year.value}-${pad(month.value)}-${pad(day.value)}`
      : `${year.value}-${pad(month.value)}`

  const first = selects[0]
  const label = first.parentElement?.parentElement?.querySelector<HTMLElement>(':scope > span, :scope > label')
  if (label) label.textContent = (label.textContent ?? '').replace(/\s*\((giorno\/)?mese\/anno\)/i, '')

  input.lang = 'it'
  input.className = 'wp-date-input'
  input.min = kind === 'date' ? `${Math.min(...years)}-01-01` : `${Math.min(...years)}-01`
  input.max = kind === 'date' ? `${Math.max(...years)}-12-31` : `${Math.max(...years)}-12`
  input.value = toValue()
  input.setAttribute('aria-label', label?.textContent?.trim() || (kind === 'date' ? 'Data' : 'Mese e anno'))

  const wrapper = document.createElement('span')
  wrapper.className = 'wp-date'
  const text = document.createElement('span')
  text.className = 'wp-date-text'
  text.setAttribute('aria-hidden', 'true')
  const icon = document.createElement('span')
  icon.className = 'wp-date-icon'
  icon.setAttribute('aria-hidden', 'true')
  icon.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg>'

  const formatter = new Intl.DateTimeFormat(
    'it-IT',
    kind === 'date' ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' },
  )
  const renderText = () => {
    const [y, m, d] = input.value.split('-').map(Number)
    if (!y || !m) {
      text.textContent = 'Seleziona'
      return
    }
    const formatted = formatter.format(new Date(y, m - 1, kind === 'date' ? d || 1 : 1))
    text.textContent = kind === 'month' ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : formatted
  }

  const syncInput = () => {
    const value = toValue()
    if (input.value !== value) input.value = value
    renderText()
  }

  input.addEventListener('click', () => {
    try {
      input.showPicker()
    } catch {
      // showPicker non è disponibile ovunque: il campo nativo si apre comunque al tocco.
    }
  })

  renderText()
  wrapper.append(text, icon, input)
  year.after(wrapper)

  for (const select of selects) {
    select.dataset.dateSource = 'true'
    select.hidden = true
    select.tabIndex = -1
    select.setAttribute('aria-hidden', 'true')
    select.addEventListener('change', syncInput)
  }

  input.addEventListener('change', () => {
    renderText()
    const [y, m, d] = input.value.split('-')
    if (!y || !optionValues(year).includes(y)) return
    year.value = y
    month.value = optionValues(month).find((v) => Number(v) === Number(m)) ?? month.value
    if (day) day.value = optionValues(day).find((v) => Number(v) === Number(d)) ?? day.value
    for (const select of selects) select.dispatchEvent(new Event('change', { bubbles: true }))
  })

  first.closest('form')?.addEventListener('reset', () => setTimeout(syncInput))
}

/** Se un campo data è stato perso (DOM rigenerato) i menu originali tornano visibili e vengono ricreati. */
function restoreOrphanedDateSelects(root: HTMLElement) {
  for (const select of Array.from(root.querySelectorAll<HTMLSelectElement>('select[data-date-source]'))) {
    if (select.parentElement?.querySelector(':scope > .wp-date')) continue
    delete select.dataset.dateSource
    select.hidden = false
    select.removeAttribute('tabindex')
    select.removeAttribute('aria-hidden')
  }
}

const FIT_EXCLUDED = '#form_fatturazione, #menomazioni'

/** Larghezza del menu = opzione più lunga (testo + padding + bordo + freccia), mai oltre il contenitore. */
function fitSelectWidth(select: HTMLSelectElement) {
  if (select.dataset.dateSource || select.closest(FIT_EXCLUDED)) return
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return
  const style = getComputedStyle(select)
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const textWidth = Math.max(0, ...Array.from(select.options).map((o) => context.measureText(o.text).width))
  const extra =
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)
  const arrow = 28
  select.style.width = `${Math.ceil(textWidth + extra + arrow)}px`
  select.style.maxWidth = '100%'
}

function fitAllSelects(root: HTMLElement) {
  for (const select of Array.from(root.querySelectorAll<HTMLSelectElement>('select'))) fitSelectWidth(select)
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

  // Giorno/mese/anno diventano un campo data nativo, mese/anno un campo mese (calendario o rotella su mobile).
  useEffect(() => {
    const root = ref.current
    if (!root) return
    restoreOrphanedDateSelects(root)
    for (const select of Array.from(root.querySelectorAll<HTMLSelectElement>('select'))) {
      if (select.dataset.dateSource) continue
      const next = select.nextElementSibling
      const afterNext = next?.nextElementSibling
      if (next instanceof HTMLSelectElement && afterNext instanceof HTMLSelectElement && isDateTriplet(select, next, afterNext)) {
        enhanceDateSelects('date', afterNext, next, select)
      } else if (next instanceof HTMLSelectElement && isMonthYearPair(select, next)) {
        enhanceDateSelects('month', next, select)
      }
    }

    fitAllSelects(root)
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) fitAllSelects(root)
    })
    // Alcuni calcolatori riscrivono le opzioni via script: il menu si riadatta quando lo si usa.
    const refit = (event: Event) => {
      if (event.target instanceof HTMLSelectElement) fitSelectWidth(event.target)
    }
    root.addEventListener('focusin', refit)
    root.addEventListener('change', refit)
    return () => {
      cancelled = true
      root.removeEventListener('focusin', refit)
      root.removeEventListener('change', refit)
    }
  }, [markup])

  // Campi alternativi (radio + campo accanto): quello non scelto resta attenuato finché il radio non viene selezionato.
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const partnerSelector = 'select, input:not([type=radio]):not([type=checkbox]):not([type=hidden]), .wp-date'
    const syncAlternatives = () => {
      for (const radio of Array.from(root.querySelectorAll<HTMLInputElement>('input[type=radio]'))) {
        const partner = radio.nextElementSibling
        const block = radio.parentElement
        if (!block || !(partner instanceof HTMLElement) || !partner.matches(partnerSelector)) continue
        block.classList.add('wp-alt')
        block.classList.toggle('wp-alt-off', !radio.checked)
      }
    }
    syncAlternatives()
    const syncSoon = () => setTimeout(syncAlternatives)
    root.addEventListener('change', syncSoon)
    root.addEventListener('click', syncSoon)
    root.addEventListener('reset', syncSoon, true)
    return () => {
      root.removeEventListener('change', syncSoon)
      root.removeEventListener('click', syncSoon)
      root.removeEventListener('reset', syncSoon, true)
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
