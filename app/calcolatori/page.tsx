import type { Metadata } from 'next'
import { AdSlot } from '@/components/ads/ad-slot'
import { ToolsGrid } from '@/components/tools/tools-grid'

export const metadata: Metadata = {
  title: 'Calcolatori legali gratuiti',
  description: 'Calcolo interessi legali, contributo unificato e scadenza dei termini processuali. Strumenti gratuiti per avvocati e cittadini.',
}

export default function CalcolatoriPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm font-mono font-medium uppercase tracking-widest text-primary">Strumenti</p>
      <h1 className="mt-2 font-sans tracking-tight text-4xl font-semibold">Calcolatori legali</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Strumenti gratuiti e aggiornati alla normativa vigente. I risultati hanno valore indicativo: verifica sempre i casi particolari.
      </p>
      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_TOP} className="my-8" />
      <ToolsGrid />
    </div>
  )
}
