# Checklist di messa online

Spunta ogni voce in staging prima di attivare il tema in produzione.

## Fedeltà grafica

- [ ] Confronto affiancato con il prototipo a 1920, 1440, 1366, 1024 e 390 px di larghezza per: home, categoria, articolo, indice di un codice, articolo di un codice, articolo di un testo unico, articolo della Costituzione, elenco calcolatori, un calcolatore, banca dati, ricerca, contatti, consulenza, assistente AI, 404
- [ ] Barra laterale da 350 px e sticky su tutte le pagine
- [ ] Riquadri «Banca dati» e «Calcolatori» identici tranne i colori
- [ ] Indice laterale degli atti limitato al titolo corrente, 484 px di altezza, scorrimento all'articolo corrente
- [ ] Estremi dell'atto e numero di articoli in tutti i codici e testi unici; azioni a destra
- [ ] Footer: newsletter allineata alla griglia sotto
- [ ] Nessuno scorrimento orizzontale su mobile

## URL e SEO

- [ ] Tutti gli URL esistenti rispondono 200 con lo stesso percorso (campione di almeno 50 URL da sitemap, per ogni tipologia)
- [ ] Title, meta description, canonical, Open Graph e dati strutturati come oggi (verificare il plugin SEO attivo)
- [ ] `rel="prev"` / `rel="next"` negli articoli degli atti e nella paginazione
- [ ] Sitemap invariata, `robots.txt` e `ads.txt` raggiungibili
- [ ] `lang="it"`, `theme-color` `#173f71`, favicon e apple-touch-icon

## Funzioni

- [ ] Ricerca nell'header e ricerca avanzata con filtri
- [ ] Iscrizione alla newsletter (conferma reale ricevuta)
- [ ] Form di consulenza inviato e ricevuto
- [ ] Tutti i calcolatori funzionano come prima
- [ ] Assistente AI risponde in streaming dal tema
- [ ] Copia testo, stampa, condivisione, torna su, sommario
- [ ] Annunci visibili nei formati 350x250, 350x600 e in-article, senza spostamenti del layout

## Qualità

- [ ] Core Web Vitals sulle pagine principali: LCP < 2,5 s, CLS < 0,1, INP < 200 ms
- [ ] Font self-hosted, nessuna richiesta a Google Fonts
- [ ] Navigazione da tastiera, focus visibile, contrasto AA, `alt` sulle immagini
- [ ] Nessun errore PHP con `WP_DEBUG` attivo, nessun errore in console
- [ ] Stampa di un articolo e di un articolo di codice leggibile
