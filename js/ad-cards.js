
/*
  Doraemon World
  Advertisement Card After Every 6 Cards

  Works with:
  - Movies
  - Wallpapers
  - Gallery
  - Reels
*/

(() => {
  "use strict";

  const AD_INTERVAL = 6;

  // Create advertisement placeholder
  function createAdCard() {
    const ad = document.createElement("div");

    ad.className = "dw-ad-card";
    ad.dataset.insertedAd = "true";
    ad.setAttribute("aria-label", "Advertisement");

    ad.innerHTML = `
      <span class="dw-ad-label">
        Advertisement
      </span>

      <div class="dw-ad-content">
        <div class="dw-ad-icon">📢</div>
        <p>Advertisement Space</p>
      </div>
    `;

    return ad;
  }

  // Add one ad after every 6 content cards
  function updateAds(grid) {
    // Remove previously inserted ads
    grid.querySelectorAll(":scope > [data-inserted-ad]")
      .forEach(ad => ad.remove());

    // Count actual cards only
    const cards = Array.from(grid.children).filter(
      element =>
        element.nodeType === 1 &&
        !element.hasAttribute("data-inserted-ad")
    );

    cards.forEach((card, index) => {
      if ((index + 1) % AD_INTERVAL === 0) {
        card.after(createAdCard());
      }
    });
  }

  // Watch dynamically generated movie/reel cards
  function initGrid(grid) {
    let scheduled = false;

    const observer = new MutationObserver(() => {
      if (scheduled) return;

      scheduled = true;

      requestAnimationFrame(() => {
        observer.disconnect();

        updateAds(grid);

        observer.observe(grid, {
          childList: true
        });

        scheduled = false;
      });
    });

    updateAds(grid);

    observer.observe(grid, {
      childList: true
    });
  }

  function init() {
    document.querySelectorAll("[data-ad-grid]")
      .forEach(initGrid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
