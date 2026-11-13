
document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
  const desktopMenu = document.getElementById("menu");
  const desktopNav = document.getElementById("nav");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.getElementById("mobileMenuPanel");
  const searchBtn = document.querySelector(".mobile-search-btn");
  const search = document.getElementById("dw-search");
  const searchInput = document.getElementById("dw-search-input");
  const searchResults = document.getElementById("dw-search-results");
  const searchStatus = document.getElementById("dw-search-status");

  // DESKTOP MENU
  desktopMenu?.addEventListener("click", e => {
    e.stopPropagation();
    desktopNav?.classList.toggle("show");
  });

  // MOBILE MENU
  function closeMenu() {
    mobileMenu?.classList.remove("show");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
    if (mobileMenuBtn) mobileMenuBtn.textContent = "☰";
  }

  mobileMenuBtn?.addEventListener("click", e => {
    e.stopPropagation();
    const opened = mobileMenu.classList.toggle("show");
    mobileMenuBtn.textContent = opened ? "✕" : "☰";
    mobileMenuBtn.setAttribute("aria-expanded", String(opened));
  });

  document.addEventListener("click", e => {
    if (!mobileMenu?.contains(e.target) &&
        !mobileMenuBtn?.contains(e.target)) {
      closeMenu();
    }
    if (!desktopNav?.contains(e.target) &&
        !desktopMenu?.contains(e.target)) {
      desktopNav?.classList.remove("show");
    }
  });

  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // SEARCH
  const pages = [
    ["🏠 Home", "index.html"],
    ["🎬 Movies", "movies.html"],
    ["📺 Episodes", "episodes.html"],
    ["👥 Characters", "characters.html"],
    ["🖼️ Wallpapers", "wallpapers.html"],
    ["🎵 Music", "music.html"],
    ["📸 Gallery", "gallery.html"],
    ["🚀 Gadgets", "gadgets.html"],
    ["🏆 Test", "test.html"],
    ["💙 Motivation", "motivation.html"],
    ["🤖 Doraemon AI", "doraemon-ai.html"]
  ];

  function renderSearch(query = "") {
    const q = query.trim().toLowerCase();
    const filtered = pages.filter(([name]) =>
      name.toLowerCase().includes(q)
    );

    searchResults.replaceChildren();

    filtered.forEach(([name, url]) => {
      const a = document.createElement("a");
      a.href = url;
      a.textContent = name + " ↗";
      searchResults.appendChild(a);
    });

    searchStatus.textContent = filtered.length
      ? `${filtered.length} matching pages`
      : "No matching page found";
  }

  function openSearch() {
    closeMenu();
    search.hidden = false;
    document.body.style.overflow = "hidden";
    searchInput.value = "";
    renderSearch();
    searchInput.focus();
  }

  function closeSearch() {
    search.hidden = true;
    document.body.style.overflow = "";
    searchBtn?.focus();
  }

  searchBtn?.addEventListener("click", openSearch);

  document.getElementById("dw-close-search")
    ?.addEventListener("click", closeSearch);

  searchInput?.addEventListener("input", () => {
    renderSearch(searchInput.value);
  });

  search?.addEventListener("click", e => {
    if (e.target === search) closeSearch();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (search && !search.hidden) closeSearch();
      closeMenu();
      desktopNav?.classList.remove("show");
    }
  });

  // ACTIVE NAVIGATION
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(
    "#nav a,.mobile-menu-panel a,.bottom-nav-item"
  ).forEach(link => {
    const target = link.getAttribute("href")?.split("?")[0];
    link.classList.toggle("active", target === currentPage);
  });

  // DORAEMON ORIGINAL START EFFECT
  const effect = document.getElementById("doraemon-effect");
  const effectImage = document.getElementById("doraemon-start-image");
  const effectAudio = document.getElementById("doraemon-audio");

  const images = Array.from({ length: 8 }, (_, i) =>
    `assets/images/doraemon/doraemon-${String(i + 1).padStart(2, "0")}.png`
  );

  let played = sessionStorage.getItem("doraemonEffectPlayed") === "true";
  let imageTimer = null;
  let stopTimer = null;

  function stopEffect() {
    clearInterval(imageTimer);
    clearTimeout(stopTimer);
    effect?.classList.remove("show");
    if (effectAudio) {
      effectAudio.pause();
      try { effectAudio.currentTime = 0; } catch {}
    }
  }

  function startEffect() {
    if (played || !effect || !effectImage) return;

    played = true;
    sessionStorage.setItem("doraemonEffectPlayed", "true");

    let index = 0;
    effectImage.src = images[0];
    effect.classList.add("show");

    imageTimer = setInterval(() => {
      if (index < images.length - 1) {
        index++;
        effectImage.src = images[index];
      } else {
        clearInterval(imageTimer);
      }
    }, 875);

    if (effectAudio) {
      effectAudio.currentTime = 0;
      effectAudio.play().catch(() => {});
      effectAudio.onended = stopEffect;
    }

    stopTimer = setTimeout(stopEffect, 7000);
  }

  document.addEventListener("click", e => {
    if (played) return;

    // Start only on a general page interaction,
    // not on links or interface controls.
    if (e.target.closest(
      "a,button,input,nav,.dw-search,#doraemon-effect"
    )) return;

    startEffect();
  });

  effect?.addEventListener("click", e => e.stopPropagation());

  // COPYRIGHT
  const copyright = document.querySelector(".copyright");
  if (copyright) {
    copyright.textContent =
      `© ${new Date().getFullYear()} Doraemon World`;
  }

  // HORIZONTAL CARD SCROLL
  document.querySelectorAll(
    ".mobile-movie-row,.mobile-gadget-row"
  ).forEach(row => {
    row.addEventListener("wheel", e => {
      if (e.shiftKey && e.deltaY) {
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      }
    }, { passive:false });
  });

  console.log("Doraemon World loaded 💙");
});
