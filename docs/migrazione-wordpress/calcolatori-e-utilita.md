# Calcolatori e utilità: struttura delle pagine indice

Questo documento sostituisce ogni indicazione precedente sull'organizzazione di `/calcolo/` e `/utilita/`. Se hai già iniziato il tema, allinea quanto fatto a quanto scritto qui.

## Regole generali (valide per entrambe le sezioni)

1. **Le singole pagine non si toccano.** Ogni calcolatore e ogni utilità è una normale pagina WordPress, figlia di `calcolo` o `utilita`, con form e contenuti già revisionati. Il tema le stampa con `the_content()` dentro la cornice (header, breadcrumb, barra laterale). Non riscrivere, spostare o rinominare nessuna pagina e non cambiare nessun URL.
2. **I CSS dei calcolatori e delle utilità restano quelli attuali.** I fogli di stile specifici dei form (e gli eventuali JS) vanno caricati sul nuovo tema esattamente come oggi, con gli stessi handle, file e condizioni di caricamento. Non riscriverli, non unirli a `main.css`, non convertirli in Tailwind. Se in seguito vanno adeguati al nuovo tema, lo decido io.
   - Il CSS del tema non deve alterare i form: il preflight di Tailwind e le regole di `.wp-content` (tabelle, liste, titoli, margini) non devono cambiare l'aspetto di `input`, `select`, `textarea`, `button`, `label`, `fieldset` e delle tabelle dei risultati. Escludi il contenuto di queste pagine dalle regole del tema o limita lo scope (per esempio con `:where()` o un contenitore dedicato), senza toccare i CSS dei form.
   - Prima di procedere, elenca i CSS/JS dei calcolatori e delle utilità che trovi registrati nel tema o nei plugin attuali e come vengono caricati, e mostrameli.
3. **Cambia solo la pagina indice** (`page-calcolo.php`, `page-utilita.php`): come sono raggruppati i link, in che ordine e con quali titoli.
4. **Fonte di verità nel prototipo:**
   - calcolatori: `TOOL_CATEGORIES` e `TOOLS` in `lib/site.ts`; griglia in `components/tools/tools-index.tsx` e `components/tools/tools-grid.tsx`
   - utilità: `UTILITY_CATEGORIES`, `LIVE_UTILITY_GROUPS`, `LIVE_FORMULARI` e `getUtilityPages()` in `lib/wp.ts`; impaginazione in `components/utilita/utilita-index.tsx`
   - Se questo documento e il codice non coincidono, vale il codice. Segnalami la differenza.
5. **Implementazione consigliata:** un file `inc/tools.php` con gli stessi due registri sotto forma di array PHP, nello stesso ordine. Lascia i campi ACF `categoria_calcolatore` / `categoria_utilita` solo come override per le pagine nuove (vedi più sotto). Non usare tassonomie nuove.

## Calcolatori (`/calcolo/`)

60 calcolatori in 16 categorie, più una categoria di riserva. Ogni calcolatore ha **una categoria principale** e può comparire **anche in altre** (`alsoIn` nel prototipo). Nell'indice compare in tutte le sue categorie, con lo stesso link. La categoria principale decide breadcrumb e «calcolatori correlati» nella pagina singola.

Ordine delle categorie e dei calcolatori: quello qui sotto, identico a `lib/site.ts`. Le pagine nuove create su WordPress e non ancora nel registro finiscono in **Altri calcolatori** (`altri-calcolatori`), che resta nascosta finché è vuota. Il campo ACF `categoria_calcolatore` accetta uno o più slug di categoria: il primo valore è la categoria principale, gli altri vanno in `alsoIn` (vedi `resolveToolCategories()` in `lib/site.ts`). I valori sconosciuti si ignorano.

**Termini processuali e prescrizione** (`termini-processuali`)
- Scadenza termini processuali: `/calcolo/termini-processuali/`
- Termini artt. 171-ter, 189 e 275-bis c.p.c.: `/calcolo/termini-171-ter-189-275-bis/`
- Termini tra separazione e divorzio: `/calcolo/termini-separazione-divorzio/`
- Calcolo prescrizione dei diritti: `/calcolo/prescrizione-diritti/`

**Date e scadenze** (`date-scadenze`)
- Giorni tra due date: `/calcolo/giorni-tra-due-date/`
- Età anagrafica: `/calcolo/eta-anagrafica/`
- Calcolo data: `/calcolo/data/`

**Pena, patteggiamento e misure alternative** (`calcoli-penali`)
- Calcolo patteggiamento e della pena: `/calcolo/patteggiamento/`
- Pena sostitutiva: `/calcolo/pena-sostitutiva/`
- Conversione della pena pecuniaria: `/calcolo/conversione-pena-pecuniaria/`
- Sospensione condizionale della pena: `/calcolo/sospensione-condizionale-pena/`
- Misure alternative alla detenzione: `/calcolo/misure-alternative-alla-detenzione/`

**Danno biologico e risarcimento del danno** (`danno-biologico`)
- Lesioni macropermanenti: `/calcolo/lesioni-macropermanenti/`
- Danno biologico, Tabelle di Milano: `/calcolo/tabelle-milano/`
- Lesioni micropermanenti: `/calcolo/lesioni-micropermanenti/`
- Danno biologico con raffronto tra le tabelle: `/calcolo/danno-biologico/`
- Danno biologico, Tabelle di Roma: `/calcolo/tabelle-roma/`
- Danno da perdita parentale: `/calcolo/danno-perdita-parentale/`
- Equo indennizzo: `/calcolo/equo-indennizzo/`
- Indennizzo Legge Pinto: `/calcolo/legge-pinto/`

**Interessi legali e moratori** (`interessi-legali-moratori`)
- Interessi moratori: `/calcolo/interessi-moratori/`
- Calcolo interessi legali: `/calcolo/interessi-legali/`

**Rivalutazione e devalutazione monetaria Istat** (`rivalutazione-istat`)
- Rivalutazione monetaria ISTAT: `/calcolo/rivalutazione-monetaria/`
- Svalutazione e devalutazione monetaria: `/calcolo/devalutazione-monetaria/`
- Interessi legali e rivalutazione monetaria: `/calcolo/interessi-rivalutazione/`

**Compensi professionali** (`compensi-professionali`)
- Fattura con scorporo IVA e ritenuta: `/calcolo/fattura-scorporo/` (principale: IVA e fatturazione)
- Fattura avvocato: `/calcolo/parcella-avvocato/`
- Compenso del delegato alla vendita: `/calcolo/compenso-delegato-alla-vendita/`
- Compenso del curatore fallimentare: `/calcolo/compenso-curatore-fallimentare/`

**Contributo unificato, diritti di copia e mediazione** (`contributo-unificato-diritti-copia`)
- Contributo unificato: `/calcolo/contributo-unificato/`
- Diritti di copia degli atti giudiziari: `/calcolo/diritti-copia/`
- Costi della mediazione civile: `/calcolo/mediazione/`

**IVA e fatturazione** (`iva-fatturazione`)
- Fattura con scorporo IVA e ritenuta: `/calcolo/fattura-scorporo/`
- Calcolo e scorporo IVA: `/calcolo/scorporo-iva/`
- Regime forfettario: `/calcolo/forfettario/`

**Imposte, tasse e stipendio** (`imposte-tasse`)
- Imposte sulla compravendita immobiliare: `/calcolo/imposte-compravendita-immobiliare/`
- Calcolo IMU: `/calcolo/imu/`
- Imposta di registro sulle locazioni: `/calcolo/imposte-locazione/`
- Calcolo Irpef: `/calcolo/irpef/`
- Stipendio netto: `/calcolo/stipendio-netto/`
- Regime forfettario: `/calcolo/forfettario/` (principale: IVA e fatturazione)
- Ravvedimento operoso: `/calcolo/ravvedimento-operoso/`
- Imposte di successione: `/calcolo/imposte-successione/`
- Bollo auto e superbollo: `/calcolo/bollo-auto/`

**Mutui, prestiti e calcoli finanziari** (`interessi-calcoli-finanziari`)
- Calcolo TAN e TAEG: `/calcolo/taeg/`
- Interesse semplice: `/calcolo/interesse-semplice/`
- Interesse composto e montante: `/calcolo/interesse-composto/`
- Piano di ammortamento: `/calcolo/ammortamento/`

**Successioni, quote ereditarie e reversibilità** (`quote-ereditarie-reversibilita`)
- Pensione di reversibilità: `/calcolo/pensione-reversibilita/`
- Quote ereditarie: `/calcolo/quote-ereditarie/`
- Imposte di successione: `/calcolo/imposte-successione/` (principale: Imposte, tasse e stipendio)

**Proprietà, usufrutto e condominio** (`valore-proprieta-usufrutto`)
- Imposte sulla compravendita immobiliare: `/calcolo/imposte-compravendita-immobiliare/` (principale: Imposte, tasse e stipendio)
- Valore usufrutto a termine: `/calcolo/valore-usufrutto-termine/`
- Calcolo IMU: `/calcolo/imu/` (principale: Imposte, tasse e stipendio)
- Usufrutto vitalizio e nuda proprietà: `/calcolo/usufrutto-vitalizio-nuda-proprieta/`
- Valore catastale degli immobili: `/calcolo/valore-catastale/`
- Quote e percentuali: `/calcolo/quote-percentuali/` (principale: Percentuali, sconto e ricarico)
- Ripartizione spese condominiali: `/calcolo/ripartizione-spese-condominiali/`

**Codice della strada** (`codice-strada`)
- Bollo auto e superbollo: `/calcolo/bollo-auto/` (principale: Imposte, tasse e stipendio)
- Punti patente: `/calcolo/punti-patente/`
- Tasso alcolemico: `/calcolo/tasso-alcolemico/`

**Codice fiscale e dati anagrafici** (`codice-fiscale-anagrafica`)
- Età anagrafica: `/calcolo/eta-anagrafica/` (principale: Date e scadenze)
- Calcolo codice fiscale: `/calcolo/codice-fiscale/`
- Codice fiscale inverso: `/calcolo/codice-fiscale-inverso/`

**Percentuali, sconto e ricarico** (`percentuali-sconto-ricarico`)
- Calcolo percentuale: `/calcolo/percentuale/`
- Prezzo iniziale da prezzo scontato: `/calcolo/prezzo-iniziale/`
- Sconto, ricarico e margine: `/calcolo/sconto-ricarico/`
- Quote e percentuali: `/calcolo/quote-percentuali/`

Note:
- 18 di questi calcolatori sono pubblicati ma oggi non sono linkati dall'indice di produzione: bollo auto, codice fiscale e codice fiscale inverso, conversione della pena pecuniaria, forfettario, imposte di successione, IRPEF, legge Pinto, lesioni macropermanenti, misure alternative, patteggiamento, pena sostitutiva, punti patente, ravvedimento operoso, ripartizione delle spese condominiali, sospensione condizionale, stipendio netto, tasso alcolemico. Nel nuovo indice vanno mostrati tutti.
- Il calcolatore TAN/TAEG ha slug `taeg` (la chiave icona in `tools-grid.tsx` è `taeg`, non più `tasso-interesse-calcolo-taeg`).
- Le icone dei calcolatori seguono la mappa `ICONS` in `components/tools/tools-grid.tsx`. Esporta le icone Lucide usate come SVG inline nel tema.

## Utilità (`/utilita/`)

L'indice riproduce **esattamente** l'elenco pubblicato oggi su miolegale.it/utilita: 6 sezioni, stesso ordine, stessi titoli. I titoli mostrati nell'indice sono quelli qui sotto, **non** il titolo della pagina WordPress, che spesso è più lungo.

**Tassi e indici** (`tassi-indici`)
- Tasso di interesse legale: `/utilita/tasso-interesse-legale/`
- Tasso degli interessi moratori: `/utilita/tasso-interessi-moratori/`
- Tassi soglia d’usura: `/utilita/tabella-tassi-soglia-usura/`
- Ultimo indice Istat: `/utilita/ultimo-indice-istat/`

**Compensi e spese di giustizia** (`compensi-spese`)
- Parametri forensi: `/utilita/parametri-forensi/`
- Parametri forensi penali: `/utilita/parametri-forensi-penali/`
- Tabella del contributo unificato: `/utilita/tabella-contributo-unificato/`
- Diritti di copia: `/utilita/tabella-diritti-di-copia/`
- Tariffe della mediazione: `/utilita/tariffe-mediazione-civile/`
- Codici di iscrizione a ruolo: `/utilita/codici-iscrizione-ruolo/`

**Danno alla persona** (`danno-persona`)
- Tabelle del Tribunale di Milano: `/utilita/tabelle-tribunale-milano/`
- Tabelle del Tribunale di Roma: `/utilita/tabelle-tribunale-roma/`
- Tabella delle lesioni micropermanenti: `/utilita/tabella-lesioni-micropermanenti/`
- Risarcimento delle micropermanenti: `/utilita/tabella-risarcimento-micropermanenti/`
- Indennizzo INAIL del danno biologico: `/utilita/tabelle-indennizzo-danno-biologico-inail/`
- Tabella delle menomazioni INAIL: `/utilita/tabella-menomazioni-inail/`
- Causa di servizio: `/utilita/causa-di-servizio/`

**Immobili e usufrutto** (`proprieta-catasto`)
- Categorie catastali: `/utilita/categorie-catastali/`
- Coefficienti dell’usufrutto: `/utilita/coefficienti-calcolo-usufrutto/`

**Circolazione stradale** (`codice-strada`)
- Tabella dei punti patente: `/utilita/tabella-punti-patente/`
- Tabelle alcolemiche: `/utilita/tabelle-alcolemiche/`

**Formulari** (`formulari`): solo due link fissi, non sono pagine figlie di `utilita`
- Formulario civile: `https://miolegale.it/formulario-civile/`
- Formulario penale: `https://miolegale.it/formulario-penale/`

Regole:
- **Le pagine figlie di `utilita` non presenti in questo elenco non compaiono nell'indice** (restano raggiungibili al loro URL). Non aggiungere sezioni come «Altre utilità», «Processo civile» o «Avvocati».
- **Non elencare i singoli formulari** (dichiarazione 137 c.p.c., rinuncia al mandato, ricorso congiunto, atto di citazione, ecc.): nell'indice ci sono solo i due link qui sopra.
- «Testimonianza scritta» e «Riforma Cartabia: tabelle comparative» sono guide (`/guide/...`), non utilità: non vanno nell'indice delle utilità.
- Le sezioni vecchie (`avvocati`, `tassi-istat`, `medicina-legale`, `formulari-civili-penali`, `altre-utilita`) non esistono più. Se il campo ACF `categoria_utilita` contiene uno di questi valori, ignoralo.

## Da fare

0. Elenca i CSS/JS attuali dei calcolatori e delle utilità e mantienine il caricamento invariato nel nuovo tema (regola 2). Verifica su 3 calcolatori e 3 utilità che i form abbiano lo stesso aspetto di oggi.
1. Crea o aggiorna `inc/tools.php` con i due registri qui sopra (calcolatori con `category` e `also_in`, utilità con slug e titolo per sezione, formulari come link fissi).
2. Aggiorna `page-calcolo.php` e `page-utilita.php` perché leggano solo da quel file, nello stesso ordine.
3. Nella pagina singola di un calcolatore usa la categoria principale per breadcrumb e correlati.
4. Confronta `/calcolo/` e `/utilita/` con il prototipo a 1440 e 390 px: stesse sezioni, stesso numero di link per sezione (calcolatori 4, 3, 5, 8, 2, 3, 4, 3, 3, 9, 4, 3, 7, 3, 3, 4; utilità 4, 6, 7, 2, 2, 2).
5. Spunta le voci corrispondenti in `checklist.md` e fermati per farmi verificare.
