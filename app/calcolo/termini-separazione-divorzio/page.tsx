import type { Metadata } from 'next'
import { TerminiSeparazioneDivorzioCalculator } from '@/components/tools/termini-separazione-divorzio'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Termini tra separazione e divorzio: quando chiedere il divorzio',
  description: 'Calcola la data dalla quale si può chiedere il divorzio dopo la separazione (6 o 12 mesi).',
}

export default function Page() {
  return (
    <ToolShell
      slug="termini-separazione-divorzio"
      guide={
        <>
          <h2>Il divorzio breve</h2><p>La legge n. 55/2015 ha ridotto i tempi tra separazione e divorzio: sei mesi se la separazione è consensuale, dodici se è giudiziale. Il termine decorre dalla comparizione dei coniugi davanti al presidente del tribunale; nella negoziazione assistita e nell&apos;accordo davanti all&apos;ufficiale di stato civile decorre dalla data certificata nell&apos;accordo.</p>
        </>
      }
    >
      <TerminiSeparazioneDivorzioCalculator />
    </ToolShell>
  )
}
