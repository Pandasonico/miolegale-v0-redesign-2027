import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Clock, FileCheck2, Mail, Phone, Scale } from 'lucide-react'
import { ConsulenzaForm } from '@/components/consulenza/consulenza-form'
import { QUICK_ACTIONS } from '@/lib/contacts'
import { STUDIO } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Consulenza legale online, preventivo gratuito',
  description: `Esponi il tuo quesito all'${STUDIO.lawyer}: preventivo gratuito e non vincolante entro ${STUDIO.responseTime}. Pareri legali da € ${STUDIO.priceFrom}.`,
  alternates: { canonical: '/consulenza-legale' },
}

const STEPS = [
  { title: 'Invii il quesito', text: 'Compili il modulo descrivendo il caso e, se vuoi, alleghi i documenti.' },
  {
    title: 'Ricevi il preventivo',
    text: `Entro ${STUDIO.responseTime} (salvo festivi) ti scriviamo per confermare la disponibilità, con un preventivo gratuito e non vincolante.`,
  },
  { title: 'Accetti e paghi', text: 'Solo se il preventivo ti convince: bonifico bancario oppure carta di credito tramite PayPal.' },
  { title: 'Ricevi il parere', text: 'Un parere scritto e personalizzato, redatto sullo studio del tuo caso specifico.' },
]

export default function ConsulenzaPage() {
  return (
    <>
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-site px-4 lg:px-8 pb-10 pt-8 lg:pb-12">
          <nav aria-label="Percorso" className="text-sm text-ink-foreground/70">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-ink-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page">Consulenza legale</li>
            </ol>
          </nav>

          <h1 className="mt-6 font-sans text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl lg:text-[2.5rem]">
            Consulenza legale online
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-pretty text-ink-foreground/75">
            Il modo pi&ugrave; veloce per avere il parere di un avvocato. Esponi il tuo quesito: l&apos;{STUDIO.lawyer} o un
            professionista del suo studio esamina il caso e ti invia un preventivo gratuito e non vincolante.
          </p>

          <ul className="mt-8 flex flex-col gap-3 border-t border-ink-foreground/15 pt-5 text-sm sm:flex-row sm:gap-8">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-ink-foreground/70" aria-hidden />
              Risposta entro <span className="font-medium">{STUDIO.responseTime}</span>
            </li>
            <li className="flex items-center gap-2">
              <FileCheck2 className="size-4 text-ink-foreground/70" aria-hidden />
              Preventivo <span className="font-medium">gratuito</span>
            </li>
            <li className="flex items-center gap-2">
              <Scale className="size-4 text-ink-foreground/70" aria-hidden />
              Pareri da <span className="font-medium">&euro; {STUDIO.priceFrom}</span>
            </li>
          </ul>
        </div>
      </header>

      <div className="mx-auto grid max-w-site grid-cols-1 gap-8 px-4 lg:px-8 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <ConsulenzaForm />

        <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="steps-title">
            <h2 id="steps-title" className="font-sans text-xl font-semibold tracking-tight">
              Come funziona
            </h2>
            <ol className="mt-5 flex flex-col">
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span aria-hidden className="absolute left-3.5 top-8 bottom-0 w-px bg-border" />
                  )}
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-ink-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold leading-7">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="price-title" className="rounded-xl border border-border bg-card p-5">
            <h2 id="price-title" className="font-semibold">
              Quanto costa
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              I pareri partono da un compenso minimo di &euro; {STUDIO.priceFrom}, tasse e accessori di legge inclusi, in
              relazione alla difficolt&agrave; della questione.
            </p>
          </section>

          <section aria-labelledby="direct-title" className="rounded-xl bg-ink p-5 text-ink-foreground">
            <h2 id="direct-title" className="font-semibold">
              Preferisci parlarne?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-foreground/70">
              Per un appuntamento in studio o l&apos;assistenza in giudizio.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href={QUICK_ACTIONS.phone} className="flex items-center gap-2 font-medium hover:underline">
                <Phone className="size-4" aria-hidden />
                Chiama lo studio
              </a>
              <a href={QUICK_ACTIONS.email} className="flex items-center gap-2 font-medium hover:underline">
                <Mail className="size-4" aria-hidden />
                Scrivi un&apos;email
              </a>
              <Link href={STUDIO.contattiUrl} className="mt-1 text-ink-foreground/70 hover:text-ink-foreground hover:underline">
                Tutti i contatti e le sedi
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
