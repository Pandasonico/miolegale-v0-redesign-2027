import type { Metadata } from 'next'
import { GiorniTraDateCalculator } from '@/components/tools/giorni-tra-date'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo giorni tra due date e giorni lavorativi',
  description: 'Calcola i giorni di calendario e lavorativi tra due date, esclusi weekend e festività nazionali italiane.',
}

export default function Page() {
  return (
    <ToolShell
      slug="giorni-tra-due-date"
      guide={
        <>
          <h2>Come vengono contati i giorni</h2>
          <p>
            Il conteggio segue la regola dell&apos;art. 2963 c.c. e dell&apos;art. 155 c.p.c.: il giorno iniziale non si computa, quello
            finale sì. I giorni lavorativi escludono sabati, domeniche, le festività nazionali e il Lunedì dell&apos;Angelo.
          </p>
          <p>Le festività patronali locali non sono considerate.</p>
        </>
      }
    >
      <GiorniTraDateCalculator />
    </ToolShell>
  )
}
