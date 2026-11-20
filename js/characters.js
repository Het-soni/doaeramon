"use strict";

(() => {
  const imageFolder = "./assets/images/characters/";

  // =====================================================
  // ALL 32 CHARACTERS
  // Image filenames match your project's existing files.
  // =====================================================

  const characters = window.dwCharacters;

  const categories = {
    all: "All Characters",
    main: "Main Characters",
    family: "Family Characters",
    friends: "Friends",
    school: "School Characters",
    robot: "Robot Characters",
    movie: "Movie Characters",
    minor: "Other Characters"
  };

  const grid = document.getElementById("characterGrid");

  if (!grid) {
    console.error('characters.html needs <div id="characterGrid"></div>');
    return;
  }

  const search = document.getElementById("characterSearch");
  const count = document.getElementById("characterCount");
  const heading = document.getElementById("charactersHeading");
  const empty = document.getElementById("noCharacters");
  const filters = [...document.querySelectorAll(".character-filter")];

  let selectedCategory = "all";

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // =====================================================
  // IMAGES: local file first, GitHub copy if needed
  // =====================================================

  const repositoryImages =
    "https://raw.githubusercontent.com/het-soni/doaeramon/main/assets/images/characters/";

  function handleImageError(event) {
    const image = event.target;

    if (!(image instanceof HTMLImageElement)) return;

    const localFolder = new URL(imageFolder, document.baseURI);
    const url = new URL(image.src, document.baseURI);

    if (
      !image.dataset.triedRemote &&
      url.origin === localFolder.origin &&
      url.pathname.startsWith(localFolder.pathname)
    ) {
      const filename = url.pathname.slice(localFolder.pathname.length);

      if (filename && !filename.includes("/")) {
        image.dataset.triedRemote = "yes";
        image.src = repositoryImages + filename;
        return;
      }
    }

    // Keep the character card and its profile usable even without a portrait.
    if (image.closest(".character-image, .modal-image")) {
      const fallback = element("span", "image-fallback", "👤");
      fallback.setAttribute("aria-label", "Portrait unavailable");
      image.replaceWith(fallback);
    }
  }

  document.addEventListener("error", handleImageError, true);

  // Banner images may already have finished loading before this script runs.
  document.querySelectorAll(".five-friends img, .people-hero-art img")
    .forEach(image => {
      if (image.complete && image.naturalWidth === 0) {
        handleImageError({ target: image });
      }
    });

  function portrait(character, className, lazy = false) {
    const box = element("div", className);
    const image = document.createElement("img");

    image.alt = character.name;
    image.loading = lazy ? "lazy" : "eager";
    image.src = imageFolder + character.image;

    box.append(image);
    return box;
  }

  // =====================================================
  // PROFILE POPUP
  // Native dialog handles Escape, keyboard focus and mobile.
  // =====================================================

  const dialog = document.createElement("dialog");
  dialog.className = "character-modal-box";
  dialog.setAttribute("aria-labelledby", "profileTitle");
  dialog.style.border = "0";
  dialog.style.margin = "auto";

  const closeButton = element("button", "modal-close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close character profile");

  const profileBody = document.createElement("div");
  dialog.append(closeButton, profileBody);
  document.body.append(dialog);

  let previousOverflow = "";
  let lastCard = null;

  function openProfile(character, card) {
    lastCard = card;

    const top = element("div", "modal-top");
    const info = element("div", "modal-main-info");
    const title = element("h2", "", character.name);
    title.id = "profileTitle";

    info.append(
      element("span", "modal-category", categories[character.category]),
      title,
      element("div", "japanese-name", character.japanese),
      element("p", "modal-description", character.description)
    );

    top.append(portrait(character, "modal-image"), info);

    const section = element("section", "details-section");
    const facts = element("div", "details-grid");

    const details = [
      ["Full name", character.fullName],
      ["Category", categories[character.category]],
      ["Role", character.role],
      ["Birthday", character.birthday],
      ["Home", character.home],
      ["Family", character.family],
      ["Friends", character.friends],
      ["Personality", character.personality],
      ["Movie", character.movie]
    ];

    for (const [label, value] of details) {
      if (!value) continue;

      const row = element("div", "detail-item");
      row.append(
        element("span", "detail-label", label),
        element("span", "detail-value", value)
      );
      facts.append(row);
    }

    section.append(element("h3", "", "Character Details"), facts);
    profileBody.replaceChildren(top, section);

    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialog.showModal();
    dialog.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  }

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;

    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;

    if (outside) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    if (lastCard?.isConnected) lastCard.focus({ preventScroll: true });
  });

  // =====================================================
  // CHARACTER CARDS
  // =====================================================

  function makeCard(character) {
    const card = element("article", "character-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `View ${character.name}'s profile`);

    const info = element("div", "character-info");

    info.append(
      element("span", "character-category", character.category),
      element("h3", "", character.name),
      element("p", "", character.description),
      element("span", "view-details", "View full details →")
    );

    card.append(portrait(character, "character-image", true), info);

    card.addEventListener("click", () => openProfile(character, card));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProfile(character, card);
      }
    });

    return card;
  }

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .replace(/[’']/g, "")
      .trim();
  }

  let page = 1;
  const perPage = 12;
  const pager = document.createElement("nav");
  pager.className = "dw-pager";
  pager.setAttribute("aria-label","Character pages");
  grid.after(pager);
  function render() {
    const query = normalize(search?.value || "");

    const matches = characters.filter(character => {
      const categoryMatches =
        selectedCategory === "all" ||
        character.category === selectedCategory;

      const searchableText = normalize([
        character.name,
        character.fullName || "",
        character.japanese,
        ...(character.aliases || []),
        character.role || "",
        character.movie || "",
        character.description
      ].join(" "));

      return categoryMatches && searchableText.includes(query);
    });

    const pages = Math.ceil(matches.length / perPage);
    page = Math.min(page, Math.max(1,pages));
    grid.replaceChildren(...matches.slice((page-1)*perPage,page*perPage).map(makeCard));
    pager.replaceChildren();
    if(pages>1) for(let i=1;i<=pages;i++){
      const button = element("button", "", String(i));
      button.type = "button";
      button.setAttribute("aria-label","Character page "+i);
      if(i===page) button.setAttribute("aria-current","page");
      button.onclick = () => {page=i; render(); grid.scrollIntoView({block:"start"});pager.children[i-1].focus({preventScroll:true});};
      pager.append(button);
    }

    if (count) count.textContent = matches.length;
    if (heading) heading.textContent = categories[selectedCategory];
    if (empty) empty.hidden = matches.length > 0;

    for (const button of filters) {
      const active = button.dataset.category === selectedCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }

  for (const button of filters) {
    button.addEventListener("click", () => {
      page=1; selectedCategory = button.dataset.category;
      render();
    });
  }

  search?.addEventListener("input", () => {page=1;render();});

  // Supports both reset-button IDs from the earlier HTML versions.
  const resetButton = document.querySelector("#resetPeople, #resetCharacters");

  resetButton?.addEventListener("click", () => {
    page=1; selectedCategory = "all";
    if (search) search.value = "";
    render();
    search?.focus();
  });

  // =====================================================
  // MOBILE MENU AND HEADER SEARCH
  // Supports both versions of your Characters page.
  // =====================================================

  const menuButton = document.querySelector("#peopleMenuButton, #menuButton");
  const menu = document.querySelector("#peopleMenu, #sideMenu");
  const searchButton = document.querySelector("#peopleSearchButton, #searchButton");

  function setMenu(open) {
    if (!menu || !menuButton) return;

    menu.hidden = !open;
    menuButton.textContent = open ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuButton?.addEventListener("click", () => {
    if (menu) setMenu(menu.hidden);
  });

  document.addEventListener("click", event => {
    if (
      menu && !menu.hidden &&
      !menu.contains(event.target) &&
      !menuButton?.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu && !menu.hidden) {
      setMenu(false);
      menuButton?.focus();
    }
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
    setMenu(false);
  });

  searchButton?.addEventListener("click", () => {
    setMenu(false);

    const directory = document.querySelector("#directory, #characters");
    directory?.scrollIntoView();
    search?.focus({ preventScroll: true });
  });

  const year = document.querySelector("#peopleYear, #year");
  if (year) year.textContent = new Date().getFullYear();

  // Show ALL 32 characters immediately.
  render();
})();
