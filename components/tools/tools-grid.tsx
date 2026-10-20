import Link from 'next/link'
import { ArrowUpRight, Banknote, CalendarClock, CalendarPlus, CalendarRange, FileText, Gavel, Home, Hourglass, Landmark, Percent, Receipt, Scale, Sparkles, Tag, UserRound } from 'lucide-react'
import { AVAILABLE_TOOLS, toolCategory, type Tool } from '@/lib/site'

const ICONS: Record<string, typeof Percent> = {
  'interessi-legali': Percent,
  'contributo-unificato': Landmark,
  'termini-processuali': CalendarClock,
  'parcella-avvocato': Receipt,
  'prescrizione-diritti': Hourglass,
  'scorporo-iva': Scale,
  'giorni-tra-due-date': CalendarRange,
  'fattura-scorporo': FileText,
  'eta-anagrafica': UserRound,
  percentuale: Percent,
  'tasso-interesse-calcolo-taeg': Banknote,
  data: CalendarPlus,
  'prezzo-iniziale': Tag,
  'sconto-ricarico': Tag,
  'imposte-compravendita-immobiliare': Home,
  patteggiamento: Gavel,
}

export function ToolsGrid({ withAi = true, tools = AVAILABLE_TOOLS }: { withAi?: boolean; tools?: Tool[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => {
        const Icon = ICONS[tool.slug] ?? Percent
        return (
          <Link
            key={tool.slug}
            href={`/calcolo/${tool.slug}`}
            className="group flex flex-col rounded-lg border border-border bg-card p-5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
            </div>
            <p className="mt-4 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">{toolCategory(tool.category)?.label}</p>
            <h3 className="mt-1 font-sans tracking-tight text-lg font-semibold leading-snug">{tool.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
          </Link>
        )
      })}
      {withAi && (
        <Link
          href="/assistente-ai"
          className="group flex flex-col rounded-lg bg-primary p-5 text-primary-foreground hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <ArrowUpRight className="size-4 opacity-70 group-hover:opacity-100" aria-hidden />
          </div>
          <p className="mt-4 text-xs font-mono font-medium uppercase tracking-wider text-primary-foreground/70">Intelligenza artificiale</p>
          <h3 className="mt-1 font-sans tracking-tight text-lg font-semibold leading-snug">Assistente AI giuridico</h3>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
            Fai una domanda: l&apos;AI risponde citando massime e norme della banca dati.
          </p>
        </Link>
      )}
    </div>
  )
}
