// Explicit .ts so `node src/about-v2/checks.ts` can resolve it too.
import { rng } from '../line/route.ts';

/**
 * Pure, seeded layout for the photo pile. Every value is a fraction of the pile's
 * width (heights too), so the same pile scales to any width.
 */
export type Orientation = 'landscape' | 'portrait';
export type Placement = { x: number; y: number; w: number; h: number; rot: number };

/** Columns by pile width, as on the reference: 2 / 3 / 4. */
export function columnsFor(width: number): number {
  return width < 566 ? 2 : width < 935 ? 3 : 4;
}

export function layoutPile(shapes: Orientation[], cols: number): { items: Placement[]; height: number } {
  const rand = rng(7 + shapes.length);
  const cell = 1 / cols;
  const items: Placement[] = [];
  let rowTop = 0;

  for (let start = 0, row = 0; start < shapes.length; start += cols, row++) {
    const rowShapes = shapes.slice(start, start + cols);
    // Alternate rows nudge sideways; a short last row is centred.
    const rowShift = row % 2 ? 0.08 * cell : -0.04 * cell;
    const centre = ((cols - rowShapes.length) * cell) / 2;
    let rowBottom = rowTop;

    rowShapes.forEach((shape, col) => {
      const landscape = shape === 'landscape';
      const w = (landscape ? cell * 0.98 : cell * 0.76) * (0.94 + rand() * 0.1);
      const h = landscape ? (w * 3) / 4 : (w * 4) / 3;
      const jitterX = (rand() - 0.5) * 2 * 0.11 * cell;
      const x = Math.min(Math.max(centre + col * cell + (cell - w) / 2 + jitterX + rowShift, -0.015), 1 - w + 0.015);
      const y = rowTop + (rand() - 0.5) * 2 * 0.06 * cell + (landscape ? 0.1 * cell : 0);
      const rot = (rand() - 0.5) * 2 * 6.5;
      items.push({ x, y, w, h, rot });
      rowBottom = Math.max(rowBottom, y + h);
    });

    // The next row starts 80% of the way down this one, so rows overlap.
    rowTop += (rowBottom - rowTop) * 0.8;
  }

  return { items, height: Math.max(0, ...items.map((p) => p.y + p.h)) };
}
