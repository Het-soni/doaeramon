"use strict";

// MOBILE MENU
const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

function setMenuOpen(open) {
  sideMenu.hidden = !open;
  menuButton.textContent = open ? "✕" : "☰";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuButton.addEventListener("click", () => {
  setMenuOpen(sideMenu.hidden);
});

document.addEventListener("click", (event) => {
  if (
    !sideMenu.hidden &&
    !sideMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !sideMenu.hidden) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
  setMenuOpen(false);
});


// EPISODE SEARCH AND SERIES FILTER
const searchInput = document.getElementById("episodeSearch");
const seriesFilter = document.getElementById("episodeFilter");
const episodeCount = document.getElementById("episodeCount");
const emptyState = document.getElementById("emptyState");
const emptyMessage = document.getElementById("emptyMessage");
const cards = Array.from(document.querySelectorAll("#episodeGrid .episode-card"));

function normalize(text) {
  return text.toLowerCase().replace(/[’']/g, "").trim();
}

// Matches "2", "02", "ep 2", "EP02" and "episode 02".
function getEpisodeNumber(query) {
  const match = query.match(/^(?:ep(?:isode)?\s*[-#]?\s*)?(\d+)$/i);
  return match ? Number(match[1]) : null;
}

function filterEpisodes() {
  const query = normalize(searchInput.value);
  const requestedNumber = getEpisodeNumber(query);
  const series = seriesFilter.value;
  let visibleCount = 0;

  for (const card of cards) {
    const title = normalize(card.querySelector("h3").textContent);
    const matchesSeries = series === "all" || card.dataset.series === series;

    const matchesSearch = requestedNumber === null
      ? title.includes(query)
      : Number(card.dataset.number) === requestedNumber;

    card.hidden = !(matchesSeries && matchesSearch);

    if (!card.hidden) visibleCount++;
  }

  episodeCount.textContent =
    `${visibleCount} ${visibleCount === 1 ? "episode" : "episodes"}`;

  emptyState.hidden = visibleCount > 0;

  if (visibleCount === 0) {
    emptyMessage.textContent = !query && series !== "all"
      ? "No episodes from this series have been added yet."
      : "Try another episode name, number or series.";
  }
}

searchInput.addEventListener("input", filterEpisodes);
seriesFilter.addEventListener("change", filterEpisodes);

document.getElementById("clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  seriesFilter.value = "all";
  filterEpisodes();
  searchInput.focus();
});

// Header search icon jumps to the episode search field.
document.getElementById("searchButton").addEventListener("click", () => {
  setMenuOpen(false);
  document.getElementById("episodeCollection").scrollIntoView();
  searchInput.focus({ preventScroll: true });
});


// COVER FALLBACK
// The title and detail link remain usable if a cover file is missing.
for (const image of document.querySelectorAll(".cover img")) {
  function showFallback() {
    if (!image.isConnected) return;

    const fallback = document.createElement("span");
    fallback.className = "cover-fallback";
    fallback.textContent = "Cover unavailable";
    image.replaceWith(fallback);
  }

  image.addEventListener("error", showFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
filterEpisodes();