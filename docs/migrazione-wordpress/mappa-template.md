# Mappa pagine → template WordPress

Percorsi relativi alla radice del repository. «Sorgente» indica la route Next.js da riprodurre e i componenti che usa.

## Struttura comune

| Elemento | Sorgente React | Template WordPress |
| --- | --- | --- |
| Layout radice, font, metadati | `app/layout.tsx` | `header.php`, `footer.php`, `functions.php` (enqueue, `add_theme_support('title-tag')`) |
| Header con menu, Banca dati e ricerca | `components/layout/site-header.tsx`, `header-search.tsx`, `nav-link.tsx` | `template-parts/header/site-header.php` + `assets/js/header.js` |
| Footer con newsletter e colonne | `components/layout/site-footer.tsx`, `components/newsletter/newsletter-form.tsx` | `template-parts/footer/site-footer.php`, `template-parts/newsletter-form.php` |
| Barra di navigazione mobile in basso | `components/layout/mobile-tab-bar.tsx` | `template-parts/footer/mobile-tab-bar.php` |
| Pulsante flottante «Avvocato AI» | `components/layout/ai-fab.tsx` | `template-parts/ai-fab.php` |
| Freccia torna su | `components/article/back-to-top.tsx` | `assets/js/back-to-top.js` |
| Barra laterale (350 px, sticky) | `components/content/listing.tsx` (sidebar) | `sidebar.php` + funzioni in `inc/sidebar.php` |
| Slot annunci | `components/ads/ad-slot.tsx` | `template-parts/ad-slot.php` (parametro formato: 350x250, 350x600, in-article) |
| Pulsante bottone/varianti | `components/ui/button.tsx` | funzione helper `miolegale_button_classes( $variant, $size )` |

Menu: header, footer e barra mobile oggi sono costanti in `lib/site.ts` (`DATABASE_MENU`, `MATERIE`, `SECTIONS`, `TOOLS`). Nel tema vanno resi **menu WordPress registrati** (`register_nav_menus`): `principale`, `banca-dati`, `footer-banca-dati`, `footer-strumenti`, `footer-materie`, `mobile`. Popolali con le stesse voci e lo stesso ordine.

## Pagine

| URL | Sorgente | Template WordPress |
| --- | --- | --- |
| `/` | `app/page.tsx`, `components/home/*` | `front-page.php` |
| `/{categoria}/` (massime, sentenze, norme, notizie, guide, brocardi, formulario-civile, formulario-penale) | `app/[category]/page.tsx`, `components/content/listing.tsx`, `post-list.tsx`, `pager.tsx` | `category.php` (una sola, parametrizzata dallo slug) |
| `/{categoria}/{slug}/` articolo | `app/[category]/[slug]/page.tsx`, `components/article/*` | `single.php` + `template-parts/article/{header,toc,share,help}.php` |
| `/tag/{slug}/` | `app/tag/[slug]/page.tsx` | `tag.php` |
| `/cerca?q=` | `app/cerca/page.tsx` | `search.php` (redirect da `/?s=` mantenuto) |
| `/banca-dati` | `app/banca-dati/page.tsx`, `components/banca-dati/search-form.tsx`, `lib/banca-dati-options.ts` | `page-banca-dati.php` |
| `/codici/` | `app/codici/page.tsx`, `components/content/acts-index.tsx`, `archive-index.tsx` | template della pagina esistente `codici` |
| `/codici/{codice}/` indice | `app/codici/[slug]/page.tsx`, `components/content/act-index.tsx`, `act-tree.tsx` | template dell'indice dell'atto |
| `/codici/{codice}/{art-n}/` | `app/codici/[slug]/[article]/page.tsx`, `components/content/act-article.tsx`, `copy-text-button.tsx`, `scroll-to-current.tsx` | template del singolo articolo dell'atto |
| `/testi-unici/`, `/testi-unici/{tu}/`, `/testi-unici/{tu}/{art-n}/` | `app/testi-unici/**` (stessi componenti dei codici) | stessi template dei codici |
| `/costituzione/`, `/costituzione/{art-n}/` | `app/costituzione/**` (stessi componenti) | stessi template dei codici |
| `/calcolo/` | `app/calcolo/page.tsx`, `components/tools/tools-index.tsx`, `tools-grid.tsx` | `page-calcolo.php` |
| `/calcolo/{slug}/` | `app/calcolo/[slug]/page.tsx`, `components/tools/tool-shell.tsx`, `wp-calculator.tsx` | template delle pagine figlie di `calcolo` |
| `/utilita/`, `/utilita/{slug}/` | `app/utilita/**`, `components/utilita/*` | come i calcolatori |
| `/assistente-ai` | `app/assistente-ai/page.tsx`, `components/ai/legal-chat.tsx` | `page-assistente-ai.php` + `assets/js/legal-chat.js` |
| `/consulenza-legale` | `app/consulenza-legale/page.tsx`, `components/consulenza/consulenza-form.tsx`, `components/studio/consulenza-cta.tsx` | `page-consulenza-legale.php` (il form resta quello del plugin attuale) |
| `/info/contatti` | `app/info/contatti/page.tsx`, `components/contacts/reviews-widget.tsx`, `lib/contacts.ts` | `page-contatti.php` |
| `/ads.txt` | `app/ads.txt/route.ts` | file statico o regola del plugin annunci |
| 404 | (default Next.js) | `404.php` con lo stile del sito |

## Regole del singolo articolo di codici e testi unici (da rispettare)

- Header: estremi dell'atto e numero di articoli a sinistra (estremi in corpo più grande), stampa e condivisione a destra. Uguale in **tutti** i codici e testi unici.
- Barra laterale: riquadro con l'elenco degli articoli del **solo titolo corrente**. Non scendere mai sotto il livello «titolo» (niente capi o sezioni come raggruppamento). Altezza massima del riquadro 484 px, con scorrimento automatico all'articolo corrente.
- Barra laterale sticky come nel resto del sito.
- Navigazione articolo precedente / successivo in fondo al testo (`rel="prev"` / `rel="next"`).
- Pulsante «Copia testo».

## Barra laterale (tutte le pagine)

- Larghezza fissa 350 px dalla larghezza `lg`, per annunci 350x250 e 350x600.
- Riquadri «Banca dati» (sfondo bianco con bordo) e «Calcolatori» (sfondo `secondary`): stessi spazi, allineamento, font e dimensioni; cambiano solo i colori. Entrambi terminano con un pulsante pieno (`Ricerca avanzata con filtri`, `Tutti i calcolatori`).
