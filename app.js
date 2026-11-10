(function () {
  "use strict";

  const STORE = "ltn-recall-v1";
  const DAY = 86400000;
  const TIER = { 1: "Quick win", 2: "Easy", 3: "Steady", 4: "Tough", 5: "Brutal" };
  const TIER_HINT = {
    1: "definitions and one-word facts",
    2: "single facts and vivid stories",
    3: "two-part fill-ins, 'give any 2'",
    4: "multi-fact answers, names and dates",
    5: "long lists and date clusters"
  };
  const DECK_NAME = {};
  DECKS.forEach(function (d) { DECK_NAME[d.id] = d.short; });

  /* ------------------------------------------------------------------ state */

  function blankCard() {
    return { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0, streak: 0, seen: 0, correct: 0, last: null };
  }

  let state = loadState();
  let session = null;
  let current = null;
  let revealed = false;
  let lastFilter = null;

  function loadState() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) { raw = {}; }
    const pick = { chapter: "all", difficulty: "all" };
    if (raw.pick && typeof raw.pick === "object") {
      if (typeof raw.pick.chapter === "string") pick.chapter = raw.pick.chapter;
      if (typeof raw.pick.difficulty === "string") pick.difficulty = raw.pick.difficulty;
    } else if (typeof raw.deck === "string") {
      // Older saves kept a single selected deck.
      if (/^d[1-5]$/.test(raw.deck)) pick.difficulty = raw.deck;
      else pick.chapter = raw.deck;
    }

    return {
      cards: raw.cards && typeof raw.cards === "object" ? raw.cards : {},
      pick: pick,
      group: raw.group === "difficulty" ? "difficulty" : "chapter",
      theme: raw.theme === "light" ? "light" : "dark",
      sessions: Array.isArray(raw.sessions) ? raw.sessions.slice(-40) : []
    };
  }

  function saveState() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
  }

  function cardOf(id) {
    return Object.assign(blankCard(), state.cards[id] || {});
  }

  function putCard(id, s) {
    state.cards[id] = s;
  }

  // Mastery ladder, mirroring the Latin app's box levels.
  const LEVELS = [
    [0, "New"],
    [1, "Learning"],
    [2, "Shaky"],
    [3, "Familiar"],
    [4, "Solid"],
    [5, "Mastered"]
  ];

  // Cards currently on the stats page, so "Drill these" can target exactly them.
  let trickyIds = [];

  function levelOf(s) {
    if (!s.seen) return 0;
    if (s.streak <= 0) return 1;
    if (s.streak === 1) return s.last === 1 ? 2 : 3;
    if (s.streak === 2) return 4;
    return 5;
  }

  /* --------------------------------------------------------------- questions */

  function isWeak(q) {
    const s = cardOf(q.id);
    if (!s.seen || s.streak >= 2) return false;
    return s.lapses > 0 || s.last === 0 || s.last === 1 || s.last === null;
  }

  function cardsFor(filter) {
    if (Array.isArray(filter)) {
      const ids = new Set(filter);
      return QUESTIONS.filter(function (q) { return ids.has(q.id); });
    }
    if (filter === "all") return QUESTIONS.slice();
    if (filter === "weak") return QUESTIONS.filter(isWeak);
    const tier = /^d([1-5])$/.exec(filter);
    if (tier) return QUESTIONS.filter(function (q) { return q.d === Number(tier[1]); });
    return QUESTIONS.filter(function (q) { return q.deck === filter; });
  }

  function activeFilter() {
    return state.pick[state.group] || "all";
  }

  // Short name for the current selection, used on the start button.
  function selName(id) {
    if (id === "weak") return "weak spots";
    const tier = /^d([1-5])$/.exec(id);
    if (tier) return "tier " + tier[1];
    return DECK_NAME[id] || "cards";
  }

  function deckProgress(filter) {
    const list = cardsFor(filter);
    let solid = 0;
    list.forEach(function (q) { if (cardOf(q.id).streak >= 2) solid++; });
    return { solid: solid, total: list.length };
  }

  /* ------------------------------------------------------------- scheduling */

  // How many cards from now a card returns within the session.
  function gapFor(s, grade) {
    const base = [3, 5, 7, 16][grade];
    const easeF = 0.55 + 0.45 * (s.ease / 2.5);
    const streakF = 1 + 0.3 * Math.max(0, Math.min(s.streak - 1, 4));
    return Math.max(2, Math.round(base * easeF * streakF));
  }

  function applyGrade(id, grade) {
    const s = cardOf(id);
    s.seen += 1;
    s.reps += 1;

    if (grade === 0) {
      s.lapses += 1;
      s.streak = 0;
      s.ease = Math.max(1.3, s.ease - 0.2);
    } else {
      s.correct += 1;
      // "Hard" means it is not secure yet: it gets asked again, but does not
      // count towards the two clean recalls needed to retire the card.
      if (grade !== 1) s.streak += 1;
      if (grade === 1) s.ease = Math.max(1.3, s.ease - 0.12);
      if (grade === 3) s.ease = Math.min(3.0, s.ease + 0.12);
    }

    // Interval in days, used when you come back for another session.
    if (grade === 0) {
      s.interval = 0;
    } else if (grade === 1) {
      s.interval = Math.max(1, Math.round((s.interval || 0) * 0.8));
    } else if ((s.interval || 0) < 1) {
      s.interval = grade === 3 ? 2 : 1;
    } else {
      const f = grade === 3 ? s.ease * 1.25 : s.ease;
      s.interval = Math.max(1, Math.min(60, Math.round(s.interval * f)));
    }

    s.due = Date.now() + s.interval * DAY;
    s.last = grade;
    putCard(id, s);
    return gapFor(s, grade);
  }

  /* ---------------------------------------------------------------- session */

  function buildSession(filter) {
    const list = cardsFor(filter);
    const reviews = [];
    const fresh = [];

    list.forEach(function (q, i) {
      const s = cardOf(q.id);
      if (s.seen > 0) reviews.push({ id: q.id, due: s.due || 0, i: i });
      else fresh.push({ id: q.id, d: q.d || 3, i: i });
    });

    // Due cards first (oldest due first); brand-new cards in easiest-to-hardest order.
    reviews.sort(function (a, b) { return a.due - b.due || a.i - b.i; });
    fresh.sort(function (a, b) { return a.d - b.d || a.i - b.i; });

    const items = [];
    let pos = 0;
    reviews.forEach(function (it) { items.push({ id: it.id, pos: pos++ }); });
    fresh.forEach(function (it) { items.push({ id: it.id, pos: pos++ }); });

    session = {
      filter: filter,
      items: items,
      total: items.length,
      retired: new Set(),
      answered: 0,
      correct: 0,
      tick: 0,
      firstPass: {},
      grades: [0, 0, 0, 0],
      startedAt: Date.now()
    };
    saveState();
    return session;
  }

  function takeNext() {
    session.items.sort(function (a, b) { return a.pos - b.pos; });
    const item = session.items.shift();
    session.tick += 1;
    current = item;
    revealed = false;
  }

  function gradeAndAdvance(grade) {
    if (!session || !current) return;
    const id = current.id;
    const gap = applyGrade(id, grade);

    session.answered += 1;
    session.grades[grade] += 1;
    if (grade >= 2) session.correct += 1;
    if (session.firstPass[id] === undefined) session.firstPass[id] = grade;

    const s = cardOf(id);
    const known = grade === 3 || s.streak >= 2;
    if (known) {
      session.retired.add(id);
    } else {
      session.items.push({ id: id, pos: session.tick + gap });
    }

    saveState();
    current = null;
    advance();
  }

  function advance() {
    if (!session || session.items.length === 0) {
      finishSession();
      return;
    }
    takeNext();
    renderCard();
  }

  function finishSession() {
    const s = session;
    const ids = Object.keys(s.firstPass);
    let firsts = 0;
    ids.forEach(function (id) { if (s.firstPass[id] >= 2) firsts++; });
    const entry = {
      at: Date.now(),
      filter: Array.isArray(s.filter) ? "tricky" : s.filter,
      cards: ids.length,
      firstPass: firsts,
      seconds: Math.round((Date.now() - s.startedAt) / 1000)
    };
    state.sessions = (state.sessions || []).concat([entry]).slice(-40);
    saveState();
    session = null;
    current = null;
    renderSummary(entry);
    show("summaryView");
  }

  /* --------------------------------------------------------------- rendering */

  const $ = function (id) { return document.getElementById(id); };

  function show(viewId) {
    ["homeView", "studyView", "summaryView", "browseView", "statsView"].forEach(function (v) {
      $(v).hidden = v !== viewId;
    });

    // Studying is a focus mode: no tabs to tap by accident mid-session.
    const focusMode = viewId === "studyView" || viewId === "summaryView";
    document.body.classList.toggle("focus-mode", focusMode);
    $("tabbar").hidden = focusMode;
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      if (b.dataset.view === viewId) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderSubtitle() {
    $("subtitle").textContent = QUESTIONS.length + " questions · 4 test papers";
  }

  function renderHome() {
    // Filter tiles: by chapter or by difficulty tier.
    let decks;
    if (state.group === "difficulty") {
      decks = [{ id: "all", title: "All difficulties", sub: "Every card, easiest to hardest" }];
      [1, 2, 3, 4, 5].forEach(function (t) {
        const n = QUESTIONS.filter(function (q) { return q.d === t; }).length;
        decks.push({
          id: "d" + t,
          title: "Tier " + t + " — " + TIER[t],
          sub: n + " cards · " + TIER_HINT[t],
          tier: t
        });
      });
    } else {
      decks = [{ id: "all", title: "All questions", sub: "Every card from the four papers" }]
        .concat(DECKS.map(function (d) { return { id: d.id, title: d.title, sub: d.sub }; }));
    }

    const weakCount = cardsFor("weak").length;
    if (weakCount > 0) {
      decks.push({ id: "weak", title: "Weak spots", sub: "Cards you keep getting wrong" });
    }

    document.querySelectorAll(".seg-btn").forEach(function (b) {
      const on = b.dataset.group === state.group;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const active = activeFilter();
    $("deckList").innerHTML = decks.map(function (d) {
      const p = deckProgress(d.id);
      const pct = p.total ? Math.round((p.solid / p.total) * 100) : 0;
      return '<button type="button" class="deck' + (d.id === active ? " active" : "") + '" data-deck="' + d.id + '">' +
        '<span class="deck-body">' +
          '<span class="deck-title">' +
            (d.tier ? '<span class="swatch t' + d.tier + '"></span>' : "") +
            esc(d.title) +
          "</span>" +
          '<span class="deck-sub">' + esc(d.sub) + "</span>" +
        "</span>" +
        '<span class="deck-right">' +
          '<span class="deck-frac">' + p.solid + "/" + p.total + "</span>" +
          '<span class="deck-bar"><span style="width:' + pct + '%"></span></span>' +
        "</span>" +
      "</button>";
    }).join("");

    // Up next preview
    const preview = cardsFor(active === "weak" && weakCount === 0 ? "all" : active);
    const ordered = preview.slice().sort(function (a, b) {
      const sa = cardOf(a.id), sb = cardOf(b.id);
      const ra = sa.seen ? 0 : 1, rb = sb.seen ? 0 : 1;
      if (ra !== rb) return ra - rb;
      if (ra === 0) return (sa.due || 0) - (sb.due || 0);
      return (a.d || 3) - (b.d || 3);
    }).slice(0, 5);

    $("focusCount").textContent = preview.length + " cards";
    $("focusList").innerHTML = ordered.map(function (q) {
      return "<li>" + esc(q.q.length > 88 ? q.q.slice(0, 86) + "…" : q.q) + "</li>";
    }).join("") || '<li class="muted">Nothing here yet.</li>';

    // Stats
    let solid = 0, learning = 0, seen = 0, correct = 0, due = 0;
    const now = Date.now();
    QUESTIONS.forEach(function (q) {
      const s = cardOf(q.id);
      if (s.seen) { seen += s.seen; correct += s.correct; }
      if (s.streak >= 2) solid++;
      else if (s.seen) { learning++; if (s.due <= now) due++; }
    });
    const acc = seen ? Math.round((correct / seen) * 100) + "%" : "—";

    $("homeStatsText").textContent =
      solid + " known cold · " + learning + " learning · " +
      (QUESTIONS.length - solid - learning) + " not started · " + acc + " accuracy";

    $("studyBtn").textContent = !preview.length
      ? "Start studying"
      : active === "all"
        ? "Start studying · " + preview.length + " cards"
        : "Study " + selName(active) + " · " + preview.length + " cards";
  }

  function renderCard() {
    const q = QUESTIONS.find(function (x) { return x.id === current.id; });
    const s = cardOf(q.id);

    $("cardDeck").textContent = DECK_NAME[q.deck] + " · Q" + q.n;
    const tier = $("cardTier");
    tier.className = "tier t" + q.d;
    tier.textContent = TIER[q.d];
    $("cardSeen").textContent = s.seen ? "seen " + s.seen + "×" : "first time";

    $("qText").textContent = q.q;
    $("aText").textContent = q.a;
    if (q.note) {
      $("aNote").textContent = q.note;
      $("aNote").hidden = false;
    } else {
      $("aNote").hidden = true;
      $("aNote").textContent = "";
    }

    $("answerBox").hidden = true;
    $("revealBtn").hidden = false;
    $("gradeRow").hidden = true;

    const done = session.retired.size;
    const pct = session.total ? Math.round((done / session.total) * 100) : 0;
    $("progFill").style.width = pct + "%";
    $("progText").textContent = done + "/" + session.total;

    const card = $("flashcard");
    card.classList.remove("flip");
    void card.offsetWidth;
    card.classList.add("flip");
    card.scrollTop = 0;
  }

  function reveal() {
    if (!current || revealed) return;
    revealed = true;
    $("answerBox").hidden = false;
    $("revealBtn").hidden = true;
    $("gradeRow").hidden = false;
  }

  function renderSummary(entry) {
    const acc = entry.cards ? Math.round((entry.firstPass / entry.cards) * 100) : 0;
    const mins = Math.max(1, Math.round(entry.seconds / 60));
    $("sumTitle").textContent = "Session complete";
    $("sumLede").textContent = entry.firstPass === entry.cards
      ? "Every card right first time. Those are now spaced far apart — come back tomorrow and they will barely have faded."
      : "Missed cards came back round more often — exactly what you want before a test. Run it again while it is fresh.";
    $("sumStats").innerHTML = [
      [entry.cards, "cards studied"],
      [acc + "%", "right first time"],
      [mins + " min", "time on task"]
    ].map(function (p) {
      return '<div class="stat"><b>' + p[0] + "</b><span>" + p[1] + "</span></div>";
    }).join("");
  }

  function renderBrowse(filter) {
    const query = (filter || "").trim().toLowerCase();
    const list = QUESTIONS.filter(function (q) {
      if (!query) return true;
      return (q.q + " " + q.a + " " + (q.note || "")).toLowerCase().indexOf(query) !== -1;
    });

    $("noResults").hidden = list.length > 0;
    $("browseList").innerHTML = list.map(function (q) {
      const s = cardOf(q.id);
      const dots = [0, 1, 2].map(function (i) {
        if (s.lapses > 0 && s.streak <= i) return '<span class="dot lapse"></span>';
        if (s.streak > i) return '<span class="dot on"></span>';
        if (s.seen && s.last === 1) return '<span class="dot hard"></span>';
        return '<span class="dot"></span>';
      }).join("");

      return '<article class="browse-item">' +
        '<div class="b-meta">' +
          '<span class="pill sm">' + DECK_NAME[q.deck] + " · Q" + q.n + "</span>" +
          '<span class="tier t' + q.d + '">' + TIER[q.d] + "</span>" +
          '<span class="mastery" title="Mastery">' + dots + "</span>" +
        "</div>" +
        '<p class="q">' + esc(q.q) + "</p>" +
        '<p class="a">' + esc(q.a) + "</p>" +
      "</article>";
    }).join("");
  }

  function renderStats() {
    const tally = [0, 0, 0, 0, 0, 0];
    let reviews = 0, correct = 0;
    QUESTIONS.forEach(function (q) {
      const s = cardOf(q.id);
      tally[levelOf(s)] += 1;
      reviews += s.seen;
      correct += s.correct;
    });
    const acc = reviews ? Math.round((correct / reviews) * 100) + "%" : "—";

    $("statsRow").innerHTML = [
      ["New", tally[0]],
      ["Learning", tally[1] + tally[2]],
      ["Familiar", tally[3]],
      ["Solid", tally[4]],
      ["Mastered", tally[5]],
      ["Accuracy", acc]
    ].map(function (c) {
      return "<div><dt>" + c[0] + "</dt><dd>" + c[1] + "</dd></div>";
    }).join("");

    $("statsLegend").innerHTML = LEVELS.map(function (l) {
      return '<span class="legend-item"><i class="swatch m' + l[0] + '"></i>' + l[1] + "</span>";
    }).join("");

    // One grid per paper: every card as a numbered cell tinted by its level.
    $("statsGrids").innerHTML = DECKS.map(function (d) {
      const list = QUESTIONS.filter(function (q) { return q.deck === d.id; });
      let solid = 0;
      const body = list.map(function (q) {
        const s = cardOf(q.id);
        const lv = levelOf(s);
        if (lv >= 4) solid++;
        const tip = "Q" + q.n + " · " + LEVELS[lv][1] +
          (s.seen ? " · seen " + s.seen + "×, " + s.lapses + " miss" + (s.lapses === 1 ? "" : "es") : "");
        return '<span class="mcell m' + lv + '" title="' + esc(tip) + '">' + q.n + "</span>";
      }).join("");

      return '<article class="panel deck-stats">' +
        '<div class="panel-split">' +
          "<div>" +
            '<h2 class="panel-title">' + esc(d.title) + "</h2>" +
            '<p class="sub">' + esc(d.sub) + "</p>" +
          "</div>" +
          '<span class="tag">' + solid + "/" + list.length + " solid</span>" +
        "</div>" +
        '<div class="mcell-grid">' + body + "</div>" +
      "</article>";
    }).join("");

    const tricky = QUESTIONS.filter(function (q) { return cardOf(q.id).seen > 0; })
      .map(function (q) { return { q: q, s: cardOf(q.id) }; })
      .sort(function (a, b) {
        return levelOf(a.s) - levelOf(b.s) || b.s.lapses - a.s.lapses || b.s.seen - a.s.seen;
      })
      .slice(0, 8);

    trickyIds = tricky.map(function (t) { return t.q.id; });

    const drill = $("drillWeakBtn");
    drill.hidden = tricky.length === 0;
    drill.textContent = tricky.length === 1 ? "Drill this card" : "Drill these " + tricky.length;

    $("statsWeak").innerHTML = tricky.length
      ? tricky.map(function (t) {
          const meta = DECK_NAME[t.q.deck] + " · Q" + t.q.n + " · seen " + t.s.seen + "×" +
            (t.s.lapses ? ", " + t.s.lapses + " miss" + (t.s.lapses === 1 ? "" : "es") : "");
          return "<li>" +
            '<span class="weak-q">' + esc(t.q.q) + "</span>" +
            '<span class="weak-lv m' + levelOf(t.s) + '">' + LEVELS[levelOf(t.s)][1] + "</span>" +
            '<span class="weak-meta">' + meta + "</span>" +
          "</li>";
        }).join("")
      : '<li class="weak-empty">Nothing to criticise yet. Finish a session and your weak spots show up here.</li>';
  }

  /* ----------------------------------------------------------------- actions */

  function startSession(filter) {
    let list = cardsFor(filter);
    // "Weak spots" empties out once everything is fixed — fall back to all cards.
    if (!list.length && filter !== "all") { filter = "all"; list = cardsFor("all"); }
    if (!list.length) return;
    buildSession(filter);
    show("studyView");
    takeNext();
    renderCard();
  }

  function resetAll() {
    if (!window.confirm("Erase all progress and start from scratch?")) return;
    state.cards = {};
    state.sessions = [];
    trickyIds = [];
    saveState();
    renderHome();
    renderStats();
  }

  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    applyTheme();
    saveState();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "light" ? "#f4eee2" : "#14110d");
    $("themeBtn").textContent = state.theme === "light" ? "◑" : "◐";
  }

  /* ------------------------------------------------------------------- wiring */

  function wire() {
    $("themeBtn").addEventListener("click", toggleTheme);

    $("deckList").addEventListener("click", function (e) {
      const btn = e.target.closest(".deck");
      if (!btn) return;
      state.pick[state.group] = btn.dataset.deck;
      saveState();
      renderHome();
    });

    $("filterGroup").addEventListener("click", function (e) {
      const btn = e.target.closest(".seg-btn");
      if (!btn) return;
      state.group = btn.dataset.group;
      saveState();
      renderHome();
    });

    $("studyBtn").addEventListener("click", function () {
      lastFilter = activeFilter();
      startSession(lastFilter);
    });

    $("againBtn").addEventListener("click", function () {
      startSession(lastFilter || "all");
    });

    $("sumHomeBtn").addEventListener("click", function () {
      renderHome();
      show("homeView");
    });

    $("backBtn").addEventListener("click", function () {
      session = null;
      current = null;
      renderHome();
      show("homeView");
    });

    $("revealBtn").addEventListener("click", reveal);

    $("flashcard").addEventListener("click", function () {
      if (!revealed) reveal();
    });

    $("gradeRow").addEventListener("click", function (e) {
      const btn = e.target.closest(".grade");
      if (!btn) return;
      gradeAndAdvance(Number(btn.dataset.grade));
    });

    $("searchInput").addEventListener("input", function (e) {
      renderBrowse(e.target.value);
    });

    $("statsResetBtn").addEventListener("click", resetAll);

    document.querySelectorAll(".tab-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        const target = b.dataset.view;
        if (target === "homeView") renderHome();
        if (target === "statsView") renderStats();
        if (target === "browseView") {
          $("searchInput").value = "";
          renderBrowse("");
        }
        show(target);
      });
    });

    $("homeStatsLink").addEventListener("click", function () {
      renderStats();
      show("statsView");
    });

    $("drillWeakBtn").addEventListener("click", function () {
      if (!trickyIds.length) return;
      lastFilter = trickyIds.slice();
      startSession(lastFilter);
    });

    document.addEventListener("keydown", function (e) {
      if ($("studyView").hidden) return;
      if (!current) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!revealed) reveal();
        else gradeAndAdvance(2);
        return;
      }
      if (!revealed) {
        if (e.key === "r" || e.key === "R") { reveal(); }
        return;
      }
      const map = { "1": 0, "2": 1, "3": 2, "4": 3 };
      if (map[e.key] !== undefined) {
        e.preventDefault();
        gradeAndAdvance(map[e.key]);
      }
    });
  }

  /* --------------------------------------------------------------------- init */

  applyTheme();
  renderSubtitle();
  renderHome();
  wire();
  show("homeView");
})();
