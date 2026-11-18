"use strict";

(() => {
  const menuButton = document.getElementById("menuButton");
  const menu = document.getElementById("sideMenu");
  const search = document.getElementById("characterSearch");
  const grid = document.getElementById("characterGrid");
  const filters = document.querySelector(".character-filters");

  // Mobile menu
  function setMenuOpen(open) {
    menu.hidden = !open;
    menuButton.textContent = open ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuButton.addEventListener("click", () => {
    setMenuOpen(menu.hidden);
  });

  document.addEventListener("click", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
    setMenuOpen(false);
  });

  document.getElementById("searchButton").addEventListener("click", () => {
    setMenuOpen(false);
    document.getElementById("characters").scrollIntoView();
    search.focus({ preventScroll: true });
  });

  // The existing characters.js filters and renders the cards.
  filters.addEventListener("click", (event) => {
    const selected = event.target.closest(".character-filter");
    if (!selected) return;

    for (const button of filters.querySelectorAll(".character-filter")) {
      button.setAttribute("aria-pressed", String(button === selected));
    }
  });

  document.getElementById("resetCharacters").addEventListener("click", () => {
    search.value = "";
    filters.querySelector('[data-category="all"]').click();
    search.focus();
  });

  // Make each generated card usable with Tab, Enter and Space.
  function prepareCards() {
    for (const card of grid.querySelectorAll(".character-card")) {
      const name = card.querySelector("h3").textContent.trim();

      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `View ${name}'s profile`);
    }
  }

  prepareCards();

  const cardObserver = new MutationObserver(prepareCards);
  cardObserver.observe(grid, { childList: true });

  let lastCard = null;

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".character-card");
    if (card) lastCard = card;
  }, true);

  grid.addEventListener("keydown", (event) => {
    const card = event.target.closest(".character-card");
    if (!card || (event.key !== "Enter" && event.key !== " ")) return;

    event.preventDefault();
    card.click();
  });

  // characters.js creates the popup only after a card is clicked.
  let activeModal = null;

  const modalObserver = new MutationObserver(() => {
    const modal = document.querySelector(".character-modal");

    if (modal === activeModal) return;

    if (!modal) {
      activeModal = null;
      if (lastCard?.isConnected) lastCard.focus({ preventScroll: true });
      return;
    }

    activeModal = modal;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const title = modal.querySelector("h2");
    title.id = "characterProfileTitle";
    modal.setAttribute("aria-labelledby", title.id);

    const close = modal.querySelector(".modal-close");
    close.focus({ preventScroll: true });

    // Close is the only interactive control inside the current profile.
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        close.focus();
      }
    });
  });

  modalObserver.observe(document.body, { childList: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();