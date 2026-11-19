// Explicit .ts so `node src/about-v2/checks.ts` can resolve it too.
import { PORTRAIT_BOX, portraitStrokes } from '../portrait.ts';

/**
 * Pure route maths for the page-long line. Everything is in page coordinates
 * (px from the page's top-left). No DOM here, so it can be checked in Node.
 */

export type Pt = { x: number; y: number };
export type Box = { x: number; y: number; w: number; h: number };
export type Stroke = { d: string; width: number; intro: boolean };

export type Anchors = {
  pageW: number;
  mobile: boolean;
  hero: Box;
  h1: Box;
  h1Size: number;
  /** The Projects / Skills buttons: beside the name on wide screens, below it otherwise. */
  nameLinks?: Box;
  portrait: Box;
  booksPhrase?: Box;
  booksArt?: Box;
  booksCopy?: Box;
  books?: Box;
  rows?: Box;
  rowName?: Box;
  tally?: Box;
  tallyCount: number;
  pile?: Box;
  pills?: Box;
  tail?: Box;
};

const right = (b: Box) => b.x + b.w;
const bottom = (b: Box) => b.y + b.h;
const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;
const f = (n: number) => Math.round(n * 10) / 10;

/** Deterministic PRNG (mulberry32), so the line wobbles the same on every visit. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A smooth curve through `pts` (Catmull-Rom, as cubic Béziers). Control points
 * are clamped inside the page so a curve never pushes the page wider.
 */
export function through(pts: Pt[], pageW: number, move = true): string {
  const clampX = (x: number) => Math.min(Math.max(x, 4), pageW - 4);
  let d = move ? `M ${f(clampX(pts[0].x))} ${f(pts[0].y)}` : '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: clampX(p1.x + (p2.x - p0.x) / 6), y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: clampX(p2.x - (p3.x - p1.x) / 6), y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(clampX(p2.x))} ${f(p2.y)}`;
  }
  return d;
}

/** Points on a hand-drawn loop around a box: overshoots, so it never quite closes. */
export function loop(b: Box, o: { sx: number; sy: number; rot: number; start: number; sweep: number; step?: number }): Pt[] {
  const rx = (b.w * o.sx) / 2;
  const ry = (b.h * o.sy) / 2;
  const rot = (o.rot * Math.PI) / 180;
  const step = o.step ?? 30;
  const pts: Pt[] = [];
  for (let a = 0; a <= o.sweep; a += step) {
    const t = ((o.start + a) * Math.PI) / 180;
    // The radius drifts a little each turn, like a pen going round twice.
    const k = 1 + (a / 360) * 0.06;
    const x = Math.cos(t) * rx * k;
    const y = Math.sin(t) * ry * k;
    pts.push({ x: cx(b) + x * Math.cos(rot) - y * Math.sin(rot), y: cy(b) + x * Math.sin(rot) + y * Math.cos(rot) });
  }
  return pts;
}

/** A wavy underline, drawn right to left (the pen arrives from the right). */
function underline(x0: number, x1: number, y: number, wave: number[]): Pt[] {
  return wave.map((dy, i) => ({ x: x1 - ((x1 - x0) * i) / (wave.length - 1), y: y + dy }));
}

/** Fits an absolute M/C/L path from `src` space into box `b` (contain, centred). */
export function fit(d: string, src: { w: number; h: number }, b: Box): string {
  const s = Math.min(b.w / src.w, b.h / src.h);
  const ox = b.x + (b.w - src.w * s) / 2;
  const oy = b.y + (b.h - src.h * s) / 2;
  let i = 0;
  return d.replace(/-?\d*\.?\d+/g, (n) => String(f(i++ % 2 === 0 ? ox + Number(n) * s : oy + Number(n) * s)));
}

/** Last point of an absolute M/C/L path. */
export function endOf(d: string): Pt {
  const nums = d.match(/-?\d*\.?\d+/g)!.map(Number);
  return { x: nums[nums.length - 2], y: nums[nums.length - 1] };
}
/** First point of an absolute path. */
export function startOf(d: string): Pt {
  const nums = d.match(/-?\d*\.?\d+/g)!.map(Number);
  return { x: nums[0], y: nums[1] };
}

/** Tally marks, groups of four with a strike, centred in `b`. One stroke per mark. */
function tallies(n: number, b: Box, rand: () => number): string[] {
  const groups = Math.ceil(n / 5);
  const gw = 40;
  const gap = 22;
  const markH = 34;
  const totalW = groups * gw + (groups - 1) * gap;
  const x0 = cx(b) - totalW / 2;
  const top = cy(b) - markH / 2;
  const out: string[] = [];
  for (let g = 0; g < groups; g++) {
    const gx = x0 + g * (gw + gap);
    const marks = Math.min(5, n - g * 5);
    for (let m = 0; m < Math.min(marks, 4); m++) {
      const x = gx + 4 + m * 10 + (rand() - 0.5) * 2;
      const lean = (rand() - 0.5) * 4;
      out.push(`M ${f(x)} ${f(top + rand() * 2)} C ${f(x + lean)} ${f(top + 12)} ${f(x - lean)} ${f(top + 22)} ${f(x + lean / 2)} ${f(top + markH)}`);
    }
    if (marks === 5) out.push(`M ${f(gx - 4)} ${f(top + markH - 6)} C ${f(gx + 12)} ${f(top + 20)} ${f(gx + 28)} ${f(top + 12)} ${f(gx + gw + 4)} ${f(top + 4)}`);
  }
  return out;
}

/** The bow that ties the line off under the contact pills. */
function bow(c: Pt, s: number): Pt[] {
  return [
    c,
    { x: c.x + 40 * s, y: c.y - 26 * s },
    { x: c.x + 72 * s, y: c.y - 4 * s },
    { x: c.x + 44 * s, y: c.y + 22 * s },
    c,
    { x: c.x - 40 * s, y: c.y - 26 * s },
    { x: c.x - 72 * s, y: c.y - 4 * s },
    { x: c.x - 44 * s, y: c.y + 22 * s },
    c,
    { x: c.x + 18 * s, y: c.y + 40 * s },
    { x: c.x + 52 * s, y: c.y + 66 * s },
    { x: c.x + 92 * s, y: c.y + 78 * s },
  ];
}

/** The whole route. Strokes are drawn in order; each is one pen-down. */
export function buildRoute(a: Anchors): Stroke[] {
  const W = a.pageW;
  const width = a.mobile ? 1.75 : 2;
  const pw = Math.min(Math.max(a.portrait.w * 0.0105, 2.4), 3.6);
  const rand = rng(60);
  const out: Stroke[] = [];
  const main = (d: string, intro = false) => out.push({ d, width, intro });

  // --- Portrait, fitted to its slot ---------------------------------------------
  const order = a.mobile ? portraitStrokes.fromLeft : portraitStrokes.fromRight;
  const portrait = order.map((d) => fit(d, PORTRAIT_BOX, a.portrait));
  const pStart = startOf(portrait[0]);
  const pEnd = endOf(portrait[portrait.length - 1]);

  // --- 1. Enter from the top, underline the name, sweep into the portrait ---------
  const fs = a.h1Size;
  const ulY = bottom(a.h1) - fs * 0.04;
  const ul = underline(a.h1.x - fs * 0.04, right(a.h1) + fs * 0.06, ulY, [0, 2, -1, 2.5, 0, 3]);
  if (a.mobile) {
    main(through([{ x: W - 14, y: -40 }, { x: W - 14, y: a.h1.y - 30 }, { x: right(a.h1) + 10, y: a.h1.y + a.h1.h * 0.5 }, ...ul, { x: 14, y: ulY + 50 }, { x: 14, y: a.portrait.y - 20 }, { x: a.portrait.x - 10, y: a.portrait.y + a.portrait.h * 0.25 }, pStart], W), true);
  } else {
    // With the buttons beside the name, come down to their right and hook under
    // them to reach the underline; otherwise drop straight in beside the name.
    const nl = a.nameLinks;
    const approach: Pt[] =
      nl && nl.x > right(a.h1)
        ? [
            { x: right(nl) + 40, y: -40 },
            { x: right(nl) + 30, y: cy(nl) },
            // Under the buttons with room to spare, then up beside the name's end.
            { x: right(nl) + 14, y: bottom(nl) + 28 },
            { x: right(a.h1) + 12, y: bottom(nl) + 30 },
          ]
        : [{ x: right(a.h1) + fs * 0.6, y: -40 }, { x: right(a.h1) + fs * 0.35, y: a.h1.y - fs * 0.2 }, { x: right(a.h1) + fs * 0.12, y: a.h1.y + a.h1.h * 0.55 }];
    // The portrait's first stroke is the ear, on its right edge: arrive from the side.
    main(through([...approach, ...ul, { x: a.h1.x - fs * 0.8, y: ulY + fs * 0.6 }, { x: right(a.portrait) + 50, y: pStart.y + 30 }, pStart], W), true);
  }
  portrait.forEach((d) => out.push({ d, width: pw, intro: true }));

  // --- 2. Down past the books, circle the first project, on to the tallies -----------
  const pts: Pt[] = [pEnd, { x: pEnd.x, y: bottom(a.hero) - 20 }];
  const gapY = a.books ? bottom(a.hero) + (a.books.y + 80 - bottom(a.hero)) * 0.4 : bottom(a.hero) + 60;
  if (a.mobile) {
    pts.push({ x: W * 0.5, y: gapY }, { x: W - 10, y: gapY + 40 });
    if (a.rows) pts.push({ x: W - 10, y: a.rows.y - 120 }, { x: 10, y: a.rows.y - 40 }, { x: 10, y: bottom(a.rows) + 10 });
  } else {
    pts.push({ x: W * 0.5, y: gapY }, { x: W - 40, y: gapY + 40 });
    if (a.booksPhrase) {
      const ph = a.booksPhrase;
      pts.push({ x: W - 40, y: ph.y - 40 }, { x: right(ph) + 30, y: bottom(ph) - 8 }, ...underline(ph.x - 6, right(ph) + 8, bottom(ph) + 4, [0, 2, -1, 2, 1]));
    }
    if (a.booksArt && a.booksCopy && a.books) {
      // Keep left of the copy, then drop down the gutter between art and copy.
      const gutter = (right(a.booksArt) + a.booksCopy.x) / 2;
      const top = a.booksPhrase ? bottom(a.booksPhrase) + 40 : a.booksCopy.y;
      pts.push({ x: a.booksCopy.x - 30, y: top }, { x: gutter, y: bottom(a.booksCopy) + 30 }, { x: gutter - 40, y: bottom(a.books) + 20 });
    }
    if (a.rows && a.rowName) {
      pts.push({ x: a.rows.x - 70, y: a.rowName.y - 90 });
      pts.push(...loop(a.rowName, { sx: 1.62, sy: 2.9, rot: -1.5, start: 200, sweep: 380, step: 25 }));
      pts.push({ x: a.rows.x - 40, y: bottom(a.rows) - 20 }, { x: a.rows.x - 20, y: bottom(a.rows) + 30 });
    }
  }
  if (a.tally) pts.push({ x: cx(a.tally) - 80, y: a.tally.y - 6 });
  main(through(pts, W));

  // --- 3. Tally marks: one per project not listed ------------------------------------
  let last = endOf(out[out.length - 1].d);
  if (a.tally && a.tallyCount > 0) {
    tallies(a.tallyCount, a.tally, rand).forEach((d) => main(d));
    last = endOf(out[out.length - 1].d);
  }

  // --- 4. Round the photo pile, then tie off around the contact pills ------------------
  // Head right first, clear of the note under the tallies, then down the right edge.
  const end: Pt[] = [last];
  const edge = a.mobile ? W - 10 : W - 50;
  end.push({ x: a.tally ? right(a.tally) + (a.mobile ? 0 : 60) : last.x + 60, y: last.y + 6 }, { x: edge, y: last.y + 70 });
  if (a.pile) {
    const p = a.pile;
    if (a.mobile) {
      end.push({ x: edge, y: p.y - 30 }, { x: edge, y: bottom(p) + 10 });
    } else {
      end.push({ x: edge, y: p.y - 70 });
      // A loop and a third round the pile, finishing under it.
      // sy 1.1 keeps the top of the loop under the hint text above the pile.
      end.push(...loop(p, { sx: 1.14, sy: 1.1, rot: -2.5, start: 330, sweep: 480, step: 30 }));
    }
  }
  if (a.pills) {
    const pl = a.pills;
    // Arrive from the right, go round the pills once and a bit, end below them.
    end.push({ x: Math.min(edge, right(pl) + 140), y: pl.y - 50 }, { x: right(pl) + 70, y: cy(pl) - 10 });
    end.push(...loop(pl, { sx: 1.42, sy: 3.2, rot: 1.5, start: 0, sweep: 460, step: 30 }));
    const s = Math.min(Math.max(pl.w / 400, 0.6), 1.1);
    end.push(...bow({ x: cx(pl), y: bottom(pl) + pl.h * 1.3 }, s).slice(1));
  }
  if (end.length > 1) main(through(end, W));

  return out;
}

/**
 * How much line should be drawn for a given scroll position. `L` and `maxY` are
 * matched samples: cumulative length and the lowest point reached by then (so
 * `maxY` never decreases). Returns the longest length whose lowest point is
 * above the reading line.
 */
export function lengthAt(L: ArrayLike<number>, maxY: ArrayLike<number>, readingLine: number): number {
  let lo = 0;
  let hi = L.length - 1;
  if (hi < 0 || maxY[0] > readingLine) return 0;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (maxY[mid] <= readingLine) lo = mid;
    else hi = mid - 1;
  }
  return L[lo];
}
