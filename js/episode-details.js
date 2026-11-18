"use strict";

(() => {
  // Mobile menu
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

  // Common episode video popup
  const dialog = document.getElementById("episodeDialog");
  const player = document.getElementById("episodePlayer");
  const closeButton = document.getElementById("closePlayer");
  const message = document.getElementById("playerMessage");

  function showMessage(text) {
    message.textContent = text;
    message.hidden = false;
  }

  function clearMessage() {
    message.textContent = "";
    message.hidden = true;
  }

  async function openPlayer() {
    if (dialog.open) return;

    clearMessage();
    dialog.showModal();
    closeButton.focus();

    try {
      await player.play();
    } catch (error) {
      if (!dialog.open || error.name === "AbortError") return;

      if (error.name === "NotAllowedError") {
        showMessage("Tap the play button on the video to start watching.");
      } else {
        showMessage("This episode video could not be played.");
      }
    }
  }

  document.querySelectorAll("[data-play-episode]").forEach((button) => {
    button.addEventListener("click", openPlayer);
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  // Close when clicking outside the popup.
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;

    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;

    if (outside) dialog.close();
  });

  // Also runs when Escape closes the native dialog.
  dialog.addEventListener("close", () => {
    player.pause();
    clearMessage();
  });

  player.addEventListener("playing", clearMessage);

  player.addEventListener("error", () => {
    if (dialog.open) {
      showMessage("The video could not be loaded. Please try again later.");
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();