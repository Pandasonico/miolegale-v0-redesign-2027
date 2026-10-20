import type { Metadata } from 'next'
import { EtaAnagraficaCalculator } from '@/components/tools/eta-anagrafica'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo età anagrafica esatta dalla data di nascita',
  description: 'Calcola l’età in anni, mesi e giorni da una data di nascita, oppure la data raggiunta aggiungendo un numero di giorni.',
}

export default function Page() {
  return (
    <ToolShell
      slug="eta-anagrafica"
      guide={
        <>
          <h2>Come si calcola l&apos;età anagrafica</h2><p>L&apos;età si ottiene dalla differenza tra la data di nascita e la data di riferimento, espressa in anni compiuti, mesi e giorni residui. Il giorno della nascita non viene computato nel secondo modulo, che aggiunge un numero di giorni alla data di nascita.</p><p>Conoscere l&apos;età esatta serve per il valore dell&apos;usufrutto vitalizio, per il risarcimento del danno biologico secondo le tabelle dei tribunali e per verificare requisiti anagrafici di legge.</p>
        </>
      }
    >
      <EtaAnagraficaCalculator />
    </ToolShell>
  )
}
