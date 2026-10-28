'use client'

import { useId, useState, type FormEvent } from 'react'
import { CheckCircle2, Paperclip, Send } from 'lucide-react'
import { MATERIE, STUDIO } from '@/lib/site'

type Errors = Partial<Record<'nome' | 'email' | 'materia' | 'quesito' | 'privacy', string>>

const fieldClass =
  'h-11 w-full rounded-md border border-border bg-background px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 aria-invalid:border-destructive'

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!String(data.get('nome') ?? '').trim()) errors.nome = 'Indica nome e cognome.'
  const email = String(data.get('email') ?? '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Inserisci un indirizzo email valido.'
  if (!data.get('materia')) errors.materia = 'Scegli la materia del quesito.'
  if (String(data.get('quesito') ?? '').trim().length < 30) errors.quesito = 'Descrivi il caso in almeno qualche riga.'
  if (!data.get('privacy')) errors.privacy = 'Per inviare la richiesta serve il consenso al trattamento dei dati.'
  return errors
}

export function ConsulenzaForm() {
  const id = useId()
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(new FormData(event.currentTarget))
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 md:p-8">
        <CheckCircle2 className="size-8 text-primary" aria-hidden />
        <h2 className="font-sans text-2xl font-semibold tracking-tight">Richiesta inviata</h2>
        <p className="max-w-xl leading-relaxed text-muted-foreground">
          Entro {STUDIO.responseTime} (salvo festivi) riceverai un&apos;email con la conferma della disponibilit&agrave; ad
          accettare l&apos;incarico e il preventivo gratuito e non vincolante.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setFiles([])
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    )
  }

  const err = (key: keyof Errors) =>
    errors[key] ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-${key}-err` } : {}

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${id}-title`}
      className="flex min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-5 md:p-8"
    >
      <div>
        <h2 id={`${id}-title`} className="font-sans text-2xl font-semibold tracking-tight">
          Richiedi una consulenza legale
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          I campi contrassegnati con * sono obbligatori.
        </p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 text-xs font-mono font-medium uppercase tracking-wider text-primary">I tuoi dati</legend>
        <Field id={`${id}-nome`} label="Nome e cognome *" error={errors.nome} errorId={`${id}-nome-err`}>
          <input id={`${id}-nome`} name="nome" autoComplete="name" className={fieldClass} {...err('nome')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-email`} label="Email *" error={errors.email} errorId={`${id}-email-err`}>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={fieldClass} {...err('email')} />
          </Field>
          <Field id={`${id}-tel`} label="Telefono">
            <input id={`${id}-tel`} name="telefono" type="tel" autoComplete="tel" className={fieldClass} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-border pt-6">
        <legend className="float-left mb-4 w-full text-xs font-mono font-medium uppercase tracking-wider text-primary">
          Il tuo quesito
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-materia`} label="Materia *" error={errors.materia} errorId={`${id}-materia-err`}>
            <select id={`${id}-materia`} name="materia" defaultValue="" className={fieldClass} {...err('materia')}>
              <option value="" disabled>
                Seleziona
              </option>
              {MATERIE.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.label}
                </option>
              ))}
              <option value="altro">Altro</option>
            </select>
          </Field>
          <Field id={`${id}-oggetto`} label="Oggetto">
            <input
              id={`${id}-oggetto`}
              name="oggetto"
              placeholder="Es. revisione assegno di mantenimento"
              className={fieldClass}
            />
          </Field>
        </div>
        <Field
          id={`${id}-quesito`}
          label="Descrivi il caso *"
          hint="Fatti, date, documenti in tuo possesso e la domanda a cui vuoi una risposta."
          error={errors.quesito}
          errorId={`${id}-quesito-err`}
        >
          <textarea
            id={`${id}-quesito`}
            name="quesito"
            rows={8}
            className={`${fieldClass} h-auto py-2.5 leading-relaxed`}
            {...err('quesito')}
          />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Documenti</span>
          <label
            htmlFor={`${id}-files`}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground hover:border-primary focus-within:border-primary"
          >
            <Paperclip className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0 truncate">
              {files.length ? files.join(', ') : 'Allega contratti, atti o lettere (PDF o immagini)'}
            </span>
            <input
              id={`${id}-files`}
              name="documenti"
              type="file"
              multiple
              accept=".pdf,image/*"
              className="sr-only"
              onChange={(e) => setFiles(Array.from(e.currentTarget.files ?? []).map((f) => f.name))}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border-t border-border pt-6">
        <legend className="float-left mb-3 w-full text-xs font-mono font-medium uppercase tracking-wider text-primary">
          Pagamento preferito
        </legend>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          Si paga solo se accetti il preventivo.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {[
            { value: 'bonifico', label: 'Bonifico bancario' },
            { value: 'paypal', label: 'Carta di credito o PayPal' },
          ].map((opt, i) => (
            <label
              key={opt.value}
              className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm has-checked:border-primary has-checked:bg-secondary"
            >
              <input type="radio" name="pagamento" value={opt.value} defaultChecked={i === 0} className="size-4 accent-primary" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              name="privacy"
              className="mt-1 size-4 shrink-0 accent-primary"
              {...err('privacy')}
            />
            <span>
              Ho letto l&apos;
              <a href={STUDIO.privacyUrl} className="font-medium text-primary hover:underline">
                informativa sul trattamento dei dati
              </a>{' '}
              e acconsento al trattamento per la formulazione del preventivo e lo svolgimento dell&apos;incarico. *
            </span>
          </label>
          {errors.privacy && (
            <p id={`${id}-privacy-err`} className="pl-7 text-sm font-medium text-destructive">
              {errors.privacy}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90 sm:w-fit"
        >
          <Send className="size-4" aria-hidden />
          Invia la richiesta
        </button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  errorId,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  errorId?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint && <p className="-mt-1 text-sm leading-relaxed text-muted-foreground">{hint}</p>}
      {children}
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
