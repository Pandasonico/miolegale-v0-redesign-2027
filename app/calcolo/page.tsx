import type { Metadata } from 'next'
import { AdSlot } from '@/components/ads/ad-slot'
import { ToolsIndex } from '@/components/tools/tools-index'
import { TOOLS, resolveToolCategories, type Tool } from '@/lib/site'
import { getCalcPageList } from '@/lib/wp'

export const metadata: Metadata = {
  title: 'Calcolatori legali gratuiti',
  description: 'Calcolo interessi legali, contributo unificato e scadenza dei termini processuali. Strumenti gratuiti per avvocati e cittadini.',
}

export const revalidate = 3600

export default async function CalcolatoriPage() {
  const wpPages = await getCalcPageList()
  const wpBySlug = new Map(wpPages.map((p) => [p.slug, p]))

  // La categoria scelta in WordPress ha la precedenza su quella del registro.
  const registered: Tool[] = TOOLS.map((tool) => {
    const fromWp = resolveToolCategories(wpBySlug.get(tool.slug)?.categories ?? [])
    return fromWp ? { ...tool, ...fromWp } : tool
  })

  const known = new Set(TOOLS.map((t) => t.slug))
  const created: Tool[] = wpPages
    .filter((p) => !known.has(p.slug))
    .map((p) => {
      const categories = resolveToolCategories(p.categories) ?? { category: 'altri-calcolatori', alsoIn: [] }
      return { slug: p.slug, title: p.title, description: p.excerpt, ...categories }
    })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm font-mono font-medium uppercase tracking-widest text-primary">Strumenti</p>
      <h1 className="mt-2 font-sans tracking-tight text-4xl font-semibold">Calcolatori legali</h1>
      <p className="mt-3 text-pretty text-muted-foreground">
        Strumenti gratuiti e aggiornati alla normativa vigente. I risultati hanno valore indicativo: verifica sempre i casi particolari.
      </p>
      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_TOP} className="my-8" />
      <ToolsIndex tools={[...registered, ...created]} />
    </div>
  )
}
