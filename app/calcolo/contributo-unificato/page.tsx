import type { Metadata } from 'next'
import { ContributoUnificatoCalculator } from '@/components/tools/contributo-unificato'
import { ToolShell } from '@/components/tools/tool-shell'
import { SCAGLIONI_CU, euro } from '@/lib/calc'

export const metadata: Metadata = {
  title: 'Calcolo contributo unificato',
  description: 'Calcola il contributo unificato per l’iscrizione a ruolo nel processo civile secondo l’art. 13 DPR 115/2002.',
}

export default function Page() {
  return (
    <ToolShell
      slug="contributo-unificato"
      guide={
        <>
          <h2>Scaglioni del contributo unificato</h2>
          <p>Importi previsti dall&apos;art. 13, comma 1, del DPR 115/2002 per i processi civili di primo grado.</p>
          <table>
            <thead>
              <tr>
                <th>Valore della causa</th>
                <th>Importo</th>
              </tr>
            </thead>
            <tbody>
              {SCAGLIONI_CU.map((s) => (
                <tr key={s.label}>
                  <td>{s.label}</td>
                  <td>{euro(s.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Per l&apos;appello l&apos;importo è aumentato della metà, per il giudizio di Cassazione è raddoppiato. Sono esclusi dal calcolo i
            procedimenti esecutivi, cautelari e di volontaria giurisdizione, soggetti a importi specifici.
          </p>
        </>
      }
    >
      <ContributoUnificatoCalculator />
    </ToolShell>
  )
}
