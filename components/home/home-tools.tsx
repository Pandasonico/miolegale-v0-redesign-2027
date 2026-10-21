import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  CalendarPlus,
  CalendarRange,
  FileText,
  FolderTree,
  Home,
  Landmark,
  Percent,
  Receipt,
  UserRound,
} from 'lucide-react'
import { POPULAR_TOOLS, toolCategory } from '@/lib/site'
import { UTILITY_CATEGORIES, type UtilityPage } from '@/lib/wp'

type HomeTool = {
  href: string
  title: string
  description: string
  label: string
  Icon: typeof Percent
}

const CALCULATOR_ICONS: Record<string, typeof Percent> = {
  'giorni-tra-due-date': CalendarRange,
  'fattura-scorporo': FileText,
  'termini-processuali': CalendarClock,
  'eta-anagrafica': UserRound,
  'parcella-avvocato': Receipt,
  data: CalendarPlus,
}

/** Le utilità più consultate, nell'ordine in cui compaiono in /utilita. */
const FEATURED_UTILITIES = [
  { slug: 'tabella-contributo-unificato', Icon: Landmark },
  { slug: 'ultimo-indice-istat', Icon: BarChart3 },
  { slug: 'coefficienti-calcolo-usufrutto', Icon: Home },
  { slug: 'categorie-catastali', Icon: FolderTree },
] as const

const PER_KIND = 4

function buildTools(utilities: UtilityPage[]): HomeTool[] {
  const utilityTools = FEATURED_UTILITIES.flatMap(({ slug, Icon }) => {
    const page = utilities.find((p) => p.href.replace(/\/+$/, '').endsWith(`/${slug}`))
    if (!page) return []
    const label = UTILITY_CATEGORIES.find((c) => c.slug === page.category)?.label ?? 'Utilità'
    return [{ href: page.href.replace('https://miolegale.it', ''), title: page.title, description: page.excerpt, label, Icon }]
  })

  // Se le utilità non sono raggiungibili, la riga si completa con altri calcolatori per restare a 8 box.
  const calculatorCount = PER_KIND + (PER_KIND - utilityTools.length)
  const calculators = POPULAR_TOOLS.slice(0, calculatorCount).map((tool) => ({
    href: `/calcolo/${tool.slug}`,
    title: tool.title,
    description: tool.description,
    label: toolCategory(tool.category)?.label ?? 'Calcolatore',
    Icon: CALCULATOR_ICONS[tool.slug] ?? Percent,
  }))

  return [...calculators, ...utilityTools]
}

export function HomeTools({ utilities }: { utilities: UtilityPage[] }) {
  const tools = buildTools(utilities)

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tools.map(({ href, title, description, label, Icon }) => (
        <li key={href}>
          <Link href={href} className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
            </div>
            <p className="mt-4 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <h3 className="mt-1 font-sans text-base font-semibold leading-snug tracking-tight sm:text-lg">{title}</h3>
            {description && (
              <p className="mt-2 line-clamp-3 hidden text-sm leading-relaxed text-muted-foreground sm:block">{description}</p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
