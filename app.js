(() => {
  const CONFIG = window.GG_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $("[data-menu-toggle]");
  const navLinks = $("[data-nav-links]");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Home page: fetch the show summary from TVmaze.
  const showPanel = $("[data-show-summary]");
  if (showPanel) {
    fetchShow().then(show => {
      const summary = stripHtml(show.summary || "A world of secrets, style, and scandal.");
      const img = show.image?.original || show.image?.medium;
      showPanel.innerHTML = `
        ${img ? `<img class="show-poster" src="${escapeAttr(img)}" alt="${escapeAttr(show.name)} poster" loading="lazy">` : ""}
        <div><p class="eyebrow">FROM THE TVMAZE ARCHIVE</p><h2>${escapeHtml(show.name)}</h2>
        <p>${escapeHtml(summary)}</p><p class="meta-line">${escapeHtml(show.premiered || "")} · ${escapeHtml(show.status || "")}</p></div>`;
    }).catch(() => {
      showPanel.innerHTML = `<p class="api-note">The show archive is unavailable right now. The rest of the site still works.</p>`;
    });
  }

  // TVmaze: dynamic cast and episode data.
  const charactersGrid = $("[data-characters-grid]");
  if (charactersGrid) loadCharacters(charactersGrid);
  const episodesGrid = $("[data-episodes-grid]");
  if (episodesGrid) loadEpisodes(episodesGrid);
  const characterSearch = $("[data-character-search]");
  if (characterSearch && charactersGrid) {
    characterSearch.addEventListener("input", () => {
      const query = characterSearch.value.trim().toLowerCase();
      $$("[data-searchable-card]", charactersGrid).forEach(card => {
        card.hidden = !card.dataset.searchableCard.includes(query);
      });
    });
  }

  // GIPHY: reaction GIF search on Gossip page.
  const gifForm = $("[data-gif-form]");
  if (gifForm) {
    const gifResults = $("[data-gif-results]");
    const gifStatus = $("[data-gif-status]");
    const gifInput = $("[name='gif-query']", gifForm);
    gifForm.addEventListener("submit", async event => {
      event.preventDefault();
      const query = gifInput.value.trim();
      if (!query) return;
      if (!CONFIG.giphyApiKey || CONFIG.giphyApiKey.includes("PASTE_")) {
        gifStatus.textContent = "GIPHY setup needed: add your API key in js/config.js. Your other site features work normally.";
        gifStatus.className = "status status-warning";
        return;
      }
      gifStatus.textContent = "Searching for the tea...";
      gifStatus.className = "status";
      gifResults.innerHTML = "";
      try {
        const url = new URL("https://api.giphy.com/v1/gifs/search");
        url.search = new URLSearchParams({ api_key: CONFIG.giphyApiKey, q: query, limit: "12", rating: "pg-13", lang: "en" });
        const response = await fetch(url);
        if (!response.ok) throw new Error("GIPHY request failed");
        const payload = await response.json();
        if (!payload.data?.length) {
          gifStatus.textContent = "No GIFs found. Try another search.";
          gifStatus.className = "status status-warning";
          return;
        }
        gifStatus.textContent = `${payload.data.length} reactions found.`;
        gifStatus.className = "status status-success";
        gifResults.innerHTML = payload.data.map(gif => {
          const img = gif.images?.fixed_width?.url || gif.images?.downsized_medium?.url;
          const title = gif.title || "Gossip Girl reaction GIF";
          return `<a class="gif-card" href="${escapeAttr(gif.url || "https://giphy.com/")}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeAttr(title)} on GIPHY"><img src="${escapeAttr(img || "")}" alt="${escapeAttr(title)}" loading="lazy"><span>${escapeHtml(title)}</span></a>`;
        }).join("");
      } catch (error) {
        console.error(error);
        gifStatus.textContent = "GIPHY couldn't load right now. Check the API key and try again.";
        gifStatus.className = "status status-error";
      }
    });
  }

  // TMDB optional gallery; falls back to TVmaze show images if no TMDB key is configured.
  const gallery = $("[data-gallery-grid]");
  if (gallery) loadGallery(gallery);

  // EmailJS contact form.
  const contactForm = $("[data-gossip-form]");
  if (contactForm) setupContactForm(contactForm);

  // Local-only favorite button; persists in this browser.
  $$('[data-favorite]').forEach(button => {
    const key = `gg-favorite-${button.dataset.favorite}`;
    const update = () => {
      const favorite = localStorage.getItem(key) === "true";
      button.classList.toggle("is-favorite", favorite);
      button.setAttribute("aria-pressed", String(favorite));
      button.textContent = favorite ? "♥ FAVOURITE" : "♡ ADD TO FAVOURITES";
    };
    update();
    button.addEventListener("click", () => {
      localStorage.setItem(key, String(localStorage.getItem(key) !== "true"));
      update();
    });
  });

  async function fetchShow() {
    const response = await fetch("https://api.tvmaze.com/singlesearch/shows?q=gossip-girl");
    if (!response.ok) throw new Error("TVmaze unavailable");
    return response.json();
  }

  async function loadCharacters(container) {
    container.innerHTML = loadingCards("Fetching the Upper East Side cast...");
    try {
      const show = await fetchShow();
      const response = await fetch(`https://api.tvmaze.com/shows/${show.id}/cast`);
      if (!response.ok) throw new Error("Cast unavailable");
      const cast = await response.json();
      const filtered = cast.filter(item => item.character && item.person).slice(0, 24);
      container.innerHTML = filtered.map(item => {
        const actor = item.person.name || "Unknown actor";
        const character = item.character.name || "Unknown character";
        const img = item.character.image?.medium || item.person.image?.medium;
        return `<article class="character-card" data-searchable-card="${escapeAttr((character + " " + actor).toLowerCase())}">
          ${img ? `<img src="${escapeAttr(img)}" alt="${escapeAttr(character)}" loading="lazy">` : `<div class="image-placeholder">GG</div>`}
          <div class="card-body"><p class="eyebrow">CHARACTER</p><h3>${escapeHtml(character)}</h3><p class="muted">Portrayed by ${escapeHtml(actor)}</p></div></article>`;
      }).join("");
    } catch (error) {
      console.error(error);
      container.innerHTML = `<p class="status status-error">Couldn't load the cast. Please refresh to try again.</p>`;
    }
  }

  async function loadEpisodes(container) {
    container.innerHTML = loadingCards("Opening the episode archive...");
    try {
      const show = await fetchShow();
      const response = await fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`);
      if (!response.ok) throw new Error("Episodes unavailable");
      const episodes = await response.json();
      container.innerHTML = episodes.filter(ep => ep.name).slice(0, 18).map(ep => `
        <article class="episode-card"><div class="episode-number">S${String(ep.season).padStart(2,"0")} · E${String(ep.number || 0).padStart(2,"0")}</div>
        <h3>${escapeHtml(ep.name)}</h3><p class="muted">${escapeHtml(ep.airdate || "Air date unavailable")}</p>
        <p>${escapeHtml(stripHtml(ep.summary || "No episode summary available."))}</p></article>`).join("");
    } catch (error) {
      console.error(error);
      container.innerHTML = `<p class="status status-error">Couldn't load episodes. Please refresh to try again.</p>`;
    }
  }

  async function loadGallery(container) {
    container.innerHTML = loadingCards("Curating the gallery...");
    // TMDB API key is optional. If configured, request show details and image assets.
    if (CONFIG.tmdbApiKey && !CONFIG.tmdbApiKey.includes("PASTE_")) {
      try {
        const searchUrl = new URL("https://api.themoviedb.org/3/search/tv");
        searchUrl.search = new URLSearchParams({ api_key: CONFIG.tmdbApiKey, query: "Gossip Girl" });
        const searchResponse = await fetch(searchUrl);
        if (!searchResponse.ok) throw new Error("TMDB search failed");
        const searchData = await searchResponse.json();
        const show = searchData.results?.find(item => item.name === "Gossip Girl") || searchData.results?.[0];
        if (show?.id) {
          const imagesResponse = await fetch(`https://api.themoviedb.org/3/tv/${show.id}/images?api_key=${encodeURIComponent(CONFIG.tmdbApiKey)}`);
          if (!imagesResponse.ok) throw new Error("TMDB images failed");
          const imagesData = await imagesResponse.json();
          const images = [...(imagesData.backdrops || []), ...(imagesData.posters || [])].slice(0, 18);
          if (images.length) {
            container.innerHTML = images.map((item, index) => {
              const src = `https://image.tmdb.org/t/p/w780${item.file_path}`;
              return `<a class="gallery-card" href="${escapeAttr(src)}" target="_blank" rel="noopener noreferrer"><img src="${escapeAttr(src)}" alt="Gossip Girl gallery image ${index + 1}" loading="lazy"><span>VIEW IMAGE ↗</span></a>`;
            }).join("");
            return;
          }
        }
      } catch (error) {
        console.warn("TMDB gallery fallback:", error);
      }
    }
    // TVmaze fallback: the show poster and cast images, no TMDB key required.
    try {
      const show = await fetchShow();
      const response = await fetch(`https://api.tvmaze.com/shows/${show.id}/cast`);
      if (!response.ok) throw new Error("TVmaze gallery unavailable");
      const cast = await response.json();
      const images = [show.image?.original || show.image?.medium, ...cast.map(item => item.character?.image?.original || item.person?.image?.original || item.character?.image?.medium || item.person?.image?.medium)].filter(Boolean);
      const unique = [...new Set(images)].slice(0, 18);
      container.innerHTML = unique.map((src, index) => `<a class="gallery-card" href="${escapeAttr(src)}" target="_blank" rel="noopener noreferrer"><img src="${escapeAttr(src)}" alt="Gossip Girl cast image ${index + 1}" loading="lazy"><span>VIEW IMAGE ↗</span></a>`).join("");
      const note = $("[data-gallery-note]");
      if (note && (!CONFIG.tmdbApiKey || CONFIG.tmdbApiKey.includes("PASTE_"))) note.textContent = "Showing images available through TVmaze. Add a TMDB API key in js/config.js for a larger image gallery.";
    } catch (error) {
      console.error(error);
      container.innerHTML = `<p class="status status-error">The gallery couldn't load. Please refresh to try again.</p>`;
    }
  }

  function setupContactForm(form) {
    const status = $("[data-form-status]", form);
    const submit = $("[type='submit']", form);
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!window.emailjs) {
        setStatus(status, "Email service didn't load. Check your internet connection and try again.", "error");
        return;
      }
      const cfg = CONFIG.emailjs || {};
      if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) {
        setStatus(status, "EmailJS setup is incomplete. Check js/config.js.", "error");
        return;
      }
      const name = $("[name='name']", form).value.trim() || "Anonymous";
      const email = $("[name='email']", form).value.trim() || "Not provided";
      const category = $("[name='category']", form).value;
      const message = $("[name='message']", form).value.trim();
      submit.disabled = true;
      submit.textContent = "SENDING YOUR TEA...";
      setStatus(status, "Sending your message...", "");
      try {
        window.emailjs.init({ publicKey: cfg.publicKey });
        await window.emailjs.send(cfg.serviceId, cfg.templateId, {
          name, email, category, message,
          recipient: cfg.recipient,
          time: new Date().toLocaleString()
        });
        setStatus(status, "Spotted! Your message has been sent. XOXO 💋", "success");
        form.reset();
      } catch (error) {
        console.error("EmailJS error:", error);
        setStatus(status, "The tea couldn't be delivered. Check the EmailJS template settings and try again.", "error");
      } finally {
        submit.disabled = false;
        submit.textContent = "💋 SPILL THE TEA";
      }
    });
  }

  function setStatus(element, message, type) {
    if (!element) return;
    element.hidden = false;
    element.textContent = message;
    element.className = `status ${type ? `status-${type}` : ""}`.trim();
  }
  function loadingCards(message) { return `<p class="status">${escapeHtml(message)}</p>`; }
  function stripHtml(html) { const doc = new DOMParser().parseFromString(String(html), "text/html"); return doc.body.textContent || ""; }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char])); }
  function escapeAttr(value) { return escapeHtml(value); }
})();
