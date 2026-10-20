import type { Metadata } from 'next'
import { UsufruttoTermineCalculator } from '@/components/tools/usufrutto-termine'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo valore usufrutto a termine e nuda proprietà',
  description: 'Valore dell’usufrutto temporaneo e della nuda proprietà con il tasso legale (artt. 46 e 48 DPR 131/1986).',
}

export default function Page() {
  return (
    <ToolShell
      slug="valore-usufrutto-termine"
      guide={
        <>
          <h2>Formula dell&apos;usufrutto a termine</h2><p>Il valore dell&apos;usufrutto temporaneo è VU = VP × (1 − (1 + i)<sup>−n</sup>), dove VP è il valore della piena proprietà, i il tasso di interesse legale e n la durata in anni. La nuda proprietà è la differenza tra piena proprietà e usufrutto.</p><p>Ai sensi dell&apos;art. 46, comma 2, lett. b) DPR 131/1986 il valore non può superare venti annualità, cioè 20 × VP × i. Per l&apos;usufrutto vitalizio si applicano invece i coefficienti per età.</p>
        </>
      }
    >
      <UsufruttoTermineCalculator />
    </ToolShell>
  )
}
