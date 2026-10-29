# Migrazione del redesign MioLegale in un tema WordPress

Questo repository contiene il redesign di miolegale.it, realizzato in Next.js 16 + Tailwind CSS 4 come **prototipo funzionante**. Il prototipo legge già i contenuti reali dal WordPress di produzione (REST API e HTML pubblico). L'obiettivo della migrazione è **riprodurre la stessa grafica e la stessa struttura in un tema WordPress**, che sostituisca il tema attuale senza cambiare URL, contenuti o plugin.

Il prototipo è la **fonte di verità per la grafica**: in caso di dubbio, confronta sempre il tema con la pagina corrispondente del prototipo.

## Documenti

| File | Contenuto |
| --- | --- |
| [mappa-template.md](mappa-template.md) | Ogni pagina del prototipo e il template WordPress corrispondente; componenti e template part |
| [dati-e-integrazioni.md](dati-e-integrazioni.md) | Da dove arrivano i dati, plugin, campi personalizzati, newsletter, annunci, assistente AI |
| [design-system.md](design-system.md) | Colori, font, spaziature, layout e regole tipografiche |
| [theme.json](theme.json) | Bozza di `theme.json` con palette, font e larghezze già impostati |
| [checklist.md](checklist.md) | Controlli da superare prima di andare online |

## Scelte tecniche consigliate

1. **Tema classico PHP con `theme.json`** (non un tema a blocchi FSE). Le pagine hanno molta logica: indici dei codici, navigazione tra articoli, annunci inseriti nel testo. In PHP si controllano meglio, e `theme.json` dà comunque palette e font all'editor.
2. **Tailwind CSS 4 compilato a build time** con la CLI (`@tailwindcss/cli`), che scansiona i file `.php`. Così si possono copiare le classi dei componenti React quasi una per una. In produzione si pubblica solo il CSS compilato: Node non serve sul server.
3. **JavaScript minimo e senza framework.** Le parti interattive (menu mobile, ricerca nell'header, sommario, torna su, copia testo, condivisione, scorrimento all'articolo corrente nell'indice) sono piccoli script vanilla da caricare con `wp_enqueue_script` e `defer`.
4. **Nessun cambio di URL.** Il prototipo usa già i percorsi di miolegale.it (`/massime/slug/`, `/codici/codice-civile/art-2043/`, `/calcolo/...`). Il tema deve mantenerli tutti.
5. **Nome del tema:** `miolegale-2027`, text domain `miolegale`.

## Ordine di lavoro consigliato

1. Struttura del tema, `theme.json`, pipeline Tailwind e font self-hosted.
2. Header, footer, barra mobile e pulsante «Avvocato AI»: tutte le pagine li condividono.
3. Template singolo articolo (`single.php`) e archivio di categoria: coprono la maggior parte del traffico.
4. Codici, testi unici e Costituzione: indice dell'atto e pagina del singolo articolo.
5. Calcolatori e utilità.
6. Home, Banca dati, ricerca, tag, contatti e consulenza.
7. Annunci, newsletter, assistente AI.
8. Checklist finale e confronto visivo pagina per pagina con il prototipo.

## Come usare questo materiale con Claude

Prompt suggerito:

> Leggi `CLAUDE.md` e tutti i file in `docs/migrazione-wordpress/`. Crea in `wordpress-theme/miolegale-2027/` un tema WordPress classico che riproduca fedelmente il prototipo Next.js di questo repository, seguendo l'ordine di lavoro del README. Per ogni template parti dal file React indicato in `mappa-template.md` e mantieni classi Tailwind, spaziature e testi. Non cambiare URL né dipendere da plugin nuovi senza segnalarlo. Alla fine di ogni fase aggiorna `checklist.md` e fermati per farmi verificare.

Lavora su un branch dedicato (per esempio `tema-wordpress`) e prova il tema in staging prima della produzione.
