export const SITE = {
  name: 'MioLegale',
  domain: 'miolegale.it',
  url: 'https://miolegale.it',
  tagline: 'Banca dati giuridica, calcolatori legali e assistente AI',
}

export type Section = {
  slug: string
  label: string
  short: string
  description: string
}

export const SECTIONS: Section[] = [
  { slug: 'massime', label: 'Massime di giurisprudenza', short: 'Massime', description: 'Principi di diritto estratti dalle pronunce di Cassazione e merito.' },
  { slug: 'sentenze', label: 'Sentenze', short: 'Sentenze', description: 'Testi integrali delle sentenze commentate.' },
  { slug: 'norme', label: 'Norme e codici', short: 'Norme', description: 'Leggi, decreti e codici aggiornati.' },
  { slug: 'notizie', label: 'Notizie giuridiche', short: 'Notizie', description: 'Novità normative e giurisprudenziali.' },
  { slug: 'guide', label: 'Guide di diritto', short: 'Guide', description: 'Approfondimenti pratici per cittadini e professionisti.' },
  { slug: 'brocardi', label: 'Brocardi e aforismi', short: 'Brocardi', description: 'Massime latine e aforismi giuridici spiegati.' },
  { slug: 'formulario-civile', label: 'Formulario civile', short: 'Formulario civile', description: 'Modelli di atti civili pronti all’uso.' },
  { slug: 'formulario-penale', label: 'Formulario penale', short: 'Formulario penale', description: 'Modelli di atti penali pronti all’uso.' },
]

export type Archive = {
  slug: 'costituzione' | 'codici' | 'testi-unici'
  label: string
  short: string
  description: string
}

export const ARCHIVES: Archive[] = [
  {
    slug: 'costituzione',
    label: 'Costituzione italiana',
    short: 'Costituzione',
    description: 'I 139 articoli e le disposizioni transitorie e finali, aggiornati al 2026.',
  },
  {
    slug: 'codici',
    label: 'Costituzione e codici',
    short: 'Codici',
    description: 'La Costituzione italiana, il codice civile, penale, di procedura, della strada e tutti gli altri codici vigenti.',
  },
  {
    slug: 'testi-unici',
    label: 'Testi unici',
    short: 'Testi unici',
    description: 'Testi unici in materia fiscale, edilizia, bancaria, enti locali e altro.',
  },
]

export const SOURCE_ARCHIVES: { slug: string; label: string; description: string }[] = [
  ARCHIVES[1],
  {
    slug: 'norme',
    label: 'Leggi e decreti',
    description: 'Leggi, decreti legislativi e decreti-legge con il testo vigente e le ultime modifiche.',
  },
  ARCHIVES[2],
]

export const DATABASE_MENU = [
  { href: '/codici', label: 'Codici italiani' },
  { href: '/norme', label: 'Leggi e decreti' },
  { href: '/testi-unici', label: 'Testi unici' },
  { href: '/massime', label: 'Massime giurisprudenziali' },
  { href: '/sentenze', label: 'Sentenze complete' },
  { href: '/guide', label: 'Guide di diritto' },
  { href: '/notizie', label: 'Notizie giuridiche' },
  { href: '/brocardi', label: 'Brocardi' },
]

export const MATERIE = [
  { slug: 'diritto-civile-procedura-civile', label: 'Civile e procedura civile' },
  { slug: 'diritto-penale-procedura-penale', label: 'Penale e procedura penale' },
  { slug: 'diritto-del-lavoro-previdenza', label: 'Lavoro e previdenza' },
  { slug: 'diritto-amministrativo', label: 'Amministrativo ed enti locali' },
  { slug: 'diritto-tributario-fisco', label: 'Fisco e tributi' },
  { slug: 'diritto-di-famiglia-successioni', label: 'Famiglia e successioni' },
  { slug: 'ordinamento-giudiziario-forense', label: 'Ordinamento forense' },
  { slug: 'diritto-commerciale', label: 'Commerciale e fallimentare' },
  { slug: 'ordine-pubblico-sanita', label: 'Ordine pubblico e sanità' },
  { slug: 'diritto-circolazione-stradale', label: 'Codice della strada' },
  { slug: 'diritti-consumatori', label: 'Consumatori' },
  { slug: 'diritti-fondamentali-persona', label: 'Diritti fondamentali' },
  { slug: 'assicurazioni-responsabilita-civile', label: 'Assicurazioni e RC' },
  { slug: 'diritto-urbanistico-edilizia', label: 'Urbanistica ed edilizia' },
  { slug: 'diritto-bancario-finanziario', label: 'Banca e mercati finanziari' },
  { slug: 'condominio-locazioni', label: 'Condominio e locazioni' },
  { slug: 'europa-affari-esteri', label: 'Europa e affari esteri' },
  { slug: 'ambiente-protezione-civile', label: 'Ambiente' },
  { slug: 'diritto-costituzionale', label: 'Affari costituzionali' },
  { slug: 'diritto-nuove-tecnologie', label: 'Diritto e nuove tecnologie' },
]

export type Tool = {
  slug: string
  title: string
  description: string
  category: string
}

export const TOOLS: Tool[] = [
  {
    slug: 'interessi-legali',
    title: 'Calcolo interessi legali',
    description: 'Interessi su un capitale con i tassi legali in vigore anno per anno (art. 1284 c.c.).',
    category: 'Civile',
  },
  {
    slug: 'contributo-unificato',
    title: 'Contributo unificato',
    description: 'Importo dovuto per l’iscrizione a ruolo in base a valore e grado (art. 13 DPR 115/2002).',
    category: 'Processo civile',
  },
  {
    slug: 'termini-processuali',
    title: 'Scadenza termini processuali',
    description: 'Calcolo della scadenza con sospensione feriale, sabati e festivi (art. 155 c.p.c.).',
    category: 'Processo',
  },
  {
    slug: 'parcella-avvocato',
    title: 'Fattura avvocato',
    description: 'Dal compenso al totale: spese generali 15%, CPA 4%, IVA 22% e ritenuta d’acconto 20%.',
    category: 'Professione',
  },
  {
    slug: 'prescrizione',
    title: 'Calcolo prescrizione',
    description: 'Data di prescrizione del diritto secondo i termini del codice civile (artt. 2946 ss. c.c.).',
    category: 'Civile',
  },
  {
    slug: 'scorporo-iva',
    title: 'Calcolo e scorporo IVA',
    description: 'Aggiungi o scorpora l’IVA da un importo con le aliquote italiane 22%, 10%, 5% e 4%.',
    category: 'Fisco',
  },
  {
    slug: 'giorni-tra-date',
    title: 'Giorni tra due date',
    description: 'Giorni di calendario e giorni lavorativi tra due date, esclusi weekend e festività nazionali.',
    category: 'Utilità',
  },
]

export function sectionBySlug(slug: string) {
  return SECTIONS.find((s) => s.slug === slug)
}
