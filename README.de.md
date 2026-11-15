# Tagwerk

![Tagwerk Screenshot](Tagwerk-Board.png)

[🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇮🇹 Italiano](README.it.md) | [🇵🇱 Polski](README.pl.md) | [🇪🇸 Español](README.es.md) | [🇳🇱 Nederlands](README.nl.md) | [🇨🇿 Čeština](README.cs.md)

---

Teste es live: [https://adrianbadertscher.github.io/tagwerk-board/](https://adrianbadertscher.github.io/tagwerk-board/)

Dein persönliches Kanban-Board. Deine Daten bleiben auf deinem Gerät. Punkt.

Tagwerk ist ein privates, local-first Kanban-Board, das vollständig aus HTML, JavaScript und CSS besteht — kein Server, keine Accounts, keine Cloud, kein Build-Step. Dateien öffnen, loslegen. Deine Aufgaben verlassen niemals dein Gerät — deshalb ist Tagwerk bewusst nicht für Teams gebaut. Es ist dein Board, für deine Arbeit.

## Warum Tagwerk?

Die meisten Kanban-Tools wollen deine Daten. Sie synchronisieren sie, analysieren sie, hosten sie und machen daraus ein Geschäft. Tagwerk nimmt die entgegengesetzte Haltung ein: Es gibt nichts abzufangen und nichts zu leaken, weil alles lokal in deinem Browser läuft und dort gespeichert wird. Privat by Design, nicht by Policy.

Wer allein arbeitet — als Entwickler, Autor, Forscher, Planer — braucht keine Kollaborationsplattform. Er braucht ein schnelles, schönes Board, das die Privatsphäre respektiert. Das ist Tagwerk.

## Funktionen

- **Mehrere Boards** — Boards erstellen, umbenennen und löschen; nach Projekten organisieren oder ein Archiv-Board führen
- **Vielseitige Karten** — Titel, Markdown-formatierte Beschreibung mit Live-Vorschau, Fälligkeitsdatum (mit Wochentagsanzeige), Tags und ein Feld „Betrifft"
- **Prioritäten mit Farbcodes** — jede Karte trägt eine Priorität hoch / mittel / tief, dargestellt als farbiger Streifen am Kartenrand: grün für tief, orange für mittel, rot für hoch. Eine Spalte scannen und sofort erkennen, was zuerst Aufmerksamkeit verdient — und Wochen später exakt dort weitermachen, wo du aufgehört hast
- **Nachvollziehbare Historie pro Karte** — jede Karte führt ihr eigenes Änderungsprotokoll: was geändert wurde, wann, und von was auf was — Titelbearbeitungen, Prioritätswechsel, verschobene Fälligkeitsdaten, Tag-Updates und Spaltenwechsel („Verschoben: Doing → Done"). Das Protokoll liegt in der Detailansicht der Karte, neueste Einträge zuerst, begrenzt auf die letzten 30 Einträge
- **Mehrfachauswahl** — mehrere Karten per Checkbox ankreuzen und das ganze Paket mit „Zu Board schieben" auf ein anderes Board verschieben (z. B. dein Archiv oder ein dediziertes Projekt-Board). Frische IDs beim Eingang verhindern Kollisionen; Drag & Drop funktioniert auch, während Filter Karten ausblenden
- **Sichtbare Verbindungen** — verknüpfte Karten werden durch animierte Fäden („Tampen") über das Board miteinander verbunden; beim Überfahren mit der Maus leuchten die Tampen einer Karte auf, während die anderen verblassen
- **On-Hold-Spalte** — eine bewusste Parkspur für blockierte Arbeit, neben To Do, Doing und Done
- **Mächtiges Filtern & Suchen** — filtere nach Tag, Betrifft, Priorität und Fälligkeitsdatum (überfällig, heute fällig, nächste 7 Tage, ohne Datum); Sofortsuche über Titel und Beschreibungen mit hervorgehobenen Treffern. Überfällige Karten bekommen einen roten, heute fällige einen orangen Rahmen — das Board warnt dich, bevor du überhaupt liest
- **Bidirektionale Links** — Karten miteinander verknüpfen; beide Enden bleiben automatisch synchron
- **Undo / Redo** — Ctrl+Z / Ctrl+Y (oder Ctrl+Shift+Z), sitzungsbezogen pro Board
- **WIP-Limits** — pro Spalte konfigurierbar, mit visueller Warnung bei Überschreitung
- **Statistikansicht** — Totale, überfällige, heute fällige Karten, Erfüllungsgrad in Prozent, Prioritätsverteilung und ein Balkendiagramm der Karten pro Spalte
- **Tastaturkürzel überall** — / für Suche, n für neue Aufgabe, s für Statistik, ? für Hilfe, Ctrl+S für Export
- **Deep Links** — ein URL-Fragment wie index.html?detail-id=c42 öffnet direkt eine bestimmte Karte
- **Drag & Drop** — flüssiges Ziehen von Karten zwischen und innerhalb von Spalten, mit Drop-Indikator; Pfeil-Buttons sind eine touchfreundliche Alternative
- **Hell- & Dunkelmodus** — folgt automatisch deiner Systemeinstellung

## Export & Import

- **Ctrl+S** oder der Export-Button sichert alle Boards auf einmal als einzelne, mit Zeitstempel versehene JSON-Datei — aufeinanderfolgende Exporte überschreiben sich nie gegenseitig
- Der Import akzeptiert entweder ein komplettes Bundle oder einen klassischen Einzel-Board-Export; Importe kommen immer als neue Boards an, sodass Bestehendes niemals überschrieben wird und ein korrupter Eintrag niemals das ganze Backup mitreisst
- Die Änderungshistorie pro Karte reist mit jedem exportierten und verschobenen Karte mit — dein Prüfpfad überlebt die Reise
- Deep-Links führen jederzeit zu archivierten Karten — versteckt ist nicht weg

## 8 Sprachen

Deutsch, Englisch, Französisch, Italienisch, Polnisch, Spanisch, Niederländisch und Tschechisch — automatisch aus deinem Browser erkannt, jederzeit umschaltbar, lokal gespeichert. Selbst die Wochentagsabkürzungen folgen der aktiven Sprache.

## Privacy by Design

- Kein Server, keine Telemetrie, kein Analytics — Tagwerk sendet nichts an niemanden
- Nur lokale Speicherung — deine Boards leben im localStorage deines Browsers, auf deinem Gerät
- Validierte Importe — importierte Daten werden bereinigt und gegen ein Schema geprüft, nicht blind vertraut
- Keine Abhängigkeiten — vier Dateien, pures HTML/CSS/JS; du kannst jede Zeile lesen

## Loslegen

Keine Installation. Keine Registrierung. Kein Build-Prozess.

- Dieses Repository herunterladen oder klonen
- `index.html` in einem modernen Browser öffnen
- Deine erste Karte erstellen

Das war's. Deine Daten sind auf deinem Gerät — und nirgendwo sonst.

### Tech Stack

| Schicht | Technologie |
| --- | --- |
| Struktur | Semantisches HTML mit `<dialog>`-Modals |
| Logik | Vanilla JavaScript (ES6+) |
| Styling | Handgeschriebenes CSS, Custom Properties, `prefers-color-scheme` |
| Speicherung | localStorage (pro Board, plus Board-Metadaten) |
| Abhängigkeiten | Keine |

Funktioniert offline, aus einem lokalen Ordner oder auf jedem statischen Fileserver (z. B. GitHub Pages).

## Nicht für Teams — und stolz darauf

Tagwerk ist bewusst ein Ein-Benutzer-Werkzeug. Keine Avatare, keine Mentions, keine Activity-Feeds, keine Benachrichtigungen, die um deine Aufmerksamkeit ringen. Wenn du zusammenarbeiten willst, nutze ein Team-Tool mit deinem Team. Wenn es nur um dich und deine Arbeit geht, gibt dir Tagwerk Fokus — ohne deine Daten herzugeben.

> Ausgeliefert mit JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — siehe `fonts/OFL.txt`

Einfach, lokal und nur deins. Probiere Tagwerk heute aus.
