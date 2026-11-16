# Tagwerk

![Snímek obrazovky Tagwerk](Tagwerk-Board.png)

[🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇮🇹 Italiano](README.it.md) | [🇵🇱 Polski](README.pl.md) | [🇪🇸 Español](README.es.md) | [🇳🇱 Nederlands](README.nl.md) | [🇨🇿 Čeština](README.cs.md)

---

Vyzkoušej naživo: [https://adrianbadertscher.github.io/tagwerk-board/](https://adrianbadertscher.github.io/tagwerk-board/)

Tvoje osobní Kanban deska. Tvoje data zůstávají na tvém zařízení. Tečka.

Tagwerk je soukromá, local-first Kanban deska postavená výhradně z HTML, JavaScriptu a CSS — žádný server, žádné účty, žádný cloud, žádný build. Otevři soubory a funguje. Tvoje úkoly nikdy neopouštějí tvůj počítač — a právě proto Tagwerk není určen pro týmy. Je to tvoje deska, pro tvoji práci.

## Poděkování

- Tagwerk používá písmo **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** od JetBrains (pod licencí SIL Open Font License).
- Tento projekt je fork repozitáře [Lewis-P-T/kanban-board](https://github.com/Lewis-P-T/kanban-board) — děkujeme za skvělý základ!

## Proč Tagwerk?

Většina Kanban nástrojů chce tvá data. Synchronizují je, analyzují, hostují a zpeněžují. Tagwerk zaujímá opačný postoj: není nic k odposlechnutí a nic k úniku, protože vše běží a ukládá se lokálně ve tvém prohlížeči. Soukromí od návrhu, ne politikou.

Pokud pracuješ sám — jako vývojář, spisovatel, výzkumník, plánovač — nepotřebuješ platformu pro spolupráci. Potřebuješ rychlou, krásnou desku, která respektuje tvé soukromí. To je Tagwerk.

## Funkce

- **Více desek** — vytvářej, přejmenovávej a maž desky; organizuj podle projektů nebo veď archivní desku
- **Bohaté karty** — název, popis v Markdownu s náhledem naživo, termín (se zobrazeným dnem týdne), štítky a pole „Týká se"
- **Priority s barevným kódem** — každá karta nese prioritu vysokou / střední / nízkou, vykreslenou jako barevný pruh podél okraje karty: zelená pro nízkou, jantarová pro střední, červená pro vysokou. Projdi sloupec pohledem a okamžitě uvidíš, co si zaslouží pozornost nejdřív — a týdny později se vrátíš přesně tam, kde ses přestal
- **Sledovatelná historie u každé karty** — každá karta si vede vlastní protokol změn: co se změnilo, kdy, a z čeho na co — úpravy názvů, změny priorit, posuny termínů, aktualizace štítků a přesuny mezi sloupci („Přesunuto: Doing → Done"). Protokol je v detailním zobrazení karty, nejnovější první, omezený na posledních 30 záznamů
- **Vícenásobný výběr** — označ zaškrtávací políčka u několika karet najednou a celou dávku přehoď na jinou desku pomocí „Přesunout na desku" (např. tvůj archiv nebo desku vyhrazenou pro projekt). Čerstvá ID po příjezdu předcházejí kolizím; drag & drop funguje i když filtry karty skrývají
- **Viditelná propojení** — provázané karty spojují animované nitě („lana") tažené přes desku; při najetí na kartu její lana zazáří, zatímco ostatní zmiznou v pozadí
- **Sloupec On Hold** — záměrná odstavná kolej pro blokovanou práci, vedle To Do, Doing a Done
- **Silné filtrování a hledání** — filtruj podle štítku, týká se, priority a termínu (po termínu, dnes, dalších 7 dní, bez data); okamžité hledání v názvech a popisech se zvýrazněnými shodami. Karty po termínu dostávají červené, karty s termínem dnes oranžové zvýraznění — deska tě varuje dřív, než vůbec začneš číst
- **Obousměrné odkazy** — propoj karty navzájem; oba konce zůstávají automaticky synchronizované
- **Zpět / znovu** — Ctrl+Z / Ctrl+Y (nebo Ctrl+Shift+Z), v rozsahu relace na desku
- **WIP limity** — nastavitelné pro každý sloupec, s vizuálním varováním při překročení
- **Statistický pohled** — součty, po termínu, dnes splatné, procento dokončení, rozdělení podle priorit a sloupcový graf karet na sloupec
- **Klávesové zkratky všude** — / hledání, n nový úkol, s statistiky, ? nápověda, Ctrl+S export
- **Deep linky** — sdílej fragment adresy jako index.html?detail-id=c42 a otevřeš konkrétní kartu přímo
- **Drag & drop** — plynulé tažení karet mezi sloupci i uvnitř nich, s indikátorem upuštění; tlačítka se šipkami jsou dotykovou alternativou
- **Světlý a tmavý motiv** — automaticky sleduje předvolby tvého systému

## Export a import

- **Ctrl+S** nebo tlačítko Export zálohuje všechny desky najednou do jediného JSON souboru s časovým razítkem — po sobě jdoucí exporty se nikdy nepřepisují
- Import přijímá buď kompletní balík, nebo klasický export jedné desky; importy vždy přichází jako nové desky, takže nic existujícího se nikdy nepřepíše a jedna poškozená položka nikdy nepotopí zbytek zálohy
- Historie změn každé karty cestuje s každou exportovanou a přesunutou kartou — tvá kontrolní stopa přežije cestu
- Deep link kdykoli dovede k archivovaným kartám — skryté neznamená ztracené

## 8 jazyků

Němčina, angličtina, francouzština, italština, polština, španělština, nizozemština a čeština — automaticky detekované z tvého prohlížeče, kdykoli přepnutelné, ukládané lokálně. Dokonce i zkratky dnů sledují aktivní jazyk.

## Soukromí od návrhu

- Žádný server, žádná telemetrie, žádná analytika — Tagwerk nikam nic neposílá
- Pouze lokální úložiště — tvé desky žijí v localStorage tvého prohlížeče, na tvém zařízení
- Validované importy — importovaná data se čistí a kontrolují proti schématu, nevěří se jim slepě
- Nula závislostí — čtyři soubory, čisté HTML/CSS/JS; můžeš si přečíst každý řádek

## Jak začít

Žádná instalace. Žádná registrace. Žádný build.

- Stáhni nebo naklonuj tento repozitář
- Otevři `index.html` v moderním prohlížeči
- Vytvoř svou první kartu

To je vše. Tvoje data jsou na tvém zařízení — a nikde jinde.

### Technologický základ

| Vrstva | Technologie |
| --- | --- |
| Struktura | Sémantické HTML s modály `<dialog>` |
| Logika | Čistý JavaScript (ES6+) |
| Styly | Ručně psané CSS, vlastní vlastnosti, `prefers-color-scheme` |
| Úložiště | localStorage (na desku, plus metadata desek) |
| Závislosti | Žádné |

Funguje offline, z lokální složky nebo hostované na jakémkoli statickém souborovém serveru (např. GitHub Pages).

## Není pro týmy — a je na to hrdý

Tagwerk je záměrně jednoúčelový nástroj pro jednotlivce. Žádné avatary, žádné zmínky, žádné kanály aktivity, žádná upozornění bojující o tvou pozornost. Pokud potřebuješ spolupracovat, použij týmový nástroj se svým týmem. Když jsi jen ty a tvoje práce, Tagwerk ti dává soustředění — bez rozdávání svých dat.

> Dodáváno s JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — viz `fonts/OFL.txt`

Jednoduché, lokální a jen tvoje. Vyzkoušej Tagwerk už dnes.
