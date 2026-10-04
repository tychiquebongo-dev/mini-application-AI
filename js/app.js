/**
 * ==============================================================================
 * CinéScope - Application Logic & State Management
 * Code JavaScript moderne ES6+, modulaire, accessible et performant.
 * ==============================================================================
 */

(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // État Global de l'Application
  // ----------------------------------------------------------------------------
  const state = {
    allMovies: typeof MOVIES_DATA !== 'undefined' ? MOVIES_DATA : [],
    activeGenre: 'Tous',
    searchQuery: '',
    sortBy: 'rating-desc',
    isWatchlistView: false,
    watchlist: [],
    activeModalMovie: null,
    isTrailerVisible: false
  };

  // Clé pour la persistance locale
  const STORAGE_KEY = 'cinescope_watchlist_v1';

  // ----------------------------------------------------------------------------
  // Éléments du DOM
  // ----------------------------------------------------------------------------
  const DOM = {
    // Navigation & Hero
    logoBtn: document.getElementById('logoBtn'),
    watchlistToggleBtn: document.getElementById('watchlistToggleBtn'),
    watchlistCount: document.getElementById('watchlistCount'),
    heroSection: document.getElementById('heroSection'),
    heroBackdrop: document.getElementById('heroBackdrop'),
    heroTitle: document.getElementById('heroTitle'),
    heroRating: document.getElementById('heroRating'),
    heroYear: document.getElementById('heroYear'),
    heroDuration: document.getElementById('heroDuration'),
    heroGenres: document.getElementById('heroGenres'),
    heroSynopsis: document.getElementById('heroSynopsis'),
    heroDetailsBtn: document.getElementById('heroDetailsBtn'),
    heroFavoriteBtn: document.getElementById('heroFavoriteBtn'),
    heroFavoriteBtnText: document.getElementById('heroFavoriteBtnText'),

    // Filtres & Recherche
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    sortSelect: document.getElementById('sortSelect'),
    genresBar: document.getElementById('genresBar'),
    resultsCount: document.getElementById('resultsCount'),
    activeFilterIndicator: document.getElementById('activeFilterIndicator'),
    moviesGrid: document.getElementById('moviesGrid'),

    // Modal
    movieModal: document.getElementById('movieModal'),
    modalContainer: document.getElementById('modalContainer'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalPoster: document.getElementById('modalPoster'),
    modalTagline: document.getElementById('modalTagline'),
    modalTitle: document.getElementById('modalTitle'),
    modalRating: document.getElementById('modalRating'),
    modalVotes: document.getElementById('modalVotes'),
    modalYear: document.getElementById('modalYear'),
    modalDuration: document.getElementById('modalDuration'),
    modalGenres: document.getElementById('modalGenres'),
    modalSynopsis: document.getElementById('modalSynopsis'),
    modalDirector: document.getElementById('modalDirector'),
    modalCast: document.getElementById('modalCast'),
    modalTrailerBtn: document.getElementById('modalTrailerBtn'),
    modalTrailerBtnText: document.getElementById('modalTrailerBtnText'),
    modalFavoriteBtn: document.getElementById('modalFavoriteBtn'),
    modalFavoriteBtnText: document.getElementById('modalFavoriteBtnText'),
    trailerContainer: document.getElementById('trailerContainer'),
    trailerIframeWrap: document.getElementById('trailerIframeWrap'),

    // Notifications & Pied de page
    toastContainer: document.getElementById('toastContainer'),
    footerWatchlistLink: document.getElementById('footerWatchlistLink')
  };

  // ----------------------------------------------------------------------------
  // Fonctions Utilitaires
  // ----------------------------------------------------------------------------

  /**
   * Fonction de temporisation (debounce) pour optimiser la frappe de recherche
   */
  function debounce(func, wait = 250) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Normalisation des chaînes pour une recherche insensible aux accents et à la casse
   */
  function normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Génération d'une affiche de secours élégante au format SVG
   */
  function createFallbackPoster(title) {
    const encodedTitle = encodeURIComponent(title || 'Film');
    return `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22450%22%20viewBox%3D%220%200%20300%20450%22%3E%3Crect%20fill%3D%22%23121929%22%20width%3D%22300%22%20height%3D%22450%22%2F%3E%3Cpath%20d%3D%22M130%20180%20l40%2025%20-40%2025%20z%22%20fill%3D%22%23f59e0b%22%2F%3E%3Ctext%20fill%3D%22%23f8fafc%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%22270%22%20text-anchor%3D%22middle%22%3E${encodedTitle}%3C%2Ftext%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20x%3D%2250%25%22%20y%3D%22300%22%20text-anchor%3D%22middle%22%3ECin%C3%A9Scope%3C%2Ftext%3E%3C%2Fsvg%3E`;
  }

  // ----------------------------------------------------------------------------
  // Gestion de la Persistance (LocalStorage)
  // ----------------------------------------------------------------------------

  function loadWatchlist() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.watchlist = JSON.parse(stored);
      } else {
        // Sélection par défaut pour une démo vivante immédiate
        state.watchlist = [1, 7];
        saveWatchlist();
      }
    } catch (e) {
      console.warn("Impossible d'accéder au localStorage :", e);
      state.watchlist = [1, 7];
    }
  }

  function saveWatchlist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.watchlist));
    } catch (e) {
      console.warn("Erreur de sauvegarde dans localStorage :", e);
    }
  }

  function updateWatchlistBadge() {
    if (DOM.watchlistCount) {
      DOM.watchlistCount.textContent = state.watchlist.length;
    }
  }

  function toggleWatchlist(movieId, movieTitle) {
    const id = Number(movieId);
    const index = state.watchlist.indexOf(id);
    let isAdded = false;

    if (index > -1) {
      state.watchlist.splice(index, 1);
      isAdded = false;
      showToast(`« ${movieTitle || 'Film'} » retiré de votre Watchlist`, 'toast-remove');
    } else {
      state.watchlist.push(id);
      isAdded = true;
      showToast(`« ${movieTitle || 'Film'} » ajouté à votre Watchlist ⭐`, 'toast-success');
    }

    saveWatchlist();
    updateWatchlistBadge();
    updateHeroFavoriteButton();
    updateModalFavoriteButton(id);

    // Si on est dans la vue Watchlist, rafraîchir la grille
    if (state.isWatchlistView) {
      renderMoviesGrid();
    } else {
      // Mettre à jour les boutons de carte individuellement sans re-render complet
      const cardBtns = document.querySelectorAll(`.card-favorite-btn[data-id="${id}"]`);
      cardBtns.forEach(btn => {
        if (isAdded) {
          btn.classList.add('favorited');
          btn.setAttribute('aria-label', 'Retirer des favoris');
        } else {
          btn.classList.remove('favorited');
          btn.setAttribute('aria-label', 'Ajouter aux favoris');
        }
      });
    }

    return isAdded;
  }

  // ----------------------------------------------------------------------------
  // Système de Notifications Toast
  // ----------------------------------------------------------------------------

  function showToast(message, type = '') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icône selon le type
    let iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
    `;
    if (type === 'toast-remove') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      <span aria-hidden="true">${iconSvg}</span>
      <span>${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // ----------------------------------------------------------------------------
  // Section Hero - Film Vedette
  // ----------------------------------------------------------------------------

  function setupHeroSection() {
    const featuredMovie = state.allMovies.find(m => m.featured) || state.allMovies[0];
    if (!featuredMovie) return;

    if (DOM.heroBackdrop) {
      DOM.heroBackdrop.src = featuredMovie.backdrop || featuredMovie.poster;
      DOM.heroBackdrop.alt = `Bannière pour ${featuredMovie.title}`;
      DOM.heroBackdrop.onerror = () => {
        DOM.heroBackdrop.src = featuredMovie.poster;
      };
    }

    if (DOM.heroTitle) DOM.heroTitle.textContent = featuredMovie.title;
    if (DOM.heroRating) DOM.heroRating.innerHTML = `⭐ ${featuredMovie.rating.toFixed(1)}`;
    if (DOM.heroYear) DOM.heroYear.textContent = featuredMovie.year;
    if (DOM.heroDuration) DOM.heroDuration.textContent = featuredMovie.duration;
    if (DOM.heroSynopsis) DOM.heroSynopsis.textContent = featuredMovie.synopsis;

    if (DOM.heroGenres) {
      DOM.heroGenres.innerHTML = featuredMovie.genres
        .slice(0, 2)
        .map(genre => `<span class="genre-pill">${genre}</span>`)
        .join('');
    }

    // Gestion du clic pour ouvrir la fiche
    if (DOM.heroDetailsBtn) {
      DOM.heroDetailsBtn.onclick = () => openMovieModal(featuredMovie.id);
    }

    // Bouton favori dans le hero
    if (DOM.heroFavoriteBtn) {
      DOM.heroFavoriteBtn.onclick = () => {
        toggleWatchlist(featuredMovie.id, featuredMovie.title);
      };
    }

    updateHeroFavoriteButton();
  }

  function updateHeroFavoriteButton() {
    const featuredMovie = state.allMovies.find(m => m.featured) || state.allMovies[0];
    if (!featuredMovie || !DOM.heroFavoriteBtn || !DOM.heroFavoriteBtnText) return;

    const isFav = state.watchlist.includes(featuredMovie.id);
    if (isFav) {
      DOM.heroFavoriteBtn.classList.add('active');
      DOM.heroFavoriteBtnText.textContent = 'Dans ma liste ✓';
      DOM.heroFavoriteBtn.style.borderColor = 'var(--accent-gold)';
      DOM.heroFavoriteBtn.style.color = 'var(--accent-gold)';
    } else {
      DOM.heroFavoriteBtn.classList.remove('active');
      DOM.heroFavoriteBtnText.textContent = 'Ajouter à ma liste';
      DOM.heroFavoriteBtn.style.borderColor = 'var(--border-subtle)';
      DOM.heroFavoriteBtn.style.color = 'var(--text-primary)';
    }
  }

  // ----------------------------------------------------------------------------
  // Filtres et Tri
  // ----------------------------------------------------------------------------

  function renderGenreFilters() {
    if (!DOM.genresBar) return;

    const genres = typeof AVAILABLE_GENRES !== 'undefined' 
      ? AVAILABLE_GENRES 
      : ['Tous', 'Action', 'Science-Fiction', 'Drame', 'Animation', 'Thriller', 'Comédie'];

    DOM.genresBar.innerHTML = genres
      .map(genre => {
        const isActive = state.activeGenre === genre && !state.isWatchlistView;
        return `
          <button 
            type="button" 
            class="genre-filter-btn ${isActive ? 'active' : ''}" 
            data-genre="${genre}"
            aria-pressed="${isActive}"
          >
            ${genre}
          </button>
        `;
      })
      .join('');

    // Écouteur par délégation d'événement
    DOM.genresBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.genre-filter-btn');
      if (!btn) return;

      const selectedGenre = btn.dataset.genre;
      state.activeGenre = selectedGenre;
      state.isWatchlistView = false;
      DOM.watchlistToggleBtn.classList.remove('active');

      // Mise à jour visuelle des boutons
      DOM.genresBar.querySelectorAll('.genre-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      renderMoviesGrid();
    });
  }

  function getFilteredAndSortedMovies() {
    let result = [...state.allMovies];

    // 1. Filtre par Watchlist si activé
    if (state.isWatchlistView) {
      result = result.filter(movie => state.watchlist.includes(movie.id));
    } else {
      // 2. Filtre par genre
      if (state.activeGenre !== 'Tous') {
        result = result.filter(movie => movie.genres.includes(state.activeGenre));
      }
    }

    // 3. Filtre par recherche textuelle (titre, réalisateur, casting, synopsis)
    if (state.searchQuery.trim() !== '') {
      const query = normalizeText(state.searchQuery);
      result = result.filter(movie => {
        const titleMatch = normalizeText(movie.title).includes(query);
        const origTitleMatch = normalizeText(movie.originalTitle).includes(query);
        const directorMatch = normalizeText(movie.director).includes(query);
        const castMatch = movie.cast.some(actor => normalizeText(actor).includes(query));
        const genreMatch = movie.genres.some(genre => normalizeText(genre).includes(query));

        return titleMatch || origTitleMatch || directorMatch || castMatch || genreMatch;
      });
    }

    // 4. Tri
    result.sort((a, b) => {
      switch (state.sortBy) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'title-asc':
          return a.title.localeCompare(b.title, 'fr');
        default:
          return b.rating - a.rating;
      }
    });

    return result;
  }

  // ----------------------------------------------------------------------------
  // Rendu de la Grille de Cartes
  // ----------------------------------------------------------------------------

  function renderMoviesGrid() {
    if (!DOM.moviesGrid) return;

    const filteredMovies = getFilteredAndSortedMovies();
    updateResultsInfo(filteredMovies.length);

    // Cas de l'état vide
    if (filteredMovies.length === 0) {
      if (state.isWatchlistView) {
        DOM.moviesGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2 class="empty-state-title">Votre Watchlist est vide</h2>
            <p class="empty-state-desc">Vous n'avez pas encore ajouté de films à votre liste de favoris. Explorez le catalogue et cliquez sur l'icône de marque-page pour sauvegarder vos coups de cœur !</p>
            <button type="button" class="btn btn-primary" id="emptyResetWatchlistBtn">
              Découvrir les films
            </button>
          </div>
        `;
        const resetBtn = document.getElementById('emptyResetWatchlistBtn');
        if (resetBtn) {
          resetBtn.onclick = () => {
            state.isWatchlistView = false;
            state.activeGenre = 'Tous';
            DOM.watchlistToggleBtn.classList.remove('active');
            renderGenreFilters();
            renderMoviesGrid();
          };
        }
      } else {
        DOM.moviesGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h2 class="empty-state-title">Aucun film trouvé</h2>
            <p class="empty-state-desc">Aucun titre ne correspond à votre recherche « <strong>${escapeHtml(state.searchQuery)}</strong> » dans la catégorie sélectionnée.</p>
            <button type="button" class="btn btn-primary" id="emptyResetFilterBtn">
              Réinitialiser les filtres
            </button>
          </div>
        `;
        const resetBtn = document.getElementById('emptyResetFilterBtn');
        if (resetBtn) {
          resetBtn.onclick = resetAllFilters;
        }
      }
      return;
    }

    // Rendu des cartes de films
    DOM.moviesGrid.innerHTML = filteredMovies.map(movie => createMovieCardHtml(movie)).join('');
  }

  function createMovieCardHtml(movie) {
    const isFavorited = state.watchlist.includes(movie.id);
    const fallbackSrc = createFallbackPoster(movie.title);

    return `
      <article 
        class="movie-card" 
        data-id="${movie.id}" 
        tabindex="0"
        role="button"
        aria-label="Voir la fiche détaillée de ${escapeHtml(movie.title)}"
      >
        <div class="card-poster-wrapper">
          <img 
            src="${movie.poster}" 
            alt="Affiche du film ${escapeHtml(movie.title)}" 
            class="card-poster" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackSrc}';"
          >
          <div class="card-overlay-gradient"></div>
          
          <div class="card-badges">
            <span class="card-rating ${movie.rating >= 8.7 ? 'high' : ''}" title="Note moyenne">
              ⭐ ${movie.rating.toFixed(1)}
            </span>
            <button 
              type="button" 
              class="card-favorite-btn ${isFavorited ? 'favorited' : ''}" 
              data-id="${movie.id}"
              data-title="${escapeHtml(movie.title)}"
              aria-label="${isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
              title="${isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="card-meta-line">
            <span class="card-year">${movie.year}</span>
            <span>•</span>
            <span class="card-duration">${movie.duration}</span>
          </div>

          <h3 class="card-title" title="${escapeHtml(movie.title)}">
            ${escapeHtml(movie.title)}
          </h3>

          <p class="card-synopsis">
            ${escapeHtml(movie.synopsis)}
          </p>

          <div class="card-genres">
            ${movie.genres.slice(0, 2).map(g => `<span class="card-genre-tag">${escapeHtml(g)}</span>`).join('')}
          </div>

          <div class="card-footer-btn" aria-hidden="true">
            Voir la fiche & bande-annonce →
          </div>
        </div>
      </article>
    `;
  }

  function updateResultsInfo(count) {
    if (!DOM.resultsCount) return;

    if (state.isWatchlistView) {
      DOM.resultsCount.innerHTML = `Affichage de votre <strong>Watchlist</strong> (${count} film${count > 1 ? 's' : ''})`;
      if (DOM.activeFilterIndicator) {
        DOM.activeFilterIndicator.textContent = 'Filtre : Mes Favoris';
      }
    } else {
      const genreLabel = state.activeGenre === 'Tous' ? 'tous genres' : `genre « ${state.activeGenre} »`;
      DOM.resultsCount.innerHTML = `<strong>${count}</strong> film${count > 1 ? 's trouvés' : ' trouvé'} (${genreLabel})`;
      if (DOM.activeFilterIndicator) {
        DOM.activeFilterIndicator.textContent = state.searchQuery ? `Recherche active : « ${state.searchQuery} »` : '';
      }
    }
  }

  function resetAllFilters() {
    state.searchQuery = '';
    state.activeGenre = 'Tous';
    state.sortBy = 'rating-desc';
    state.isWatchlistView = false;

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'none';
    if (DOM.sortSelect) DOM.sortSelect.value = 'rating-desc';
    if (DOM.watchlistToggleBtn) DOM.watchlistToggleBtn.classList.remove('active');

    renderGenreFilters();
    renderMoviesGrid();
  }

  // ----------------------------------------------------------------------------
  // Modal de Détails du Film & Bande-Annonce
  // ----------------------------------------------------------------------------

  function openMovieModal(movieId) {
    const movie = state.allMovies.find(m => m.id === Number(movieId));
    if (!movie) return;

    state.activeModalMovie = movie;
    state.isTrailerVisible = false;

    // Remplissage des données
    const fallbackSrc = createFallbackPoster(movie.title);

    if (DOM.modalBackdrop) {
      DOM.modalBackdrop.src = movie.backdrop || movie.poster;
      DOM.modalBackdrop.alt = `Bannière de ${movie.title}`;
      DOM.modalBackdrop.onerror = () => { DOM.modalBackdrop.src = movie.poster; };
    }

    if (DOM.modalPoster) {
      DOM.modalPoster.src = movie.poster;
      DOM.modalPoster.alt = `Affiche de ${movie.title}`;
      DOM.modalPoster.onerror = () => { DOM.modalPoster.src = fallbackSrc; };
    }

    if (DOM.modalTagline) DOM.modalTagline.textContent = movie.tagline || '';
    if (DOM.modalTitle) DOM.modalTitle.textContent = movie.title;
    if (DOM.modalRating) DOM.modalRating.innerHTML = `⭐ ${movie.rating.toFixed(1)}`;
    if (DOM.modalVotes) DOM.modalVotes.textContent = `(${movie.votesCount} votes)`;
    if (DOM.modalYear) DOM.modalYear.textContent = movie.year;
    if (DOM.modalDuration) DOM.modalDuration.textContent = movie.duration;
    if (DOM.modalSynopsis) DOM.modalSynopsis.textContent = movie.synopsis;
    if (DOM.modalDirector) DOM.modalDirector.textContent = movie.director;
    if (DOM.modalCast) DOM.modalCast.textContent = movie.cast.join(', ');

    if (DOM.modalGenres) {
      DOM.modalGenres.innerHTML = movie.genres.map(g => `<span>${escapeHtml(g)}</span>`).join('');
    }

    // Réinitialisation du conteneur de bande-annonce
    if (DOM.trailerContainer && DOM.trailerIframeWrap) {
      DOM.trailerContainer.classList.remove('visible');
      DOM.trailerIframeWrap.innerHTML = '';
      if (DOM.modalTrailerBtnText) {
        DOM.modalTrailerBtnText.textContent = 'Voir la bande-annonce';
      }
    }

    updateModalFavoriteButton(movie.id);

    // Affichage de la modal avec accessibilité
    DOM.movieModal.classList.add('open');
    DOM.movieModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus sur le bouton de fermeture pour accessibilité clavier
    setTimeout(() => {
      DOM.modalCloseBtn.focus();
    }, 100);
  }

  function closeMovieModal() {
    if (!DOM.movieModal) return;

    DOM.movieModal.classList.remove('open');
    DOM.movieModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Arrêt immédiat de la vidéo YouTube si elle était en cours de lecture
    if (DOM.trailerIframeWrap) {
      DOM.trailerIframeWrap.innerHTML = '';
    }
    if (DOM.trailerContainer) {
      DOM.trailerContainer.classList.remove('visible');
    }
    state.isTrailerVisible = false;
    state.activeModalMovie = null;
  }

  function toggleTrailer() {
    if (!state.activeModalMovie || !DOM.trailerContainer || !DOM.trailerIframeWrap) return;

    state.isTrailerVisible = !state.isTrailerVisible;

    if (state.isTrailerVisible) {
      const youtubeId = state.activeModalMovie.trailerYoutubeId;
      DOM.trailerIframeWrap.innerHTML = `
        <iframe 
          src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1" 
          title="Bande-annonce officielle de ${escapeHtml(state.activeModalMovie.title)}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      `;
      DOM.trailerContainer.classList.add('visible');
      if (DOM.modalTrailerBtnText) DOM.modalTrailerBtnText.textContent = 'Masquer la bande-annonce';
      DOM.trailerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      DOM.trailerIframeWrap.innerHTML = '';
      DOM.trailerContainer.classList.remove('visible');
      if (DOM.modalTrailerBtnText) DOM.modalTrailerBtnText.textContent = 'Voir la bande-annonce';
    }
  }

  function updateModalFavoriteButton(movieId) {
    if (!DOM.modalFavoriteBtn || !DOM.modalFavoriteBtnText) return;

    const isFav = state.watchlist.includes(movieId);
    if (isFav) {
      DOM.modalFavoriteBtn.classList.add('active');
      DOM.modalFavoriteBtnText.textContent = 'Dans ma Watchlist ✓';
      DOM.modalFavoriteBtn.style.background = 'rgba(229, 9, 20, 0.15)';
      DOM.modalFavoriteBtn.style.borderColor = 'var(--accent-red)';
      DOM.modalFavoriteBtn.style.color = 'var(--accent-red)';
    } else {
      DOM.modalFavoriteBtn.classList.remove('active');
      DOM.modalFavoriteBtnText.textContent = 'Ajouter à ma Watchlist';
      DOM.modalFavoriteBtn.style.background = 'rgba(255, 255, 255, 0.08)';
      DOM.modalFavoriteBtn.style.borderColor = 'var(--border-subtle)';
      DOM.modalFavoriteBtn.style.color = 'var(--text-primary)';
    }
  }

  // ----------------------------------------------------------------------------
  // Échappement HTML préventif pour sécurité XSS
  // ----------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ----------------------------------------------------------------------------
  // Initialisation et Gestion des Événements
  // ----------------------------------------------------------------------------

  function bindEvents() {
    // 1. Recherche avec debounce
    const handleSearchInput = debounce((e) => {
      state.searchQuery = e.target.value;
      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
      }
      renderMoviesGrid();
    }, 200);

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', handleSearchInput);
    }

    // Effacer la recherche
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener('click', () => {
        if (DOM.searchInput) {
          DOM.searchInput.value = '';
          state.searchQuery = '';
          DOM.searchClearBtn.style.display = 'none';
          DOM.searchInput.focus();
          renderMoviesGrid();
        }
      });
    }

    // Raccourci clavier "/" pour focaliser la recherche
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== DOM.searchInput && !DOM.movieModal.classList.contains('open')) {
        e.preventDefault();
        DOM.searchInput.focus();
      }
      // Fermeture par la touche Échap
      if (e.key === 'Escape' && DOM.movieModal.classList.contains('open')) {
        closeMovieModal();
      }
    });

    // 2. Sélecteur de tri
    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderMoviesGrid();
      });
    }

    // 3. Bascule Vue Watchlist dans le Header
    if (DOM.watchlistToggleBtn) {
      DOM.watchlistToggleBtn.addEventListener('click', () => {
        state.isWatchlistView = !state.isWatchlistView;
        DOM.watchlistToggleBtn.classList.toggle('active', state.isWatchlistView);

        // Désélectionner les boutons de genres
        if (DOM.genresBar) {
          DOM.genresBar.querySelectorAll('.genre-filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
        }

        renderMoviesGrid();
        
        // Défilement doux vers la grille
        DOM.moviesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Lien Watchlist dans le footer
    if (DOM.footerWatchlistLink) {
      DOM.footerWatchlistLink.addEventListener('click', (e) => {
        e.preventDefault();
        state.isWatchlistView = true;
        if (DOM.watchlistToggleBtn) DOM.watchlistToggleBtn.classList.add('active');
        renderMoviesGrid();
        DOM.moviesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // 4. Logo clique => réinitialisation à l'accueil
    if (DOM.logoBtn) {
      DOM.logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetAllFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 5. Clics dans la grille par délégation d'événement
    if (DOM.moviesGrid) {
      DOM.moviesGrid.addEventListener('click', (e) => {
        // Clic sur le bouton favori
        const favBtn = e.target.closest('.card-favorite-btn');
        if (favBtn) {
          e.stopPropagation();
          const movieId = favBtn.dataset.id;
          const movieTitle = favBtn.dataset.title;
          toggleWatchlist(movieId, movieTitle);
          return;
        }

        // Clic sur la carte entière pour ouvrir le modal
        const card = e.target.closest('.movie-card');
        if (card) {
          const movieId = card.dataset.id;
          openMovieModal(movieId);
        }
      });

      // Accessibilité clavier (touche Entrée sur carte)
      DOM.moviesGrid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const card = e.target.closest('.movie-card');
          if (card && !e.target.closest('.card-favorite-btn')) {
            openMovieModal(card.dataset.id);
          }
        }
      });
    }

    // 6. Événements du Modal
    if (DOM.modalCloseBtn) {
      DOM.modalCloseBtn.addEventListener('click', closeMovieModal);
    }

    if (DOM.movieModal) {
      DOM.movieModal.addEventListener('click', (e) => {
        if (e.target === DOM.movieModal) {
          closeMovieModal();
        }
      });
    }

    if (DOM.modalTrailerBtn) {
      DOM.modalTrailerBtn.addEventListener('click', toggleTrailer);
    }

    if (DOM.modalFavoriteBtn) {
      DOM.modalFavoriteBtn.addEventListener('click', () => {
        if (state.activeModalMovie) {
          toggleWatchlist(state.activeModalMovie.id, state.activeModalMovie.title);
        }
      });
    }
  }

  // ----------------------------------------------------------------------------
  // Démarrage de l'Application
  // ----------------------------------------------------------------------------
  function init() {
    loadWatchlist();
    updateWatchlistBadge();
    setupHeroSection();
    renderGenreFilters();
    renderMoviesGrid();
    bindEvents();
    console.log('🎬 CinéScope initialisé avec succès !');
  }

  // Lancement dès que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
