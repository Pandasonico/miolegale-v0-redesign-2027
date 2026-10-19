import type { Metadata } from 'next'
import { ScorporoIvaCalculator } from '@/components/tools/scorporo-iva'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo e scorporo IVA online',
  description: 'Aggiungi o scorpora l’IVA da un importo con le aliquote 22%, 10%, 5% e 4%.',
}

export default function Page() {
  return (
    <ToolShell
      slug="scorporo-iva"
      guide={
        <>
          <h2>Formule per lo scorporo dell&apos;IVA</h2>
          <p>
            Per scorporare l&apos;IVA si divide l&apos;importo lordo per (1 + aliquota/100): con aliquota 22% l&apos;imponibile di € 1.220
            è € 1.000. Per aggiungere l&apos;IVA si moltiplica l&apos;imponibile per l&apos;aliquota e si somma il risultato.
          </p>
          <p>
            Aliquote vigenti: 22% ordinaria, 10% e 5% ridotte, 4% minima per beni di prima necessità (DPR 633/1972, tabella A).
          </p>
        </>
      }
    >
      <ScorporoIvaCalculator />
    </ToolShell>
  )
}
