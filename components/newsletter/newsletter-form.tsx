'use client'

import { useActionState, useId } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { subscribeNewsletter, type NewsletterState } from '@/app/actions/newsletter'

const initialState: NewsletterState = { status: 'idle', message: '' }

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState)
  const id = useId()

  if (state.status === 'success') {
    return (
      <p role="status" className="flex items-start gap-2 rounded-lg bg-ink-foreground/10 p-4 text-sm leading-relaxed">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-3" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Indirizzo email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="La tua email"
          aria-invalid={state.status === 'error' || undefined}
          aria-describedby={state.status === 'error' ? `${id}-msg` : undefined}
          className="h-11 w-full min-w-0 rounded-md border border-ink-foreground/20 bg-ink-foreground/10 px-4 text-sm text-ink-foreground placeholder:text-ink-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/50"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-ink-foreground/25 px-5 text-sm font-semibold text-ink-foreground hover:bg-ink-foreground/10 disabled:opacity-70"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
          Iscriviti
        </button>
      </div>
      <p className="text-sm leading-relaxed text-ink-foreground/70">
        L&rsquo;email sar&agrave; utilizzata esclusivamente per l&rsquo;invio della newsletter giuridica. Cancellazione in qualsiasi
        momento.
      </p>
      {state.status === 'error' && (
        <p id={`${id}-msg`} role="alert" className="text-sm font-medium text-accent">
          {state.message}
        </p>
      )}
    </form>
  )
}
