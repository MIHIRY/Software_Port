/**
 * Self-check for the two pure pieces of About v2. Run with:
 *   node src/about-v2/checks.ts
 * (Node 23.6+ runs TypeScript directly.) Exits non-zero on the first failure.
 */
import { columnsFor, layoutPile, type Orientation } from './pile/layout.ts';
import { lengthAt, loop, through } from './line/route.ts';

// A minimal assert, so this file needs no Node type definitions in the app's typecheck.
function assert(condition: unknown, message = 'assertion failed'): void {
  if (!condition) throw new Error(message);
}
assert.ok = assert;
assert.equal = (a: unknown, b: unknown, message?: string) => assert(a === b, message ?? `${String(a)} !== ${String(b)}`);
assert.deepEqual = (a: unknown, b: unknown, message?: string) => assert(JSON.stringify(a) === JSON.stringify(b), message ?? 'not deep-equal');

// --- Pile layout -------------------------------------------------------------------
assert.equal(columnsFor(400), 2);
assert.equal(columnsFor(700), 3);
assert.equal(columnsFor(1000), 4);

const shapes: Orientation[] = ['landscape', 'portrait', 'landscape', 'landscape', 'portrait', 'landscape', 'landscape', 'portrait', 'landscape', 'landscape'];
for (const cols of [2, 3, 4]) {
  const a = layoutPile(shapes, cols);
  const b = layoutPile(shapes, cols);
  assert.deepEqual(a, b, 'layout is deterministic');
  assert.equal(a.items.length, shapes.length);
  for (const p of a.items) {
    assert.ok(p.x >= -0.016 && p.x + p.w <= 1.016, `print stays inside the pile (cols ${cols})`);
    assert.ok(Math.abs(p.rot) <= 6.5, 'rotation within ±6.5°');
  }
  assert.ok(a.height > 0 && a.height === Math.max(...a.items.map((p) => p.y + p.h)), 'height covers the lowest print');
}

// --- Scroll → length lookup ------------------------------------------------------------
const L = [0, 10, 20, 30, 40];
const maxY = [5, 50, 50, 120, 300];
assert.equal(lengthAt(L, maxY, 0), 0, 'nothing drawn above the first point');
assert.equal(lengthAt(L, maxY, 60), 20, 'stops before the first point below the line');
assert.equal(lengthAt(L, maxY, 1000), 40, 'everything drawn past the end');

// --- Route helpers ---------------------------------------------------------------------
const pts = loop({ x: 0, y: 0, w: 100, h: 40 }, { sx: 1, sy: 1, rot: 0, start: 0, sweep: 360, step: 90 });
assert.equal(pts.length, 5, 'a full turn at 90° steps has 5 points');
assert.ok(!through([{ x: -50, y: 0 }, { x: 50, y: 10 }], 100).includes('-'), 'curves are clamped inside the page');

console.log('about-v2 checks: all passed');
