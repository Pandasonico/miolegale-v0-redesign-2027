import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { z } from 'zod'
import { getPosts } from '@/lib/wp'

export const maxDuration = 60

const SYSTEM = `Sei l'assistente giuridico di MioLegale.it, portale italiano di informazione giuridica.
- Rispondi sempre in italiano, in modo chiaro e accessibile anche ai non giuristi.
- Prima di rispondere a domande di diritto usa lo strumento cercaBancaDati per trovare massime, sentenze, norme o guide pertinenti e citale.
- Cita gli articoli di legge pertinenti quando li conosci con certezza. Non inventare numeri di sentenza o riferimenti.
- Scrivi in testo semplice: paragrafi brevi, elenchi con il trattino. Non usare tabelle o markdown complesso.
- Per calcoli di interessi legali, contributo unificato o scadenze suggerisci i calcolatori di MioLegale (/calcolo).
- Concludi ricordando che le informazioni non sostituiscono la consulenza di un avvocato quando la questione è concreta.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'google/gemini-3.8-flash',
    system: SYSTEM,
    messages: await convertToModelMessages(messages.slice(-20)),
    stopWhen: isStepCount(4),
    tools: {
      cercaBancaDati: tool({
        description: 'Cerca nella banca dati di MioLegale (massime, sentenze, norme, guide, brocardi).',
        inputSchema: z.object({
          query: z.string().min(2).max(100).describe('Parole chiave in italiano, es. "risarcimento danno da insidia stradale"'),
        }),
        execute: async ({ query }) => {
          const { posts } = await getPosts({ search: query, perPage: 5 })
          return posts.map((p) => ({ title: p.title, url: p.href, section: p.section, excerpt: p.excerpt.slice(0, 400) }))
        },
      }),
    },
  })

  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })
}
