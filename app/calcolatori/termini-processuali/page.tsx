import type { Metadata } from 'next'
import { TerminiProcessualiCalculator } from '@/components/tools/termini-processuali'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo scadenza termini processuali',
  description: 'Calcola la scadenza dei termini processuali con sospensione feriale, sabati e festività (art. 155 c.p.c.).',
}

export default function Page() {
  return (
    <ToolShell
      slug="termini-processuali"
      guide={
        <>
          <h2>Regole applicate</h2>
          <ul>
            <li>Il giorno iniziale non si computa (dies a quo non computatur, art. 155 c.1 c.p.c.).</li>
            <li>Il periodo dal 1° al 31 agosto è escluso dal computo (art. 1 L. 742/1969), se l&apos;opzione è attiva.</li>
            <li>Se la scadenza cade di sabato, domenica o in un giorno festivo, è prorogata al primo giorno seguente non festivo (art. 155 c.4-5 c.p.c.).</li>
          </ul>
          <p>
            La sospensione feriale non si applica, tra l&apos;altro, ai procedimenti cautelari, alle controversie di lavoro e ai
            procedimenti con detenuti. Non sono considerate le festività patronali locali.
          </p>
        </>
      }
    >
      <TerminiProcessualiCalculator />
    </ToolShell>
  )
}
