from pathlib import Path
from html import escape
import re


# Project folders
project = Path(__file__).resolve().parent
template_file = project / "episode-details" / "episode-01.html"
output_folder = project / "episode-pages-ready" / "episode-details"

if not template_file.is_file():
    raise SystemExit(
        "episode-details/episode-01.html nahi mili. "
        "Is Python file ko index.html ke paas rakho."
    )

template = template_file.read_text(encoding="utf-8-sig")


# ----------------------------------------------------------
# EPISODE DATA
# ----------------------------------------------------------

common_characters = [
    "🔵 Doraemon",
    "👦 Nobita",
    "🌸 Shizuka",
    "💪 Gian",
    "😎 Suneo",
]

common_gadgets = [
    "👜 4D Pocket",
    "🚪 Anywhere Door",
    "🚁 Take-Copter",
    "🔧 Future Gadgets",
]

episodes = {
    2: {
        "title": "Echo Mountain",
        "year": "1979",
        "rating": "8.8",
        "story_title": "The Echo Mountain Adventure",
        "intro": (
            "Doraemon and Nobita head into the mountains, where a voice "
            "can travel farther than either of them expects."
        ),
        "story": [
            "Nobita and Doraemon set out for Echo Mountain. When they call "
            "out, the mountain sends their voices back to them.",

            "As their friends join in, the echoes turn a quiet mountain "
            "outing into a series of funny misunderstandings.",
        ],
        "gadgets": [
            "🗺️ Adventure Map",
            "🚁 Take-Copter",
            "🚪 Anywhere Door",
            "🔊 Echo Gadget",
        ],
        "about": (
            "This adventure takes the friends away from their usual streets "
            "and school. The mountain itself becomes part of the comedy as "
            "the group tries to make sense of what it hears."
        ),
    },

    3: {
        "title": "Vacuum Mosquito",
        "year": "2002",
        "rating": "8.9",
        "story_title": "The Vacuum Mosquito Adventure",
        "intro": (
            "A mosquito-shaped gadget can suck away memories. After hearing "
            "Suneo's scary stories, Nobita is eager to see how it works."
        ),
        "story": [
            "Suneo's scary stories leave Nobita frightened. Doraemon shows "
            "him the Vacuum Mosquito, a gadget that can remove a memory.",

            "Nobita soon thinks of other memories he would like to erase. "
            "What starts as a way to forget a frightening story gets more "
            "complicated when he begins using the gadget for himself.",
        ],
        "gadgets": [
            "🦟 Vacuum Mosquito",
            "🧛 Dracula Gadget",
            "🚪 Anywhere Door",
            "🎒 Doraemon's Gadget Pocket",
        ],
        "about": (
            "The unusual gadget gives Nobita an easy way out of an "
            "embarrassing moment. The fun comes from watching him discover "
            "that removing a memory can create another problem."
        ),
    },

    4: {
        "title": "Nobita Ka Udan Khatola",
        "year": "1979",
        "rating": "8.9",
        "story_title": "Nobita Takes Flight",
        "intro": (
            "Nobita wants to see the world from above. With Doraemon's "
            "help, he finally gets a chance to take to the sky."
        ),
        "story": [
            "Nobita gets the chance to fly with one of Doraemon's gadgets. "
            "From up in the air, even familiar places look different.",

            "Learning to handle the flying gadget becomes an adventure of "
            "its own for Nobita and his friends.",
        ],
        "gadgets": [
            "🚁 Take-Copter",
            "🎒 4D Pocket",
        ],
        "about": (
            "Flying is one of Nobita's favourite uses for Doraemon's "
            "gadgets. In this episode, the attraction is simple: seeing "
            "everyday life from a completely different height."
        ),
    },

    5: {
        "title": "Nobita's Rocket to the Milky Way",
        "year": "1979",
        "rating": "9.1",
        "story_title": "Nobita's Space Adventure",
        "intro": (
            "Nobita dreams of seeing the Milky Way. Doraemon helps him "
            "take his curiosity beyond Earth."
        ),
        "story": [
            "Looking at the night sky makes Nobita wonder what it would "
            "be like to travel through space. Doraemon decides to help him "
            "experience that journey.",

            "With a rocket and Doraemon's futuristic gadgets, the friends "
            "set off to discover the world beyond their own planet.",
        ],
        "gadgets": [
            "🚀 Space Rocket",
            "🚁 Take-Copter",
            "🌌 Space Gadgets",
            "👜 4D Pocket",
        ],
        "about": (
            "The Milky Way gives this episode a different setting from "
            "Nobita's usual adventures. His curiosity, rather than a "
            "school problem, is what starts the journey."
        ),
    },

    6: {
        "title": "Doraemon Now Belongs to Suneo!?",
        "japanese": "ドラえもんはスネ夫のモノ!?",
        "year": "2005",
        "release": "February 25, 2005",
        "rating": "9.3",
        "story_title": "Doraemon Becomes Suneo's?",
        "intro": (
            "Suneo enjoys having Doraemon around, but Nobita begins to "
            "wonder what that means for his own friendship with Doraemon."
        ),
        "story": [
            "Nobita is surprised to find Doraemon spending time with "
            "Suneo. For Suneo, having Doraemon and his gadgets nearby is "
            "an exciting change.",

            "For Nobita, the same situation feels very different. He "
            "worries about losing his best friend and tries to understand "
            "what has happened.",
        ],
        "gadgets": common_gadgets,
        "about": (
            "Suneo sees the appeal of Doraemon's gadgets. Nobita's reaction "
            "shows how much he values the friend who carries them."
        ),
    },

    7: {
        "title": "The Premiere Seal - Pakado Nobita Ko",
        "year": "2005",
        "rating": "9.2",
        "story_title": "Pakado Nobita Ko",
        "intro": (
            "Nobita turns to Doraemon for help when another everyday "
            "problem gets out of hand."
        ),
        "story": [
            "Nobita finds himself in an unusual situation and looks to "
            "Doraemon for a solution.",

            "A futuristic gadget gives him something new to try, and his "
            "friends soon become part of the adventure.",
        ],
        "gadgets": common_gadgets,
        "about": (
            "Listed in the collection as The Premiere Seal - Pakado Nobita Ko, "
            "this is Episode 07 of Doraemon World."
        ),
    },

    8: {
        "title": "Nobita Company",
        "year": "2005",
        "rating": "9.2",
        "story_title": "Nobita Company",
        "intro": (
            "Nobita has an idea and turns to Doraemon's gadgets to put "
            "it into action."
        ),
        "story": [
            "Nobita gets involved in another unexpected situation. As "
            "usual, Doraemon has a gadget that might help.",

            "Once Nobita puts the idea into practice, what looked simple "
            "at first becomes more complicated.",
        ],
        "gadgets": common_gadgets,
        "about": (
            "Nobita Company is Episode 08 in this collection. It sits "
            "between Pakado Nobita Ko and Thambilina."
        ),
    },

    9: {
        "title": "Thambilina",
        "year": "2005",
        "rating": "9.1",
        "story_title": "Thambilina",
        "intro": (
            "Nobita and Doraemon return for another gadget adventure "
            "with their friends."
        ),
        "story": [
            "An unexpected situation sends Nobita looking for Doraemon's "
            "help. Doraemon brings out a gadget, giving Nobita a new way "
            "to tackle the problem.",

            "Trying it out leads to the comic complications familiar to "
            "Nobita and his friends.",
        ],
        "gadgets": common_gadgets,
        "about": (
            "Thambilina is Episode 09 in this collection. You can continue "
            "directly to Nobita and Non-chan using the next-episode link."
        ),
    },

    10: {
        "title": "Nobita and Non-chan",
        "year": "2005",
        "rating": "9.1",
        "story_title": "Nobita and Non-chan",
        "intro": (
            "Join Nobita and Doraemon for the tenth episode in the "
            "Doraemon World collection."
        ),
        "story": [
            "Nobita faces another unexpected situation and turns to "
            "Doraemon. With his friend nearby, he tries to find a way "
            "through it.",

            "Doraemon's gadgets bring their familiar mix of help, surprises "
            "and comedy to the adventure.",
        ],
        "gadgets": common_gadgets,
        "about": (
            "Nobita and Non-chan closes the current ten-episode collection. "
            "Use All Episodes below to return to the library."
        ),
    },
}


# ----------------------------------------------------------
# BUILD HTML USING THE SAME CLASSES AS EPISODE 01
# ----------------------------------------------------------

titles = {
    1: "Nobita and Doraemon's First Adventure",
    **{number: episode["title"] for number, episode in episodes.items()},
}


def chips(items):
    return "\n".join(f"<li>{escape(item)}</li>" for item in items)


def make_page(number, episode):
    num = f"{number:02d}"
    title = escape(episode["title"])
    year = escape(episode["year"])
    rating = escape(episode["rating"])
    category = "Classic"

    cover = f"../assets/episodes/covers/episode-{num}.jpg"
    video = f"../assets/episodes/compressed/episode-{num}.mp4"

    previous = number - 1
    following = number + 1

    previous_link = f"""
      <a href="episode-{previous:02d}.html">
        <small>← Previous episode</small>
        <strong>{previous:02d} · {escape(titles[previous])}</strong>
      </a>
    """

    if following in titles:
        next_link = f"""
          <a class="ep-next" href="episode-{following:02d}.html">
            <small>Next episode →</small>
            <strong>{following:02d} · {escape(titles[following])}</strong>
          </a>
        """
    else:
        next_link = """
          <a class="ep-next" href="../episodes.html">
            <small>Back to collection →</small>
            <strong>All Episodes</strong>
          </a>
        """

    facts = [
        ("Series", "Doraemon"),
        ("Episode", num),
        ("Title", episode["title"]),
        ("Category", category),
        ("Release", episode.get("release", episode["year"])),
    ]

    if "japanese" in episode:
        facts.append(("Japanese title", episode["japanese"]))

    fact_rows = "\n".join(
        f"<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>"
        for label, value in facts
    )

    story_paragraphs = "\n".join(
        f"<p>{escape(paragraph)}</p>" for paragraph in episode["story"]
    )

    main = f"""
<main class="dw-episode-main">

  <nav class="ep-crumbs" aria-label="Breadcrumb">
    <a href="../index.html">Home</a>
    <span aria-hidden="true">›</span>
    <a href="../episodes.html">Episodes</a>
    <span aria-hidden="true">›</span>
    <span aria-current="page">Episode {num}</span>
  </nav>

  <section class="ep-hero" aria-labelledby="episodeTitle">
    <div class="ep-art">
      <img src="{cover}" alt="{title}" fetchpriority="high">
      <span class="ep-cover-number">EPISODE {num}</span>

      <button
        class="ep-cover-play"
        type="button"
        data-play-episode
        aria-label="Play Episode {num}"
        aria-haspopup="dialog"
      >▶</button>
    </div>

    <div class="ep-hero-copy">
      <p class="ep-category">{category} episode</p>
      <h1 id="episodeTitle">{title}</h1>
      <p class="ep-intro">{escape(episode["intro"])}</p>

      <dl class="ep-stats">
        <div><dt>📺 Episode</dt><dd>{num}</dd></div>
        <div><dt>📅 Year</dt><dd>{year}</dd></div>
        <div><dt>⭐ Rating</dt><dd>{rating}</dd></div>
      </dl>

      <div class="ep-actions">
        <button
          class="ep-button ep-primary"
          type="button"
          data-play-episode
          aria-haspopup="dialog"
        >▶ Watch Episode</button>

        <a class="ep-button ep-secondary" href="../episodes.html">
          ← All Episodes
        </a>
      </div>
    </div>
  </section>

  <section class="ep-section" aria-labelledby="overviewTitle">
    <h2 id="overviewTitle">Episode Overview</h2>

    <div class="ep-overview">
      <a href="#story">
        <span class="ep-icon ep-sky" aria-hidden="true">📖</span>
        <div><small>Story</small><strong>{title}</strong></div>
      </a>

      <a href="#characters">
        <span class="ep-icon ep-pink" aria-hidden="true">👥</span>
        <div><small>Characters</small><strong>{len(common_characters)} main characters</strong></div>
      </a>

      <a href="#gadgets">
        <span class="ep-icon ep-yellow" aria-hidden="true">🔧</span>
        <div><small>Gadgets</small><strong>{len(episode["gadgets"])} featured gadgets</strong></div>
      </a>

      <a href="#details">
        <span class="ep-icon ep-mint" aria-hidden="true">🏷️</span>
        <div><small>Category</small><strong>{category}</strong></div>
      </a>
    </div>
  </section>

  <section class="ep-section" aria-labelledby="infoTitle">
    <h2 id="infoTitle">Episode Information</h2>

    <div class="ep-info-grid">
      <article class="ep-panel ep-story" id="story">
        <div class="ep-panel-head">
          <span class="ep-icon ep-sky" aria-hidden="true">📖</span>
          <div>
            <small>Story</small>
            <h3>{escape(episode["story_title"])}</h3>
          </div>
        </div>

        {story_paragraphs}
      </article>

      <article class="ep-panel" id="characters">
        <div class="ep-panel-head">
          <span class="ep-icon ep-pink" aria-hidden="true">👥</span>
          <h3>Main Characters</h3>
        </div>

        <ul class="ep-chips">{chips(common_characters)}</ul>
        <a class="ep-text-link" href="../characters.html">Explore characters →</a>
      </article>

      <article class="ep-panel" id="gadgets">
        <div class="ep-panel-head">
          <span class="ep-icon ep-yellow" aria-hidden="true">🔧</span>
          <h3>Featured Gadgets</h3>
        </div>

        <ul class="ep-chips">{chips(episode["gadgets"])}</ul>
        <a class="ep-text-link" href="../gadgets.html">Explore gadgets →</a>
      </article>

      <article class="ep-panel" id="details">
        <div class="ep-panel-head">
          <span class="ep-icon ep-mint" aria-hidden="true">ℹ️</span>
          <h3>Episode Details</h3>
        </div>

        <dl class="ep-facts">{fact_rows}</dl>
      </article>
    </div>
  </section>

  <section class="ep-about" aria-labelledby="aboutTitle">
    <h2 id="aboutTitle">💙 About This Episode</h2>
    <p>{escape(episode["about"])}</p>
  </section>

  <nav class="ep-pager" aria-label="Browse episodes">
    {previous_link}
    {next_link}
  </nav>

  <aside class="ad-space" aria-label="Advertisement">
    <small>Advertisement</small>
    <!-- Paste your responsive AdSense display ad unit here. -->
  </aside>

  <dialog class="ep-dialog" id="episodeDialog" aria-labelledby="videoTitle">
    <div class="ep-dialog-head">
      <h2 id="videoTitle">Episode {num} · {title}</h2>

      <button
        class="ep-close"
        id="closePlayer"
        type="button"
        aria-label="Close video player"
      >✕</button>
    </div>

    <video
      id="episodePlayer"
      controls
      playsinline
      preload="none"
      poster="{cover}"
      src="{video}"
    >
      Your browser does not support video playback.
    </video>

    <p class="ep-player-message" id="playerMessage" role="status" hidden></p>
  </dialog>

</main>
""".strip()

    # Keep Episode 01's header, footer, search link, bottom nav,
    # stylesheet links, AdSense loader and common player script.
    page, count = re.subn(
        r"<main\b[^>]*>.*?</main\s*>",
        lambda _: main,
        template,
        flags=re.IGNORECASE | re.DOTALL,
    )

    if count != 1:
        raise SystemExit("Episode 01 template mein exactly one <main> chahiye.")

    page = re.sub(
        r"<title>.*?</title>",
        lambda _: f"<title>Episode {num} · {title} | Doraemon World</title>",
        page,
        count=1,
        flags=re.IGNORECASE | re.DOTALL,
    )

    page = re.sub(
        r'<meta\b(?=[^>]*\bname=["\']description["\'])[^>]*>',
        lambda _: (
            f'<meta name="description" content="Watch Episode {num}, '
            f'{title}, and explore its story, characters and gadgets.">'
        ),
        page,
        count=1,
        flags=re.IGNORECASE,
    )

    return page


# Check the template before creating any pages.
required_parts = [
    "ep-hero",
    'id="episodeDialog"',
    "episode-details.css",
    "episode-details.js",
]

if any(part not in template for part in required_parts):
    raise SystemExit(
        "Pehle updated Episode 01 HTML save karo — "
        "wahi version jisme video popup aur Episode Overview hain."
    )

pages = {
    number: make_page(number, episode)
    for number, episode in episodes.items()
}

output_folder.mkdir(parents=True, exist_ok=True)

for number, page in pages.items():
    filename = output_folder / f"episode-{number:02d}.html"
    filename.write_text(page, encoding="utf-8")
    print(f"Created: {filename.name} — {titles[number]}")

print(f"\nAll 9 HTML pages are ready in:\n{output_folder}")