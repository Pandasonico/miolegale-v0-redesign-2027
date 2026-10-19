/** Saggio degli interessi legali (art. 1284 c.c.) con data di decorrenza. */
export const TASSI_LEGALI: { from: string; rate: number }[] = [
  { from: '1990-12-16', rate: 10 },
  { from: '1997-01-01', rate: 5 },
  { from: '1999-01-01', rate: 2.5 },
  { from: '2001-01-01', rate: 3.5 },
  { from: '2002-01-01', rate: 3 },
  { from: '2004-01-01', rate: 2.5 },
  { from: '2008-01-01', rate: 3 },
  { from: '2010-01-01', rate: 1 },
  { from: '2011-01-01', rate: 1.5 },
  { from: '2012-01-01', rate: 2.5 },
  { from: '2014-01-01', rate: 1 },
  { from: '2015-01-01', rate: 0.5 },
  { from: '2016-01-01', rate: 0.2 },
  { from: '2017-01-01', rate: 0.1 },
  { from: '2018-01-01', rate: 0.3 },
  { from: '2019-01-01', rate: 0.8 },
  { from: '2020-01-01', rate: 0.05 },
  { from: '2021-01-01', rate: 0.01 },
  { from: '2022-01-01', rate: 1.25 },
  { from: '2023-01-01', rate: 5 },
  { from: '2024-01-01', rate: 2.5 },
  { from: '2025-01-01', rate: 2 },
  { from: '2026-01-01', rate: 1.6 },
]

const DAY = 86_400_000

function utc(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export function toISO(ms: number) {
  return new Date(ms).toISOString().slice(0, 10)
}

export type InterestRow = { from: string; to: string; days: number; rate: number; interest: number }

/** Interessi semplici, anno civile di 365 giorni, dal giorno successivo a `start` fino a `end` incluso. */
export function calcolaInteressiLegali(capitale: number, start: string, end: string) {
  const rows: InterestRow[] = []
  const s = utc(start)
  const e = utc(end)
  if (!(capitale > 0) || e <= s) return { rows, total: 0 }

  TASSI_LEGALI.forEach((t, i) => {
    const periodStart = utc(t.from)
    const periodEnd = i + 1 < TASSI_LEGALI.length ? utc(TASSI_LEGALI[i + 1].from) : Number.POSITIVE_INFINITY
    const from = Math.max(s, periodStart - DAY)
    const to = Math.min(e, periodEnd - DAY)
    const days = Math.round((to - from) / DAY)
    if (days <= 0) return
    const interest = (capitale * t.rate * days) / 36_500
    rows.push({ from: toISO(from + DAY), to: toISO(to), days, rate: t.rate, interest })
  })
  return { rows, total: rows.reduce((a, r) => a + r.interest, 0) }
}

/** Scaglioni art. 13 c.1 DPR 115/2002 – processo civile ordinario. */
export const SCAGLIONI_CU: { upTo: number; amount: number; label: string }[] = [
  { upTo: 1_100, amount: 43, label: 'fino a € 1.100' },
  { upTo: 5_200, amount: 98, label: 'da € 1.100,01 a € 5.200' },
  { upTo: 26_000, amount: 237, label: 'da € 5.200,01 a € 26.000' },
  { upTo: 52_000, amount: 518, label: 'da € 26.000,01 a € 52.000' },
  { upTo: 260_000, amount: 759, label: 'da € 52.000,01 a € 260.000' },
  { upTo: 520_000, amount: 1_214, label: 'da € 260.000,01 a € 520.000' },
  { upTo: Number.POSITIVE_INFINITY, amount: 1_686, label: 'oltre € 520.000' },
]

export type Grado = 'primo' | 'appello' | 'cassazione'
export type Rito = 'ordinario' | 'monitorio' | 'lavoro'

export function calcolaContributoUnificato({
  valore,
  indeterminabile,
  grado,
  rito,
}: {
  valore: number
  indeterminabile: boolean
  grado: Grado
  rito: Rito
}) {
  const scaglione = indeterminabile ? SCAGLIONI_CU[3] : SCAGLIONI_CU.find((s) => valore <= s.upTo)!
  let base = scaglione.amount
  const notes: string[] = [
    indeterminabile ? 'Valore indeterminabile: si applica lo scaglione da € 26.000,01 a € 52.000.' : `Scaglione: ${scaglione.label}.`,
  ]
  if (rito === 'monitorio' || rito === 'lavoro') {
    base = base / 2
    notes.push(
      rito === 'monitorio'
        ? 'Procedimento d’ingiunzione: importo ridotto alla metà (art. 13 c.3).'
        : 'Controversie di lavoro/previdenza: importo ridotto alla metà (art. 13 c.3).',
    )
  }
  const multiplier = grado === 'appello' ? 1.5 : grado === 'cassazione' ? 2 : 1
  if (multiplier !== 1) notes.push(grado === 'appello' ? 'Appello: aumento del 50% (art. 13 c.1-bis).' : 'Cassazione: importo raddoppiato (art. 13 c.2).')
  return { amount: Math.round(base * multiplier * 100) / 100, notes }
}

function easterSunday(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return Date.UTC(year, month - 1, day)
}

const FIXED_HOLIDAYS = ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26']

export function festivita(ms: number): string | null {
  const iso = toISO(ms)
  const md = iso.slice(5)
  if (FIXED_HOLIDAYS.includes(md)) return 'festivo'
  const year = Number(iso.slice(0, 4))
  if (ms === easterSunday(year) + DAY) return 'Lunedì dell’Angelo'
  const dow = new Date(ms).getUTCDay()
  if (dow === 0) return 'domenica'
  return null
}

function inFeriale(ms: number) {
  const md = toISO(ms).slice(5)
  return md >= '08-01' && md <= '08-31'
}

export function calcolaScadenza({
  start,
  days,
  direction,
  sospensioneFeriale,
  sabatoFestivo,
}: {
  start: string
  days: number
  direction: 'avanti' | 'indietro'
  sospensioneFeriale: boolean
  sabatoFestivo: boolean
}) {
  const step = direction === 'avanti' ? DAY : -DAY
  let cur = utc(start)
  let counted = 0
  let skippedFeriale = 0
  while (counted < days) {
    cur += step
    if (sospensioneFeriale && inFeriale(cur)) {
      skippedFeriale++
      continue
    }
    counted++
  }
  const notes: string[] = []
  if (skippedFeriale) notes.push(`Esclusi ${skippedFeriale} giorni di sospensione feriale (1–31 agosto, L. 742/1969).`)

  const isNonWorking = (ms: number) => {
    const reason = festivita(ms)
    if (reason) return reason
    if (sabatoFestivo && new Date(ms).getUTCDay() === 6) return 'sabato'
    return null
  }
  let reason = isNonWorking(cur)
  const original = cur
  while (reason) {
    cur += step
    reason = isNonWorking(cur)
  }
  if (cur !== original) {
    notes.push(
      direction === 'avanti'
        ? `La scadenza cadeva il ${toISO(original)} (giorno non lavorativo): prorogata al primo giorno utile (art. 155 c.4-5 c.p.c.).`
        : `La scadenza cadeva il ${toISO(original)} (giorno non lavorativo): anticipata al giorno lavorativo precedente.`,
    )
  }
  return { date: toISO(cur), notes }
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function calcolaParcella({
  compenso,
  speseGenerali,
  cpa,
  iva,
  ritenuta,
  speseEsenti,
}: {
  compenso: number
  speseGenerali: boolean
  cpa: boolean
  iva: boolean
  ritenuta: boolean
  speseEsenti: number
}) {
  const sg = speseGenerali ? round2(compenso * 0.15) : 0
  const imponibileCpa = compenso + sg
  const cassa = cpa ? round2(imponibileCpa * 0.04) : 0
  const imponibileIva = imponibileCpa + cassa
  const imposta = iva ? round2(imponibileIva * 0.22) : 0
  const totale = round2(imponibileIva + imposta + speseEsenti)
  const rda = ritenuta ? round2(imponibileCpa * 0.2) : 0
  return {
    rows: [
      { label: 'Compenso professionale', value: compenso },
      { label: 'Spese generali 15% (art. 2 DM 55/2014)', value: sg },
      { label: 'Cassa avvocati (CPA) 4%', value: cassa },
      { label: 'Imponibile IVA', value: imponibileIva, strong: true },
      { label: 'IVA 22%', value: imposta },
      { label: 'Spese esenti (art. 15 DPR 633/72)', value: speseEsenti },
      { label: 'Totale documento', value: totale, strong: true },
      { label: 'Ritenuta d’acconto 20%', value: -rda },
    ],
    netto: round2(totale - rda),
  }
}

export function calcolaIva(importo: number, aliquota: number, modo: 'aggiungi' | 'scorpora') {
  if (modo === 'aggiungi') {
    const imposta = round2((importo * aliquota) / 100)
    return { imponibile: round2(importo), imposta, totale: round2(importo + imposta) }
  }
  const imponibile = round2(importo / (1 + aliquota / 100))
  return { imponibile, imposta: round2(importo - imponibile), totale: round2(importo) }
}

export const TERMINI_PRESCRIZIONE = [
  { id: 'ordinaria', years: 10, label: 'Ordinaria – 10 anni', norm: 'art. 2946 c.c.' },
  { id: 'danno', years: 5, label: 'Risarcimento danno extracontrattuale – 5 anni', norm: 'art. 2947 c.1 c.c.' },
  { id: 'periodiche', years: 5, label: 'Canoni, interessi, prestazioni periodiche – 5 anni', norm: 'art. 2948 c.c.' },
  { id: 'professionisti', years: 3, label: 'Compensi dei professionisti – 3 anni', norm: 'art. 2956 c.c.' },
  { id: 'circolazione', years: 2, label: 'Danni da circolazione di veicoli – 2 anni', norm: 'art. 2947 c.2 c.c.' },
  { id: 'assicurazione', years: 2, label: 'Diritti da contratto di assicurazione – 2 anni', norm: 'art. 2952 c.c.' },
  { id: 'trasporto', years: 1, label: 'Contratto di trasporto – 1 anno', norm: 'art. 2951 c.c.' },
] as const

export function calcolaPrescrizione(start: string, years: number) {
  const [y, m, d] = start.split('-').map(Number)
  const target = new Date(Date.UTC(y + years, m - 1, d))
  if (target.getUTCMonth() !== m - 1) target.setUTCDate(0)
  let ms = target.getTime()
  let prorogata = false
  while (festivita(ms)) {
    ms += DAY
    prorogata = true
  }
  return { date: toISO(ms), prorogata }
}

export function giorniTraDate(from: string, to: string) {
  const a = utc(from)
  const b = utc(to)
  const [s, e] = a <= b ? [a, b] : [b, a]
  const calendario = Math.round((e - s) / DAY)
  let lavorativi = 0
  for (let ms = s + DAY; ms <= e; ms += DAY) {
    if (new Date(ms).getUTCDay() !== 6 && !festivita(ms)) lavorativi++
  }
  const ds = new Date(s)
  const de = new Date(e)
  let anni = de.getUTCFullYear() - ds.getUTCFullYear()
  let mesi = de.getUTCMonth() - ds.getUTCMonth()
  let giorni = de.getUTCDate() - ds.getUTCDate()
  if (giorni < 0) {
    mesi--
    giorni += new Date(Date.UTC(de.getUTCFullYear(), de.getUTCMonth(), 0)).getUTCDate()
  }
  if (mesi < 0) {
    anni--
    mesi += 12
  }
  return { calendario, lavorativi, anni, mesi, giorni, settimane: Math.floor(calendario / 7) }
}

export const euro = (n: number) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })

export const dataIT = (iso: string) =>
  new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  )
