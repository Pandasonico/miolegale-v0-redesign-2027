export const SITE = {
  name: 'MioLegale',
  domain: 'miolegale.it',
  url: 'https://miolegale.it',
  tagline: 'Banca dati giuridica, calcolatori, consulenza legale e assistente AI',
  /** Ricerca filtrata per archivio, servita da WordPress. */
  bancaDatiGiuridicaUrl: '/banca-dati#ricerca',
}

export const STUDIO = {
  lawyer: 'Avv. Gianluca Lanciano',
  name: 'Studio Legale Avv. Gianluca Lanciano',
  profileUrl: 'https://miolegale.it/author/avv-gianluca-lanciano/',
  consulenzaUrl: '/consulenza-legale',
  privacyUrl: 'https://miolegale.it/info/note-legali-privacy/',
  contattiUrl: '/info/contatti',
  priceFrom: '143,44',
  responseTime: '24 ore',
}

export const NEWSLETTER_ENDPOINT = 'https://miolegale.it/wp-admin/admin-ajax.php?action=tnp&na=s'

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

  export const SEARCH_ARCHIVES: { slug: string; label: string }[] = SECTIONS.map((s) => ({
  slug: s.slug,
  label: s.slug === 'norme' ? 'Leggi e decreti' : s.short,
  }))
  
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
    label: 'Codici',
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

/** Categorie dell'indice dei calcolatori, nell'ordine in cui compaiono. */
export const TOOL_CATEGORIES: { slug: string; label: string; short: string }[] = [
  { slug: 'termini-processuali', label: 'Termini processuali e prescrizione', short: 'Termini processuali' },
  { slug: 'date-scadenze', label: 'Date e scadenze', short: 'Date e scadenze' },
  { slug: 'calcoli-penali', label: 'Pena, patteggiamento e misure alternative', short: 'Calcoli penali' },
  { slug: 'danno-biologico', label: 'Danno biologico e risarcimento del danno', short: 'Danno biologico' },
  { slug: 'interessi-legali-moratori', label: 'Interessi legali e moratori', short: 'Interessi legali e moratori' },
  { slug: 'rivalutazione-istat', label: 'Rivalutazione e devalutazione monetaria Istat', short: 'Rivalutazione Istat' },
  { slug: 'compensi-professionali', label: 'Compensi professionali', short: 'Compensi professionali' },
  { slug: 'contributo-unificato-diritti-copia', label: 'Contributo unificato, diritti di copia e mediazione', short: 'Spese di giustizia' },
  { slug: 'iva-fatturazione', label: 'IVA e fatturazione', short: 'IVA e fatturazione' },
  { slug: 'imposte-tasse', label: 'Imposte, tasse e stipendio', short: 'Imposte e tasse' },
  { slug: 'interessi-calcoli-finanziari', label: 'Mutui, prestiti e calcoli finanziari', short: 'Calcoli finanziari' },
  { slug: 'quote-ereditarie-reversibilita', label: 'Successioni, quote ereditarie e reversibilità', short: 'Successioni' },
  { slug: 'valore-proprieta-usufrutto', label: 'Proprietà, usufrutto e condominio', short: 'Proprietà e condominio' },
  { slug: 'codice-strada', label: 'Codice della strada', short: 'Codice della strada' },
  { slug: 'codice-fiscale-anagrafica', label: 'Codice fiscale e dati anagrafici', short: 'Codice fiscale' },
  { slug: 'percentuali-sconto-ricarico', label: 'Percentuali, sconto e ricarico', short: 'Percentuali e sconti' },
  /** Dove finiscono le pagine create su WordPress che non sono ancora nel registro. */
  { slug: 'altri-calcolatori', label: 'Altri calcolatori', short: 'Altri calcolatori' },
]

export function toolCategory(slug: string) {
  return TOOL_CATEGORIES.find((c) => c.slug === slug)
}

const normalizeCategoryKey = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/**
 * Traduce i valori scritti in WordPress (slug, etichetta completa o breve) in categorie del registro.
 * La prima è la categoria principale, le altre finiscono in `alsoIn`. Valori sconosciuti vengono ignorati.
 */
export function resolveToolCategories(values: string[]): { category: string; alsoIn: string[] } | null {
  const found: string[] = []
  for (const value of values) {
    const key = normalizeCategoryKey(value)
    const match = TOOL_CATEGORIES.find(
      (c) => normalizeCategoryKey(c.slug) === key || normalizeCategoryKey(c.label) === key || normalizeCategoryKey(c.short) === key,
    )
    if (match && !found.includes(match.slug)) found.push(match.slug)
  }
  if (found.length === 0) return null
  return { category: found[0], alsoIn: found.slice(1) }
}

export type Tool = {
  slug: string
  title: string
  description: string
  /** Slug di una voce di TOOL_CATEGORIES. */
  category: string
  /** Altre categorie in cui il calcolatore compare nell'indice. */
  alsoIn?: string[]
  /** Compare nella riga "I più usati"; l'ordine è quello dell'elenco. */
  popular?: boolean
  /** Parole aggiuntive per la ricerca. */
  keywords?: string[]
}

/** Ordinati per clic su Search Console: l'ordine decide anche quello delle liste. */
export const TOOLS: Tool[] = [
  {
    slug: 'giorni-tra-due-date',
    title: 'Giorni tra due date',
    description: 'Giorni di calendario e giorni lavorativi tra due date, esclusi weekend e festività nazionali.',
    category: 'date-scadenze',
    popular: true,
    keywords: ['differenza', 'lavorativi', 'calendario', 'quanti giorni'],
  },
  {
    slug: 'fattura-scorporo',
    title: 'Fattura con scorporo IVA e ritenuta',
    description: 'Fattura diretta e inversa: dal compenso al totale e dal totale o dal netto al compenso, con cassa, IVA, ritenuta e split payment.',
    category: 'iva-fatturazione',
    alsoIn: ['compensi-professionali'],
    popular: true,
    keywords: ['fattura inversa', 'netto', 'ritenuta', 'split payment', 'forfettario', 'bollo', 'cassa forense'],
  },
  {
    slug: 'termini-processuali',
    title: 'Scadenza termini processuali',
    description: 'Calcolo della scadenza con sospensione feriale, sabati e festivi (art. 155 c.p.c.).',
    category: 'termini-processuali',
    popular: true,
    keywords: ['sospensione feriale', 'scadenza', 'giorni', 'impugnazione'],
  },
  {
    slug: 'rivalutazione-monetaria',
    title: 'Rivalutazione monetaria ISTAT',
    description: 'Rivalutazione di un capitale con l’indice FOI dell’ISTAT dal 1947 a oggi.',
    category: 'rivalutazione-istat',
    keywords: ['foi', 'istat', 'indice', 'adeguamento', 'affitto', 'assegno'],
  },
  {
    slug: 'eta-anagrafica',
    title: 'Età anagrafica',
    description: 'Età esatta in anni, mesi e giorni dalla data di nascita, o aggiungendo un numero di giorni.',
    category: 'date-scadenze',
    alsoIn: ['codice-fiscale-anagrafica'],
    popular: true,
    keywords: ['data di nascita', 'anni compiuti', 'età cronologica'],
  },
  {
    slug: 'percentuale',
    title: 'Calcolo percentuale',
    description: 'Percentuale di un numero, rapporto percentuale, variazione percentuale, aumento e diminuzione.',
    category: 'percentuali-sconto-ricarico',
    popular: true,
    keywords: ['percento', 'variazione', 'aumento', 'diminuzione'],
  },
  {
    slug: 'parcella-avvocato',
    title: 'Fattura avvocato',
    description: 'Dal compenso al totale: spese generali 15%, CPA 4%, IVA 22% e ritenuta d’acconto 20%.',
    category: 'compensi-professionali',
    popular: true,
    keywords: ['parcella', 'cpa', 'ritenuta', 'compenso', 'iva'],
  },
  {
    slug: 'lesioni-macropermanenti',
    title: 'Lesioni macropermanenti',
    description: 'Danno biologico per invalidità permanente superiore al 9%.',
    category: 'danno-biologico',
    keywords: ['invalidità', 'risarcimento', 'sinistro', 'punti'],
  },
  {
    slug: 'taeg',
    title: 'Calcolo TAN e TAEG',
    description: 'TAEG di prestiti e mutui partendo dal TAN o dalla rata, con le spese accessorie.',
    category: 'interessi-calcoli-finanziari',
    popular: true,
    keywords: ['finanziamento', 'mutuo', 'prestito', 'tasso effettivo', 'rata', 'tan'],
  },
  {
    slug: 'data',
    title: 'Calcolo data',
    description: 'Aggiungi o sottrai anni, mesi e giorni a una data e ottieni la data risultante.',
    category: 'date-scadenze',
    popular: true,
    keywords: ['aggiungere giorni', 'sottrarre', 'tra 30 giorni', 'mesi'],
  },
  {
    slug: 'prezzo-iniziale',
    title: 'Prezzo iniziale da prezzo scontato',
    description: 'Risali al prezzo di partenza dal prezzo finale e dalla percentuale di sconto o aumento.',
    category: 'percentuali-sconto-ricarico',
    keywords: ['prezzo originale', 'sconto', 'scorporo percentuale', 'prima dello sconto'],
  },
  {
    slug: 'termini-171-ter-189-275-bis',
    title: 'Termini artt. 171-ter, 189 e 275-bis c.p.c.',
    description: 'Scadenze delle memorie e degli atti del processo civile ordinario rispetto alle udienze.',
    category: 'termini-processuali',
    keywords: ['memorie', 'precisazione conclusioni', 'comparsa conclusionale', 'cartabia'],
  },
  {
    slug: 'pensione-reversibilita',
    title: 'Pensione di reversibilità',
    description: 'Quota di pensione spettante ai superstiti in base ai familiari e ai redditi.',
    category: 'quote-ereditarie-reversibilita',
    keywords: ['superstiti', 'coniuge', 'figli', 'inps'],
  },
  {
    slug: 'interessi-moratori',
    title: 'Interessi moratori',
    description: 'Interessi di mora sulle transazioni commerciali (D.Lgs. 231/2002).',
    category: 'interessi-legali-moratori',
    keywords: ['ritardo pagamento', 'bce', 'transazioni commerciali', 'mora'],
  },
  {
    slug: 'tabelle-milano',
    title: 'Danno biologico, Tabelle di Milano',
    description: 'Risarcimento del danno non patrimoniale per lesioni, invalidità permanente e temporanea.',
    category: 'danno-biologico',
    keywords: ['tribunale di milano', 'punto', 'invalidità temporanea', 'personalizzazione'],
  },
  {
    slug: 'lesioni-micropermanenti',
    title: 'Lesioni micropermanenti',
    description: 'Danno biologico per invalidità permanente fino al 9% (art. 139 Cod. Ass.).',
    category: 'danno-biologico',
    keywords: ['colpo di frusta', 'rc auto', 'invalidità', 'sinistro stradale'],
  },
  {
    slug: 'termini-separazione-divorzio',
    title: 'Termini tra separazione e divorzio',
    description: 'Data dalla quale si può chiedere il divorzio dopo la separazione (6 o 12 mesi).',
    category: 'termini-processuali',
    keywords: ['divorzio breve', 'consensuale', 'giudiziale', 'legge 55/2015'],
  },
  {
    slug: 'scorporo-iva',
    title: 'Calcolo e scorporo IVA',
    description: 'Aggiungi o scorpora l’IVA da un importo con le aliquote italiane 22%, 10%, 5% e 4%.',
    category: 'iva-fatturazione',
    keywords: ['aliquota', 'imponibile', 'imposta'],
  },
  {
    slug: 'patteggiamento',
    title: 'Calcolo patteggiamento e della pena',
    description: 'Aumenti e riduzioni per aggravanti e attenuanti, diminuente del patteggiamento e del rito abbreviato.',
    category: 'calcoli-penali',
    keywords: ['444', 'applicazione pena', 'riduzione di un terzo', 'allargato', 'abbreviato', 'aggravanti', 'attenuanti'],
  },
  {
    slug: 'sconto-ricarico',
    title: 'Sconto, ricarico e margine',
    description: 'Prezzo scontato, prezzo di vendita con ricarico e margine di guadagno in percentuale.',
    category: 'percentuali-sconto-ricarico',
    keywords: ['margine', 'markup', 'prezzo di vendita', 'ribasso'],
  },
  {
    slug: 'interessi-legali',
    title: 'Calcolo interessi legali',
    description: 'Interessi su un capitale con i tassi legali in vigore anno per anno (art. 1284 c.c.).',
    category: 'interessi-legali-moratori',
    keywords: ['tasso', 'capitale', 'mora', 'saggio legale'],
  },
  {
    slug: 'devalutazione-monetaria',
    title: 'Svalutazione e devalutazione monetaria',
    description: 'Riporta un importo attuale al suo valore in una data passata con l’indice FOI.',
    category: 'rivalutazione-istat',
    keywords: ['devalutazione', 'foi', 'istat', 'potere d’acquisto'],
  },
  {
    slug: 'imposte-compravendita-immobiliare',
    title: 'Imposte sulla compravendita immobiliare',
    description: 'Registro, ipotecaria, catastale e IVA per l’acquisto di una casa, prima o seconda, da privato o impresa.',
    category: 'imposte-tasse',
    alsoIn: ['valore-proprieta-usufrutto'],
    keywords: ['prima casa', 'registro', 'rogito', 'prezzo valore', 'rendita catastale'],
  },
  {
    slug: 'valore-usufrutto-termine',
    title: 'Valore usufrutto a termine',
    description: 'Valore dell’usufrutto temporaneo e della nuda proprietà con il tasso legale (artt. 46 e 48 DPR 131/1986).',
    category: 'valore-proprieta-usufrutto',
    keywords: ['nuda proprietà', 'tasso legale', 'usufrutto temporaneo', 'durata'],
  },
  {
    slug: 'prescrizione-diritti',
    title: 'Calcolo prescrizione dei diritti',
    description: 'Data di prescrizione del diritto secondo i termini del codice civile (artt. 2946 ss. c.c.).',
    category: 'termini-processuali',
    keywords: ['termine', 'decorrenza', 'diritto'],
  },
  {
    slug: 'contributo-unificato',
    title: 'Contributo unificato',
    description: 'Importo dovuto per l’iscrizione a ruolo in base a valore e grado (art. 13 DPR 115/2002).',
    category: 'contributo-unificato-diritti-copia',
    keywords: ['iscrizione a ruolo', 'cu', 'valore della causa'],
  },
  {
    slug: 'danno-biologico',
    title: 'Danno biologico con raffronto tra le tabelle',
    description: 'Risarcimento del danno non patrimoniale calcolato e messo a confronto con le diverse tabelle.',
    category: 'danno-biologico',
    keywords: ['risarcimento', 'invalidità', 'non patrimoniale', 'confronto tabelle'],
  },
  {
    slug: 'tabelle-roma',
    title: 'Danno biologico, Tabelle di Roma',
    description: 'Risarcimento del danno secondo le tabelle del Tribunale di Roma.',
    category: 'danno-biologico',
    keywords: ['tribunale di roma', 'punto', 'invalidità'],
  },
  {
    slug: 'danno-perdita-parentale',
    title: 'Danno da perdita parentale',
    description: 'Risarcimento ai familiari per la morte di un congiunto.',
    category: 'danno-biologico',
    keywords: ['tabelle milano', 'parentale', 'decesso', 'morte del congiunto', 'familiari'],
  },
  {
    slug: 'equo-indennizzo',
    title: 'Equo indennizzo',
    description: 'Indennizzo per infermità dipendente da causa di servizio.',
    category: 'danno-biologico',
    keywords: ['causa di servizio', 'pubblico dipendente', 'infermità'],
  },
  {
    slug: 'interesse-semplice',
    title: 'Interesse semplice',
    description: 'Interesse semplice su un capitale a tasso fisso.',
    category: 'interessi-calcoli-finanziari',
    keywords: ['capitale', 'tasso fisso', 'montante'],
  },
  {
    slug: 'interesse-composto',
    title: 'Interesse composto e montante',
    description: 'Interesse composto a tasso fisso e calcolo del montante.',
    category: 'interessi-calcoli-finanziari',
    keywords: ['capitalizzazione', 'montante', 'tasso fisso'],
  },
  {
    slug: 'ammortamento',
    title: 'Piano di ammortamento',
    description: 'Piano di ammortamento di un finanziamento rata per rata.',
    category: 'interessi-calcoli-finanziari',
    keywords: ['mutuo', 'rate', 'prestito', 'francese'],
  },
  {
    slug: 'interessi-rivalutazione',
    title: 'Interessi legali e rivalutazione monetaria',
    description: 'Interessi legali e rivalutazione ISTAT calcolati insieme.',
    category: 'rivalutazione-istat',
    keywords: ['foi', 'istat', 'capitale', 'crediti di lavoro'],
  },
  {
    slug: 'imu',
    title: 'Calcolo IMU',
    description: 'Acconto, saldo e ravvedimento dell’IMU con le regole in vigore.',
    category: 'imposte-tasse',
    alsoIn: ['valore-proprieta-usufrutto'],
    keywords: ['imposta municipale', 'aliquota', 'immobili', 'acconto', 'saldo', 'tasi'],
  },
  {
    slug: 'imposte-locazione',
    title: 'Imposta di registro sulle locazioni',
    description: 'Imposta di registro su affitti e cedolare secca, con ravvedimento.',
    category: 'imposte-tasse',
    keywords: ['affitto', 'registro', 'cedolare secca', 'contratto'],
  },
  {
    slug: 'compenso-delegato-alla-vendita',
    title: 'Compenso del delegato alla vendita',
    description: 'Compenso spettante al professionista delegato alle vendite.',
    category: 'compensi-professionali',
    keywords: ['esecuzioni immobiliari', 'professionista delegato', 'dm 227/2015'],
  },
  {
    slug: 'compenso-curatore-fallimentare',
    title: 'Compenso del curatore fallimentare',
    description: 'Compenso del curatore secondo il D.M. 30/2012.',
    category: 'compensi-professionali',
    keywords: ['fallimento', 'dm 30/2012', 'curatore'],
  },
  {
    slug: 'usufrutto-vitalizio-nuda-proprieta',
    title: 'Usufrutto vitalizio e nuda proprietà',
    description: 'Valore dell’usufrutto vitalizio e della nuda proprietà in base all’età.',
    category: 'valore-proprieta-usufrutto',
    keywords: ['usufruttuario', 'età', 'tasso legale'],
  },
  {
    slug: 'valore-catastale',
    title: 'Valore catastale degli immobili',
    description: 'Valore catastale a partire dalla rendita catastale.',
    category: 'valore-proprieta-usufrutto',
    keywords: ['rendita catastale', 'moltiplicatore', 'imu'],
  },
  {
    slug: 'quote-percentuali',
    title: 'Quote e percentuali',
    description: 'Dalle percentuali alle quote e dalle quote alle percentuali.',
    category: 'percentuali-sconto-ricarico',
    alsoIn: ['valore-proprieta-usufrutto'],
    keywords: ['ripartizione', 'millesimi', 'quote'],
  },
  {
    slug: 'diritti-copia',
    title: 'Diritti di copia degli atti giudiziari',
    description: 'Importo dei diritti di copia per atti e provvedimenti giudiziari.',
    category: 'contributo-unificato-diritti-copia',
    keywords: ['copie', 'cancelleria', 'urgenza', 'conforme'],
  },
  {
    slug: 'mediazione',
    title: 'Costi della mediazione civile',
    description: 'Spese di avvio e indennità dell’organismo di mediazione civile e commerciale.',
    category: 'contributo-unificato-diritti-copia',
    keywords: ['mediazione', 'organismo', 'indennità', 'd.lgs. 28/2010', 'dm 150/2023'],
  },
  {
    slug: 'quote-ereditarie',
    title: 'Quote ereditarie',
    description: 'Quote in successione legittima o necessaria.',
    category: 'quote-ereditarie-reversibilita',
    keywords: ['successione', 'legittima', 'riserva', 'eredi'],
  },
  {
    slug: 'pena-sostitutiva',
    title: 'Pena sostitutiva',
    description: 'Conversione della pena detentiva in pena pecuniaria o lavoro di pubblica utilità.',
    category: 'calcoli-penali',
    keywords: ['pene sostitutive', 'cartabia', 'lavoro di pubblica utilità', 'detenzione domiciliare', 'semilibertà'],
  },
  {
    slug: 'conversione-pena-pecuniaria',
    title: 'Conversione della pena pecuniaria',
    description: 'Multa e ammenda non pagate: conversione per insolvenza e insolvibilità del condannato.',
    category: 'calcoli-penali',
    keywords: ['multa', 'ammenda', 'insolvibilità', 'insolvenza', 'art. 71 l. 689/1981'],
  },
  {
    slug: 'sospensione-condizionale-pena',
    title: 'Sospensione condizionale della pena',
    description: 'Limiti di pena, ragguaglio della multa, seconda sospensione e periodo di prova.',
    category: 'calcoli-penali',
    keywords: ['art. 163 c.p.', 'condizionale', 'ragguaglio', 'seconda sospensione'],
  },
  {
    slug: 'misure-alternative-alla-detenzione',
    title: 'Misure alternative alla detenzione',
    description: 'Pena residua, sospensione dell’ordine di esecuzione e soglie per affidamento in prova e detenzione domiciliare.',
    category: 'calcoli-penali',
    keywords: ['affidamento in prova', 'detenzione domiciliare', 'ordine di esecuzione', 'pena residua', 'ordinamento penitenziario'],
  },
  {
    slug: 'legge-pinto',
    title: 'Indennizzo Legge Pinto',
    description: 'Equa riparazione per l’irragionevole durata del processo: anni di ritardo e indennizzo.',
    category: 'danno-biologico',
    keywords: ['equa riparazione', 'durata ragionevole', 'l. 89/2001', 'ritardo processo'],
  },
  {
    slug: 'irpef',
    title: 'Calcolo Irpef',
    description: 'Irpef lorda e netta con aliquote, scaglioni e detrazioni in vigore.',
    category: 'imposte-tasse',
    keywords: ['aliquote', 'scaglioni', 'detrazioni', 'imposta sul reddito'],
  },
  {
    slug: 'stipendio-netto',
    title: 'Stipendio netto',
    description: 'Dalla retribuzione lorda allo stipendio netto in busta paga.',
    category: 'imposte-tasse',
    keywords: ['busta paga', 'lordo netto', 'ral', 'contributi'],
  },
  {
    slug: 'forfettario',
    title: 'Regime forfettario',
    description: 'Imposta sostitutiva e contributi per chi applica il regime forfettario.',
    category: 'iva-fatturazione',
    alsoIn: ['imposte-tasse'],
    keywords: ['partita iva', 'flat tax', 'coefficiente di redditività', 'imposta sostitutiva'],
  },
  {
    slug: 'ravvedimento-operoso',
    title: 'Ravvedimento operoso',
    description: 'Sanzione ridotta, interessi legali e codici tributo F24 per IRPEF, IVA, ritenute, IMU e cedolare secca.',
    category: 'imposte-tasse',
    keywords: ['f24', 'sanzione ridotta', 'codici tributo', 'versamento tardivo'],
  },
  {
    slug: 'imposte-successione',
    title: 'Imposte di successione',
    description: 'Quanto paga ogni erede: franchigie, aliquote, imposte ipotecaria e catastale, scadenze e rate.',
    category: 'imposte-tasse',
    alsoIn: ['quote-ereditarie-reversibilita'],
    keywords: ['franchigia', 'eredi', 'dichiarazione di successione', 'ipotecaria', 'catastale'],
  },
  {
    slug: 'bollo-auto',
    title: 'Bollo auto e superbollo',
    description: 'Tassa automobilistica per regione, potenza e classe ambientale, con superbollo.',
    category: 'imposte-tasse',
    alsoIn: ['codice-strada'],
    keywords: ['tassa automobilistica', 'superbollo', 'kw', 'euro'],
  },
  {
    slug: 'ripartizione-spese-condominiali',
    title: 'Ripartizione spese condominiali',
    description: 'Quota di ogni condòmino con i millesimi, per scale e ascensore e per il lastrico solare.',
    category: 'valore-proprieta-usufrutto',
    keywords: ['condominio', 'millesimi', 'ascensore', 'scale', 'lastrico solare'],
  },
  {
    slug: 'punti-patente',
    title: 'Punti patente',
    description: 'Quanti punti si perdono con la multa, sospensione breve e revisione della patente.',
    category: 'codice-strada',
    keywords: ['decurtazione', 'infrazioni', 'revisione', 'sospensione'],
  },
  {
    slug: 'tasso-alcolemico',
    title: 'Tasso alcolemico',
    description: 'Stima dell’alcolemia nel tempo, ore per tornare sotto 0,5 g/l e conseguenze per la patente.',
    category: 'codice-strada',
    keywords: ['alcol', 'guida in stato di ebbrezza', 'art. 186', 'etilometro'],
  },
  {
    slug: 'codice-fiscale',
    title: 'Calcolo codice fiscale',
    description: 'Codice fiscale da nome, cognome, data e luogo di nascita.',
    category: 'codice-fiscale-anagrafica',
    keywords: ['cf', 'comune di nascita', 'omocodia'],
  },
  {
    slug: 'codice-fiscale-inverso',
    title: 'Codice fiscale inverso',
    description: 'Dal codice fiscale ai dati anagrafici: data, sesso e luogo di nascita.',
    category: 'codice-fiscale-anagrafica',
    keywords: ['decodifica', 'verifica codice fiscale', 'data di nascita'],
  },
]

export const POPULAR_TOOLS = TOOLS.filter((t) => t.popular)

export function sectionBySlug(slug: string) {
  return SECTIONS.find((s) => s.slug === slug)
}
