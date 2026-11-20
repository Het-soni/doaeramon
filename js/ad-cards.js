
/*
  Doraemon World
  Adsterra Banner After Every 6 Cards
*/

(() => {
  "use strict";

  const AD_INTERVAL = 6;

  // Keep false until ready to activate ads.
  const ADS_ENABLED = true;

  function createAdCard() {
    const card = document.createElement("div");

    card.className = "dw-ad-card";
    card.dataset.insertedAd = "true";
    card.setAttribute("aria-label", "Advertisement");

    const label = document.createElement("span");
    label.className = "dw-ad-label";
    label.textContent = "Advertisement";

    card.appendChild(label);

    if (ADS_ENABLED) {
      const frame = document.createElement("iframe");

      frame.src = "./adsterra-banner.html";
      frame.width = "300";
      frame.height = "250";
      frame.loading = "lazy";
      frame.title = "Advertisement";
      frame.setAttribute("scrolling", "no");

      frame.style.border = "0";
      frame.style.display = "block";
      frame.style.maxWidth = "100%";

      card.appendChild(frame);
    } else {
      const placeholder = document.createElement("div");

      placeholder.className = "dw-ad-content";
      placeholder.innerHTML = `
        <div class="dw-ad-icon">📢</div>
        <p>Advertisement Space</p>
      `;

      card.appendChild(placeholder);
    }

    return card;
  }

  function updateAds(grid) {
    grid.querySelectorAll(
      ":scope > [data-inserted-ad]"
    ).forEach(ad => ad.remove());

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
    document
      .querySelectorAll("[data-ad-grid]")
      .forEach(initGrid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
