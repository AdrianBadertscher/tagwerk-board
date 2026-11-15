// Undo/redo history over immutable board snapshots.
//
// Board states are never mutated, so storing references is enough — no deep
// copies needed. Each operation returns a NEW history object; if nothing
// changes (empty stacks or no-op push) the SAME object is returned, so
// callers can cheaply detect "nothing happened" via reference equality.
//
// Works in the browser (window.History_) and in Node (module.exports).

(function (root) {
  const LIMIT = 100;

  // Create a fresh history holding `present`. Optional `limit` caps how many
  // past states are retained.
  function create(present, limit = LIMIT) {
    return { past: [], present, future: [], limit };
  }

  // Record a new present state; clears the redo stack and drops the oldest
  // entries beyond `limit`. Returns `h` unchanged if `next` IS the present.
  function push(h, next) {
    if (next === h.present) return h;
    const past = [...h.past, h.present].slice(-h.limit);
    return { ...h, past, present: next, future: [] };
  }

  // Step back one state; the discarded present becomes the next redo target.
  // Returns `h` unchanged if there is nothing to undo.
  function undo(h) {
    if (!h.past.length) return h;
    return {
      ...h,
      past: h.past.slice(0, -1),
      present: h.past[h.past.length - 1],
      future: [h.present, ...h.future],
    };
  }

  // Step forward one previously undone state; mirrors undo().
  // Returns `h` unchanged if there is nothing to redo.
  function redo(h) {
    if (!h.future.length) return h;
    return {
      ...h,
      past: [...h.past, h.present],
      present: h.future[0],
      future: h.future.slice(1),
    };
  }

  const api = { LIMIT, create, push, undo, redo };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.History_ = api;
})(this);