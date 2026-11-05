(() => {
  "use strict";

  const RACES = window.RACES;
  const TRACKS = window.TRACK_PATHS;

  // `?date=2026-07-01` lets you preview the calendar at any point in the season.
  const params = new URLSearchParams(location.search);
  const forced = params.get("date");
  const now = () => (forced ? new Date(forced + "T12:00:00Z") : new Date());

  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  /* ---------------- Season state ---------------- */
  let round = 0;
  RACES.forEach((r) => { if (!r.cancelled) r.round = ++round; });
  const TOTAL = round;

  function computeStatus() {
    const t = now().getTime();
    let nextFound = false;
    RACES.forEach((r) => {
      const raceEnd = new Date(r.raceUtc).getTime() + 2.5 * 3600e3;
      const weekendStart = new Date(r.start + "T00:00:00Z").getTime() - 12 * 3600e3;
      r.done = !r.cancelled && t > raceEnd;
      r.live = !r.cancelled && t >= weekendStart && t <= raceEnd;
      r.next = false;
      if (!r.cancelled && !r.done && !nextFound) { r.next = true; nextFound = true; }
    });
  }
  computeStatus();

  const fmtRange = (r) => {
    const s = new Date(r.start + "T00:00:00Z"), e = new Date(r.end + "T00:00:00Z");
    const dd = (d) => String(d.getUTCDate()).padStart(2, "0");
    return s.getUTCMonth() === e.getUTCMonth()
      ? `${dd(s)} – ${dd(e)} ${MONTHS[e.getUTCMonth()]}`
      : `${dd(s)} ${MONTHS[s.getUTCMonth()]} – ${dd(e)} ${MONTHS[e.getUTCMonth()]}`;
  };
  const fmtLocal = (iso) => new Intl.DateTimeFormat(undefined, {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  }).format(new Date(iso));
  const flag = (cc) => `<img class="flag" src="https://flagcdn.com/w80/${cc}.png" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`;

  /* ---------------- Track map SVG ---------------- */
  let svgId = 0;
  function trackSVG(id, { animate = false, car = false, mono = false } = {}) {
    const t = TRACKS[id];
    if (!t) return "";
    const uid = "t" + ++svgId;
    const [sx, sy] = t.start, [nx, ny] = t.next;
    let dx = nx - sx, dy = ny - sy;
    const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
    const px = -dy, py = dx; // perpendicular
    const fl = 16;
    const finish = `M${sx - px * fl},${sy - py * fl} L${sx + px * fl},${sy + py * fl}`;
    // direction chevron beside the start line
    const ax = sx + px * 34 + dx * 24, ay = sy + py * 34 + dy * 24;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const sectors = mono
      ? `<path class="sector mono" d="${t.path}"/>`
      : [0, 1, 2].map((i) => `<path class="sector s${i + 1}" d="${t.path}" pathLength="300" stroke-dasharray="100 200" stroke-dashoffset="${-100 * i}"/>`).join("");
    const mask = animate
      ? `<mask id="${uid}m" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1200" height="1200"><path d="${t.path}" pathLength="300" fill="none" stroke="#fff" stroke-width="40" stroke-linejoin="round" class="draw"/></mask>`
      : "";
    return `<svg class="track-svg" viewBox="0 0 1000 1000" role="img" aria-label="Track map">
      <defs>${mask}</defs>
      <g ${animate ? `mask="url(#${uid}m)"` : ""}>
        <path class="halo" d="${t.path}"/>
        <path class="base" d="${t.path}"/>
        ${sectors}
      </g>
      <path class="finish" d="${finish}"/><path class="finish-chk" d="${finish}"/>
      <polygon class="dir" points="-9,-8 9,0 -9,8 -4,0" transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(1.3)"/>
      ${car ? `<circle class="car" r="10"><animateMotion dur="14s" begin="2s" repeatCount="indefinite" rotate="auto" path="${t.path}"/></circle>` : ""}
    </svg>`;
  }

  /* ---------------- Circuit photos (Wikimedia Commons, via Wikipedia API) ----------------
   * 1. race.photo  – optional exact Commons filename override
   * 2. images used on the circuit's Wikipedia article, ranked by filename then size
   * 3. fallback: Wikimedia Commons file search for race.photoQuery || circuit name
   */
  const CACHE_KEY = "gp-photo-v3:";
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(CACHE_KEY + k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(CACHE_KEY + k, JSON.stringify(v)); } catch { /* ignore */ } },
  };
  const WP = "https://en.wikipedia.org/w/api.php?";
  const COMMONS = "https://commons.wikimedia.org/w/api.php?";
  const api = (base, q) => fetch(base + new URLSearchParams({ format: "json", origin: "*", ...q })).then((r) => r.json());
  const IINFO = { prop: "imageinfo", iiprop: "url|size|mime", iiurlwidth: "1600" };

  const BAD_WORDS = new Set(["logo", "flag", "map", "maps", "layout", "plan", "diagram", "portrait", "helmet", "signature",
    "trophy", "icon", "seal", "ticket", "poster", "badge", "banner", "crest", "stamp", "chart", "locator", "location", "coa", "render", "rendering"]);
  const words = (name) => name.toLowerCase().replace(/\.[a-z0-9]+$/, "").split(/[^a-z0-9À-ɏ]+/).filter(Boolean);
  const isBad = (name) => /coat[_ ]of[_ ]arms/i.test(name) || words(name).some((w) => BAD_WORDS.has(w));
  const GOOD = [
    [/aerial|luftbild|from[_ ]above|bird|drone|overview|panorama/i, 7],
    [/circuit|track|autodrom|ring|raceway|speedway|course|street|strip/i, 3],
    [/grid|start|race|grand[_ ]prix|\bgp\b|formula|\bf1\b/i, 2],
    [/pit|grandstand|straight|corner|turn|hairpin|chicane|curve|view|tribune|paddock|night/i, 2],
  ];
  function nameScore(name, r) {
    if (!/\.(jpe?g|webp)$/i.test(name) || isBad(name)) return null;
    let s = 0;
    GOOD.forEach(([re, w]) => { if (re.test(name)) s += w; });
    const lower = name.toLowerCase();
    (r.circuit + " " + r.city).toLowerCase().split(/[\s-]+/).filter((w) => w.length > 3)
      .forEach((w) => { if (lower.includes(w)) s += 2; });
    if (/20[12]\d/.test(name)) s += 1;
    return s;
  }
  function fullScore(p, r, bonus = 0) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii || !/jpe?g|webp/.test(ii.mime || "")) return null;
    const s0 = nameScore(p.title.replace(/^File:/, ""), r);
    if (s0 === null) return null;
    let s = s0 + bonus;
    const ratio = ii.width / ii.height;
    if (ratio >= 1.25) s += 3; else if (ratio < 1) s -= 4;
    if (ii.width < 800) s -= 6;
    return s;
  }
  const pickBest = (pages, r, bonusFn) => pages
    .map((p, i) => ({ p, s: fullScore(p, r, bonusFn ? bonusFn(p, i) : 0) }))
    .filter((x) => x.s !== null).sort((a, b) => b.s - a.s)[0];
  const toPhoto = (p) => p && {
    src: p.imageinfo[0].thumburl || p.imageinfo[0].url,
    page: p.imageinfo[0].descriptionurl,
    name: p.title.replace(/^File:/, ""),
  };

  async function findPhoto(r) {
    if (r.photo) {
      const d = await api(COMMONS, { action: "query", titles: "File:" + r.photo, ...IINFO });
      const p = Object.values(d.query?.pages || {})[0];
      if (p && p.imageinfo) return toPhoto(p);
    }
    // Step 1: list every file on the article (cheap, no thumbnail limit), shortlist by filename.
    const list = await api(WP, { action: "query", redirects: "1", titles: r.wiki, prop: "images", imlimit: "max" });
    const titles = Object.values(list.query?.pages || {}).flatMap((p) => (p.images || []).map((im) => im.title));
    const shortlist = titles
      .map((t) => ({ t, s: nameScore(t.replace(/^File:/, ""), r) }))
      .filter((x) => x.s !== null).sort((a, b) => b.s - a.s).slice(0, 15).map((x) => x.t);
    if (shortlist.length) {
      const d = await api(WP, { action: "query", titles: shortlist.join("|"), ...IINFO });
      const best = pickBest(Object.values(d.query?.pages || {}), r);
      if (best && best.s > -4) return toPhoto(best.p);
    }
    // Step 2: search Wikimedia Commons directly.
    const q = r.photoQuery || r.circuit;
    const d = await api(COMMONS, {
      action: "query", generator: "search", gsrsearch: `${q} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "25", ...IINFO,
    });
    const pages = Object.values(d.query?.pages || {});
    const best = pickBest(pages, r, (p) => Math.max(0, 6 - (p.index || 0) / 3)); // favour search relevance
    return best ? toPhoto(best.p) : null;
  }

  const queue = [];
  let active = 0;
  const inflight = {};
  function photoFor(r) {
    const cached = store.get(r.id);
    if (cached && cached.v && cached.t > Date.now() - 14 * 864e5) return Promise.resolve(cached.v);
    if (!inflight[r.id]) {
      inflight[r.id] = new Promise((resolve) => { queue.push({ r, resolve }); pump(); });
      inflight[r.id].then((v) => { if (!v) delete inflight[r.id]; }); // allow a retry later if nothing was found
    }
    return inflight[r.id];
  }
  function pump() {
    while (active < 4 && queue.length) {
      const { r, resolve } = queue.shift();
      active++;
      findPhoto(r)
        .then((v) => { if (v) store.set(r.id, { t: Date.now(), v }); resolve(v); })
        .catch(() => resolve(null))
        .finally(() => { active--; pump(); });
    }
  }
  function attachPhoto(img, r, onDone) {
    photoFor(r).then((v) => {
      if (!v) return onDone && onDone(null);
      img.onload = () => { img.classList.add("is-loaded"); onDone && onDone(v); };
      img.onerror = () => onDone && onDone(null);
      img.src = v.src;
      img.alt = `${r.circuit}`;
    });
  }

  /* ---------------- Hero ---------------- */
  let tick;
  function renderHero() {
    const hero = $("#hero");
    const r = RACES.find((x) => x.live) || RACES.find((x) => x.next);
    if (!r) {
      const last = [...RACES].reverse().find((x) => !x.cancelled);
      hero.innerHTML = `<div class="wrap hero__inner"><div>
        <span class="hero__tag"><span class="live"></span>Season complete</span>
        <h2 class="hero__name">That's a wrap on ${window.SEASON}</h2>
        <p class="hero__circuit">${TOTAL} Grands Prix contested. Final round: ${esc(last.gp)}.</p></div>
        <div class="hero__map">${trackSVG(last.id, { animate: true, car: true })}</div></div>`;
      return;
    }
    const tag = r.live ? "Race week — live" : "Next race";
    hero.innerHTML = `
      <div class="hero__photo" id="heroPhoto"></div>
      <div class="wrap hero__inner">
        <div>
          <span class="hero__tag"><span class="live"></span>${tag}</span>
          <div class="hero__round"><span class="num">R${String(r.round).padStart(2, "0")}</span><span class="of">Round ${r.round} of ${TOTAL}</span></div>
          <h2 class="hero__name">${esc(r.gp)}</h2>
          <div class="hero__circuit">${flag(r.cc)}<span>${esc(r.circuit)}</span><span>·</span><span>${esc(r.city)}, ${esc(r.country)}</span></div>
          <span class="hero__date">${fmtRange(r)} ${window.SEASON}${r.sprint ? " · Sprint" : ""}</span>
          <div class="countdown" id="countdown" aria-label="Countdown to lights out"></div>
          <div class="hero__actions">
            <button class="btn" data-open="${r.id}">Circuit guide
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>
            <a class="btn btn--ghost" href="#grid">Full calendar</a>
          </div>
        </div>
        <div class="hero__map">
          ${trackSVG(r.id, { animate: true, car: true })}
          <div class="hero__map-hud">
            <span>Lap record</span><b class="lap">${r.lapRecord.time}</b>
            <span>${esc(r.lapRecord.driver)} · ${r.lapRecord.year}</span>
          </div>
        </div>
      </div>`;
    const ph = $("#heroPhoto");
    photoFor(r).then((v) => {
      if (!v) return;
      const im = new Image();
      im.onload = () => { ph.style.backgroundImage = `url("${v.src}")`; ph.classList.add("is-loaded"); };
      im.src = v.src;
    });

    const cd = $("#countdown");
    const target = new Date(r.raceUtc).getTime();
    const draw = () => {
      let d = Math.max(0, target - now().getTime());
      const days = Math.floor(d / 864e5); d -= days * 864e5;
      const hrs = Math.floor(d / 36e5); d -= hrs * 36e5;
      const min = Math.floor(d / 6e4); d -= min * 6e4;
      const sec = Math.floor(d / 1e3);
      const cell = (n, l) => `<div class="countdown__cell"><b>${String(n).padStart(2, "0")}</b><span>${l}</span></div>`;
      cd.innerHTML = cell(days, "DAYS") + cell(hrs, "HRS") + cell(min, "MINS") + cell(sec, "SECS");
    };
    draw();
    clearInterval(tick);
    if (!forced) tick = setInterval(draw, 1000);
  }

  /* ---------------- Season meta + progress ---------------- */
  function renderMeta() {
    const done = RACES.filter((r) => r.done).length;
    const sprints = RACES.filter((r) => r.sprint && !r.cancelled).length;
    const km = RACES.filter((r) => !r.cancelled).reduce((a, r) => a + r.length * r.laps, 0);
    $("#seasonMeta").innerHTML = [
      [TOTAL, "Rounds"], [done, "Completed"], [TOTAL - done, "Remaining"], [sprints, "Sprints"], [Math.round(km).toLocaleString(), "Race km"],
    ].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join("");
    const p = $("#progress");
    p.style.setProperty("--n", TOTAL);
    p.innerHTML = RACES.filter((r) => !r.cancelled)
      .map((r) => `<i class="${r.done ? "done" : r.next ? "next" : ""}" title="R${r.round} ${esc(r.gp)}"></i>`).join("");
  }

  /* ---------------- Cards ---------------- */
  function badges(r) {
    const b = [];
    if (r.cancelled) b.push(`<span class="badge badge--off">Called off</span>`);
    else if (r.live) b.push(`<span class="badge badge--next">Live</span>`);
    else if (r.next) b.push(`<span class="badge badge--next">Next</span>`);
    else if (r.done) b.push(`<span class="badge badge--done">Completed</span>`);
    if (r.sprint && !r.cancelled) b.push(`<span class="badge badge--sprint">Sprint</span>`);
    if (r.newVenue) b.push(`<span class="badge badge--new">New</span>`);
    return b.join("");
  }

  function cardHTML(r, i) {
    const cls = ["card", r.done && "is-done", (r.next || r.live) && "is-next", r.cancelled && "is-cancelled"].filter(Boolean).join(" ");
    const roundLbl = r.cancelled ? `<b>—</b>` : `<b>R${String(r.round).padStart(2, "0")}</b>`;
    return `<article class="${cls}" style="--i:${i}" tabindex="0" role="button" data-open="${r.id}" aria-label="${esc(r.gp)} details">
      <div class="card__photo">
        <div class="ph"></div>
        <img data-photo="${r.id}" alt="" decoding="async">
        <div class="card__round">${roundLbl}</div>
        <div class="badges">${badges(r)}</div>
      </div>
      <div class="card__map">${trackSVG(r.id, { mono: r.cancelled })}</div>
      <div class="card__body">
        <div class="card__country">${flag(r.cc)}${esc(r.country)}</div>
        <h3 class="card__gp">${esc(r.gp.replace(/ Grand Prix$/, ""))}</h3>
        <div class="card__circuit">${esc(r.circuit)}</div>
        <span class="card__date">${fmtRange(r)}</span>
      </div>
      <div class="card__stats">
        <div><span class="k">Length</span><span class="v">${r.length.toFixed(3)}<small> km</small></span></div>
        <div><span class="k">Laps</span><span class="v">${r.laps}</span></div>
        <div><span class="k">Lap record</span><span class="v lap">${r.lapRecord.time}</span>
          <span class="lap-by">${esc(r.lapRecord.driver)} · ${r.lapRecord.year}</span></div>
      </div>
    </article>`;
  }

  let filter = "all";
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const r = RACES.find((x) => x.id === e.target.dataset.photo);
      attachPhoto(e.target, r);
    });
  }, { rootMargin: "400px" }) : null;

  function renderGrid() {
    const list = RACES.filter((r) => {
      if (filter === "upcoming") return !r.done && !r.cancelled;
      if (filter === "completed") return r.done;
      if (filter === "sprint") return r.sprint && !r.cancelled;
      return true;
    });
    const grid = $("#grid");
    grid.innerHTML = list.map(cardHTML).join("");
    grid.querySelectorAll("img[data-photo]").forEach((img) => {
      if (io) io.observe(img);
      else attachPhoto(img, RACES.find((x) => x.id === img.dataset.photo));
    });
  }

  /* ---------------- Modal ---------------- */
  const modal = $("#modal");
  function openModal(id) {
    const r = RACES.find((x) => x.id === id);
    if (!r) return;
    const dist = (r.length * r.laps).toFixed(3);
    const rows = [
      ["Status", r.cancelled ? "Called off" : r.live ? "Race week" : r.done ? "Completed" : r.next ? "Next race" : "Upcoming"],
      ["Race start (your time)", r.cancelled ? "—" : fmtLocal(r.raceUtc), "time"],
      ["Weekend format", r.sprint ? "Sprint weekend" : "Conventional"],
      ["Circuit length", `${r.length.toFixed(3)} km`],
      ["Number of laps", r.laps],
      ["Race distance", `${dist} km`],
      ["Corners", r.turns],
      ["First Grand Prix", r.firstGp],
      ["Circuit type", r.type + (r.night ? " · Night race" : "") + (r.saturday ? " · Saturday race" : "")],
    ];
    modal.innerHTML = `
      <button class="modal__close" aria-label="Close" data-close>✕</button>
      <div class="modal__hero"><img id="modalImg" alt=""><a class="modal__credit" id="modalCredit" target="_blank" rel="noopener"></a></div>
      <div class="modal__head">
        <div class="card__country">${flag(r.cc)}${esc(r.city)}, ${esc(r.country)} · ${r.cancelled ? "Called off" : "Round " + r.round}</div>
        <h2 id="modalTitle">${esc(r.gp)}</h2>
        <div class="hero__circuit">${esc(r.circuit)}</div>
        <span class="hero__date">${fmtRange(r)} ${window.SEASON}</span>
      </div>
      <div class="modal__body">
        <div class="modal__map">
          ${trackSVG(r.id, { animate: true, car: !r.cancelled })}
          <div class="legend"><span><i style="background:var(--s1)"></i>S1</span><span><i style="background:var(--s2)"></i>S2</span><span><i style="background:var(--s3)"></i>S3</span></div>
        </div>
        <div class="tower">
          <div class="tower__row tower__row--record">
            <span class="k">Lap record</span>
            <span><span class="v">${r.lapRecord.time}</span><span class="lap-by">${esc(r.lapRecord.driver)} · ${esc(r.lapRecord.team)} · ${r.lapRecord.year}</span></span>
          </div>
          ${rows.map(([k, v, m]) => `<div class="tower__row ${m ? "tower__row--" + m : ""}"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join("")}
        </div>
      </div>`;
    attachPhoto($("#modalImg", modal), r, (v) => {
      const c = $("#modalCredit", modal);
      if (v) { c.href = v.page; c.textContent = "Photo: Wikimedia Commons — " + v.name.replace(/\.[a-z]+$/i, "").replace(/_/g, " "); }
    });
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) modal.close();
  });

  /* ---------------- Events ---------------- */
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) openModal(o.dataset.open);
    const f = e.target.closest("[data-filter]");
    if (f) {
      filter = f.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => {
        const on = b === f; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on);
      });
      renderGrid();
    }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("article[data-open]")) {
      e.preventDefault(); openModal(e.target.dataset.open);
    }
  });

  renderHero();
  renderMeta();
  renderGrid();
})();
