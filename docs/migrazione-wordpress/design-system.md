# Design system

I valori ufficiali sono in `app/globals.css`. Copia il file nel tema come base del CSS Tailwind (`assets/css/main.css`): token, `@theme` e le classi `.wp-content` e `.act-text` funzionano così come sono.

## Colori

| Token | Valore | Uso |
| --- | --- | --- |
| `--primary` | `#1e5192` | blu MioLegale: link, pulsanti, numeri dei commi |
| `--ink` | `#173f71` | navy: footer, `theme-color`, testo su `secondary` |
| `--foreground` | `#10223d` | testo principale |
| `--background` / `--card` | `#ffffff` | sfondo |
| `--secondary` | `#eff3f9` | riquadro Calcolatori, superfici tenui |
| `--muted` | `#f3f6fa` | blocchi citazione, aree secondarie |
| `--muted-foreground` | `#5a6a82` | testo secondario, date |
| `--accent` | `#dbe7f6` | evidenze, bordo delle citazioni |
| `--border` / `--input` | `#e1e7ef` / `#d3dce8` | bordi e campi |
| `--radius` | `0.5rem` | raggio di base (sm 0.6×, md 0.8×, xl 1.4×) |

Nessun colore diretto nei template: usa solo i token (`bg-primary`, `text-ink`...).

## Font

- **IBM Plex Sans** (`--font-sans`): interfaccia, titoli, menu, pulsanti.
- **Public Sans** pesi 400/500/600/700: testo degli articoli (`.wp-content`) e degli atti (`.act-text`).
- Monospazio di sistema (`--font-mono`): etichette in maiuscolo («BANCA DATI», «CALCOLATORI») e numeri dei commi.

Ospita i font nel tema (woff2 in `assets/fonts/`, `font-display: swap`). Non caricarli da Google Fonts.

## Layout

- Contenitore del sito: `max-w-site` = **90rem (1440 px)**, con padding laterale.
- Colonna principale + barra laterale da **350 px** fissi dalla larghezza `lg` (1024 px); sotto, la barra va sotto al contenuto.
- Barra laterale `sticky` sotto l'header, su tutte le pagine (codici e testi unici compresi).
- Mobile: barra di navigazione fissa in basso; il `body` ha `padding-bottom` pari alla sua altezza più la safe area (vedi `app/layout.tsx`).
- Mobile first; testo minimo 14 px; interlinea del testo 1.4–1.6.

## Tipografia del contenuto

Le regole di `.wp-content` (h2, h3, h4, h6, liste, citazioni, tabelle, immagini, didascalie) e di `.act-text` (commi con numero assoluto a sinistra) in `app/globals.css` vanno copiate **identiche**: la resa dei testi giuridici è stata calibrata su queste.

## Componenti con regole precise

- **Footer / newsletter:** colonna sinistra più larga, campo email allineato alla colonna «Strumenti» sotto, pulsante «Iscriviti» allineato alla colonna «Materie». Nota privacy a 14 px.
- **Header dei singoli articoli e degli atti:** informazioni a sinistra, azioni (stampa, condivisione) sempre a destra.
- **Riquadri della barra laterale:** vedi `mappa-template.md`.
