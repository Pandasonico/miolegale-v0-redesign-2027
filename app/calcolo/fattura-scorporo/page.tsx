import type { Metadata } from 'next'
import { FatturaScorporoCalculator } from '@/components/tools/fattura-scorporo'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo fattura professionisti con scorporo IVA e ritenuta',
  description: 'Fattura diretta e inversa: dal compenso al totale e dal totale o dal netto al compenso, con cassa, IVA, ritenuta e split payment.',
}

export default function Page() {
  return (
    <ToolShell
      slug="fattura-scorporo"
      guide={
        <>
          <h2>Fattura diretta e inversa</h2><p>Nel calcolo diretto si parte dal compenso e si sommano rimborso spese generali (15%), cassa previdenziale (4%), IVA e spese esenti. Nel calcolo inverso si parte dal totale in fattura o dal netto a pagare e si risale al compenso.</p><p>La ritenuta d&apos;acconto del 20% è calcolata su compenso e spese generali. Con lo split payment l&apos;IVA è versata direttamente dalla pubblica amministrazione. Nel regime forfettario non si applicano IVA e ritenuta; se la fattura supera € 77,47 è dovuto il bollo di € 2, che può essere addebitato al cliente.</p>
        </>
      }
    >
      <FatturaScorporoCalculator />
    </ToolShell>
  )
}
