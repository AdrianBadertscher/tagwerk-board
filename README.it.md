# Tagwerk

![Screenshot di Tagwerk](Tagwerk-Board.png)

[🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇮🇹 Italiano](README.it.md) | [🇵🇱 Polski](README.pl.md) | [🇪🇸 Español](README.es.md) | [🇳🇱 Nederlands](README.nl.md) | [🇨🇿 Čeština](README.cs.md)

---

Provalo dal vivo: [https://adrianbadertscher.github.io/tagwerk-board/](https://adrianbadertscher.github.io/tagwerk-board/)

La tua lavagna Kanban personale. I tuoi dati restano sul tuo dispositivo. Punto.

Tagwerk è una lavagna Kanban privata e local-first, costruita interamente con HTML, JavaScript e CSS — nessun server, nessun account, nessun cloud, nessun build. Apri i file e funziona. Le tue attività non lasciano mai il tuo computer — ed è esattamente per questo che Tagwerk non è pensato per i team. È la tua lavagna, per il tuo lavoro.

## Ringraziamenti

- Tagwerk utilizza il carattere **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** di JetBrains (licenza SIL Open Font License).
- Questo progetto è un fork di [Lewis-P-T/kanban-board](https://github.com/Lewis-P-T/kanban-board) — mille grazie per l'ottima base!

## Perché Tagwerk?

La maggior parte degli strumenti Kanban vuole i tuoi dati. Li sincronizzano, li analizzano, li ospitano e li monetizzano. Tagwerk prende la posizione opposta: non c'è nulla da intercettare e nulla da far trapelare, perché tutto viene eseguito e archiviato localmente nel tuo browser. Privato per progetto, non per politica aziendale.

Se lavori da solo — sviluppatore, scrittore, ricercatore, pianificatore — non ti serve una piattaforma collaborativa. Ti serve una lavagna veloce e bella che rispetti la tua privacy. Questa è Tagwerk.

## Funzionalità

- **Più lavagne** — crea, rinomina ed elimina lavagne; organizza per progetto o mantieni una lavagna archivio
- **Schede ricche** — titolo, descrizione in Markdown con anteprima dal vivo, data di scadenza (con giorno della settimana), tag e campo «Riguarda»
- **Priorità con codice colore** — ogni scheda porta una priorità alta / media / bassa, mostrata come banda colorata lungo il bordo: verde per bassa, ambra per media, rossa per alta. Scorri una colonna e vedi subito cosa merita la tua attenzione per primo — e riprendi esattamente dove ti eri fermato settimane dopo
- **Cronologia tracciabile per scheda** — ogni scheda conserva il proprio registro dei cambiamenti: cosa è cambiato, quando, e da cosa a cosa — modifiche del titolo, cambi di priorità, spostamenti della scadenza, aggiornamenti dei tag e transizioni di colonna («Spostata: Doing → Done»). Il registro sta nella vista dettaglio della scheda, più recenti per primi, limitato agli ultimi 30 elementi
- **Selezione multipla** — spunta le caselle di più schede, poi sposta l'intero lotto su un'altra lavagna con «Sposta su lavagna» (es. il tuo archivio o una lavagna dedicata a un progetto). Nuovi ID all'arrivo evitano collisioni; il drag & drop continua a funzionare anche mentre i filtri nascondono schede
- **Connessioni visibili** — le schede collegate sono unite da fili animati («cime») tracciati sulla lavagna; al passaggio del mouse le cime di una scheda brillano mentre le altre svaniscono
- **Colonna On Hold** — una corsia di parcheggio deliberata per il lavoro bloccato, accanto a To Do, Doing e Done
- **Filtraggio e ricerca potenti** — filtra per tag, riguarda, priorità e scadenza (in ritardo, scade oggi, prossimi 7 giorni, senza data); ricerca istantanea su titoli e descrizioni con corrispondenze evidenziate. Le schede in ritardo ricevono un evidenziazione rossa, quelle che scadono oggi arancione — la lavagna ti avverte prima ancora che tu legga
- **Link bidirezionali** — collega schede tra loro; entrambe le estremità restano sincronizzate automaticamente
- **Annulla / rifai** — Ctrl+Z / Ctrl+Y (o Ctrl+Shift+Z), per sessione e per lavagna
- **Limiti WIP** — configurabili per colonna, con avvisi visivi al superamento
- **Vista statistiche** — totali, in ritardo, in scadenza oggi, percentuale di completamento, ripartizione per priorità e grafico a barre delle schede per colonna
- **Scorciatoie da tastiera ovunque** — / per cercare, n per una nuova attività, s per le statistiche, ? per l'aiuto, Ctrl+S per esportare
- **Deep link** — condividi un frammento URL come index.html?detail-id=c42 per aprire direttamente una scheda specifica
- **Drag & drop** — trascinamento fluido delle schede tra e dentro le colonne, con indicatore di rilascio; i pulsanti freccia sono un'alternativa touch-friendly
- **Tema chiaro e scuro** — segue automaticamente le preferenze del sistema

## Esportazione e importazione

- **Ctrl+S** o il pulsante Esporta salva tutte le lavagne in una volta in un unico file JSON con marca temporale — esportazioni successive non si sovrascrivono mai
- L'importazione accetta sia un pacchetto completo sia un'esportazione classica di una singola lavagna; gli import arrivano sempre come nuove lavagne, così niente di esistente viene mai sovrascritto e una voce corrotta non trascina mai giù il resto del backup
- La cronologia dei cambiamenti di ogni scheda viaggia con ogni scheda esportata e spostata — il tuo audit trail sopravvive al viaggio
- Un deep link porta in ogni momento alle schede archiviate — nascosto non significa perso

## 8 lingue

Tedesco, inglese, francese, italiano, polacco, spagnolo, olandese e ceco — rilevate automaticamente dal browser, commutabili in qualsiasi momento, salvate localmente. Perfino le abbreviazioni dei giorni seguono la lingua attiva.

## Privacy per progetto

- Nessun server, nessuna telemetria, nessun analytics — Tagwerk non invia nulla a nessuno
- Solo archiviazione locale — le tue lavogne vivono nel localStorage del tuo browser, sul tuo dispositivo
- Import validati — i dati importati vengono bonificati e verificati contro uno schema, non fidati alla cieca
- Zero dipendenze — quattro file, puro HTML/CSS/JS; puoi leggere ogni riga

## Per iniziare

Nessuna installazione. Nessuna registrazione. Nessun processo di build.

- Scarica o clona questa repository
- Apri `index.html` in un browser moderno
- Crea la tua prima scheda

Tutto qui. I tuoi dati sono sul tuo dispositivo — e da nessun'altra parte.

### Stack tecnologico

| Livello | Tecnologia |
| --- | --- |
| Struttura | HTML semantico con modali `<dialog>` |
| Logica | JavaScript vanilla (ES6+) |
| Stili | CSS scritto a mano, proprietà personalizzate, `prefers-color-scheme` |
| Archiviazione | localStorage (per lavagna, più metadati delle lavagne) |
| Dipendenze | Nessuna |

Funziona offline, da una cartella locale o ospitato su qualsiasi server di file statici (es. GitHub Pages).

## Non per i team — e ne è orgoglioso

Tagwerk è volutamente mono-utente. Niente avatar, niente menzioni, niente feed di attività, niente notifiche che lottano per la tua attenzione. Se devi collaborare, usa uno strumento di team con il tuo team. Quando ci sei solo tu e il tuo lavoro, Tagwerk ti dà concentrazione — senza regalare i tuoi dati.

> Distribuito con JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — vedi `fonts/OFL.txt`

Semplice, locale e solo tuo. Prova Tagwerk oggi.
