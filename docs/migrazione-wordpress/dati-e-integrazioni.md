# Dati e integrazioni

Nel prototipo i dati arrivano da miolegale.it **via rete**. Nel tema sono già disponibili nel database: tutte le chiamate HTTP diventano query WordPress (`WP_Query`, `get_terms`, `get_post_meta`...). La logica di trasformazione invece va riportata in PHP.

## Sorgenti del prototipo e loro equivalente

| Dato | Prototipo | Nel tema |
| --- | --- | --- |
| Articoli, categorie, tag, immagini in evidenza | REST `wp/v2` in `lib/wp.ts` (`getPosts`, `getPostBySlug`, `getCategoryBySlug`, `getPostsByTag`, `getRelatedPosts`) | `WP_Query`, template hierarchy, `get_the_post_thumbnail` |
| Sommario dell'articolo e ancore dei titoli | `withHeadingAnchors`, `TocItem` in `lib/wp.ts` | filtro su `the_content` che aggiunge `id` a h2/h3 e genera il sommario |
| Tempo di lettura | `readingMinutes` in `lib/wp.ts` | funzione helper PHP con la stessa formula |
| Annunci dentro il testo | `IN_ARTICLE_ADS`, `splitContentForAds` in `lib/wp.ts` | filtro su `the_content` con le stesse soglie (riportarle identiche) |
| Indice di codici, testi unici, Costituzione | `lib/act-index.ts`: legge l'HTML pubblico della pagina dell'atto | dati del plugin che genera oggi codici e testi unici (classi HTML `ml4cod-*`): leggerli dalla sorgente del plugin, non riparsare l'HTML |
| Singolo articolo dell'atto (commi, rubrica, precedente/successivo, elenco del titolo) | `lib/act-article.ts` | come sopra; mantenere la stessa struttura dati (`ActArticle`, `ActLink`) |
| Elenco atti (`/codici`, `/testi-unici`) | `lib/archives.ts` | pagine esistenti; ricostruire le sezioni con lo stesso raggruppamento |
| Calcolatori e utilità | `getCalcPageList`, `getCalcPage`, `getUtilityPages` in `lib/wp.ts`; campi `categoria_calcolatore` e `categoria_utilita` | pagine figlie di `calcolo` / `utilita` e i loro campi personalizzati (ACF o meta, da verificare) |
| Registro calcolatori, categorie, popolari | `TOOLS`, `TOOL_CATEGORIES`, `POPULAR_TOOLS` in `lib/site.ts` | campo per la categoria e campo «popolare» sulle pagine, oppure un file `inc/tools.php` con lo stesso registro |
| Menu, materie, sezioni | `lib/site.ts` | menu WordPress registrati (vedi `mappa-template.md`) |
| Opzioni della ricerca avanzata | `lib/banca-dati-options.ts` | `get_terms` sulle tassonomie corrispondenti |
| Dati di studio e contatti | `STUDIO` in `lib/site.ts`, `lib/contacts.ts` | Customizer o pagina opzioni del tema |

## Plugin e servizi esterni

- **Newsletter:** il form invia a `admin-ajax.php?action=tnp&na=s` (plugin The Newsletter Plugin), vedi `app/actions/newsletter.ts`. Nel tema basta un form nativo verso lo stesso endpoint con gli stessi campi, oppure lo shortcode del plugin con lo stile del prototipo.
- **Annunci (AdSense):** client in `NEXT_PUBLIC_ADSENSE_CLIENT`. Formati: 350x250 e 350x600 in barra laterale, in-article nel testo. Riserva sempre l'altezza dello slot per evitare spostamenti del layout (CLS).
- **Assistente AI** (`/assistente-ai`, `app/api/chat/route.ts`): usa AI SDK su Vercel e **non va riscritto in PHP**. Opzione consigliata: lasciare l'endpoint `/api/chat` su un progetto Vercel e chiamarlo dal tema via `fetch` in streaming, con CORS limitato a miolegale.it e un rate limit. In alternativa, un endpoint REST WordPress che fa da proxy.
- **Recensioni:** `components/contacts/reviews-widget.tsx`, da collegare alla stessa sorgente attuale.
- **Form di consulenza:** mantiene il plugin o l'endpoint attuale; cambia solo la grafica.

## Variabili d'ambiente del prototipo

| Variabile | Uso | Nel tema |
| --- | --- | --- |
| `WP_API_URL` | base REST (default `https://miolegale.it/wp-json/wp/v2`) | non serve |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | ID AdSense | opzione del tema o costante in `wp-config.php` |

## Comportamenti solo-sviluppo da NON portare

- Rewrite `/wp-img/*` in `next.config.mjs` e le funzioni `devSameOriginHtml` / riscrittura delle immagini in `lib/wp.ts`: servono solo all'anteprima v0.
- `typescript.ignoreBuildErrors` e `images.unoptimized`: impostazioni del prototipo.
