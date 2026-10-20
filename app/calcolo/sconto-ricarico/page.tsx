import type { Metadata } from 'next'
import { ScontoRicaricoCalculator } from '@/components/tools/sconto-ricarico'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo sconto, ricarico e margine',
  description: 'Calcola il prezzo scontato, il prezzo di vendita con ricarico e il margine di guadagno.',
}

export default function Page() {
  return (
    <ToolShell
      slug="sconto-ricarico"
      guide={
        <>
          <h2>Ricarico e margine non coincidono</h2><p>Il ricarico è calcolato sul costo di acquisto, il margine sul prezzo di vendita. Un ricarico del 25% su un costo di € 100 dà un prezzo di € 125 e un margine del 20%.</p><p>Per ottenere un margine desiderato il prezzo di vendita è il costo diviso per (1 − margine/100).</p>
        </>
      }
    >
      <ScontoRicaricoCalculator />
    </ToolShell>
  )
}
