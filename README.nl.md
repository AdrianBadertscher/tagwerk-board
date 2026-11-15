# Tagwerk

![Tagwerk-schermafdruk](Tagwerk-Board.png)

[🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇮🇹 Italiano](README.it.md) | [🇵🇱 Polski](README.pl.md) | [🇪🇸 Español](README.es.md) | [🇳🇱 Nederlands](README.nl.md) | [🇨🇿 Čeština](README.cs.md)

---

Probeer het live: [https://adrianbadertscher.github.io/tagwerk-board/](https://adrianbadertscher.github.io/tagwerk-board/)

Jouw persoonlijke Kanban-bord. Jouw gegevens blijven op jouw apparaat. Punt.

Tagwerk is een privé, local-first Kanban-bord, volledig gebouwd met HTML, JavaScript en CSS — geen server, geen accounts, geen cloud, geen build-stap. Open de bestanden, en het werkt. Je taken verlaten nooit je machine — en daarom is Tagwerk niet bedoeld voor teams. Het is jouw bord, voor jouw werk.

## Waarom Tagwerk?

De meeste Kanban-tools willen je gegevens. Ze synchroniseren ze, analyseren ze, hosten ze en verdienen er geld mee. Tagwerk neemt de tegenovergestelde houding aan: er is niets te onderscheppen en niets te lekken, omdat alles lokaal in je browser draait en daar wordt opgeslagen. Privé door ontwerp, niet door beleid.

Als je alleen werkt — als ontwikkelaar, schrijver, onderzoeker of planner — heb je geen samenwerkingsplatform nodig. Je hebt een snel, mooi bord nodig dat je privacy respecteert. Dat is Tagwerk.

## Functies

- **Meerdere borden** — maak, hernoem en verwijder borden; organiseer per project of houd een archiefboard aan
- **Rijke kaarten** — titel, beschrijving in Markdown met live voorbeeld, vervaldatum (met weekdag), tags en een veld «Betreft»
- **Prioriteiten met kleurcodes** — elke kaart draagt een prioriteit hoog / middel / laag, weergegeven als gekleurde strook langs de rand van de kaart: groen voor laag, amber voor middel, rood voor hoog. Scan een kolom en zie in één oogopslag wat eerst aandacht verdient — en pak weken later precies daar weer op waar je was gebleven
- **Traceerbare geschiedenis per kaart** — elke kaart houdt zijn eigen wijzigingslog bij: wat er veranderde, wanneer, en van wat naar wat — titelbewerkingen, prioriteitswijzigingen, vervaldatum-verschuivingen, tag-updates en kolomovergangen («Verplaatst: Doing → Done»). De log staat in de detailweergave van de kaart, nieuwste eerst, met een limiet van de laatste 30 regels
- **Meervoudige selectie** — vink de selectievakjes van meerdere kaarten tegelijk aan en verschuif de hele batch naar een ander bord met «Naar board verschuiven» (bijv. je archief of een toegewijd projectbord). Verse ID's bij aankomst voorkomen botsingen; drag & drop blijft werken ook als filters kaarten verbergen
- **Zichtbare verbindingen** — gekoppelde kaarten worden verbonden door geanimeerde draden («touwen») over het bord; bij het aanwijzen van een kaart gloeien zijn touwen terwijl de andere vervagen
- **On Hold-kolom** — een bewuste parkeerstrook voor geblokkeerd werk, naast To Do, Doing en Done
- **Krachtig filteren en zoeken** — filter op tag, betreft, prioriteit en vervaldatum (achterstallig, vandaag vervallen, komende 7 dagen, zonder datum); direct zoeken in titels en beschrijvingen met gemarkeerde treffers. Achterstallige kaarten krijgen een rode markering, vandaag-vervallende een oranje — het bord waarschuwt je voordat je zelfs maar leest
- **Tweerichtingskoppelingen** — koppel kaarten aan elkaar; beide uiteinden blijven automatisch gesynchroniseerd
- **Ongedaan maken / opnieuw** — Ctrl+Z / Ctrl+Y (of Ctrl+Shift+Z), per sessie per bord
- **WIP-limieten** — per kolom in te stellen, met visuele waarschuwingen bij overschrijding
- **Statistiekweergave** — totalen, achterstallig, vandaag vervallen, voltooiingspercentage, prioriteitsverdeling en een staafdiagram van kaarten per kolom
- **Sneltoetsen overal** — / zoeken, n nieuwe taak, s statistieken, ? hulp, Ctrl+S exporteren
- **Diepe links** — deel een URL-fragment zoals index.html?detail-id=c42 om direct een specifieke kaart te openen
- **Drag & drop** — vloeiend slepen van kaarten tussen en binnen kolommen, met sleepindicator; pijlknoppen zijn een touchvriendelijk alternatief
- **Licht en donker thema** — volgt automatisch je systeemvoorkeur

## Exporteren en importeren

- **Ctrl+S** of de knop Exporteren maakt een back-up van alle borden tegelijk als één JSON-bestand met tijdstempel — opeenvolgende exporten overschrijven elkaar nooit
- Import accepteert óf een volledige bundel óf een klassieke export van één bord; importen komen altijd aan als nieuwe borden, zodat bestaande data nooit wordt overschreven en één corrupte invoer nooit de rest van de back-up meesleept
- De wijzigingsgeschiedenis per kaart reist mee met elke geëxporteerde en verschoven kaart — je audit-spoor overleeft de reis
- Een diepe link leidt altijd naar gearchiveerde kaarten — verborgen is niet verdwenen

## 8 talen

Duits, Engels, Frans, Italiaans, Pools, Spaans, Nederlands en Tsjechisch — automatisch gedetecteerd uit je browser, altijd omschakelbaar, lokaal bewaard. Zelfs de afkortingen van weekdagen volgen de actieve taal.

## Privacy door ontwerp

- Geen server, geen telemetrie, geen analytics — Tagwerk stuurt niets ergens heen
- Alleen lokale opslag — je borden leven in de localStorage van je browser, op jouw apparaat
- Gevalideerde import — geïmporteerde data wordt gezuiverd en tegen een schema gecontroleerd, niet blindelings vertrouwd
- Nul afhankelijkheden — vier bestanden, pure HTML/CSS/JS; je kunt elke regel lezen

## Aan de slag

Geen installatie. Geen registratie. Geen build-proces.

- Download of kloon deze repository
- Open `index.html` in een moderne browser
- Maak je eerste kaart

Dat is alles. Je gegevens staan op jouw apparaat — en nergens anders.

### Tech-stack

| Laag | Technologie |
| --- | --- |
| Structuur | Semantische HTML met `<dialog>`-modals |
| Logica | Vanilla JavaScript (ES6+) |
| Stijl | Handgeschreven CSS, custom properties, `prefers-color-scheme` |
| Opslag | localStorage (per bord, plus bord-metadata) |
| Afhankelijkheden | Geen |

Werkt offline, vanuit een lokale map of gehost op elke statische bestandsserver (bijv. GitHub Pages).

## Niet voor teams — en trots daarop

Tagwerk is bewust voor één gebruiker. Geen avatars, geen mentions, geen activiteitenfeeds, geen notificaties die om je aandacht vechten. Wil je samenwerken, gebruik dan een teamtool met je team. Als het alleen jij en je werk betreft, geeft Tagwerk je focus — zonder je gegevens weg te geven.

> Geleverd met JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — zie `fonts/OFL.txt`

Eenvoudig, lokaal, en alleen van jou. Probeer Tagwerk vandaag.
