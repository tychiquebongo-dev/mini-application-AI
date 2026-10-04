# Spécification Fonctionnelle & Technique — CinéScope

## 1. Présentation générale

**CinéScope** est une mini-application web interactive et responsive dédiée à la découverte, à l'exploration et à l'organisation de films incontournables du 7ᵉ art. Conçue comme un produit moderne à l'esthétique soignée (dans la lignée des plateformes de streaming premium comme Apple TV+ et Netflix), CinéScope propose une interface cinématique sombre, des cartes interactives riches en métadonnées, une recherche instantanée multicritère, une modal immersive avec lecteur de bande-annonce et une gestion locale de Watchlist personnalisée.

---

## 2. Problématique

Face à la profusion de contenus cinématographiques sur les plateformes numériques, les utilisateurs rencontrent souvent le syndrome de la « fatigue décisionnelle » :
- Difficulté à trouver rapidement un film de qualité sans être submergé d'interfaces encombrées.
- Absence d'outils légers, sans inscription ni publicité, permettant de consulter un synopsis, une note critique fiable et une bande-annonce en un seul clic.
- Manque de solutions simples pour mémoriser instantanément les films que l'on souhaite visionner plus tard.

**CinéScope** résout cette problématique en proposant un catalogue sélectionné avec soin, une navigation ultra-fluide, une recherche instantanée et une liste de favoris autonome sauvegardée localement dans le navigateur.

---

## 3. Objectifs

### 3.1. Objectif principal
Concevoir, architecturer et déployer une application web monopage (SPA) autonome, esthétiquement saisissante, 100% responsive et prête pour un hébergement gratuit sur **GitHub Pages**.

### 3.2. Objectifs secondaires
- Démontrer une maîtrise avancée du développement frontend moderne sans dépendances superflues.
- Offrir une expérience utilisateur (UX) fluide : recherche en temps réel optimisée (debounce), micro-interactions tactiles et notifications contextuelles (toasts).
- Garantir une persistance locale fiable grâce à l'API `localStorage`.
- Respecter les standards d'accessibilité (WCAG 2.1 AA) et de sémantique HTML5.
- Fournir une documentation technique et utilisateur exemplaire prête pour des évaluateurs ou recruteurs.

---

## 4. Utilisateurs cibles

1. **Cinéphiles et spectateurs réguliers** : personnes cherchant une recommandation rapide, bien documentée, avec affiches haute résolution et bandes-annonces intégrées.
2. **Utilisateurs mobiles et nomades** : personnes consultant des fiches de films depuis leur smartphone ou tablette avec des temps de chargement instantanés.
3. **Recruteurs et évaluateurs techniques** : professionnels évaluant la qualité du code, l'ergonomie, la structure Git et la capacité à livrer un projet web complet et fonctionnel.

---

## 5. Fonctionnalités du MVP

| Module | Fonctionnalité | Description |
| :--- | :--- | :--- |
| **Catalogue** | Affichage en grille responsive | Présentation des films sous forme de cartes élégantes avec affiches haute définition, badges de notes et tags de genres. |
| **Hero Banner** | Film à l'affiche | Bannière cinématographique dynamique mettant en avant le coup de cœur de la rédaction avec accès direct à la fiche. |
| **Recherche** | Recherche en direct avec debounce | Recherche instantanée sur le titre, le titre original, le réalisateur, les acteurs et le synopsis (raccourci clavier `/`). |
| **Filtres** | Filtres par genre | Filtrage rapide par catégorie (Action, Drame, Science-Fiction, Animation, Thriller, etc.). |
| **Tri** | Sélecteur de tri multicritère | Tri par note décroissante, année la plus récente, année la plus ancienne ou ordre alphabétique. |
| **Fiche détaillée** | Modal immersive | Fenêtre modale avec grand backdrop, affiche, synopsis complet, casting, réalisateur et métadonnées. |
| **Bande-annonce** | Lecteur vidéo intégré | Intégration à la demande d'un lecteur YouTube sans publicité (`youtube-nocookie.com`) pour préserver les performances. |
| **Watchlist** | Gestion des favoris | Ajout/suppression de films en un clic (sur carte, hero ou modal) avec compteur dynamique dans l'en-tête. |
| **Persistance** | Sauvegarde `localStorage` | Conservation de la Watchlist même après rechargement ou fermeture du navigateur. |
| **Notifications** | Système de Toasts | Alertes visuelles non intrusives confirmant chaque action (ajout/retrait de la Watchlist). |
| **Gestion d'état** | États vides & Fallbacks | Affichage soigné en l'absence de résultat ou lorsque la Watchlist est vide ; images SVG de secours en cas de problème réseau. |

---

## 6. Contraintes techniques

- **Technologies de base** : HTML5 sémantique, CSS3 moderne (Variables CSS, Flexbox, CSS Grid), JavaScript natif (ES6+ modulaire).
- **Zéro dépendance lourde** : Aucun framework lourd (React, Angular, Vue) n'est imposé, ce qui garantit un temps de chargement immédiat (< 1 seconde) et une maintenabilité maximale.
- **Hébergement & Déploiement** : Compatibilité totale avec **GitHub Pages** (fichiers statiques, chemins relatifs stricts, protocole HTTPS natif).
- **Compatibilité navigateurs** : Support des dernières versions de Chrome, Firefox, Safari, Edge et des navigateurs mobiles (iOS Safari, Android Chrome).
- **Stockage client** : Utilisation exclusive de l'API standard `window.localStorage` avec gestion des exceptions (`try/catch`).

---

## 7. UX / UI Design

### 7.1. Direction artistique
- **Ambiance cinématique sombre** : Arrière-plans profonds (`#07090e`, `#121929`) limitant la fatigue oculaire et valorisant les couleurs des affiches.
- **Glassmorphism** : Effet de verre dépoli (`backdrop-filter: blur(...)`) sur l'en-tête, les boutons et les cartes pour un rendu résolument moderne.
- **Palette d'accents** : Doré/Ambre (`#f59e0b`) évoquant les récompenses cinématographiques et les étoiles de notation, complété par un rouge carmin (`#e50914`) pour les favoris.
- **Typographie** : Combinaison de **Outfit** (titres audacieux et identitaires) et de **Plus Jakarta Sans** (lecture fluide du synopsis et des métadonnées).

### 7.2. Ergonomie & Micro-interactions
- Cartes surélevées avec lueur ambrée au survol (`transform: translateY(-8px)`).
- Raccourci clavier universel (`/`) pour accéder instantanément à la barre de recherche.
- Fermeture intuitive de la modal via la touche `Échap`, le bouton dédié ou un clic en dehors du conteneur.
- Défilement fluide vers les sections cibles lors de la sélection des favoris.

---

## 8. Critères de réussite

Le projet est validé et considéré comme achevé dès lors que :
1. ✅ L'application fonctionne sans aucune erreur dans la console JavaScript.
2. ✅ Le responsive design est impeccable sur smartphone (375px+), tablette (768px+) et grand écran (1200px+).
3. ✅ Toutes les fonctionnalités du MVP (recherche, filtres, tri, modal, bande-annonce, Watchlist) sont 100% opérationnelles.
4. ✅ La Watchlist conserve ses éléments après actualisation de la page (`F5`).
5. ✅ Le dépôt Git contient un historique propre et un code rigoureusement formaté.
6. ✅ Le site est déployé avec succès sur GitHub Pages et accessible publiquement via une URL HTTPS.
7. ✅ La documentation (`README.md` et `SPECIFICATION.md`) est exhaustive et professionnelle.
