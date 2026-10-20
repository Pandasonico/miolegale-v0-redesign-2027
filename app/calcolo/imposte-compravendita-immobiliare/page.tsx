import type { Metadata } from 'next'
import { ImposteCompravenditaCalculator } from '@/components/tools/imposte-compravendita'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo imposte sulla compravendita immobiliare',
  description: 'Registro, ipotecaria, catastale e IVA per l’acquisto di una casa, prima o seconda, da privato o impresa.',
}

export default function Page() {
  return (
    <ToolShell
      slug="imposte-compravendita-immobiliare"
      guide={
        <>
          <h2>Imposte sull&apos;acquisto della casa</h2><p>Da un privato si paga l&apos;imposta di registro: 2% con agevolazioni prima casa, 9% negli altri casi, con minimo di € 1.000, più € 50 di ipotecaria e € 50 di catastale. Da un&apos;impresa si paga l&apos;IVA (4% prima casa, 10% altre abitazioni non di lusso, 22% per le categorie A/1, A/8 e A/9) più registro, ipotecaria e catastale in misura fissa di € 200 ciascuna.</p><p>Con il regime prezzo-valore le imposte si calcolano sul valore catastale, pari alla rendita rivalutata del 5% per il moltiplicatore 110 (prima casa) o 120 (altre abitazioni).</p>
        </>
      }
    >
      <ImposteCompravenditaCalculator />
    </ToolShell>
  )
}
