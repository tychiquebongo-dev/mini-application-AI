# 🎬 CinéScope — Exploration & Découverte Cinématographique

[![Web App](https://img.shields.io/badge/Application-Web%20Moderne-f59e0b?style=for-the-badge&logo=html5&logoColor=white)](https://github.com)
[![Licence](https://img.shields.io/badge/Licence-MIT-blue?style=for-the-badge)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/D%C3%A9ploiement-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://pages.github.com/)
[![Code Quality](https://img.shields.io/badge/Code-Clean%20%26%20Accessible-6366f1?style=for-the-badge)](SPECIFICATION.md)

> **CinéScope** est une mini-application web moderne, responsive et fluide conçue pour découvrir des chefs-d'œuvre du cinéma, consulter leurs métadonnées détaillées, visionner leurs bandes-annonces et gérer une Watchlist personnalisée sauvegardée localement.

---

## 📌 Sommaire

1. [Présentation du projet](#-présentation-du-projet)
2. [Contexte et Objectifs](#-contexte-et-objectifs)
3. [Fonctionnalités Clés](#-fonctionnalités-clés)
4. [Technologies Utilisées](#-technologies-utilisées)
5. [Structure du Projet](#-structure-du-projet)
6. [Instructions d'Installation Locale](#-instructions-dinstallation-locale)
7. [Guide d'Utilisation](#-guide-dutilisation)
8. [Déploiement sur GitHub Pages (Étape par étape)](#-déploiement-sur-github-pages)
9. [Lien de Démonstration en Ligne](#-lien-de-démonstration-en-ligne)
10. [Améliorations Futures](#-améliorations-futures)

---

## 🌟 Présentation du projet

Développée dans l’esprit des plateformes de streaming contemporaines (Apple TV+, Netflix), **CinéScope** propose une interface sombre cinématique haute définition associant :
- Des **cartes de films interactives** présentant note, durée, année, affiche et tags de genre.
- Un **film vedette en bannière Hero** avec présentation dynamique du coup de cœur de la rédaction.
- Une **modal immersive** intégrant le synopsis complet, les crédits (réalisateur, casting) et la bande-annonce officielle.
- Une **gestion de Watchlist (favoris)** persistée localement via l'API `localStorage`.
- Un **design 100% responsive** adapté aux smartphones, tablettes et ordinateurs de bureau.

---

## 🎯 Contexte et Objectifs

Ce projet a été réalisé dans le cadre de la démonstration de compétences en **ingénierie logicielle frontend assistée par l'intelligence artificielle**.

### Objectifs atteints :
- **Excellence UX/UI** : Thème sombre cinématique, glassmorphism, micro-animations et retours visuels instantanés (toasts).
- **Zéro dépendance superflue** : Architecture légère en JavaScript moderne (ES6+), sans framework lourd afin de maximiser la rapidité et la longévité du code.
- **Fiabilité absolue** : Déploiement statique instantané sur **GitHub Pages**, sans risque de blocage CORS ni d'expiration de clés API.
- **Accessibilité & Sémantique** : Respect des balises HTML5 (`header`, `main`, `article`, `dialog`), gestion du focus clavier et attributs ARIA.

---

## ⚡ Fonctionnalités Clés

* 🔍 **Recherche en temps réel** : Recherche instantanée par titre, réalisateur ou acteur avec temporisation (*debounce*) pour des performances optimales.
* ⌨️ **Raccourci clavier rapide** : Appuyez sur `/` depuis n'importe où pour activer instantanément la barre de recherche.
* 🏷️ **Filtres par genre** : Basculez entre Science-Fiction, Action, Drame, Animation, Thriller, Comédie, etc.
* 📊 **Tri multicritère** : Classez les films par meilleures notes, plus récents, plus anciens ou par ordre alphabétique.
* 📑 **Fiche détaillée (Modal)** : Consultez le synopsis complet, le réalisateur, la distribution et les notes critiques.
* 🎥 **Lecteur de bande-annonce** : Visionnez le trailer officiel YouTube directement dans la modal en mode éco-performant.
* 💖 **Ma Watchlist (Favoris)** : Ajoutez vos films favoris en un clic depuis les cartes, la bannière ou la modal. Les données sont conservées même après actualisation (`localStorage`).
* 🔔 **Système de Toasts** : Notifications visuelles élégantes confirmant l'ajout ou le retrait d'un film.
* 🛡️ **Gestion d'erreurs et images de secours** : Fallbacks SVG automatiques si une ressource réseau venait à manquer.

---

## 🛠️ Technologies Utilisées

| Domaine | Technologie | Rôle |
| :--- | :--- | :--- |
| **Structure** | **HTML5 Sémantique** | Balisage accessible, balises meta SEO et OpenGraph |
| **Style & Design** | **CSS3 Moderne** | Custom properties (variables), Grid, Flexbox, Glassmorphism, animations |
| **Typographie** | **Google Fonts** | Polices *Outfit* (titres cinématographiques) et *Plus Jakarta Sans* |
| **Logique Métier** | **JavaScript ES6+** | Gestion d'état réactive, debounce, délégation d'événements, modal |
| **Persistance** | **Web Storage API** | Sauvegarde locale de la Watchlist (`localStorage`) |
| **Lecteur Vidéo** | **YouTube Embed API** | Intégration respectueuse de la vie privée (`youtube-nocookie.com`) |
| **Versionnement** | **Git & GitHub** | Gestion de versions et hébergement du code source |
| **Hébergement** | **GitHub Pages** | Déploiement continu et distribution HTTPS gratuite |

---

## 📁 Structure du Projet

L'architecture du projet respecte les meilleures pratiques de développement frontend :

```text
mini-application AI/
│
├── index.html            # Point d'entrée principal & balisage sémantique
├── README.md             # Documentation complète du projet
├── SPECIFICATION.md      # Spécification fonctionnelle et technique
├── .gitignore            # Fichiers et dossiers à exclure du versionnement
│
├── css/
│   └── style.css         # Design system, variables CSS, layout et composants
│
└── js/
    ├── movies-data.js    # Base de données locale de films (métadonnées, affiches, trailers)
    └── app.js            # Logique applicative, gestion d'état, événements et persistance
```

---

## 💻 Instructions d'Installation Locale

Aucun gestionnaire de paquets lourd (npm/yarn) n'est obligatoire pour faire tourner l'application.

### Méthode 1 : Ouverture directe (Recommandée & Rapide)
1. Téléchargez ou clonez le dépôt sur votre ordinateur.
2. Double-cliquez directement sur le fichier `index.html` pour l'ouvrir dans votre navigateur web préféré (Chrome, Edge, Firefox, Safari).

### Méthode 2 : Avec un serveur local (Live Server ou Python)
Pour une expérience de développement optimale :

**Avec VS Code / Antigravity :**
- Installez l'extension **Live Server**, puis cliquez sur *Go Live* en bas à droite.

**Avec Python 3 :**
```bash
# Dans le dossier du projet
python -m http.server 8000
```
Ouvrez ensuite `http://localhost:8000` dans votre navigateur.

---

## 🎮 Guide d'Utilisation

1. **Explorer le catalogue** : Faites défiler la page pour découvrir les films sous forme de cartes.
2. **Rechercher un film** :
   - Tapez du texte dans la barre de recherche (ex: *Nolan*, *Dune*, *Zendaya*).
   - Utilisez le raccourci `/` pour y accéder rapidement.
3. **Filtrer par genre** : Cliquez sur les pilules de genres (*Science-Fiction*, *Action*, *Animation*...).
4. **Trier les résultats** : Utilisez la liste déroulante (*Meilleures notes*, *Plus récents*...).
5. **Consulter la fiche détaillée** : Cliquez sur une carte de film pour ouvrir la modal.
6. **Regarder la bande-annonce** : Dans la modal, cliquez sur « *Voir la bande-annonce* ».
7. **Gérer votre Watchlist** :
   - Cliquez sur l'icône marque-page d'une carte ou sur « *Ajouter à ma liste* ».
   - Cliquez sur « *Ma Watchlist* » dans la barre supérieure pour filtrer uniquement vos films enregistrés.

---

## 🚀 Déploiement sur GitHub Pages

Suivez ces étapes simples pour publier votre projet en ligne en moins de 3 minutes :

### Étape 1 : Créer le dépôt sur GitHub
1. Connectez-vous sur [GitHub](https://github.com).
2. Cliquez sur le bouton vert **New** (Nouveau dépôt).
3. Nommez le dépôt (par exemple `cinescope` ou `mini-application-cinema`).
4. Choisissez la visibilité **Public**.
5. Ne cochez pas « Add a README file » (le projet en contient déjà un).
6. Cliquez sur **Create repository**.

### Étape 2 : Initialiser Git et pousser le code local
Dans votre terminal (PowerShell ou Bash), positionnez-vous dans le dossier du projet :

```bash
# 1. Initialiser le dépôt Git local
git init

# 2. Ajouter tous les fichiers du projet
git add .

# 3. Effectuer le premier commit
git commit -m "feat: initial release of CinéScope web app"

# 4. Définir la branche principale
git branch -M main

# 5. Connecter votre dépôt GitHub distant (remplacez par votre URL)
git remote add origin https://github.com/VOTRE_PSEUDO/cinescope.git

# 6. Pousser le code sur GitHub
git push -u origin main
```

### Étape 3 : Activer GitHub Pages
1. Rendez-vous sur votre dépôt GitHub.
2. Allez dans l'onglet **Settings** (Paramètres) en haut à droite.
3. Dans le menu de gauche, cliquez sur la rubrique **Pages** (dans la section *Code and automation*).
4. Sous la section **Build and deployment** :
   - Source : sélectionnez **Deploy from a branch**.
   - Branch : sélectionnez **main** et le dossier `/(root)`.
5. Cliquez sur **Save**.

### Étape 4 : Accéder à l'application en ligne
Après environ 1 à 2 minutes, GitHub Pages affiche l'URL publique de votre application :
`https://VOTRE_PSEUDO.github.io/cinescope/`

---

## 🌐 Liens du Projet

* **Dépôt GitHub :** `https://github.com/VOTRE_PSEUDO/cinescope` *(À compléter avec votre URL)*
* **Démonstration en ligne (GitHub Pages) :** `https://VOTRE_PSEUDO.github.io/cinescope/` *(À compléter)*

---

## 🔮 Améliorations Futures

* 🌐 **Connecteur API TMDB en direct** : Option pour basculer vers une recherche en direct sur des millions de films via la clé d'API The Movie Database.
* 🌓 **Mode d'affichage personnalisable** : Vue en grille compacte ou vue en liste détaillée.
* 💾 **Export / Import de la Watchlist** : Sauvegarde et transfert de ses favoris au format JSON.
* 🗣️ **Critiques utilisateurs** : Possibilité d'attribuer une note personnelle et de rédiger un avis mémorisé en local.
* 📱 **PWA (Progressive Web App)** : Ajout d'un Web Manifest et d'un Service Worker pour une installation native sur smartphone et fonctionnement 100% hors-ligne.

---

## 📄 Licence

Ce projet est distribué sous la licence libre **MIT**. Vous êtes libre de l'utiliser, le modifier et l'adapter pour vos propres besoins.
