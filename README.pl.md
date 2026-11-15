# Tagwerk

![Zrzut ekranu Tagwerk](Tagwerk-Board.png)

[🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇮🇹 Italiano](README.it.md) | [🇵🇱 Polski](README.pl.md) | [🇪🇸 Español](README.es.md) | [🇳🇱 Nederlands](README.nl.md) | [🇨🇿 Čeština](README.cs.md)

---

Wypróbuj na żywo: [https://adrianbadertscher.github.io/tagwerk-board/](https://adrianbadertscher.github.io/tagwerk-board/)

Twoja osobista tablica Kanban. Twoje dane zostają na Twoim urządzeniu. Kropka.

Tagwerk to prywatna tablica Kanban typu local-first, zbudowana w całości z HTML, JavaScriptu i CSS — bez serwera, bez kont, bez chmury, bez procesu budowania. Otwórz pliki i działa. Twoje zadania nigdy nie opuszczają Twojego komputera — i właśnie dlatego Tagwerk nie jest przeznaczony dla zespołów. To Twoja tablica, do Twojej pracy.

## Dlaczego Tagwerk?

Większość narzędzi Kanban chce Twoich danych. Synchronizują je, analizują, hostują i monetyzują. Tagwerk przyjmuje przeciwną postawę: nie ma czego przechwycić i nie ma czego wyciec, bo wszystko działa i jest przechowywane lokalnie w Twojej przeglądarce. Prywatność z projektowania, nie z polityki.

Jeśli pracujesz sam — jako programista, pisarz, badacz, planista — nie potrzebujesz platformy do współpracy. Potrzebujesz szybkiej, pięknej tablicy, która szanuje Twoją prywatność. To jest Tagwerk.

## Funkcje

- **Wiele tablic** — twórz, zmieniaj nazwy i usuwaj tablice; organizuj według projektów lub prowadź tablicę archiwum
- **Bogate karty** — tytuł, opis w Markdown z podglądem na żywo, termin wykonania (z dniem tygodnia), tagi i pole „Dotyczy"
- **Priorytety z kodem kolorów** — każda karta ma priorytet wysoki / średni / niski, widoczny jako kolorowa linia wzdłuż krawędzi karty: zielony dla niskiego, bursztynowy dla średniego, czerwony dla wysokiego. Przejrzyj kolumnę i od razu zobacz, co zasługuje na uwagę w pierwszej kolejności — i wróć dokładnie tam, gdzie skończyłeś tygodnie później
- **Śledząca historia każdej karty** — każda karta prowadzi własny dziennik zmian: co się zmieniło, kiedy i z czego na co — edycje tytułów, zmiany priorytetów, przesunięcia terminów, aktualizacje tagów i przejścia między kolumnami („Przeniesiono: Doing → Done"). Dziennik znajduje się w widoku szczegółów karty, najnowsze wpisy na początku, ograniczony do ostatnich 30 pozycji
- **Wybór wielokrotny** — zaznacz checkboxy kilku kart naraz, a potem przenieś całą partię na inną tablicę przez „Przenieś do tablicy" (np. do archiwum albo na dedykowaną tablicę projektu). Świeże identyfikatory po przybyciu zapobiegają kolizjom; drag & drop działa nawet wtedy, gdy filtry ukrywają karty
- **Widoczne połączenia** — powiązane karty łączą animowane nici („liny") rozciągnięte przez tablicę; po najechaniu na kartę jej liny świecą, a pozostałe gasną
- **Kolumna On Hold** — celowy pas postoju dla zablokowanych zadań, obok To Do, Doing i Done
- **Potężne filtrowanie i wyszukiwanie** — filtruj po tagu, dotyczy, priorytecie i terminie (zaległe, na dziś, następne 7 dni, bez daty); natychmiastowe wyszukiwanie w tytułach i opisach z podświetleniem trafień. Zaległe karty dostają czerwone, terminowe na dziś pomarańczowe podświetlenie — tablica ostrzega Cię, zanim zdążysz przeczytać
- **Powiązania dwukierunkowe** — łącz karty ze sobą; oba końce pozostają automatycznie zsynchronizowane
- **Cofnij / ponów** — Ctrl+Z / Ctrl+Y (lub Ctrl+Shift+Z), w zakresie sesji na tablicę
- **Limity WIP** — konfigurowalne dla każdej kolumny, z ostrzeżeniami wizualnymi po przekroczeniu
- **Widok statystyk** — sumy, zaległe, na dziś, procent ukończenia, podział wg priorytetów i wykres słupkowy kart na kolumnę
- **Skróty klawiszowe wszędzie** — / do wyszukiwania, n nowego zadania, s statystyk, ? pomocy, Ctrl+S eksportu
- **Deep linki** — udostępnij fragment adresu jak index.html?detail-id=c42, aby otworzyć konkretną kartę bezpośrednio
- **Drag & drop** — płynne przeciąganie kart między kolumnami i wewnątrz nich, ze wskaźnikiem upuszczenia; przyciski strzałek to przyjazna alternatywa dotykowa
- **Motyw jasny i ciemny** — automatycznie podąża za preferencjami systemu

## Eksport i import

- **Ctrl+S** lub przycisk Eksport tworzy kopię wszystkich tablic naraz w jednym pliku JSON z sygnaturą czasową — kolejne eksporty nigdy się nie nadpisują
- Import przyjmuje zarówno pełny pakiet, jak i klasyczny eksport pojedynczej tablicy; importy zawsze przychodzą jako nowe tablice, więc nic istniejącego nigdy nie jest nadpisywane, a jedna uszkodzona pozycja nigdy nie pociąga za sobą reszty kopii zapasowej
- Historia zmian każdej karty podróżuje z każdą wyeksportowaną i przeniesioną kartą — Twoje dziennik kontroli przeżywa podróż
- Deep link prowadzi w każdej chwili do zarchiwizowanych kart — ukryte nie znaczy stracone

## 8 języków

Niemiecki, angielski, francuski, włoski, polski, hiszpański, niderlandzki i czeski — wykrywane automatycznie z przeglądarki, przełączalne w każdej chwili, zapisywane lokalnie. Nawet skróty dni tygodnia podążają za aktywnym językiem.

## Prywatność w projekcie

- Brak serwera, telemetrii i analityki — Tagwerk nie wysyła niczego nikomu
- Wyłącznie lokalne przechowywanie — Twoje tablice żyją w localStorage przeglądarki, na Twoim urządzeniu
- Walidowane importy — importowane dane są oczyszczane i sprawdzane względem schematu, nie przyjmowane ślepo
- Zero zależności — cztery pliki, czysty HTML/CSS/JS; możesz przeczytać każdą linijkę

## Jak zacząć

Bez instalacji. Bez rejestracji. Bez procesu budowania.

- Pobierz lub sklonuj to repozytorium
- Otwórz `index.html` w nowoczesnej przeglądarce
- Utwórz swoją pierwszą kartę

To wszystko. Twoje dane są na Twoim urządzeniu — i nigdzie indziej.

### Stack technologiczny

| Warstwa | Technologia |
| --- | --- |
| Struktura | Semantyczny HTML z modalami `<dialog>` |
| Logika | Czysty JavaScript (ES6+) |
| Style | Ręcznie pisany CSS, własne właściwości, `prefers-color-scheme` |
| Przechowywanie | localStorage (na tablicę, plus metadane tablic) |
| Zależności | Brak |

Działa offline, z lokalnego folderu lub hostowany na dowolnym serwerze plików statycznych (np. GitHub Pages).

## Nie dla zespołów — i jest z tego dumny

Tagwerk to świadomie jednoosobowe narzędzie. Żadnych awatarów, wzmianek, feedów aktywności ani powiadomień walczących o Twoją uwagę. Jeśli musisz współpracować, użyj narzędzia zespołowego ze swoim zespołem. Gdy jest tylko Ty i Twoja praca, Tagwerk daje Ci skupienie — bez oddawania swoich danych.

> Dystrybuowany z JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — patrz `fonts/OFL.txt`

Proste, lokalne i tylko Twoje. Wypróbuj Tagwerk już dziś.
