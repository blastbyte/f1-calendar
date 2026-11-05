# 2026 Grand Prix Calendar

A broadcast-style calendar for the 2026 Formula One season: a static site with no build step.

**Features**
- All 23 championship rounds. That includes the Bahrain Grand Prix re-staged at Sepang, Malaysia. The original April Bahrain and Saudi Arabia dates are shown as *called off*
- The race winner on each completed race, with their photo, team colour and name
- Official F1 race highlights in each completed race's detail view. Clicking the thumbnail opens the exact video on YouTube, because F1 disables embedding.
- A next-race hero panel with a live countdown and an animated track map with a glowing car
- For each circuit: country, flag, name, dates, length, laps, sprint weekends and the race lap record
- Track maps drawn as SVG from real circuit geometry, coloured by sector
- Track photos fetched live from Wikimedia Commons, credited in the detail view
- Season progress bar, filters (upcoming / completed / sprint) and a detail panel for each circuit
- Race start times converted to the viewer's local time zone

## Run locally

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

Add `?date=2026-05-01` to the URL to preview the calendar as of any date.

## Data sources
- Circuit layouts: [bacinger/f1-circuits](https://github.com/bacinger/f1-circuits) (MIT, see `js/TRACKS_LICENSE.md`), pre-converted to SVG paths in `js/tracks.js`
- Photos: Wikimedia Commons, via the Wikipedia API at runtime. A race can instead use a local photo in `assets/photos/` through its `image` field (Madring does). Driver photos are the lead image of each driver's Wikipedia article.
- Flags: flagcdn.com
- Calendar, winners, drivers, lap records and race times: `js/data.js`. Lap records are official race-lap records. Start times are approximate.

Unofficial fan project. Not affiliated with Formula One Group or the FIA.

## Deployment
- **GitHub Pages:** `.github/workflows/pages.yml` publishes the repo root on every push to `main`. In the repo, go to Settings → Pages → Build and deployment and set **Source** to **GitHub Actions** (one-time). The site is served at https://blastbyte.github.io/f1-calendar/.
- **Cloudflare Workers:** also auto-deploys from `main`.
