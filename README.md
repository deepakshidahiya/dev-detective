# Dev Detective

A client-side GitHub profile search tool with a head-to-head "Battle Mode" comparison feature, built entirely with vanilla HTML, CSS, and JavaScript.

## Overview

Dev Detective lets you look up any GitHub username and see their profile at a glance — avatar, bio, join date, and portfolio link — or pit two developers against each other in Battle Mode, comparing followers, public repositories, and account age with a visible score and category-by-category winner highlights.

The project was built as a learning exercise in native `fetch()`, `async`/`await`, DOM manipulation, and API error handling, without any frameworks or build tooling.

## Features

- **Single Search** — search any GitHub username and view their avatar, name, bio, join date, and portfolio/profile link
- **Battle Mode** — compare two GitHub users side-by-side:
  - Followers, following, public repositories, and account creation date for each
  - A visible score (e.g. `2 - 1`)
  - Per-category winner highlighting (Followers / Public Repos / Account Age)
  - Winner/Loser badges, or "It's a tie" when scores are equal
  - A "Battle Again" reset button
- **Robust state handling** — loading spinners, friendly error messages for invalid usernames, network failures, and GitHub API rate limits (403), with no stale data left over between searches
- **Responsive, accessible dark UI** — mobile-first layout, visible focus states, `aria-live` regions for loading/results, keyboard-friendly navigation

## Screenshots

> _Add screenshots or a short screen recording here before publishing — e.g. the Single Search result, Battle Mode result, and mobile view._

| Single Search | Battle Mode |
|---|---|
| _screenshot placeholder_ | _screenshot placeholder_ |

## Technologies used

- **HTML5** — semantic structure
- **CSS3** — custom properties (design tokens), Flexbox, media queries, no frameworks
- **Vanilla JavaScript (ES6+)** — `fetch`, `async`/`await`, `Promise.allSettled`, DOM APIs
- **GitHub REST API** — no build tools, no external libraries

## GitHub API usage

Dev Detective calls the public, unauthenticated GitHub REST API:

```
GET https://api.github.com/users/{username}
```

Notes:
- Unauthenticated requests are rate-limited to **60 requests per hour per IP** by GitHub. If you hit this limit, the app shows a friendly rate-limit message instead of a raw error.
- No API key, token, or secret is required or used anywhere in this project — all requests are made directly from the browser to GitHub's public API.
- Battle Mode fetches both usernames concurrently via `Promise.allSettled`, so one invalid username doesn't block the other from loading.

## Installation

No build step, no dependencies, no `npm install`. Clone or download the project:

```bash
git clone <this-repository-url>
cd dev-detective
```

## How to run locally

Because the app uses ES modules (`<script type="module">`), opening `index.html` directly via `file://` will **not** work — browsers block module scripts from loading over the `file://` protocol. Serve the folder over HTTP instead:

**Option A — VS Code Live Server extension**
Right-click `index.html` → "Open with Live Server".

**Option B — Python**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

**Option C — Node**
```bash
npx serve .
```

## Deployment

This is a fully static site — no server, no environment variables, no secrets — so it deploys as-is to any static host:

- **GitHub Pages**: push to a repository, then enable Pages in the repo settings (root or `/docs`, depending on your branch setup).
- **Netlify**: drag-and-drop the project folder, or connect the repository — no build command needed, publish directory is the project root.
- **Vercel**: import the repository — framework preset "Other", no build command, output directory is the project root.

## Future improvements

- Fetch and display each user's top repositories (by stars) in Single Search
- Persist recent searches (e.g. via `localStorage`)
- Add a light theme toggle
- Add automated tests (currently verified via manual and scripted browser testing, no test suite is checked into the repo)
- Optional GitHub personal access token support to raise the 60/hour rate limit for heavier use
