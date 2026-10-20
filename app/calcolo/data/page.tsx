import type { Metadata } from 'next'
import { CalcoloDataCalculator } from '@/components/tools/calcolo-data'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo data: aggiungere o sottrarre giorni, mesi e anni',
  description: 'Aggiungi o sottrai anni, mesi e giorni a una data e ottieni la data risultante.',
}

export default function Page() {
  return (
    <ToolShell
      slug="data"
      guide={
        <>
          <h2>Come funziona il calcolo</h2><p>Prima si sommano o sottraggono anni e mesi, mantenendo il giorno del mese (se il mese di arrivo è più corto si usa l&apos;ultimo giorno), poi si aggiungono o tolgono i giorni.</p><p>Il calcolatore non applica proroghe per festivi né sospensioni: per i termini del processo civile usa lo strumento sulle scadenze processuali.</p>
        </>
      }
    >
      <CalcoloDataCalculator />
    </ToolShell>
  )
}
