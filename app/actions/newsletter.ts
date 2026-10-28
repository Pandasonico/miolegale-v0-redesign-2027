'use server'

import { NEWSLETTER_ENDPOINT } from '@/lib/site'

export type NewsletterState = { status: 'idle' | 'success' | 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribeNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 'error', message: 'Inserisci un indirizzo email valido.' }
  }
  // Honeypot: real users never fill this hidden field.
  if (String(formData.get('website') ?? '') !== '') {
    return { status: 'success', message: 'Iscrizione ricevuta.' }
  }

  try {
    const res = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ ne: email, nlang: '', ny: 'on' }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return {
      status: 'success',
      message: 'Quasi fatto: ti abbiamo inviato un’email per confermare l’iscrizione.',
    }
  } catch {
    return { status: 'error', message: 'Iscrizione non riuscita. Riprova tra qualche minuto.' }
  }
}
