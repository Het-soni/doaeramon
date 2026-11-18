"use strict";

// Mobile and tablet menu
const menuButton = document.getElementById("menuButton");
const siteMenu = document.getElementById("siteMenu");

function setMenuOpen(open) {
  siteMenu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuButton.textContent = open ? "✕" : "☰";
}

menuButton.addEventListener("click", () => {
  setMenuOpen(siteMenu.hidden);
});

document.addEventListener("click", (event) => {
  if (
    !siteMenu.hidden &&
    !siteMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !siteMenu.hidden) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
  setMenuOpen(false);
});

// Search starts with the actual page links and featured movie cards.
const searchDialog = document.getElementById("searchDialog");
const searchButton = document.getElementById("searchButton");
const closeSearch = document.getElementById("closeSearch");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchStatus = document.getElementById("searchStatus");

const entries = [];

for (const link of siteMenu.querySelectorAll("a")) {
  entries.push({
    title: link.textContent.trim(),
    href: link.href
  });
}

for (const card of document.querySelectorAll(".movie-card")) {
  entries.push({
    title: "🎬 " + card.querySelector("h3").textContent.trim(),
    href: card.href
  });
}

function renderSearch() {
  const words = searchInput.value.trim().toLowerCase().split(/\s+/);
  const seen = new Set();
  const matches = [];

  for (const entry of entries) {
    const title = entry.title.toLowerCase();

    if (seen.has(entry.href)) continue;
    if (!words.every((word) => title.includes(word))) continue;

    seen.add(entry.href);
    matches.push(entry);
  }

  searchResults.replaceChildren();

  for (const entry of matches.slice(0, 15)) {
    const link = document.createElement("a");
    link.href = entry.href;
    link.textContent = entry.title;
    searchResults.append(link);
  }

  if (matches.length === 0) {
    searchStatus.textContent = "No results found. Try another name.";
  } else if (matches.length > 15) {
    searchStatus.textContent = `Showing 15 of ${matches.length} results.`;
  } else {
    searchStatus.textContent =
      `${matches.length} ${matches.length === 1 ? "result" : "results"}`;
  }
}

// Load the existing site index once for additional movies and episodes.
let indexLoaded = false;
let indexLoading = false;

async function loadSiteIndex() {
  if (indexLoaded || indexLoading || location.protocol === "file:") return;

  indexLoading = true;

  try {
    const response = await fetch("js/site-search-index.json");
    if (!response.ok) return;

    const items = await response.json();
    if (!Array.isArray(items)) return;

    const siteRoot = new URL("./", document.baseURI);

    for (const item of items) {
      if (!item || typeof item.title !== "string") continue;
      if (typeof item.url !== "string" || !item.url.trim()) continue;

      let url;

      try {
        url = new URL(item.url, siteRoot);
      } catch {
        continue;
      }

      if (
        url.origin !== siteRoot.origin ||
        !url.pathname.startsWith(siteRoot.pathname)
      ) {
        continue;
      }

      entries.push({
        title: `${item.icon || "🔎"} ${item.title}`,
        href: url.href
      });
    }

    indexLoaded = true;

    if (searchDialog.open) {
      renderSearch();
    }
  } catch {
    // Page links and the six featured movies remain searchable offline.
  } finally {
    indexLoading = false;
  }
}

searchButton.addEventListener("click", () => {
  setMenuOpen(false);
  searchInput.value = "";
  renderSearch();
  searchDialog.showModal();
  searchInput.focus();
  loadSiteIndex();
});

closeSearch.addEventListener("click", () => {
  searchDialog.close();
});

searchDialog.addEventListener("close", () => {
  searchButton.focus();
});

searchInput.addEventListener("input", renderSearch);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!searchInput.value.trim()) return;

  const firstResult = searchResults.querySelector("a");
  if (firstResult) firstResult.click();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();