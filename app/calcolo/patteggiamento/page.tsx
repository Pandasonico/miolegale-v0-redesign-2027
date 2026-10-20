import type { Metadata } from 'next'
import { PatteggiamentoCalculator } from '@/components/tools/patteggiamento'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo patteggiamento: pena con riduzione di un terzo',
  description: 'Calcola la pena finale con la riduzione fino a un terzo dell’art. 444 c.p.p. e il tipo di patteggiamento.',
}

export default function Page() {
  return (
    <ToolShell
      slug="patteggiamento"
      guide={
        <>
          <h2>Applicazione della pena su richiesta</h2><p>Con il patteggiamento la pena, tenuto conto delle circostanze, è diminuita fino a un terzo (art. 444 c.p.p.). Si parte dalla pena base già determinata, si applica la riduzione e si verifica il limite: fino a due anni il patteggiamento è ordinario, fino a cinque anni è allargato, oltre non è ammesso.</p><p>Il calcolatore non considera le cause di esclusione dal patteggiamento allargato né la sostituzione della pena.</p>
        </>
      }
    >
      <PatteggiamentoCalculator />
    </ToolShell>
  )
}
