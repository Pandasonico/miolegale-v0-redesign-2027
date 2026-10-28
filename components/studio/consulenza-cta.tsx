import { ArrowUpRight, Clock, FileCheck2, Scale } from 'lucide-react'
import { STUDIO } from '@/lib/site'

export function ConsulenzaBand() {
  return (
    <section aria-labelledby="consulenza-title" className="mx-auto max-w-site px-4 lg:px-8 pt-14">
      <div className="flex flex-col gap-8 rounded-xl border border-border bg-card p-6 md:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-primary">Consulenza legale online</p>
          <h2 id="consulenza-title" className="mt-2 font-sans tracking-tight text-3xl font-semibold text-balance">
            Il tuo caso merita la risposta di un avvocato.
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
            Esponi il quesito: l&apos;{STUDIO.lawyer} o un professionista del suo studio esamina il caso specifico e
            ti invia un preventivo gratuito e non vincolante.
          </p>
          <ul className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden />
              Risposta entro {STUDIO.responseTime}
            </li>
            <li className="flex items-center gap-2">
              <FileCheck2 className="size-4 text-primary" aria-hidden />
              Preventivo gratuito
            </li>
            <li className="flex items-center gap-2">
              <Scale className="size-4 text-primary" aria-hidden />
              Pareri da € {STUDIO.priceFrom}
            </li>
          </ul>
        </div>
        <a
          href={STUDIO.consulenzaUrl}
          className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Richiedi una consulenza
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  )
}

export function ConsulenzaArticleBox() {
  return (
    <a
      href={STUDIO.consulenzaUrl}
      className="mt-4 flex items-center gap-4 rounded-lg border border-border bg-card p-5 hover:border-primary"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        <Scale className="size-5" aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block font-semibold">Ti serve un parere sul tuo caso?</span>
        <span className="block text-sm text-muted-foreground">
          Consulenza legale online dello studio dell&apos;{STUDIO.lawyer}: preventivo gratuito entro {STUDIO.responseTime}.
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-primary" aria-hidden />
    </a>
  )
}
