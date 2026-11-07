
/* =========================================
   DORAEMON WORLD - HOMEPAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

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
  }

  function closeSearch() {
    searchPanel.hidden = true;
    searchButton.setAttribute("aria-expanded", "false");
    searchInput.value = "";
    searchResults.replaceChildren();
  }

  searchButton.addEventListener("click", () => {
    if (searchPanel.hidden) {
      openSearch();
    } else {
      closeSearch();
    }
  });

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
