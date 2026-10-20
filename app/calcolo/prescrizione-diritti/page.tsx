import type { Metadata } from 'next'
import { PrescrizioneCalculator } from '@/components/tools/prescrizione'
import { ToolShell } from '@/components/tools/tool-shell'
import { TERMINI_PRESCRIZIONE } from '@/lib/calc'

export const metadata: Metadata = {
  title: 'Calcolo prescrizione civile',
  description: 'Calcola la data di prescrizione di un diritto secondo i termini ordinari e brevi del codice civile.',
}

export default function Page() {
  return (
    <ToolShell
      slug="prescrizione-diritti"
      guide={
        <>
          <h2>Termini di prescrizione nel codice civile</h2>
          <table>
            <thead>
              <tr>
                <th>Diritto</th>
                <th>Norma</th>
              </tr>
            </thead>
            <tbody>
              {TERMINI_PRESCRIZIONE.map((t) => (
                <tr key={t.id}>
                  <td>{t.label}</td>
                  <td>{t.norm}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            La prescrizione decorre dal giorno in cui il diritto può essere fatto valere (art. 2935 c.c.) e si interrompe con la
            notificazione dell&apos;atto introduttivo del giudizio o con un atto di costituzione in mora (art. 2943 c.c.). Dopo
            l&apos;interruzione inizia un nuovo periodo di prescrizione.
          </p>
        </>
      }
    >
      <PrescrizioneCalculator />
    </ToolShell>
  )
}
