// Pure board state logic — no DOM. Works in the browser (window.Board) and in Node (module.exports).
(function (root) {
  const COLUMNS = [
    { id: 'waiting', title: 'On Hold' },
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' },
  ];

  // Change-log capacity per card (FIFO: oldest entries are dropped first).
  const LOG_LIMIT = 30;

  function createBoard() {
    return { columns: COLUMNS.map(c => ({ id: c.id, title: c.title, cardIds: [] })), cards: {}, nextId: 1 };
  }

  function addCard(state, title, colId = 'todo') {
    title = String(title || '').trim();
    if (!title) return state;
    const id = 'c' + state.nextId;
    const now = Date.now();
    return {
      ...state,
      nextId: state.nextId + 1,
      cards: { ...state.cards, [id]: { id, title, created: now, log: [{ ts: now, text: 'Card created' }] } },
      columns: state.columns.map(c => c.id === colId ? { ...c, cardIds: [...c.cardIds, id] } : c),
    };
  }

  // Append one change-log entry to cards[id]; newest last, capped at LOG_LIMIT.
  // Mutates only the passed shallow cards copy (callers own that copy).
  function addLog(cards, id, text) {
    cards[id] = { ...cards[id], log: [...(cards[id].log || []), { ts: Date.now(), text }].slice(-LOG_LIMIT) };
  }

  // Describe the delta between two string lists as "+a, +b, -c" ('' when identical).
  function listDiffLabel(oldList, newList) {
    const old = oldList || [], next = newList || [];
    const added = next.filter(x => !old.includes(x)).map(x => '+' + x);
    const removed = old.filter(x => !next.includes(x)).map(x => '-' + x);
    return [...added, ...removed].join(', ');
  }

  // Build human-readable change-log lines for the differences between two
  // versions of one card. Descriptions never leak content (too large for a log).
  function diffLog(oldCard, newCard) {
    const lines = [];
    if (newCard.title !== oldCard.title) lines.push('Title: "' + oldCard.title + '" → "' + newCard.title + '"');
    if ((newCard.description || '') !== (oldCard.description || '')) lines.push('Description changed');
    if ((newCard.priority || 'none') !== (oldCard.priority || 'none'))
      lines.push('Priority: ' + (oldCard.priority || 'none') + ' → ' + (newCard.priority || 'none'));
    if ((newCard.due || '') !== (oldCard.due || '')) lines.push('Due date: ' + (oldCard.due || '—') + ' → ' + (newCard.due || '—'));
    const tags = listDiffLabel(oldCard.tags, newCard.tags); if (tags) lines.push('Tags: ' + tags);
    const aff = listDiffLabel(oldCard.affects, newCard.affects); if (aff) lines.push('Affects: ' + aff);
    const lnk = listDiffLabel(oldCard.links, newCard.links); if (lnk) lines.push('Links: ' + lnk);
    return lines;
  }

  function findColumnIndex(state, cardId) {
    return state.columns.findIndex(c => c.cardIds.includes(cardId));
  }

  // Move a card by `delta` columns (-1 = left, +1 = right); appended to the end of the target column.
  function shiftCard(state, cardId, delta) {
    const from = findColumnIndex(state, cardId);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= state.columns.length) return state;
    const cards = { ...state.cards };
    addLog(cards, cardId, 'Moved: ' + state.columns[from].title + ' → ' + state.columns[to].title);
    return {
      ...state,
      cards,
      columns: state.columns.map((c, i) => {
        if (i === from) return { ...c, cardIds: c.cardIds.filter(x => x !== cardId) };
        if (i === to) return { ...c, cardIds: [...c.cardIds, cardId] };
        return c;
      }),
    };
  }

  // Move a card to column `toColId` at position `index` (index counts the target column's cards
  // with the moved card already removed). Handles both cross-column moves and in-column reordering.
  // Cross-column moves are logged; same-column reorders are not (too noisy for a change log).
  function moveCard(state, cardId, toColId, index) {
    const from = findColumnIndex(state, cardId);
    const toIdx = state.columns.findIndex(c => c.id === toColId);
    if (from < 0 || toIdx < 0) return state;
    const columns = state.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(x => x !== cardId) }));
    const target = columns[toIdx].cardIds;
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : target.length, target.length));
    target.splice(at, 0, cardId);
    const same = columns.every((c, i) => c.cardIds.length === state.columns[i].cardIds.length &&
      c.cardIds.every((x, j) => x === state.columns[i].cardIds[j]));
    if (same) return state;
    const cards = { ...state.cards };
    if (from !== toIdx) addLog(cards, cardId, 'Moved: ' + state.columns[from].title + ' → ' + columns[toIdx].title);
    return { ...state, cards, columns };
  }

  const PRIORITIES = ['none', 'low', 'medium', 'high'];

  // Split a comma/space separated tag string into unique, lowercase tags (max length 30).
  function parseTags(text) {
    const seen = new Set();
    String(text || '').split(/[,\s]+/).forEach(t => {
      t = t.trim().toLowerCase().replace(/^#/, '');
      if (t) seen.add(t.slice(0, 30));
    });
    return [...seen];
  }

  // Apply edits from the detail modal. Unknown fields are ignored; an empty title keeps the old one.
  // opts.silent suppresses change-log entries (used by importBoard, which must not log).
  function updateCard(state, cardId, patch, opts) {
    const card = state.cards[cardId];
    if (!card) return state;
    const next = { ...card };
    if ('title' in patch) { const t = String(patch.title || '').trim(); if (t) next.title = t.slice(0, 200); }
    if ('description' in patch) next.description = String(patch.description || '');
    if ('priority' in patch) next.priority = PRIORITIES.includes(patch.priority) ? patch.priority : 'none';
    if ('due' in patch) next.due = /^\d{4}-\d{2}-\d{2}$/.test(patch.due || '') ? patch.due : '';
    if ('tags' in patch) next.tags = Array.isArray(patch.tags) ? parseTags(patch.tags.join(',')) : parseTags(patch.tags);
    if ('affects' in patch) next.affects = Array.isArray(patch.affects) ? parseTags(patch.affects.join(',')) : parseTags(patch.affects);
    // Linked cards: ids must exist on this board; self-links are rejected.
    // (The UI edits links through setLinks for symmetry; this path is a fallback.)
    if ('links' in patch) {
      const raw = Array.isArray(patch.links) ? patch.links : String(patch.links || '').split(/[,\s]+/);
      next.links = [...new Set(raw.map(s => String(s).trim().toLowerCase())
        .filter(s => s !== cardId && state.cards[s]))].slice(0, 50);
    }
    const cards = { ...state.cards, [cardId]: next };
    if (!(opts && opts.silent)) diffLog(card, next).forEach(text => addLog(cards, cardId, text));
    return { ...state, cards };
  }

  // Symmetric link setter: defines cardId's outgoing links AND maintains the
  // reciprocal entries on the other cards, so every link is visible from both
  // ends. Unknown and self ids are ignored. Changes are logged on BOTH cards.
  // Returns `state` if nothing changes.
  function setLinks(state, cardId, ids) {
    const card = state.cards[cardId];
    if (!card) return state;
    const want = [...new Set((ids || []).map(s => String(s).trim().toLowerCase()))]
      .filter(id => id !== cardId && state.cards[id]);
    const old = card.links || [];
    const added = want.filter(id => !old.includes(id));
    const removed = old.filter(id => !want.includes(id));
    if (!added.length && !removed.length) return state;
    const cards = { ...state.cards, [cardId]: { ...card, links: want } };
    addLog(cards, cardId, 'Links: ' + listDiffLabel(old, want));
    added.forEach(id => {
      cards[id] = { ...cards[id], links: [...(cards[id].links || []), cardId] };
      addLog(cards, id, 'Linked with ' + cardId);
    });
    removed.forEach(id => {
      cards[id] = { ...cards[id], links: (cards[id].links || []).filter(x => x !== cardId) };
      addLog(cards, id, 'Unlinked from ' + cardId);
    });
    return { ...state, cards };
  }

  // Idempotent normalization: prunes dangling/duplicate/self links and adds
  // missing reciprocal entries. Used on load (legacy one-sided migration)
  // and after import, when all cards exist. Deliberately NOT logged.
  // Returns `state` if unchanged.
  function symmetrizeLinks(state) {
    const cards = { ...state.cards };
    let changed = false;
    Object.keys(cards).forEach(id => {
      const l = cards[id].links || [];
      const clean = [];
      l.forEach(x => { if (x !== id && cards[x] && !clean.includes(x)) clean.push(x); });
      if (clean.length !== l.length || clean.some((x, i) => x !== l[i])) {
        cards[id] = { ...cards[id], links: clean }; changed = true;
      }
      clean.forEach(other => {
        const ol = cards[other].links || [];
        if (!ol.includes(id)) { cards[other] = { ...cards[other], links: [...ol, id] }; changed = true; }
      });
    });
    return changed ? { ...state, cards } : state;
  }

  // Local YYYY-MM-DD for a Date (avoids UTC shifts from toISOString).
  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // A card is overdue when it has a due date before today and is not in the last ("done") column.
  function isOverdue(state, cardId, today = isoDate(new Date())) {
    const card = state.cards[cardId];
    if (!card || !card.due) return false;
    const done = state.columns[state.columns.length - 1];
    return card.due < today && !done.cardIds.includes(cardId);
  }

  function deleteCard(state, cardId) {
    const cards = { ...state.cards };
    delete cards[cardId];
    // Scrub links pointing at the deleted card so none are left dangling.
    for (const k of Object.keys(cards)) {
      const l = cards[k].links;
      if (Array.isArray(l) && l.includes(cardId)) cards[k] = { ...cards[k], links: l.filter(x => x !== cardId) };
    }
    return { ...state, cards, columns: state.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(x => x !== cardId) })) };
  }

  function isValid(state) {
    return !!(state && Array.isArray(state.columns) && state.cards && typeof state.nextId === 'number');
  }

  // ---- Board list (metadata only; each board's state is stored under its own key) ----

  function createMeta(name = 'My Board') {
    return { boards: [{ id: 'b1', name }], activeId: 'b1', nextId: 2 };
  }

  function cleanName(name, fallback) {
    return String(name || '').trim().slice(0, 60) || fallback;
  }

  // Returns a new meta with the board added and made active.
  function addBoard(meta, name) {
    const id = 'b' + meta.nextId;
    return { boards: [...meta.boards, { id, name: cleanName(name, 'Board ' + meta.nextId) }], activeId: id, nextId: meta.nextId + 1 };
  }

  function renameBoard(meta, id, name) {
    return { ...meta, boards: meta.boards.map(b => b.id === id ? { ...b, name: cleanName(name, b.name) } : b) };
  }

  // The last board can't be removed. If the active board is removed, its neighbour becomes active.
  function removeBoard(meta, id) {
    const i = meta.boards.findIndex(b => b.id === id);
    if (i < 0 || meta.boards.length === 1) return meta;
    const boards = meta.boards.filter(b => b.id !== id);
    const activeId = meta.activeId === id ? boards[Math.min(i, boards.length - 1)].id : meta.activeId;
    return { ...meta, boards, activeId };
  }

  function isValidMeta(meta) {
    return !!(meta && Array.isArray(meta.boards) && meta.boards.length && typeof meta.nextId === 'number' &&
      meta.boards.some(b => b.id === meta.activeId));
  }

  // Move cards between boards: remove `ids` from `source` and append them to
  // `target`'s "To Do" column under FRESH ids (target's nextId), so ids can
  // never collide with cards the target already holds. All card fields are
  // preserved — including the change log (links are board-local and dropped).
  // Returns { source, target } or null if nothing matched.
  function moveCards(source, target, ids) {
    const picked = [...new Set(ids)].filter(id => source.cards[id]);
    if (!picked.length) return null;
    let nextId = typeof target.nextId === 'number' ? target.nextId : 1;
    const cards = { ...target.cards };
    const todo = target.columns.find(c => c.id === 'todo') || target.columns[0];
    const newIds = [];
    picked.forEach(id => {
      const nid = 'c' + nextId++;
      cards[nid] = { ...source.cards[id], id: nid, links: [] };  // links are board-local: dropped on move
      newIds.push(nid);
    });
    const moved = {
      ...target, nextId,
      cards,
      columns: target.columns.map(c => c.id === todo.id ? { ...c, cardIds: [...c.cardIds, ...newIds] } : c),
    };
    // Board-local links: scrub references to the moved cards from all
    // remaining source cards, so no dangling link chips are left behind.
    const scards = Object.fromEntries(Object.entries(source.cards).filter(([k]) => !picked.includes(k)));
    Object.keys(scards).forEach(k => {
      const l = scards[k].links;
      if (Array.isArray(l) && l.some(x => picked.includes(x)))
        scards[k] = { ...scards[k], links: l.filter(x => !picked.includes(x)) };
    });
    const shrunk = {
      ...source,
      cards: scards,
      columns: source.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(x => !picked.includes(x)) })),
    };
    return { source: shrunk, target: moved };
  }

  // ---- Search & filters ----

  // Fuzzy subsequence match: every query char must appear in order in `text`.
  // Kept for backwards compatibility (Node tests, external callers) but NO
  // LONGER used by the card search, which is plain substring matching now.
  // Returns { score, indices } (indices into `text` for highlighting) or null.
  function fuzzyMatch(query, text) {
    const q = String(query || '').toLowerCase().replace(/\s+/g, '');
    const t = String(text || '');
    const lower = t.toLowerCase();
    if (!q) return { score: 0, indices: [] };
    const indices = [];
    let score = 0, ti = 0, prev = -2;
    for (const ch of q) {
      const at = lower.indexOf(ch, ti);
      if (at < 0) return null;
      score += 1;
      if (at === prev + 1) score += 5;                           // consecutive
      if (at === 0 || /[\s\-_#.,/]/.test(t[at - 1])) score += 3; // word start
      if (prev >= 0) score -= Math.min(at - prev - 1, 3) * 0.5;  // gap
      indices.push(at);
      prev = at;
      ti = at + 1;
    }
    return { score, indices };
  }

  // Match one card against { query, tag, affects, priority } plus an optional date range.
  // The date range is built by the caller as one of: { before } | { from, to } | { none: true }.
  // All given criteria are AND-combined; a card must satisfy every one of them.
  //
  // QUERY SEMANTICS (plain, predictable substring search over title + description):
  // - The query is split on whitespace into words.
  // - A card matches when AT LEAST ONE word occurs as a case-insensitive SUBSTRING
  //   in the card's title OR description (OR across words, OR across the two
  //   fields). Partial words match: "alter" also finds "Altersheim".
  // - Tags, affects and links are NOT searched — they have their own filters.
  // - An exact card-ID query ("c4566" or plain "4566") matches directly with
  //   score 100 and no highlights (used for deep-link-style lookups).
  // - `indices` lists the character positions of all word hits within the
  //   TITLE, for <mark> highlighting. Hits that exist only in the description
  //   match the card but produce no highlight indices.
  function matchCard(card, filter = {}, dates = null) {
    if (dates) {
      if (dates.none) {
        if (card.due) return null;
      } else {
        if (!card.due) return null;
        if (dates.before && card.due >= dates.before) return null;
        if (dates.from && card.due < dates.from) return null;
        if (dates.to && card.due > dates.to) return null;
      }
    }
    if (filter.tag && !(card.tags || []).includes(filter.tag)) return null;
    if (filter.affects && !(card.affects || []).includes(filter.affects)) return null;
    if (filter.priority && (card.priority || 'none') !== filter.priority) return null;
    const q = (filter.query || '').trim().toLowerCase();
    if (!q) return { score: 0, indices: [] };
    const idLow = card.id.toLowerCase();
    const num = q.match(/^c?(\d+)$/);
    if (idLow === q || (num && idLow === 'c' + num[1])) return { score: 100, indices: [] };
    const words = q.split(/\s+/).filter(Boolean);
    const title = String(card.title || '').toLowerCase();
    const desc = String(card.description || '').toLowerCase();
    if (!words.some(w => title.includes(w) || desc.includes(w))) return null;
    // Collect the highlight positions of every word occurrence inside the title.
    const indices = [];
    words.forEach(w => {
      let at = title.indexOf(w);
      while (at > -1) {
        for (let i = 0; i < w.length; i++) indices.push(at + i);
        at = title.indexOf(w, at + 1);
      }
    });
    return { score: 1, indices };
  }

  // Collect the distinct tags of all cards, sorted alphabetically.
  function allTags(state) {
    const tags = new Set();
    Object.values(state.cards).forEach(c => (c.tags || []).forEach(t => tags.add(t)));
    return [...tags].sort();
  }

  // Collect the distinct "affects" values of all cards, sorted alphabetically.
  function allAffects(state) {
    const set = new Set();
    Object.values(state.cards).forEach(c => (c.affects || []).forEach(t => set.add(t)));
    return [...set].sort();
  }

  // ---- WIP limits & stats ----

  // n <= 0 (or not a number) clears the limit.
  function setWipLimit(state, colId, n) {
    n = Math.floor(Number(n));
    const wip = n > 0 ? Math.min(n, 999) : 0;
    const col = state.columns.find(c => c.id === colId);
    if (!col || (col.wip || 0) === wip) return state;
    return { ...state, columns: state.columns.map(c => c.id === colId ? { ...c, wip } : c) };
  }

  function boardStats(state, today = isoDate(new Date())) {
    const columns = state.columns.map(c => ({
      id: c.id, title: c.title, count: c.cardIds.length, wip: c.wip || 0,
      over: !!c.wip && c.cardIds.length > c.wip,
    }));
    const byPriority = Object.fromEntries(PRIORITIES.map(p => [p, 0]));
    Object.values(state.cards).forEach(c => { byPriority[c.priority || 'none']++; });
    const total = columns.reduce((n, c) => n + c.count, 0);
    const done = columns[columns.length - 1].count;
    return {
      columns, total, byPriority,
      overdue: Object.keys(state.cards).filter(id => isOverdue(state, id, today)).length,
      donePct: total ? Math.round(done / total * 100) : 0,
    };
  }

  // ---- Import / export ----

  function exportBoard(name, state) {
    return { app: 'kanban-board', version: 1, name, exported: new Date().toISOString(), board: state };
  }

  // Parse untrusted JSON (an export file, or a bare board state) into { name, state } or null.
  // Cards are re-validated through updateCard, unknown columns are dropped, dangling or
  // duplicate card ids are removed, and orphan cards land in the first column.
  // Existing change logs are preserved (sanitized); the import itself is silent.
  function importBoard(text) {
    let data;
    try { data = JSON.parse(text); } catch (e) { return null; }
    const src = data && data.board ? data.board : data;
    if (!src || !Array.isArray(src.columns) || !src.cards || typeof src.cards !== 'object') return null;
    let state = createBoard();
    const placed = new Set();
    let maxId = 0;
    const take = (oldCol, newCol) => (Array.isArray(oldCol.cardIds) ? oldCol.cardIds : []).forEach(id => {
      if (typeof id !== 'string' || !/^[\w-]{1,40}$/.test(id) || id === '__proto__' || placed.has(id) ||
        !Object.prototype.hasOwnProperty.call(src.cards, id)) return;
      const c = src.cards[id];
      if (!c || typeof c.title !== 'string' || !c.title.trim()) return;
      placed.add(id);
      if (/^c\d+$/.test(id)) maxId = Math.max(maxId, Number(id.slice(1)));
      state.cards[id] = { id, title: c.title.trim().slice(0, 200), created: Number(c.created) || Date.now() };
      if (Array.isArray(c.links)) state.cards[id].links = c.links.map(String);
      if (Array.isArray(c.log)) state.cards[id].log = c.log
        .filter(e => e && typeof e.text === 'string' && e.text.trim() && e.text.length <= 300)
        .map(e => ({ ts: Number(e.ts) || Date.now(), text: e.text.slice(0, 300) }))
        .slice(-LOG_LIMIT);
      state = updateCard(state, id, {
        description: c.description, priority: c.priority, due: c.due,
        tags: Array.isArray(c.tags) ? c.tags : '',
        affects: Array.isArray(c.affects) ? c.affects : '',
      }, { silent: true });
      newCol.cardIds.push(id);
    });
    state.columns.forEach(col => {
      const old = src.columns.find(c => c && c.id === col.id);
      if (!old) return;
      take(old, col);
      const wip = Math.floor(Number(old.wip));
      if (wip > 0) col.wip = Math.min(wip, 999);
    });
    take({ cardIds: Object.keys(src.cards) }, state.columns[0]);
    // Non-"cN" ids (hand-written files) are kept as-is; nextId only has to avoid "cN" collisions.
    state.nextId = maxId + 1;
    // Now that every card exists, links can be validated and made symmetric.
    state = symmetrizeLinks(state);
    const name = cleanName(data.name, 'Imported board');
    return { name, state };
  }

  const api = {
    exportBoard, importBoard, fuzzyMatch, matchCard, allTags, allAffects,
    setWipLimit, boardStats, moveCards,
    createMeta, addBoard, renameBoard, removeBoard, isValidMeta,
    setLinks, symmetrizeLinks,
    COLUMNS, PRIORITIES, LOG_LIMIT,
    createBoard, addCard, shiftCard, moveCard, updateCard, parseTags,
    isoDate, isOverdue, deleteCard, findColumnIndex, isValid,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Board = api;
})(this);