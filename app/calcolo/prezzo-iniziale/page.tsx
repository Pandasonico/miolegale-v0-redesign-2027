import type { Metadata } from 'next'
import { PrezzoInizialeCalculator } from '@/components/tools/prezzo-iniziale'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo prezzo iniziale da prezzo scontato',
  description: 'Risali al prezzo di partenza dal prezzo finale e dalla percentuale di sconto o aumento.',
}

export default function Page() {
  return (
    <ToolShell
      slug="prezzo-iniziale"
      guide={
        <>
          <h2>Come si risale al prezzo iniziale</h2><p>Con uno sconto la percentuale si applica al prezzo iniziale, non a quello finale: il prezzo iniziale è il finale diviso per (1 − sconto/100). Con un aumento è il finale diviso per (1 + aumento/100).</p><p>Esempio: un articolo a € 80 dopo uno sconto del 20% costava € 100, non € 96.</p>
        </>
      }
    >
      <PrezzoInizialeCalculator />
    </ToolShell>
  )
}
