# Doraemon World
Copy the contents into the existing project folder containing index.html. The uploaded project omitted assets. Keep the original assets folder alongside index.html.

## Run locally
With Node.js 24 LTS installed, run this from the project folder.

    node backend/server.mjs

Open http://localhost:3000. To try chat on two devices on the same Wi-Fi, open the computer's LAN address with port 3000 on both devices. A room retains the most recent 60 messages in memory while its server is running. The count shows connected tabs.

## Existing Vercel or GitHub Pages frontend
Serve backend/server.mjs on one continuously running Node web service. Its start command is node backend/server.mjs. Set SITE_ORIGINS on that service to your comma-separated frontend origins such as https://doaeramon.vercel.app,https://het-soni.github.io. In js/site-config.js set chatBase to that service's HTTPS origin, then redeploy your frontend. Hosting both frontend and chat on the same Node service uses the default empty chatBase.

## Ads and quiz
The existing AdSense publisher script is included on content pages. Enter your numeric display ad slot in displaySlot in js/site-config.js to request manual display ads. With no slot configured, the section shows the site's own movie promotion. The 20/20 quiz result displays the ad section and a Show code button. Clicking Show code reveals the existing game password, including when third-party ads are blocked. This is a game unlock stored in public frontend code.

## Doraemon Buddy
Ask Buddy uses a small TF-IDF topic model fitted on the site's character and gadget entries plus navigation examples. It answers named-entity questions locally and can look up known birthday, family, home or movie fields. The AI page is voice-only and requires microphone permission. Voice uses the browser's speech support and falls back to the original remote AI endpoint for unmatched questions. To rebuild the topic model after editing the catalogue, run node tools/train-buddy.mjs.

## Account server
Use Node.js 24 LTS. Accounts and sessions are stored in SQLite. DW_ACCOUNT_DIR can point to a persistent disk on your Node host (default is .doraemon-world inside the server user's home). Serve the site from the same origin as the backend when possible. HTTPS is required in production. A static frontend uses chatBase for both chat and accounts; cross-site session cookies depend on browser settings. Sign up or sign in with the top-right account button.
