import type { Metadata } from 'next'
import { AdSlot } from '@/components/ads/ad-slot'
import { LegalChat } from '@/components/ai/legal-chat'
import { ListingSidebar } from '@/components/content/listing'

export const metadata: Metadata = {
  title: 'Assistente AI giuridico',
  description: 'Fai una domanda di diritto: l’assistente AI di MioLegale risponde citando massime, sentenze e norme della banca dati.',
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function AssistentePage({ searchParams }: Props) {
  const { q } = await searchParams
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Assistente AI</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-balance">Chiedi all&apos;assistente giuridico</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Risposte in linguaggio semplice, con i riferimenti alla nostra banca dati di massime, sentenze e norme.
        </p>
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_AI_TOP} className="my-6" />
        <LegalChat initialQuestion={q?.slice(0, 500)} />
      </div>
      <ListingSidebar />
    </div>
  )
}
