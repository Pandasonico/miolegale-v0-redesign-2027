import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Scale, Sparkles } from 'lucide-react'
import { STUDIO } from '@/lib/site'

export function ArticleHelp({ title }: { title: string }) {
  return (
    <section aria-labelledby="help-title" className="mt-12 overflow-hidden rounded-xl border border-border">
      <h2 id="help-title" className="bg-secondary px-6 py-4 font-sans text-lg font-semibold tracking-tight text-secondary-foreground">
        Hai ancora dubbi su questo argomento?
      </h2>
      <div className="grid divide-y divide-border bg-card md:grid-cols-2 md:divide-x md:divide-y-0">
        <Link
          href={`/assistente-ai?q=${encodeURIComponent(`Spiegami in modo semplice: ${title}`)}`}
          className="group flex flex-col gap-3 p-6 hover:bg-muted"
        >
          <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <span className="font-semibold">Chiedi all&apos;Avvocato AI</span>
          <span className="text-sm leading-relaxed text-muted-foreground">
            Una spiegazione semplificata di questo contenuto, con i riferimenti alle fonti.
          </span>
          <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-medium text-primary">
            Apri l&apos;assistente <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
        <a href={STUDIO.consulenzaUrl} className="group flex flex-col gap-3 p-6 hover:bg-muted">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Scale className="size-5" aria-hidden />
          </span>
          <span className="font-semibold">Ti serve un parere sul tuo caso?</span>
          <span className="text-sm leading-relaxed text-muted-foreground">
            Consulenza legale online dello studio dell&apos;{STUDIO.lawyer}: preventivo gratuito entro{' '}
            {STUDIO.responseTime}.
          </span>
          <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-medium text-primary">
            Richiedi una consulenza <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </a>
      </div>
    </section>
  )
}
