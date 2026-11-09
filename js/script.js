
<<<<<<< HEAD
/* =========================================
   DORAEMON WORLD - HOMEPAGE JAVASCRIPT
========================================= */
=======
/* =================================================
   DORAEMON WORLD - HOME JAVASCRIPT
   MENU + SEARCH + RESPONSIVE INTERACTIONS
================================================= */
>>>>>>> fc9a300 (update)

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

<<<<<<< HEAD
  const $ = (id) => document.getElementById(id);

  /* =====================================
     MOBILE MENU
  ===================================== */

  const menu = $("sideMenu");
  const menuButton = $("menuButton");
  const closeMenuButton = $("closeMenu");
  const menuOverlay = $("menuOverlay");
  const moreButton = $("moreButton");

  function openMenu() {
    menu.classList.add("open");
    menuOverlay.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menu.classList.remove("open");
    menuOverlay.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuButton.addEventListener("click", openMenu);
  moreButton.addEventListener("click", openMenu);
  closeMenuButton.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* =====================================
     SEARCH
  ===================================== */

  const searchButton = $("searchButton");
  const searchPanel = $("searchPanel");
  const closeSearchButton = $("closeSearch");
  const searchInput = $("searchInput");
  const searchResults = $("searchResults");

  const searchPages = [
    { title: "Home", url: "index.html" },
    { title: "Doraemon Movies", url: "movies.html" },
    { title: "Doraemon Episodes", url: "episodes.html" },
    { title: "Characters", url: "characters.html" },
    { title: "Gadgets", url: "gadgets.html" },
    { title: "Wallpapers", url: "wallpapers.html" },
    { title: "Gallery", url: "gallery.html" },
    { title: "Music", url: "music.html" },
    { title: "Doraemon Quiz", url: "test.html" },
    { title: "Motivation", url: "motivation.html" }
  ];

  function openSearch() {
    searchPanel.hidden = false;
    searchButton.setAttribute("aria-expanded", "true");
    searchInput.focus();
=======
  const $ = id => document.getElementById(id);

  const menuBtn = $("dwMenuButton");
  const mobileMenu = $("dwMobileMenu");
  const bottomMore = $("dwBottomMore");

  const moreBtn = $("dwMoreButton");
  const moreMenu = $("dwMoreMenu");

  const searchBtn = $("dwSearchButton");
  const searchPanel = $("dwSearchPanel");
  const searchInput = $("dwSearchInput");
  const searchForm = $("dwSearchForm");
  const searchResults = $("dwSearchResults");

  const year = $("dwYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ================= PAGE DATABASE ================= */

  const pages = [
    {
      title: "Home",
      url: "index.html",
      icon: "🏠",
      keywords: "welcome homepage"
    },
    {
      title: "Movies",
      url: "movies.html",
      icon: "🎬",
      keywords: "film adventure dinosaur moon"
    },
    {
      title: "Episodes",
      url: "episodes.html",
      icon: "📺",
      keywords: "cartoon television classic"
    },
    {
      title: "Characters",
      url: "characters.html",
      icon: "👥",
      keywords: "doraemon nobita shizuka gian suneo"
    },
    {
      title: "Wallpapers",
      url: "wallpapers.html",
      icon: "🖼️",
      keywords: "hd background image"
    },
    {
      title: "Music",
      url: "music.html",
      icon: "🎵",
      keywords: "songs audio theme"
    },
    {
      title: "Gallery",
      url: "gallery.html",
      icon: "📸",
      keywords: "photos images pictures"
    },
    {
      title: "Magic Gadgets",
      url: "gadgets.html",
      icon: "🚪",
      keywords: "anywhere door 4d pocket take copter time machine"
    },
    {
      title: "Test",
      url: "test.html",
      icon: "📝",
      keywords: "quiz questions"
    },
    {
      title: "Motivation",
      url: "motivation.html",
      icon: "💙",
      keywords: "inspiration quotes"
    },
    {
      title: "Secret Message",
      url: "secret-login.html",
      icon: "💌",
      keywords: "letter private"
    },
    {
      title: "New Nobita's Dinosaur",
      url: "movies.html?movie=39",
      icon: "🎬",
      keywords: "movie 2020"
    },
    {
      title: "Moon Exploration",
      url: "movies.html?movie=38",
      icon: "🎬",
      keywords: "movie 2019"
    },
    {
      title: "Birth of Japan",
      url: "movies.html?movie=35",
      icon: "🎬",
      keywords: "movie 2016"
    }
  ];

  /* ================= MENU HELPERS ================= */

  function closeMenu() {
    mobileMenu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function closeMore() {
    moreMenu.hidden = true;
    moreBtn.setAttribute("aria-expanded", "false");
>>>>>>> fc9a300 (update)
  }

  function closeSearch() {
    searchPanel.hidden = true;
<<<<<<< HEAD
    searchButton.setAttribute("aria-expanded", "false");
    searchInput.value = "";
    searchResults.replaceChildren();
  }

  searchButton.addEventListener("click", () => {
    if (searchPanel.hidden) {
      openSearch();
    } else {
      closeSearch();
=======
    searchBtn.setAttribute("aria-expanded", "false");
  }

  function closeAll() {
    closeMenu();
    closeMore();
    closeSearch();
  }

  /* ================= MOBILE MENU ================= */

  function toggleMenu() {
    const willOpen = mobileMenu.hidden;

    closeAll();

    if (willOpen) {
      mobileMenu.hidden = false;
      menuBtn.setAttribute("aria-expanded", "true");
    }
  }

  menuBtn.addEventListener("click", toggleMenu);

  bottomMore.addEventListener("click", () => {
    toggleMenu();

    if (!mobileMenu.hidden) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });

  /* ================= DESKTOP MORE ================= */

  moreBtn.addEventListener("click", () => {
    const willOpen = moreMenu.hidden;

    closeAll();

    if (willOpen) {
      moreMenu.hidden = false;
      moreBtn.setAttribute("aria-expanded", "true");
    }
  });

  /* ================= SEARCH ENGINE ================= */

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function getResults(query) {
    if (!query) return pages.slice(0, 8);

    const words = normalize(query).split(" ").filter(Boolean);

    return pages.filter(page => {
      const searchable = normalize(
        page.title + " " + page.keywords
      );

      return words.every(word => searchable.includes(word));
    }).sort((a, b) => {
      const first = normalize(a.title);
      const second = normalize(b.title);

      const score = title => {
        if (title === query) return 100;
        if (title.startsWith(query)) return 80;
        if (title.includes(query)) return 50;
        return 10;
      };

      return score(second) - score(first);
    }).slice(0, 10);
  }

  function showResults() {
    const query = normalize(searchInput.value);
    const results = getResults(query);

    searchResults.replaceChildren();

    if (results.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No results found.";
      searchResults.appendChild(empty);
      return;
>>>>>>> fc9a300 (update)
    }
  });

<<<<<<< HEAD
  closeSearchButton.addEventListener("click", closeSearch);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    searchResults.replaceChildren();

    if (!query) return;

    const matches = searchPages.filter((page) =>
      page.title.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No matching section found.";
      searchResults.appendChild(message);
      return;
    }

    matches.forEach((page) => {
      const link = document.createElement("a");
      link.href = page.url;
      link.textContent = "🔎 " + page.title;
      searchResults.appendChild(link);
    });
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const firstResult = searchResults.querySelector("a");

    if (firstResult) {
      window.location.href = firstResult.href;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeSearch();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !searchPanel.hidden &&
      !searchPanel.contains(event.target) &&
      !searchButton.contains(event.target)
    ) {
      closeSearch();
    }
  });

  /* =====================================
     MOVIE SLIDER
  ===================================== */

  const movieSlider = $("movieSlider");
  const prevButton = $("moviePrev");
  const nextButton = $("movieNext");
  const dotsContainer = $("movieDots");

  function getScrollAmount() {
    const firstCard = movieSlider.querySelector(".movie-card");

    if (!firstCard) return 220;

    const gap = parseFloat(
      getComputedStyle(movieSlider).gap
    ) || 0;

    return firstCard.getBoundingClientRect().width + gap;
  }

  prevButton.addEventListener("click", () => {
    movieSlider.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth"
    });
  });

  nextButton.addEventListener("click", () => {
    movieSlider.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth"
    });
  });

  // Carousel indicators
  const dotCount = 3;
  const dots = [];

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("span");

    if (i === 0) {
      dot.classList.add("active");
    }

    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  function updateMovieDots() {
    const maxScroll =
      movieSlider.scrollWidth - movieSlider.clientWidth;

    const progress = maxScroll > 0
      ? movieSlider.scrollLeft / maxScroll
      : 0;

    const activeIndex = Math.min(
      dotCount - 1,
      Math.max(0, Math.round(progress * (dotCount - 1)))
    );
=======
    results.forEach(page => {
      const link = document.createElement("a");

      link.href = page.url;
      link.textContent = page.icon + "  " + page.title;

      searchResults.appendChild(link);
    });
  }

  function toggleSearch() {
    const willOpen = searchPanel.hidden;

    closeAll();

    if (willOpen) {
      searchPanel.hidden = false;
      searchBtn.setAttribute("aria-expanded", "true");

      showResults();
      searchInput.focus();
    }
  }

  searchBtn.addEventListener("click", toggleSearch);

  searchInput.addEventListener("input", showResults);

  searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const first = searchResults.querySelector("a");

    if (first) {
      window.location.href = first.href;
    }
  });

  /* ================= OUTSIDE CLICK ================= */

  document.addEventListener("click", event => {
    const target = event.target;

    const clickedMenu =
      menuBtn.contains(target) ||
      mobileMenu.contains(target) ||
      bottomMore.contains(target);

    if (!clickedMenu) {
      closeMenu();
    }

    const clickedMore =
      moreBtn.contains(target) ||
      moreMenu.contains(target);

    if (!clickedMore) {
      closeMore();
    }

    const clickedSearch =
      searchBtn.contains(target) ||
      searchPanel.contains(target);

    if (!clickedSearch) {
      closeSearch();
    }
  });

  /* ================= ESCAPE KEY ================= */

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAll();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();

      closeAll();
      searchPanel.hidden = false;
      searchBtn.setAttribute("aria-expanded", "true");
      showResults();
      searchInput.focus();
    }
  });

  /* ================= RESPONSIVE RESET ================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  /* ================= IMAGE ERRORS ================= */

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      console.warn(
        "Doraemon World: Image not found:",
        img.getAttribute("src")
      );
    });
  });
>>>>>>> fc9a300 (update)

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });

    prevButton.disabled = movieSlider.scrollLeft <= 2;
    nextButton.disabled =
      maxScroll <= 2 ||
      movieSlider.scrollLeft >= maxScroll - 2;

    prevButton.style.opacity = prevButton.disabled ? ".45" : "1";
    nextButton.style.opacity = nextButton.disabled ? ".45" : "1";
  }

  movieSlider.addEventListener(
    "scroll",
    updateMovieDots,
    { passive: true }
  );

  window.addEventListener("resize", updateMovieDots);

  updateMovieDots();

  /* =====================================
     REVEAL ANIMATIONS
  ===================================== */

  const animatedElements = document.querySelectorAll(
    ".quick-card, .movie-card, .gadgets-banner, " +
    ".motivation-banner, .explore-card, .friendship-inner"
  );

  // Use a small fade-in only when reduced motion is not enabled.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    animatedElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(15px)";
      element.style.transition =
        "opacity .5s ease, transform .5s ease";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 80px 0px"
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* =====================================
     IMAGE ERROR HANDLING
  ===================================== */

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.visibility = "hidden";
    });

    if (img.complete && img.naturalWidth === 0) {
      img.style.visibility = "hidden";
    }
  });

  /* =====================================
     SMOOTH EXPLORE SCROLL
  ===================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

});
