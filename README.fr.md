# Tagwerk

![Capture d'écran de Tagwerk](Tagwerk-Board.png)

[🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇮🇹 Italiano](README.it.md) | [🇵🇱 Polski](README.pl.md) | [🇪🇸 Español](README.es.md) | [🇳🇱 Nederlands](README.nl.md) | [🇨🇿 Čeština](README.cs.md)

---

Essaie-le en direct : [https://adrianbadertscher.github.io/tagwerk-board/](https://adrianbadertscher.github.io/tagwerk-board/)

Ton tableau Kanban personnel. Tes données restent sur ton appareil. Point final.

Tagwerk est un tableau Kanban privé et local-first, entièrement construit en HTML, JavaScript et CSS — pas de serveur, pas de comptes, pas de cloud, pas d'étape de build. Ouvre les fichiers, et ça marche. Tes tâches ne quittent jamais ta machine — c'est précisément pourquoi Tagwerk n'est pas conçu pour les équipes. C'est ton tableau, pour ton travail.

## Pourquoi Tagwerk ?

La plupart des outils Kanban veulent tes données. Ils les synchronisent, les analysent, les hébergent et en tirent profit. Tagwerk prend la position opposée : il n'y a rien à intercepter et rien à fuiter, car tout s'exécute et se stocke localement dans ton navigateur. Privé par conception, pas par politique.

Si tu travailles seul — développeur, auteur, chercheur, planificateur — tu n'as pas besoin d'une plateforme collaborative. Tu as besoin d'un tableau rapide et élégant qui respecte ta vie privée. C'est Tagwerk.

## Fonctionnalités

- **Plusieurs tableaux** — crée, renomme et supprime des tableaux ; organise par projet ou garde un tableau d'archives
- **Cartes riches** — titre, description en Markdown avec aperçu en direct, date d'échéance (avec jour de la semaine), tags et champ « Concerne »
- **Priorités avec code couleur** — chaque carte porte une priorité haute / moyenne / basse, affichée en bande colorée sur le bord de la carte : vert pour basse, ambre pour moyenne, rouge pour haute. Balaye une colonne du regard et vois immédiatement ce qui mérite ton attention en premier — et reprends exactement là où tu t'étais arrêté des semaines plus tard
- **Historique traçable par carte** — chaque carte tient son propre journal des changements : quoi a changé, quand, et de quoi vers quoi — modifications de titre, changements de priorité, déplacements de date, mises à jour de tags et transitions de colonnes (« Déplacé : Doing → Done »). Le journal se trouve dans la vue détaillée de la carte, du plus récent au plus ancien, limité aux 30 dernières entrées
- **Sélection multiple** — coche les cases de plusieurs cartes, puis envoie tout le lot vers un autre tableau avec « Déplacer vers un tableau » (par ex. ton archive ou un tableau dédié à un projet). Des identifiants frais à l'arrivée évitent les collisions ; le glisser-déposer continue de fonctionner même quand des filtres masquent des cartes
- **Connexions visibles** — les cartes liées sont reliées par des fils animés (« amarres ») tracés à travers le tableau ; survoler une carte fait briller ses amarres tandis que les autres s'estompent
- **Colonne En attente** — une voie de stationnement délibérée pour le travail bloqué, aux côtés de To Do, Doing et Done
- **Filtrage et recherche puissants** — filtre par tag, concerne, priorité et date d'échéance (en retard, dû aujourd'hui, 7 prochains jours, sans date) ; recherche instantanée sur titres et descriptions avec correspondances surlignées. Les cartes en retard reçoivent un surlignage rouge, celles dues aujourd'hui un orange — le tableau t'avertit avant même que tu ne lises
- **Liens bidirectionnels** — relie des cartes entre elles ; les deux extrémités restent synchronisées automatiquement
- **Annuler / rétablir** — Ctrl+Z / Ctrl+Y (ou Ctrl+Shift+Z), par tableau et par session
- **Limites WIP** — configurables par colonne, avec avertissements visuels en cas de dépassement
- **Vue statistiques** — totaux, en retard, dus aujourd'hui, pourcentage d'accomplissement, répartition par priorité et diagramme en barres des cartes par colonne
- **Raccourcis clavier partout** — / pour chercher, n pour une nouvelle tâche, s pour les stats, ? pour l'aide, Ctrl+S pour exporter
- **Liens profonds** — partage un fragment d'URL comme index.html?detail-id=c42 pour ouvrir directement une carte précise
- **Glisser-déposer** — déplacement fluide des cartes entre et dans les colonnes, avec indicateur de dépôt ; les boutons fléchés sont une alternative tactile
- **Thème clair et sombre** — suit automatiquement la préférence de ton système

## Export et import

- **Ctrl+S** ou le bouton Exporter sauvegarde tous les tableaux en une fois dans un unique fichier JSON horodaté — des exports successifs ne s'écrasent jamais
- L'import accepte soit un lot complet, soit un export classique d'un seul tableau ; les imports arrivent toujours comme nouveaux tableaux, si bien que rien d'existant n'est jamais écrasé et qu'une seule entrée corrompue ne fait jamais couler le reste de la sauvegarde
- L'historique des changements de chaque carte voyage avec chaque carte exportée ou déplacée — ta piste d'audit survit au voyage
- Un lien profond mène à tout moment vers les cartes archivées — caché ne veut pas disparu

## 8 langues

Allemand, anglais, français, italien, polonais, espagnol, néerlandais et tchèque — détectés automatiquement depuis ton navigateur, changeables à tout moment, conservés localement. Même les abréviations des jours suivent la langue active.

## Protection de la vie privée par conception

- Pas de serveur, pas de télémétrie, pas d'analytics — Tagwerk n'envoie rien nulle part
- Stockage local uniquement — tes tableaux vivent dans le localStorage de ton navigateur, sur ton appareil
- Imports validés — les données importées sont nettoyées et vérifiées par schéma, pas aveuglément crues
- Zéro dépendance — quatre fichiers, du HTML/CSS/JS pur ; tu peux lire chaque ligne

## Pour commencer

Aucune installation. Aucune inscription. Aucun build.

- Télécharge ou clone ce dépôt
- Ouvre `index.html` dans un navigateur moderne
- Crée ta première carte

C'est tout. Tes données sont sur ton appareil — et nulle part ailleurs.

### Pile technique

| Couche | Technologie |
| --- | --- |
| Structure | HTML sémantique avec fenêtres modales `<dialog>` |
| Logique | JavaScript natif (ES6+) |
| Styles | CSS écrit à la main, propriétés personnalisées, `prefers-color-scheme` |
| Stockage | localStorage (par tableau, plus métadonnées des tableaux) |
| Dépendances | Aucune |

Fonctionne hors ligne, depuis un dossier local ou hébergé sur n'importe quel serveur de fichiers statiques (ex. GitHub Pages).

## Pas pour les équipes — et fier de l'être

Tagwerk est volontairement mono-utilisateur. Pas d'avatars, pas de mentions, pas de flux d'activité, pas de notifications en lutte pour ton attention. Si tu dois collaborer, utilise un outil d'équipe avec ton équipe. Quand il ne s'agit que de toi et de ton travail, Tagwerk te donne de la concentration — sans donner tes données.

> Livré avec JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — voir `fonts/OFL.txt`

Simple, local et à toi seul. Essaie Tagwerk dès aujourd'hui.
