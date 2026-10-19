import type { Metadata } from 'next'
import { InteressiLegaliCalculator } from '@/components/tools/interessi-legali'
import { ToolShell } from '@/components/tools/tool-shell'
import { TASSI_LEGALI } from '@/lib/calc'

export const metadata: Metadata = {
  title: 'Calcolo interessi legali online',
  description: 'Calcola gli interessi legali su un capitale tra due date con i tassi ex art. 1284 c.c. aggiornati.',
}

export default function Page() {
  const recent = [...TASSI_LEGALI].reverse().slice(0, 8)
  return (
    <ToolShell
      slug="interessi-legali"
      guide={
        <>
          <h2>Come funziona il calcolo</h2>
          <p>
            Gli interessi legali sono calcolati in regime di capitalizzazione semplice, su base annua di 365 giorni, applicando per ciascun
            periodo il saggio fissato annualmente con decreto del Ministro dell&apos;Economia ai sensi dell&apos;art. 1284 c.c.
          </p>
          <h3>Tassi degli ultimi anni</h3>
          <table>
            <thead>
              <tr>
                <th>Dal</th>
                <th>Tasso</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.from}>
                  <td>{new Date(t.from).toLocaleDateString('it-IT')}</td>
                  <td>{t.rate.toLocaleString('it-IT')}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Il risultato ha valore indicativo e non tiene conto di eventuali interessi moratori ex D.Lgs. 231/2002.</p>
        </>
      }
    >
      <InteressiLegaliCalculator />
    </ToolShell>
  )
}
