"use strict";

// Existing Doraemon World catalogue.
// Each entry contains title, year, rating, genre and story.
// IDs follow the original 1–39 order used by Home and site search.
const movieRows = [
  ["Nobita's Dinosaur", 1980, "8.2", "Adventure, Fantasy, Family",
    "Nobita discovers a dinosaur egg and raises a young dinosaur named Pisu."],

  ["The Records of Nobita", 1981, "8.1", "Adventure, Fantasy, Family",
    "Nobita and Doraemon travel through time on an adventure filled with gadgets and friendship."],

  ["Nobita and the Haunts", 1982, "8.0", "Adventure, Fantasy",
    "Nobita and his friends discover mysterious events and set out to investigate with Doraemon."],

  ["Nobita's Great Adventure", 1983, "8.3", "Adventure, Fantasy, Family",
    "Nobita and his friends enter a mysterious world full of challenges."],

  ["Nobita's Little Star Wars", 1985, "8.4", "Sci-Fi, Adventure, Fantasy",
    "The friends help a tiny alien prince caught in an intergalactic battle."],

  ["Nobita and the Steel Troops", 1986, "8.5", "Sci-Fi, Adventure",
    "Mysterious robot parts lead Nobita and his friends into a battle against an army of robots."],

  ["Nobita and the Knights", 1987, "8.4", "Fantasy, Adventure",
    "Nobita and his friends enter a hidden world and become part of a new adventure."],

  ["Nobita and the Parallel Journey", 1988, "8.5", "Fantasy, Adventure, Sci-Fi",
    "Doraemon and Nobita discover a parallel world and face an enemy threatening both worlds."],

  ["Nobita's Birth of Japan", 1989, "8.6", "Adventure, Historical, Fantasy",
    "Nobita and his friends travel back to prehistoric Japan."],

  ["Nobita and the Animal Planet", 1990, "8.5", "Adventure, Fantasy, Sci-Fi",
    "Nobita discovers a world of intelligent animals and helps them protect their home."],

  ["Nobita's Dorabian Nights", 1991, "8.4", "Fantasy, Adventure",
    "Nobita and his friends enter the stories of the Arabian Nights."],

  ["Nobita and the Kingdom of Clouds", 1992, "8.5", "Fantasy, Adventure",
    "Nobita builds a kingdom in the clouds and discovers a civilization with plans of its own."],

  ["Nobita's Tin Labyrinth", 1993, "8.3", "Adventure, Sci-Fi, Mystery",
    "The friends explore a labyrinth and uncover a secret connected to robots."],

  ["Nobita's Three Visionary Swordsmen", 1994, "8.4", "Fantasy, Adventure",
    "Nobita dreams of becoming a swordsman and finds himself on a fantasy adventure."],

  ["Nobita's Diary on the Creation of the World", 1995, "8.5", "Fantasy, Adventure, Sci-Fi",
    "Nobita and his friends create a miniature world and watch its history unfold."],

  ["Nobita and the Galaxy Super-express", 1996, "8.6", "Sci-Fi, Adventure",
    "Nobita boards a mysterious galaxy train for a journey through space."],

  ["Nobita's Adventure in the South Seas", 1998, "8.4", "Adventure, Fantasy",
    "Nobita and his friends sail to the South Seas and discover a mysterious island."],

  ["Nobita Drifts in the Universe", 1999, "8.5", "Sci-Fi, Adventure",
    "The friends are drawn into a space adventure and must find their way home."],

  ["Nobita's Legend of the Sun King", 2000, "8.6", "Fantasy, Adventure",
    "Nobita meets a prince who looks exactly like him and becomes part of a royal adventure."],

  ["Nobita and the Winged Braves", 2001, "8.5", "Fantasy, Adventure",
    "Nobita discovers a bird civilization and helps its people face a threat."],

  ["Nobita and the Robot Kingdom", 2002, "8.4", "Sci-Fi, Adventure",
    "The friends visit a robot kingdom caught in a conflict between humans and robots."],

  ["Nobita and the Windmasters", 2003, "8.5", "Fantasy, Adventure",
    "Nobita meets people who can control the wind and helps them protect their world."],

  ["Nobita's Wan-Nyan Space-Time Odyssey", 2004, "8.6", "Sci-Fi, Adventure, Fantasy",
    "A journey through time leads the friends to a civilization connected to dogs and cats."],

  ["Nobita's Dinosaur 2006", 2006, "8.7", "Adventure, Fantasy, Family",
    "Nobita discovers a dinosaur egg and raises a dinosaur named Pisuke."],

  ["Nobita's New Great Adventure", 2007, "8.4", "Fantasy, Adventure",
    "Nobita and his friends set out on an adventure in a world of magic."],

  ["Nobita and the Green Giant Legend", 2008, "8.3", "Fantasy, Adventure, Family",
    "A mysterious plant brings Nobita into contact with a green civilization."],

  ["The New Record of Nobita", 2009, "8.4", "Adventure, Fantasy",
    "Nobita and his friends explore a world filled with adventure and secrets."],

  ["Nobita's Great Battle of the Mermaid King", 2010, "8.5", "Fantasy, Adventure",
    "The friends explore an underwater kingdom and help a mermaid princess."],

  ["Nobita and the New Steel Troops", 2011, "8.6", "Sci-Fi, Adventure",
    "Nobita and his friends discover powerful robot soldiers and face a dangerous threat."],

  ["Nobita and the Island of Miracles", 2012, "8.3", "Adventure, Fantasy",
    "Nobita discovers an island where extinct animals still live."],

  ["Nobita's Secret Gadget Museum", 2013, "8.5", "Mystery, Adventure, Sci-Fi",
    "When Doraemon's bell is stolen, the search leads the friends to a gadget museum."],

  ["New Nobita's Great Demon", 2014, "8.4", "Fantasy, Adventure",
    "Nobita and his friends enter a magical world and face a powerful enemy."],

  ["Stand by Me Doraemon", 2014, "9.0", "Drama, Fantasy, Family",
    "A story about Nobita and Doraemon's friendship and their journey together."],

  ["Nobita's Space Heroes", 2015, "8.3", "Sci-Fi, Adventure, Superhero",
    "Nobita and his friends become superheroes and embark on a space adventure."],

  ["New Nobita's Birth of Japan", 2016, "8.5", "Adventure, Fantasy",
    "Nobita and his friends travel back to prehistoric Japan for a new adventure."],

  ["Great Adventure in the Antarctic", 2017, "8.4", "Adventure, Sci-Fi, Fantasy",
    "The friends travel to Antarctica and discover an ancient civilization beneath the ice."],

  ["Nobita's Treasure Island", 2018, "8.6", "Adventure, Fantasy",
    "Nobita and his friends search for treasure while facing pirates and unexpected dangers."],

  ["Nobita's Chronicle of the Moon Exploration", 2019, "8.5", "Sci-Fi, Adventure, Fantasy",
    "Nobita discovers a mysterious world on the Moon and joins the battle to protect it."],

  ["New Nobita's Dinosaur", 2020, "8.7", "Adventure, Fantasy, Family",
    "Nobita discovers twin dinosaurs and sets out to help them return to their own time."]
];

const movies = movieRows.map(([title, year, rating, genre, story], index) => {
  const id = index + 1;
  const posterNumber = String(id).padStart(2, "0");

  return {
    id,
    title,
    year,
    rating,
    genre,
    story,
    image: `assets/images/movies/movie-${posterNumber}.jpg`
  };
});

const byId = (id) => document.getElementById(id);

const listView = byId("listView");
const detailView = byId("detailView");
const grid = byId("movieGrid");
const search = byId("movieSearch");
const yearFilter = byId("yearFilter");
const pagination = byId("pagination");
const menu = byId("sideMenu");
const menuButton = byId("menuButton");

const mobileScreen = window.matchMedia("(max-width: 700px)");
const pageSize = 8;
let pageNumber = 1;

// Navigation works with the static header and bottom bar in movies.html.
function setMenu(open) {
  menu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuButton.textContent = open ? "✕" : "☰";
}

menuButton.addEventListener("click", () => setMenu(menu.hidden));

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
    setMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});

window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
  setMenu(false);
});

// Relative links also work inside a GitHub Pages project folder.
function movieURL(id) {
  return id == null ? "movies.html" : `movies.html?movie=${id}`;
}

function addPoster(frame, movie, lazy = true) {
  const img = document.createElement("img");

  img.alt = "";
  img.loading = lazy ? "lazy" : "eager";

  img.addEventListener("error", () => {
    frame.textContent = "Poster unavailable";
  }, { once: true });

  frame.replaceChildren(img);
  img.src = movie.image;
}

function createCard(movie) {
  const card = document.createElement("a");
  card.className = "movie-card";
  card.href = movieURL(movie.id);

  const frame = document.createElement("div");
  frame.className = "poster";
  addPoster(frame, movie);

  const info = document.createElement("div");
  info.className = "card-info";

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const year = document.createElement("span");
  year.textContent = `📅 ${movie.year}`;

  const rating = document.createElement("span");
  rating.textContent = `⭐ ${movie.rating}`;

  meta.append(year, rating);
  info.append(title, meta);
  card.append(frame, info);

  return card;
}

function renderPagination(totalPages) {
  pagination.replaceChildren();
  pagination.hidden = !mobileScreen.matches || totalPages <= 1;

  if (pagination.hidden) return;

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = page;
    button.setAttribute("aria-label", `Movie page ${page}`);

    if (page === pageNumber) {
      button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {
      pageNumber = page;
      renderList();
      grid.querySelector("a")?.focus();
    });

    pagination.append(button);
  }
}

function renderList() {
  const query = search.value.trim().toLowerCase();
  const year = yearFilter.value;

  const matches = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(query) &&
      (!year || String(movie.year) === year);
  });

  const totalPages = Math.ceil(matches.length / pageSize);
  pageNumber = Math.max(1, Math.min(pageNumber, totalPages));

  const start = (pageNumber - 1) * pageSize;
  const visible = mobileScreen.matches
    ? matches.slice(start, start + pageSize)
    : matches;

  grid.replaceChildren(...visible.map(createCard));

  byId("movieCount").textContent =
    `${matches.length} ${matches.length === 1 ? "movie" : "movies"}`;

  byId("emptyState").hidden = matches.length > 0;
  renderPagination(totalPages);
}

function updateDetailLink(id, movie) {
  const link = byId(id);
  link.hidden = !movie;

  if (movie) {
    link.href = movieURL(movie.id);
  } else {
    link.removeAttribute("href");
  }
}

function renderView() {
  const requestedId = new URLSearchParams(location.search).get("movie");
  const index = movies.findIndex((movie) => String(movie.id) === requestedId);
  const movie = movies[index];

  listView.hidden = Boolean(movie);
  detailView.hidden = !movie;

  if (!movie) {
    document.title = "Movies | Doraemon World";
    renderList();
    return;
  }

  document.title = `${movie.title} | Doraemon World`;

  addPoster(byId("detailPoster"), movie, false);

  byId("detailNumber").textContent = `Movie ${String(movie.id).padStart(2, "0")}`;
  byId("detailTitle").textContent = movie.title;
  byId("detailYear").textContent = `📅 ${movie.year}`;
  byId("detailRating").textContent = `⭐ ${movie.rating}`;
  byId("detailGenre").textContent = movie.genre;
  byId("detailStory").textContent = movie.story;

  byId("telegramLink").href =
    `https://t.me/ProSearchM7Bot?start=${encodeURIComponent(movie.title)}`;

  updateDetailLink("previousMovie", movies[index - 1]);
  updateDetailLink("nextMovie", movies[index + 1]);
}

// Keep direct URLs, browser Back/Forward and opening links in a new tab.
document.querySelector(".page").addEventListener("click", (event) => {
  const link = event.target.closest(
    ".movie-card, #backLink, #previousMovie, #nextMovie"
  );

  if (!link || event.defaultPrevented || event.button !== 0) return;
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

  // On a local file, let the browser follow the ordinary HTML link.
  if (location.protocol === "file:") return;

  event.preventDefault();
  history.pushState(null, "", link.href);
  renderView();

  if (detailView.hidden) {
    search.focus({ preventScroll: true });
    byId("collection").scrollIntoView();
  } else {
    byId("detailTitle").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
});

byId("searchButton").addEventListener("click", () => {
  setMenu(false);

  if (!detailView.hidden) {
    if (location.protocol === "file:") {
      location.href = "movies.html#movieSearch";
      return;
    }

    history.pushState(null, "", movieURL());
    renderView();
  }

  search.focus({ preventScroll: true });
  byId("collection").scrollIntoView();
});

function resetPage() {
  pageNumber = 1;
  renderList();
}

const years = [...new Set(movies.map((movie) => movie.year))];
years.sort((a, b) => b - a);

for (const year of years) {
  yearFilter.add(new Option(year, year));
}

search.addEventListener("input", resetPage);
yearFilter.addEventListener("change", resetPage);
mobileScreen.addEventListener("change", resetPage);

byId("clearFilters").addEventListener("click", () => {
  search.value = "";
  yearFilter.value = "";
  resetPage();
  search.focus();
});

window.addEventListener("popstate", renderView);

byId("year").textContent = new Date().getFullYear();
renderView();