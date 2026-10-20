import type { Metadata } from 'next'
import { ParcellaAvvocatoCalculator } from '@/components/tools/parcella-avvocato'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo fattura avvocato: spese generali, CPA, IVA e ritenuta',
  description: 'Calcola il totale della fattura dell’avvocato con spese generali 15%, CPA 4%, IVA 22% e ritenuta d’acconto 20%.',
}

export default function Page() {
  return (
    <ToolShell
      slug="parcella-avvocato"
      guide={
        <>
          <h2>Come si calcola la fattura dell&apos;avvocato</h2>
          <p>
            Al compenso si aggiungono le spese generali forfettarie del 15% (art. 2 DM 55/2014). Sulla somma si calcola il contributo
            integrativo del 4% per Cassa Forense, quindi l&apos;IVA al 22% su compenso, spese generali e CPA.
          </p>
          <p>
            Se il cliente è sostituto d&apos;imposta, trattiene la ritenuta d&apos;acconto del 20% su compenso e spese generali. Le spese
            anticipate in nome e per conto del cliente sono escluse da IVA ai sensi dell&apos;art. 15 DPR 633/1972.
          </p>
          <p>I professionisti in regime forfettario non applicano IVA e ritenuta: in tal caso disattiva le relative voci.</p>
        </>
      }
    >
      <ParcellaAvvocatoCalculator />
    </ToolShell>
  )
}
