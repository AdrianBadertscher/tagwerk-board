// Kanban board UI logic. Depends on i18n.js (window.I18n_), board.js (window.Board) and history.js (window.History_).

// ---- i18n bootstrap: resolve the language BEFORE anything renders ----
I18n_.setLang(I18n_.detectLang(null, localStorage));
document.documentElement.lang = I18n_.getLang();
const t = (key, args) => I18n_.t(key, args);

// Translate all statically declared elements (index.html, data-i18n-* attributes).
function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}

// Language dropdown: native labels; a change persists, retranslates the static
// markup and re-renders all dynamic text (filters, stats, cards) in one pass.
const langSelect = document.getElementById('lang-select');
function renderLangSelect() {
  langSelect.innerHTML = '';
  I18n_.LANGUAGES.forEach(l => langSelect.add(new Option(l.label, l.code, false, l.code === I18n_.getLang())));
}
langSelect.addEventListener('change', () => {
  I18n_.setLang(langSelect.value);
  I18n_.persistLang(I18n_.getLang(), localStorage);
  document.documentElement.lang = I18n_.getLang();
  applyI18n();
  renderLangSelect();
  render();
});

const LEGACY_KEY = 'kanban-board:v1';
const META_KEY = 'kanban-meta:v1';
const boardKey = id => 'kanban-board:v1:' + id;

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}
function remove(key) {
  try { localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
}

// ---- Deep links: index.html?detail-id=c42 opens that card's detail dialog directly ----

// Read the linked card id from the query string, falling back to the hash
// (the hash is used automatically when the browser blocks query rewrites, e.g. under file://).
function detailParam() {
  const q = new URLSearchParams(location.search).get('detail-id');
  if (q) return q;
  const h = (location.hash.match(/detail-id=([^&]+)/) || [])[1];
  return h ? decodeURIComponent(h) : null;
}

// Set (id truthy) or remove (id null) the detail-id link parameter without reloading.
function setDetailParam(id) {
  try {
    const p = new URLSearchParams(location.search);
    if (id) p.set('detail-id', id); else p.delete('detail-id');
    const qs = p.toString();
    window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  } catch (e) {
    // file:// may block query rewriting; fall back to the hash and log loudly instead of failing silently.
    console.warn(t('console-query-blocked', e.message));
    location.hash = id ? '#detail-id=' + encodeURIComponent(id) : '';
  }
}

// First run with multi-board storage: adopt the old single board as "My Board".
function loadMeta() {
  const m = read(META_KEY);
  if (Board.isValidMeta(m)) return m;
  const meta = Board.createMeta();
  const legacy = read(LEGACY_KEY);
  if (Board.isValid(legacy)) write(boardKey('b1'), legacy);
  write(META_KEY, meta);
  return meta;
}

function loadBoard(id) {
  const s = read(boardKey(id));
  // symmetrizeLinks migrates legacy one-sided links on first load; idempotent afterwards.
  return Board.isValid(s) ? Board.symmetrizeLinks(s) : Board.createBoard();
}

let meta = loadMeta();
let history = History_.create(loadBoard(meta.activeId));
let state = history.present;

// Every edit goes through here so it lands in the undo history.
function update(next) {
  if (next === state) return;
  setHistory(History_.push(history, next));
}

function setHistory(h) {
  if (h === history) return;
  history = h;
  state = h.present;
  write(boardKey(meta.activeId), state);
  render();
}

function setMeta(next) {
  meta = next;
  write(META_KEY, meta);
}

// Undo history is per session and per board; switching boards starts a fresh one.
function switchBoard(id) {
  setMeta({ ...meta, activeId: id });
  history = History_.create(loadBoard(id));
  state = history.present;
  render();
  selected.clear();
}

const boardEl = document.getElementById('board');

// ---- Rendering ----

function render() {
  renderToolbar();
  renderFilterOptions();
  // Drop selections pointing at cards that no longer exist on this board.
  selected = new Set([...selected].filter(sid => state.cards[sid]));
  if (view === 'stats') { renderStats(); drawRopes(); return; }
  const today = Board.isoDate(new Date());
  const DAY = 86400000;
  let filterDates = null;
  if (filter.due === 'overdue') filterDates = { before: today };
  else if (filter.due === 'today') filterDates = { from: today, to: today };
  else if (filter.due === 'week') filterDates = { from: today, to: Board.isoDate(new Date(Date.now() + 6 * DAY)) };
  else if (filter.due === 'none') filterDates = { none: true };
  const filtering = isFiltering();
  let shown = 0;
  boardEl.innerHTML = '';
  state.columns.forEach((col, colIdx) => {
    const section = document.createElement('section');
    section.className = 'column';
    section.dataset.col = col.id;

    const h2 = document.createElement('h2');
    const name = document.createElement('span');
    name.textContent = col.title;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = col.wip ? col.cardIds.length + ' / ' + col.wip : col.cardIds.length;
    if (col.wip && col.cardIds.length > col.wip) {
      section.classList.add('over-wip');
      count.title = t('over-wip-title', col.wip);
      count.textContent += ' ⚠';
    }
    h2.append(name, count);
    section.appendChild(h2);

    const list = document.createElement('ul');
    list.className = 'cards';
    list.dataset.col = col.id;
    col.cardIds.forEach(id => {
      const m = Board.matchCard(state.cards[id], filter, filterDates);
      if (!m) return;
      shown++;
      list.appendChild(renderCard(state.cards[id], colIdx, today, m.indices, filtering));
    });
    section.appendChild(list);

    if (colIdx === 1) {
      const form = document.createElement('form');
      form.className = 'add-form';
      form.innerHTML = '<input type="text" placeholder="' + t('add-input-placeholder')
        + '" aria-label="' + t('add-input-aria')
        + '" maxlength="200"><button type="submit">' + t('add-submit') + '</button>';
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input');
        const next = Board.addCard(state, input.value);
        update(next);
        input.value = '';
        input.focus();
      });
      section.appendChild(form);
    }
    boardEl.appendChild(section);
  });
  filterStatus.textContent = filtering ? t('filter-status', [shown, Object.keys(state.cards).length]) : '';
  filterClear.hidden = !filtering;
  renderSelectionStatus();
  drawRopes();
}

// Weekday display only; storage stays ISO: "2026-11-12" -> "Do, 12.11.2026".
// Abbreviations come from Intl in the ACTIVE language (cached per language);
// the static array is a fallback for environments without Intl.
const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const wdFmtCache = { lang: null, fmt: null };
function weekdayShort(date) {
  const lang = I18n_.getLang();
  if (wdFmtCache.lang !== lang) {
    let fmt = null;
    try { fmt = new Intl.DateTimeFormat(lang, { weekday: 'short' }); } catch (e) { fmt = null; }
    wdFmtCache.lang = lang;
    wdFmtCache.fmt = fmt;
  }
  return wdFmtCache.fmt ? wdFmtCache.fmt.format(date).replace(/[.]$/, '') : WD[date.getDay()];
}
function fmtDue(iso) {
  const d = new Date(iso + 'T00:00:00');           // local midnight, avoids UTC shift
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return weekdayShort(d) + ', ' + dd + '.' + mm + '.' + d.getFullYear();
}

// Timestamp for change-log entries: "14.11.2026 20:45".
function fmtTs(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' '
    + p(d.getHours()) + ':' + p(d.getMinutes());
}

function renderCard(card, colIdx, today, hits = [], filtering = false) {
  const id = card.id;
  const li = document.createElement('li');
  li.className = 'card';
  if (card.priority && card.priority !== 'none') li.classList.add('prio-' + card.priority);
  if (Board.isOverdue(state, id, today)) li.classList.add('overdue');
  else if (card.due && card.due === today) li.classList.add('due-today');
  li.dataset.id = id;
  li.draggable = true; // safe while filtered: the drop handler maps visible anchors to real positions
  // Multi-select checkbox; click must not open the detail dialog.
  const tick = document.createElement('input');
  tick.type = 'checkbox';
  tick.className = 'card-select';
  tick.checked = selected.has(id);
  tick.title = t('card-select-title');
  tick.setAttribute('aria-label', t('card-select-aria', id));
  tick.addEventListener('click', e => e.stopPropagation());
  tick.addEventListener('change', () => {
    if (tick.checked) selected.add(id); else selected.delete(id);
    li.classList.toggle('selected', tick.checked);
    renderSelectionStatus();
  });
  li.appendChild(tick);
  const body = document.createElement('button');
  body.type = 'button';
  body.className = 'card-body';
  body.title = t('open-details');

  const head = document.createElement('span');
  head.className = 'card-head';
  const idBadge = document.createElement('span');
  idBadge.className = 'card-id';
  idBadge.textContent = '[' + card.id + '] - ';
  const title = document.createElement('span');
  title.className = 'title';
  highlight(title, card.title, hits);
  head.append(idBadge, title);
  body.appendChild(head);

  const meta = document.createElement('span');
  meta.className = 'meta';

  if (card.due) {
    const due = document.createElement('span');
    due.className = 'due';
    const prefix = li.classList.contains('overdue') || li.classList.contains('due-today') ? '>> · ' : '>> ';
    due.textContent = prefix + fmtDue(card.due);
    meta.appendChild(due);
  }
  if (card.description) {
    const d = document.createElement('span');
    d.className = 'has-desc';
    d.textContent = ' | [☰] ';
    d.title = t('has-desc-title');
    meta.appendChild(d);
  }
  if ((card.tags || []).length) {
    const tagLine = document.createElement('span');
    tagLine.className = 'chips tags-line';
    (card.tags || []).forEach(tg => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = '#' + tg;
      tagLine.appendChild(tag);
    });
    meta.appendChild(tagLine);
  }
  if ((card.affects || []).length) {
    const affLine = document.createElement('span');
    affLine.className = 'chips affects-line';
    (card.affects || []).forEach(a => {
      const aff = document.createElement('span');
      aff.className = 'affect';
      aff.textContent = '@' + a;
      affLine.appendChild(aff);
    });
    meta.appendChild(affLine);
  }
  if ((card.links || []).length) {
    const links = document.createElement('span');
    links.className = 'chips links-line';
    (card.links || []).forEach(lid => {
      const lk = document.createElement('span');
      lk.className = 'card-link';
      lk.textContent = '🔗 ' + lid;
      lk.title = t('link-chip-title', lid);
      // Click on the chip opens the linked card instead of this one.
      lk.addEventListener('click', e => { e.stopPropagation(); openDetail(lid); });
      links.appendChild(lk);
    });
    meta.appendChild(links);
  }
  if (meta.childNodes.length) body.appendChild(meta);
  body.addEventListener('click', () => openDetail(id));
  li.appendChild(body);

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(
    button('←', t('move-left'), colIdx === 0, () => update(Board.shiftCard(state, id, -1))),
    button('→', t('move-right'), colIdx === state.columns.length - 1, () => update(Board.shiftCard(state, id, 1))),
    button('✕', t('delete'), false, () => update(Board.deleteCard(state, id))),
  );
  li.appendChild(actions);
  // Rope glow: hovering a card highlights its links; leaving dims back.
  li.addEventListener('mouseenter', () => { if ((card.links || []).length) { hotCard = id; drawRopes(); } });
  li.addEventListener('mouseleave', () => { hotCard = null; drawRopes(); });
  return li;
}

// Fill `el` with `text`, wrapping the characters at `hits` (string indices) in <mark>.
function highlight(el, text, hits) {
  const set = new Set(hits);
  let run = '', marked = false;
  const flush = () => {
    if (!run) return;
    if (marked) { const m = document.createElement('mark'); m.textContent = run; el.appendChild(m); }
    else el.appendChild(document.createTextNode(run));
    run = '';
  };
  for (let i = 0; i < text.length; i++) {
    if (set.has(i) !== marked) { flush(); marked = !marked; }
    run += text[i];
  }
  flush();
}

function button(label, title, disabled, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.title = title;
  b.setAttribute('aria-label', title);
  b.disabled = disabled;
  b.addEventListener('click', onClick);
  return b;
}

// ---- Toolbar: board switcher + undo/redo ----

const boardSelect = document.getElementById('board-select');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');

function renderToolbar() {
  boardSelect.innerHTML = '';
  meta.boards.forEach(b => boardSelect.add(new Option(b.name, b.id, false, b.id === meta.activeId)));
  document.getElementById('board-delete').disabled = meta.boards.length === 1;
  undoBtn.disabled = !history.past.length;
  redoBtn.disabled = !history.future.length;
  document.title = boardName() + ' · ' + t('Kanban Board');
}

function boardName() {
  return meta.boards.find(b => b.id === meta.activeId).name;
}

boardSelect.addEventListener('change', () => switchBoard(boardSelect.value));
document.getElementById('board-new').addEventListener('click', () => {
  const name = prompt(t('prompt-new-board'), t('prompt-default-new-board', meta.nextId));
  if (name === null) return;
  setMeta(Board.addBoard(meta, name));
  switchBoard(meta.activeId);
});
document.getElementById('board-rename').addEventListener('click', () => {
  const name = prompt(t('prompt-rename-board'), boardName());
  if (name === null) return;
  setMeta(Board.renameBoard(meta, meta.activeId, name));
  renderToolbar();
});
document.getElementById('board-delete').addEventListener('click', () => {
  if (meta.boards.length === 1 || !confirm(t('confirm-delete-board', boardName()))) return;
  const id = meta.activeId;
  setMeta(Board.removeBoard(meta, id));
  remove(boardKey(id));
  switchBoard(meta.activeId);
});

undoBtn.addEventListener('click', () => setHistory(History_.undo(history)));
redoBtn.addEventListener('click', () => setHistory(History_.redo(history)));

// ---- Keyboard shortcuts (single consolidated listener) ----

document.addEventListener('keydown', e => {
  const inField = !!(e.target.closest && e.target.closest('input, textarea, select'));
  const dlgOpen = !!document.querySelector('dialog[open]');

  if (e.ctrlKey || e.metaKey) {
    if (dlgOpen || inField) return; // keep native text undo in fields
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); setHistory(History_.undo(history)); }
    else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); setHistory(History_.redo(history)); }
    else if (k === 's') { e.preventDefault(); document.getElementById('export').click(); }
    return;
  }

  // Escape in the search field clears the query (must run before the inField guard).
  if (e.key === 'Escape' && e.target === searchEl && searchEl.value) {
    searchEl.value = '';
    setFilter({ query: '' });
    return;
  }

  if (e.altKey || dlgOpen || inField) return;
  if (e.key === '/' && view === 'board') {
    e.preventDefault();
    searchEl.focus();
  } else if (e.key === 'Escape' && selected.size) {
    selected.clear();
    render();
  } else if (e.key === '?') {
    e.preventDefault();
    shortcutsDlg.showModal();
  } else if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    viewBtn.click();
  } else if (e.key === 'n' || e.key === 'N') {
    e.preventDefault();
    if (view === 'stats') viewBtn.click();
    boardEl.querySelector('.add-form input').focus();
  }
});

// ---- Multi-select: ticked cards for a later "move to board" action ----
let selected = new Set(); // card ids, session-only; cleared on board switch

const moveSelect = document.getElementById('move-target');
const moveBtn = document.getElementById('move-to-board');
const selectionClearBtn = document.getElementById('selection-clear');

function renderSelectionStatus() {
  const n = selected.size;
  document.getElementById('selection-status').textContent = n ? t('selection-status', n) : '';
  selectionClearBtn.hidden = !n;
  moveBtn.hidden = moveSelect.hidden = !n;
  // Targets: every board except the current one, plus "create a new one".
  moveSelect.innerHTML = '';
  meta.boards.filter(b => b.id !== meta.activeId).forEach(b => moveSelect.add(new Option(b.name, b.id)));
  moveSelect.add(new Option(t('move-new-board'), '__new__'));
}

// Clear the multi-selection (button and Escape key use the same path).
selectionClearBtn.addEventListener('click', () => {
  selected.clear();
  render();
});

// Filesystem mutations: the move rewrites BOTH boards in storage. It deliberately
// bypasses the undo history (a cross-board undo would resurrect duplicates).
// Undo history is therefore reset to the post-move source state.
moveBtn.addEventListener('click', () => {
  if (!selected.size) return;
  const choice = moveSelect.value;
  let targetId = choice, targetName, target;
  if (choice === '__new__') {
    const name = prompt(t('prompt-move-new-board'), t('prompt-default-new-board', meta.nextId));
    if (name === null) return;
    const newMeta = Board.addBoard(meta, name);
    targetId = newMeta.activeId;
    targetName = newMeta.boards.find(b => b.id === targetId).name;
    if (!confirm(t('confirm-move-new-board', [selected.size, targetName]))) return;
    setMeta({ ...newMeta, activeId: meta.activeId });   // create it, but stay on the current board
    target = Board.createBoard();
  } else if (choice) {
    targetName = meta.boards.find(b => b.id === choice).name;
    if (!confirm(t('confirm-move-board', [selected.size, targetName]))) return;
    target = loadBoard(choice);
  } else {
    alert(t('alert-pick-target'));
    return;
  }
  const res = Board.moveCards(state, target, [...selected]);
  if (!res) return;
  write(boardKey(targetId), res.target);
  write(boardKey(meta.activeId), res.source);
  history = History_.create(res.source);   // fresh history: no phantom-undo across boards
  state = res.source;
  selected.clear();
  render();
});

// ---- Search & filters (session-only, not part of undo history) ----

const searchEl = document.getElementById('search');
const tagEl = document.getElementById('filter-tag');
const affectEl = document.getElementById('filter-affect');
const prioEl = document.getElementById('filter-prio');
const filterClear = document.getElementById('filter-clear');
const filterStatus = document.getElementById('filter-status');
const dueEl = document.getElementById('filter-due');
let filter = { query: '', tag: '', affects: '', priority: '', due: '' };

function isFiltering() {
  return !!(filter.query.trim() || filter.tag || filter.affects || filter.priority || filter.due);
}

function renderFilterOptions() {
  const tags = Board.allTags(state);
  if (filter.tag && !tags.includes(filter.tag)) filter.tag = '';
  tagEl.innerHTML = '';
  tagEl.add(new Option(t('all-tags'), ''));
  tags.forEach(tg => tagEl.add(new Option('#' + tg, tg)));
  tagEl.value = filter.tag;
  const affects = Board.allAffects(state);
  if (filter.affects && !affects.includes(filter.affects)) filter.affects = '';
  affectEl.innerHTML = '';
  affectEl.add(new Option(t('all-affects'), ''));
  affects.forEach(a => affectEl.add(new Option('@' + a, a)));
  affectEl.value = filter.affects;
}

function setFilter(patch) {
  filter = { ...filter, ...patch };
  render();
}

searchEl.addEventListener('input', () => setFilter({ query: searchEl.value }));
tagEl.addEventListener('change', () => setFilter({ tag: tagEl.value }));
affectEl.addEventListener('change', () => setFilter({ affects: affectEl.value }));
prioEl.addEventListener('change', () => setFilter({ priority: prioEl.value }));
dueEl.addEventListener('change', () => setFilter({ due: dueEl.value }));
filterClear.addEventListener('click', () => {
  searchEl.value = '';
  tagEl.value = '';
  prioEl.value = '';
  dueEl.value = '';
  affectEl.value = '';
  setFilter({ query: '', tag: '', affects: '', priority: '', due: '' });
});

// ---- Import / export ----

// Export ALL boards at once as a single bundle file. The bundle reuses the
// per-board exportBoard() format for every entry, so each entry passes
// through importBoard()'s validation unchanged on the way back in.
const BUNDLE_KIND = 'kanban-bundle';
const BUNDLE_VERSION = 1;

function exportAllBoards() {
  return {
    kind: BUNDLE_KIND,
    version: BUNDLE_VERSION,
    exportedAt: new Date().toISOString(),
    boards: meta.boards.map(b => {
      const stored = read(boardKey(b.id));
      // Missing storage for a listed board is a data inconsistency; skip with a loud warning
      // instead of silently exporting an empty board.
      if (!stored) console.warn(t('console-export-missing', [b.name, b.id]));
      return Board.exportBoard(b.name, stored || Board.createBoard());
    }),
  };
}

// File name for backups: timestamped so consecutive exports never overwrite each other.
function backupFileName(d) {
  const pad = n => String(n).padStart(2, '0');
  return 'kanban-backup-'
    + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
    + '-' + pad(d.getHours()) + pad(d.getMinutes()) + '.json';
}

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(exportAllBoards(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = backupFileName(new Date());
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

const importFile = document.getElementById('import-file');
document.getElementById('import').addEventListener('click', () => importFile.click());

// Import a single board entry (one exportBoard payload) as a NEW board.
// Returns the id of the created board, or null if the entry was invalid.
function importOneBoard(payload) {
  const result = Board.importBoard(typeof payload === 'string' ? payload : JSON.stringify(payload));
  if (!result) return null;
  setMeta(Board.addBoard(meta, result.name));
  write(boardKey(meta.activeId), result.state);
  return meta.activeId;
}

// Import detects the format: a bundle (kind marker) imports every board it
// contains; anything else falls back to the classic single-board path.
// Imports always become new boards, so nothing existing is ever overwritten.
// A corrupt entry is skipped with a console warning instead of aborting the
// whole import — one bad board must not sink the rest of the backup.
importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  importFile.value = '';
  if (!file) return;
  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch (e) {
    alert(t('alert-invalid-json'));
    return;
  }

  if (parsed && parsed.kind === BUNDLE_KIND && Array.isArray(parsed.boards)) {
    const ok = [], failed = [];
    for (const entry of parsed.boards) {
      const id = importOneBoard(entry);
      if (id) ok.push(id); else failed.push(entry && entry.name ? entry.name : '(unknown)');
    }
    if (failed.length) console.warn(t('console-import-skipped', failed.join(', ')));
    if (!ok.length) { alert(t('alert-no-valid-boards')); return; }
    alert(t('alert-imported', [ok.length, failed.length ? t('alert-import-skipped', failed.length) : '']));
    switchBoard(ok[ok.length - 1]);
    return;
  }

  // Classic single-board export.
  const id = importOneBoard(parsed);
  if (!id) { alert(t('alert-not-a-board')); return; }
  switchBoard(id);
});

// ---- Single-key shortcuts help ----

const shortcutsDlg = document.getElementById('shortcuts');
document.getElementById('help').addEventListener('click', () => shortcutsDlg.showModal());
shortcutsDlg.addEventListener('click', e => { if (e.target === shortcutsDlg) shortcutsDlg.close(); });

// ---- Stats view ----

const statsEl = document.getElementById('stats');
const viewBtn = document.getElementById('view-toggle');
const filtersEl = document.getElementById('filters');
let view = 'board';

viewBtn.addEventListener('click', () => {
  view = view === 'board' ? 'stats' : 'board';
  viewBtn.setAttribute('aria-pressed', view === 'stats');
  viewBtn.textContent = view === 'stats' ? t('view-toggle-board') : t('view-toggle-stats');
  boardEl.hidden = filtersEl.hidden = view === 'stats';
  statsEl.hidden = view !== 'stats';
  render();
});

const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs, text) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text !== undefined) el.textContent = text;
  return el;
}

// Vertical bar per column; a dashed line marks the column's WIP limit.
function barChart(columns) {
  const W = 360, H = 200, pad = 28, bw = 60;
  const max = Math.max(1, ...columns.map(c => Math.max(c.count, c.wip)));
  const gap = (W - pad * 2 - bw * columns.length) / Math.max(1, columns.length - 1);
  const y = n => H - pad - (n / max) * (H - pad * 2);
  const chart = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img',
    'aria-label': columns.map(c => c.title + ': ' + c.count).join(', ') });
  chart.appendChild(svg('line', { x1: pad, x2: W - pad, y1: H - pad, y2: H - pad, class: 'axis' }));
  columns.forEach((c, i) => {
    const x = pad + i * (bw + gap);
    chart.appendChild(svg('rect', { x, y: y(c.count), width: bw, height: H - pad - y(c.count), rx: 4, class: 'bar' + (c.over ? ' over' : '') }));
    chart.appendChild(svg('text', { x: x + bw / 2, y: y(c.count) - 6, class: 'val' }, c.count));
    chart.appendChild(svg('text', { x: x + bw / 2, y: H - pad + 16, class: 'lbl' }, c.title));
    if (c.wip) chart.appendChild(svg('line', { x1: x - 6, x2: x + bw + 6, y1: y(c.wip), y2: y(c.wip), class: 'wip' }));
  });
  return chart;
}

function tile(label, value, warn) {
  const d = document.createElement('div');
  d.className = 'tile' + (warn ? ' warn' : '');
  const v = document.createElement('strong');
  v.textContent = value;
  const l = document.createElement('span');
  l.textContent = label;
  d.append(v, l);
  return d;
}

function renderStats() {
  const s = Board.boardStats(state);
  const today = Board.isoDate(new Date());
  const todayCount = Object.values(state.cards).filter(c => c.due === today).count ? 0 : Object.values(state.cards).filter(c => c.due === today).length;
  statsEl.innerHTML = '';
  statsEl.setAttribute('aria-label', t('stats-aria'));

  const tiles = document.createElement('div');
  tiles.className = 'tiles';
  tiles.append(
    tile(t('stat-total'), s.total),
    tile(t('stat-overdue'), s.overdue, s.overdue > 0),
    tile(t('stat-due-today'), todayCount, todayCount > 0),
    tile(t('stat-done'), s.donePct + '%'),
    tile(t('stat-high-priority'), s.byPriority.high),
  );

  const over = s.columns.filter(c => c.over);
  const warn = document.createElement('p');
  warn.className = 'wip-warning';
  warn.textContent = over.length ? t('stats-over-wip', over.map(c => `${c.title} (${c.count}/${c.wip})`).join(', ')) : '';

  const chartBox = document.createElement('div');
  chartBox.className = 'panel';
  chartBox.innerHTML = '<h2>' + t('stats-cards-per-column') + '</h2>';
  chartBox.appendChild(barChart(s.columns));

  const wipBox = document.createElement('div');
  wipBox.className = 'panel';
  wipBox.innerHTML = '<h2>' + t('stats-wip-limits') + '</h2><p class="muted">' + t('stats-wip-hint') + '</p>';
  s.columns.forEach(c => {
    const label = document.createElement('label');
    label.className = 'wip-row';
    label.textContent = c.title;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 999;
    input.value = c.wip;
    input.addEventListener('change', () => update(Board.setWipLimit(state, c.id, input.value)));
    label.appendChild(input);
    wipBox.appendChild(label);
  });

  statsEl.append(tiles, warn, chartBox, wipBox);
}

// ---- Drag & drop ----

let dragId = null;
const indicator = document.createElement('li');
indicator.className = 'drop-indicator';

// The first rendered card (excluding the dragged one) that the pointer is above;
// the actual insertion index is derived from real card ids at drop time.
function dropIndex(list, y) {
  const cards = [...list.querySelectorAll('.card')].filter(el => el.dataset.id !== dragId);
  const i = cards.findIndex(el => { const r = el.getBoundingClientRect(); return y < r.top + r.height / 2; });
  return { before: cards[i] || null };
}

boardEl.addEventListener('dragstart', e => {
  const card = e.target.closest && e.target.closest('.card');
  if (!card) return;
  dragId = card.dataset.id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
  requestAnimationFrame(() => card.classList.add('dragging'));
});

boardEl.addEventListener('dragover', e => {
  if (!dragId) return;
  const column = e.target.closest('.column');
  if (!column) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const list = column.querySelector('.cards');
  const { before } = dropIndex(list, e.clientY);
  if (before) list.insertBefore(indicator, before); else list.appendChild(indicator);
});

boardEl.addEventListener('drop', e => {
  if (!dragId) return;
  const column = e.target.closest('.column');
  if (!column) return;
  e.preventDefault();
  const list = column.querySelector('.cards');
  const { before } = dropIndex(list, e.clientY);
  const col = state.columns.find(c => c.id === list.dataset.col);
  let index = col.cardIds.length;                    // 'end of column' = real end (moveCard clamps anyway)
  if (before) {
    const bi = col.cardIds.indexOf(before.dataset.id);
    const di = col.cardIds.indexOf(dragId);
    index = bi - (di > -1 && di < bi ? 1 : 0);        // in-column reorder: anchor shifts when the dragged card is removed in front of it
  }
  const id = dragId;
  endDrag();
  update(Board.moveCard(state, id, list.dataset.col, index));
});

boardEl.addEventListener('dragend', endDrag);
boardEl.addEventListener('dragleave', e => {
  if (!boardEl.contains(e.relatedTarget)) indicator.remove();
});

function endDrag() {
  dragId = null;
  indicator.remove();
  boardEl.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
}

// ---- Visual ropes: curved cords between linked cards ----
// The SVG overlay is fixed to the viewport, so rope coordinates are plain
// getBoundingClientRect() values. Pointer events stay on the cards.

const ropeBack = document.getElementById('ropes-back');
const ropeFront = document.getElementById('ropes-front');
let hotCard = null;   // hovered card id: its ropes glow, the rest dim

// One rope path between two card rectangles: anchored on the FACING edges
// (so the rope hugs the card borders), with a slight downward sag.
function ropePath(r1, r2) {
  const a = { x: r1.left + r1.width / 2, y: r1.top + r1.height / 2 };
  const b = { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2 };
  let p1, p2;
  if (Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)) {          // side by side
    p1 = { x: b.x >= a.x ? r1.right : r1.left, y: a.y };
    p2 = { x: b.x >= a.x ? r2.left : r2.right, y: b.y };
  } else {                                                   // stacked vertically
    p1 = { x: a.x, y: b.y >= a.y ? r1.bottom : r1.top };
    p2 = { x: b.x, y: b.y >= a.y ? r2.top : r2.bottom };
  }
  const midX = (p1.x + p2.x) / 2, midY = (p1.y + p2.y) / 2;
  const sag = Math.min(40, Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.15);
  return 'M' + p1.x + ' ' + p1.y + ' Q' + midX + ' ' + (midY + sag) + ' ' + p2.x + ' ' + p2.y;
}

function drawRopes() {
  ropeBack.innerHTML = '';
  ropeFront.innerHTML = '';
  if (view !== 'board') return;                 // stats view hides the board
  const els = {};
  boardEl.querySelectorAll('.card').forEach(el => els[el.dataset.id] = el);
  const drawn = new Set();                       // links are symmetric: draw each pair once
  Object.values(state.cards).forEach(card => {
    (card.links || []).forEach(other => {
      const key = [card.id, other].sort().join('|');
      if (drawn.has(key)) return;
      drawn.add(key);
      if (!els[card.id] || !els[other]) return;  // hidden by a filter: no rope
      const isHot = hotCard === card.id || hotCard === other;
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', ropePath(els[card.id].getBoundingClientRect(), els[other].getBoundingClientRect()));
      // Layering: gray ropes run BEHIND the cards, only glowing ones in front.
      path.setAttribute('class', 'rope' + (isHot ? ' hot' : hotCard ? ' dim' : ''));
      (isHot ? ropeFront : ropeBack).appendChild(path);
    });
  });
}

window.addEventListener('resize', drawRopes);
window.addEventListener('scroll', drawRopes, true);   // capture: catches inner scrollers too

// ---- Card detail modal ----

const dialog = document.getElementById('detail');
const form = document.getElementById('detail-form');
const previewEl = document.getElementById('md-preview');
const descArea = form.elements.description;
const logListEl = document.getElementById('detail-log');
const mdToolbar = document.getElementById('md-toolbar');
const mdTools = document.getElementById('md-tools');
const mdCopy = document.getElementById('md-copy')
let editingId = null;

// Copy the RENDERED description to the clipboard.
// PRIMARY: a native selection copy — byte-for-byte what Ctrl+C does, and the
// only path that reliably keeps <img> (and <a>) intact. Chromium sanitizes
// HTML written through navigator.clipboard.write(); the native copy pipeline
// does not. execCommand('copy') is deprecated but remains the proven fallback.
document.getElementById('md-copy').addEventListener('click', async () => {
  if (previewEl.innerHTML.trim()) {
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(previewEl);
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand('copy');
    sel.removeAllRanges();
    if (ok) return;
  }
  // Fallback 1: async Clipboard API (rich text, possibly minus images).
  try {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html':  new Blob([previewEl.innerHTML], { type: 'text/html' }),
      'text/plain': new Blob([descArea.value], { type: 'text/plain' }),
    })]);
  } catch (e) {
    // Fallback 2: older browser or denied permission — plain text only.
    try { await navigator.clipboard.writeText(descArea.value); } catch (e2) { /* clipboard unavailable */ }
  }
});

// Render the markdown preview from the current textarea content.
function refreshPreview() {
  previewEl.innerHTML = descArea.value ? mdToHtml(descArea.value) : '';
}

// Switch the description block between render and edit mode.
// focusTextarea: grab focus into the textarea (USER-initiated switches only,
// e.g. clicking the preview). Programmatic switches (dialog open, blur
// restore) must NEVER steal focus — otherwise they fight with title.focus()
// and every other field in the dialog (focus war on empty descriptions).
function setDescMode(edit, focusTextarea = true) {
  const mdTools = document.getElementById('md-tools');
  if (mdCopy) mdCopy.hidden = edit;   // visible in render mode only
  // An empty description renders nothing — keep the textarea usable instead.
  if (!edit && !descArea.value.trim()) edit = true;
  descEditing = edit;
  descEditing = edit;
  // Height parity between edit and render views: adopt the textarea's CURRENT
  // height (including manual resizes) as the preview's max-height BEFORE the
  // textarea is hidden, so switching modes never moves the layout.
  if (!edit) previewEl.style.maxHeight = descArea.getBoundingClientRect().height + 'px';
  descArea.hidden = !edit;
  previewEl.hidden = edit;
  if (mdToolbar) {
    mdToolbar.hidden = false;                            // container always participates in layout
    if (mdTools) mdTools.classList.toggle('ghosted', !edit);  // format buttons: edit mode only
    if (mdCopy) mdCopy.hidden = edit;                    // copy button: render mode only
  }
  if (edit) {
    if (focusTextarea) {
      descArea.focus();
      // Caret at the end: clicking the preview means "append/edit the text".
      const len = descArea.value.length;
      descArea.setSelectionRange(len, len);
    }
  } else {
    refreshPreview();
  }
}

// Copy the RENDERED description as rich text (text/html) plus the raw
// markdown as text/plain fallback. Clipboard API needs a click-triggered
// secure context; file:// counts as one in Chromium browsers.
document.getElementById('md-copy').addEventListener('click', async () => {
  const html = previewEl.innerHTML;               // freshly rendered in render mode
  try {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html':  new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([descArea.value], { type: 'text/plain' }),
    })]);
  } catch (e) {
    // Older browser or denied permission: degrade to plain text instead of failing silently.
    try { await navigator.clipboard.writeText(descArea.value); } catch (e2) { /* clipboard unavailable */ }
  }
});

// Leaving the textarea (tab away, click into another field, Save, …) restores
// the render view. Checked asynchronously: if the focus merely moved (e.g. into
// the toolbar via Tab) or came straight back, the edit mode must survive.
descArea.addEventListener('blur', () => {
  if (!descEditing) return;
  setTimeout(() => {
    if (!descEditing) return;
    const active = document.activeElement;
    if (active === descArea) return;                              // focus came back
    if (mdToolbar && mdToolbar.contains(active)) return;          // tabbed into the toolbar
    setDescMode(false, false);                                    // restore render view, NO focus steal
  }, 0);
});

// Live preview while typing (the textarea is the source of truth either way).
descArea.addEventListener('input', refreshPreview);

// ---- Markdown toolbar: formatting buttons above the description textarea ----
// Actions operate on the textarea's current selection. All button clicks go
// through mousedown+preventDefault so the textarea never loses focus and the
// selection survives. The textarea stays the single source of truth: the
// toolbar only rewrites `descArea.value` and restores a sensible selection.

// Selection index helper: focus FIRST, then read [start, end] — an unfocused
// textarea may not report a valid selection.
function mdSel() {
  descArea.focus();
  return [descArea.selectionStart, descArea.selectionEnd];
}

// Wrap the selection (or insert bare markup) with pre/post. Pressing the same
// button again on wrapped text removes the markup. Ends with a COLLAPSED
// caret right at the edit location — never a selection, so typing cannot
// overwrite the formatted text, and the caret never jumps to the far end.
function mdWrap(pre, post) {
  const [s, e] = mdSel();
  const val = descArea.value;
  const sel = val.slice(s, e);
  const before = val.slice(0, s), after = val.slice(e);
  let caret;
  if (sel && before.endsWith(pre) && after.startsWith(post)) {
    // Toggle off: strip the surrounding markup.
    descArea.value = before.slice(0, -pre.length) + sel + after.slice(post.length);
    caret = s - pre.length + sel.length;          // caret right after the un-wrapped text
  } else if (sel) {
    descArea.value = before + pre + sel + post + after;
    caret = s + pre.length + sel.length + post.length;  // caret after the closing markup
  } else {
    // No selection: insert bare markers, caret between them.
    descArea.value = before + pre + post + after;
    caret = s + pre.length;
  }
  descArea.setSelectionRange(caret, caret);
  refreshPreview();
}

// Line-prefix actions (h1/h2/h3, bullet list, task list): applied to every
// line touched by the selection. A line that already carries the SAME prefix
// loses it; any other prefix is REPLACED (e.g. task -> bullet).
const MD_PREFIXES = { h1: '# ', h2: '## ', h3: '### ', ul: '- ', task: '- [ ] ' };
const MD_PREFIX_RE = /^(#{1,3}\s+|[-*]\s+\[(?: |x|X)\]\s+|[-*]\s+)?/;

function mdPrefix(kind) {
  const [s, e] = mdSel();
  const val = descArea.value;
  const ls = val.lastIndexOf('\n', s - 1) + 1;       // start of the first line
  let le = val.indexOf('\n', Math.max(ls, e));        // end of the last line
  if (le === -1) le = val.length;
  const want = MD_PREFIXES[kind];
  const text = val.slice(ls, le).split('\n').map(line => {
    const m = line.match(MD_PREFIX_RE);
    const cur = m && m[1] ? m[1] : '';
    const body = line.slice(cur.length);
    return cur === want ? body : want + body;         // same prefix -> toggle off
  }).join('\n');
  descArea.value = val.slice(0, ls) + text + val.slice(le);
  descArea.setSelectionRange(ls + text.length, ls + text.length);   // caret at the END of the block
  refreshPreview();
}

// Insert a link/image template at the selection. The caret ends up collapsed
// right after the closing parenthesis — no URL preselection, no jump.
function mdInsert(isImage) {
  const [s, e] = mdSel();
  const val = descArea.value;
  const label = val.slice(s, e) || (isImage ? 'Bild' : 'Text');
  const URL_PH = 'https://…';
  const ins = (isImage ? '![' : '[') + label + '](' + URL_PH + ')';
  descArea.value = val.slice(0, s) + ins + val.slice(e);
  descArea.setSelectionRange(s + ins.length, s + ins.length);
  refreshPreview();
}

// mousedown on a toolbar button must NOT steal focus from the textarea.
mdToolbar.addEventListener('mousedown', e => {
  if (e.target.closest('button[data-md]')) e.preventDefault();
});

mdToolbar.addEventListener('click', e => {
  const btn = e.target.closest('button[data-md]');
  if (!btn) return;
  switch (btn.dataset.md) {
    case 'h1': case 'h2': case 'h3': case 'ul': case 'task': mdPrefix(btn.dataset.md); break;
    case 'bold': mdWrap('**', '**', 'Text'); break;
    case 'italic': mdWrap('*', '*', 'Text'); break;
    case 'underline': mdWrap('_', '_', 'Text'); break;
    case 'link': mdInsert(false); break;
    case 'img': mdInsert(true); break;
  }
});

// Render the card's change log into the collapsible history section (newest first).
// The log texts themselves are stored data and stay in the language they were
// written in (see design decision); only UI chrome is translated.
function renderHistory(card) {
  logListEl.innerHTML = '';
  const entries = [...(card.log || [])].reverse();   // newest on top
  if (!entries.length) {
    const li = document.createElement('li');
    li.textContent = t('detail-log-empty');
    logListEl.appendChild(li);
    return;
  }
  entries.forEach(e => {
    const li = document.createElement('li');
    const time = document.createElement('span');
    time.className = 'log-time';
    time.textContent = fmtTs(e.ts);
    li.appendChild(time);
    li.appendChild(document.createTextNode(e.text));
    logListEl.appendChild(li);
  });
}

function openDetail(id) {
  const card = state.cards[id];
  if (!card) return;
  editingId = id;
  setDetailParam(id);
  form.elements.title.value = card.title;
  descArea.value = card.description || '';
  refreshPreview();                             // render NOW: the preview must never open empty
  form.elements.priority.value = card.priority || 'none';
  form.elements.due.value = card.due || '';
  form.elements.tags.value = (card.tags || []).join(', ');
  form.elements.affects.value = (card.affects || []).join(', ');
  document.getElementById('detail-id').textContent = '[' + card.id + ']';
  const col = state.columns[Board.findColumnIndex(state, id)];
  document.getElementById('detail-col').textContent = col ? t('detail-in', col.title) : '';
  linkDraft = [...(card.links || [])];
  linkSearch.value = '';
  renderLinkChips();
  document.getElementById('link-list').hidden = true;
  renderHistory(card);                          // populate the history section
  dialog.showModal();
  setDescMode(false, false);                    // render view first, NO focus steal
  form.elements.title.focus();
}

function mdToHtml(src) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const inline = s => {
    // Stash rendered <img> AND <a> tags BEFORE the other rules run: their
    // src/href may contain characters (_/*`...) that bold/italic/underline
    // would otherwise corrupt (e.g. heise CDN paths like _www-heise-de_).
    const keep = [];
    const stash = html => { keep.push(html); return '\x00K' + (keep.length - 1) + '\x00'; };
    s = s
      .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
        (m, alt, url) => stash('<img src="' + url + '" alt="' + alt + '">'))
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        (m, txt, url) => stash('<a href="' + url + '" target="_blank" rel="noopener">' + txt + '</a>'))
      .replace(/(^|[^A-Za-z0-9_])_([^_\n]+)_(?![A-Za-z0-9_])/g, '$1<u>$2</u>');
    // Restore the stashed tags – their URLs are now untouchable.
    return s.replace(/\x00K(\d+)\x00/g, (m, i) => keep[+i]);
  };
  const lines = esc(String(src || '')).split(/\r?\n/);
  const out = [];
  let list = null, para = [];
  let taskNo = 0;
  const closeList = () => { if (list) { out.push('</' + list + '>'); list = null; } };
  const flushPara = () => { if (para.length) { out.push('<p>' + para.map(inline).join('<br>') + '</p>'); para = []; } };

  lines.forEach(raw => {
    const l = raw.trimEnd();

    const h = l.match(/^(#{1,3})\s+(.*)/);
    if (h) {
      flushPara(); closeList();
      const tag = ['h3', 'h4', 'h5'][h[1].length - 1];
      out.push('<' + tag + '>' + inline(h[2]) + '</' + tag + '>');
      return;
    }

    const task = l.match(/^[-*]\s+\[( |x|X)?\]\s+(.*)/);
    const ul = task || l.match(/^[-*]\s+(.*)/);
    const ol = !ul && l.match(/^\d+[.)]\s+(.*)/);
    if (ul || ol) {
      flushPara();
      const want = ul ? 'ul' : 'ol';
      if (list !== want) { closeList(); out.push('<' + want + '>'); list = want; }
      if (task) {
        taskNo++;
        const on = task[1] && task[1] !== ' ' ? ' on' : '';
        out.push('<li class="task" data-task="' + taskNo + '"><span class="cbx' + on + '">' + (on ? '✓' : '') + '</span> ' + inline(task[2]) + '</li>');
      } else {
        out.push('<li>' + inline((ul || ol)[1]) + '</li>');
      }
    } else if (!l.trim()) {
      flushPara(); closeList();
      out.push('<br>');                       // every blank line renders as a visible line break
    } else {
      closeList(); para.push(l);
    }
  });
  flushPara(); closeList();
  return out.join('\n').replace(/(?:\s|<br>)+$/, '');   // trim trailing blank lines from the end
}

// Toggle the n-th task checkbox in the raw description source ("- [ ]" <-> "- [x]").
function toggleTaskInSrc(src, n) {
  let i = 0;
  return String(src || '').replace(/^[-*]\s+\[( |x|X)?\]\s+/gm, (m, mark) => {
    if (++i !== n) return m;
    return m.replace(/\[( |x|X)?\]/, mark && mark !== ' ' ? '[ ]' : '[x]');
  });
}

// ---- Link picker: searchable multi-select for linked cards ----
let linkDraft = []; // chosen card ids while the dialog is open

function linkCandidates() {
  return Object.values(state.cards).filter(c => c.id !== editingId);
}

// Filter candidates by query: fuzzy match (Board.fuzzyMatch) over "[id] title",
// falling back to plain substring match for very short queries.
function linkFiltered(query) {
  const q = query.trim().toLowerCase();
  if (!q) return linkCandidates();
  return linkCandidates().filter(c => {
    const hay = '[' + c.id + '] ' + c.title;
    const f = Board.fuzzyMatch(query, hay);
    return f !== null || hay.toLowerCase().includes(q);
  });
}

function renderLinkChips() {
  const box = document.getElementById('link-chips');
  box.innerHTML = '';
  linkDraft.forEach(id => {
    const card = state.cards[id];
    const chip = document.createElement('span');
    chip.className = 'card-link';
    chip.textContent = '[' + id + '] ' + (card ? card.title : t('link-unknown'));
    chip.title = t('link-remove-title');
    chip.addEventListener('click', () => {
      linkDraft = linkDraft.filter(x => x !== id);
      renderLinkChips();
    });
    box.appendChild(chip);
  });
}

function renderLinkList(query) {
  const list = document.getElementById('link-list');
  const hits = linkFiltered(query);
  list.innerHTML = '';
  if (!hits.length) {
    list.textContent = t('link-no-hits');
    list.hidden = false;
    return;
  }
  hits.forEach(c => {
    const item = document.createElement('div');
    item.className = 'lp-item' + (linkDraft.includes(c.id) ? ' picked' : '');
    item.textContent = '[' + c.id + '] ' + c.title + (linkDraft.includes(c.id) ? ' ✓' : '');
    // mousedown fires before the input's blur, so the list stays usable.
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      if (linkDraft.includes(c.id)) linkDraft = linkDraft.filter(x => x !== c.id);
      else linkDraft.push(c.id);
      renderLinkChips();
      renderLinkList(document.getElementById('link-search').value);
    });
    list.appendChild(item);
  });
  list.hidden = false;
}

const linkSearch = document.getElementById('link-search');
linkSearch.addEventListener('input', () => renderLinkList(linkSearch.value));
linkSearch.addEventListener('focus', () => renderLinkList(linkSearch.value));
linkSearch.addEventListener('blur', () => { document.getElementById('link-list').hidden = true; });
linkSearch.addEventListener('keydown', e => {
  if (e.key === 'Escape') { linkSearch.value = ''; document.getElementById('link-list').hidden = true; }
  else if (e.key === 'Enter') {
    e.preventDefault();                       // never submit the dialog from the picker
    const first = linkFiltered(linkSearch.value)[0];
    if (first) {
      if (!linkDraft.includes(first.id)) linkDraft.push(first.id);
      renderLinkChips();
    }
    linkSearch.value = '';
    renderLinkList('');
  }
});
document.getElementById('link-confirm').addEventListener('click', () => {
  document.getElementById('link-list').hidden = true;
  linkSearch.blur();
});

// Clicking the render view swaps to the raw textarea — with three exceptions
// that stay in the render view: task checkboxes (toggle in place), hyperlinks
// (the browser opens them in a new tab), and images (inert content).
previewEl.addEventListener('click', e => {
  if (e.target.closest('a')) return;              // hyperlink: let the browser navigate
  if (e.target.closest('img')) return;            // image: inert, never enters edit mode
  const li = e.target.closest('li.task');
  if (li) {
    descArea.value = toggleTaskInSrc(descArea.value, Number(li.dataset.task));
    refreshPreview();
    return;
  }
  setDescMode(true);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (editingId) {
    let next = Board.updateCard(state, editingId, {
      title: form.elements.title.value,
      description: descArea.value,
      priority: form.elements.priority.value,
      due: form.elements.due.value,
      tags: form.elements.tags.value,
      affects: form.elements.affects.value,
    });
    next = Board.setLinks(next, editingId, linkDraft);   // symmetric: updates BOTH ends
    update(next);
  }
  dialog.close();
});

document.getElementById('detail-cancel').addEventListener('click', () => dialog.close());
document.getElementById('detail-delete').addEventListener('click', () => {
  if (editingId && confirm(t('confirm-delete-card'))) update(Board.deleteCard(state, editingId));
  dialog.close();
});

// DELIBERATE UX DECISION: the detail dialog does NOT close on clicks — neither
// on the backdrop nor anywhere inside the dialog. Closing is an explicit user
// action via the Speichern / Abbrechen / Löschen buttons only, so an errant
// click outside the textarea can never silently discard edits.
// (Native Escape still closes the dialog; that is documented in the shortcuts
// help and intentionally kept.)

dialog.addEventListener('close', () => { editingId = null; setDetailParam(null); });

// ---- Startup: translate the static markup, then render the board ----
applyI18n();
renderLangSelect();
render();

// ---- Deep-link startup: open the linked card after the initial render ----
(function openFromLink() {
  const wanted = detailParam();
  if (!wanted) return;
  const id = state.cards[wanted] ? wanted : (state.cards['c' + wanted] ? 'c' + wanted : null);
  if (id) openDetail(id);
  else console.warn(t('console-deep-link-missing', [wanted, boardName()]));
})();
