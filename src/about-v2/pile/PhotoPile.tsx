import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { StickerCurled, StickerSitting } from '../art';
import { photos } from '../content';
import { columnsFor, layoutPile } from './layout';
import Lightbox from './Lightbox';

/** Movement under this is a click, not a drag (px). */
const DRAG_THRESHOLD = 6;

/** A position in fractions of the pile's width, plus a rotation in degrees. */
type Pos = { x: number; y: number; rot: number };

const vars = (p: Pos, width: number): CSSProperties =>
  ({ '--x': `${p.x * width}px`, '--y': `${p.y * width}px`, '--r': `${p.rot}deg` }) as CSSProperties;

function CameraDoodle() {
  return (
    <svg viewBox="0 0 48 36" width="44" aria-hidden="true" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round' }}>
      <path d="M 4 10 L 14 10 L 18 4 L 30 4 L 34 10 L 44 10 L 44 32 L 4 32 Z" />
      <circle cx="24" cy="20" r="7" />
    </svg>
  );
}

/**
 * The camera roll: tilted prints you can drag around and click to open, plus two
 * cat stickers that only drag and squish. Positions live as fractions of the pile
 * width, so a moved print stays put through a resize.
 */
export default function PhotoPile() {
  const pileRef = useRef<HTMLDivElement>(null);
  const printRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const cols = columnsFor(width || 1024);
  const layout = useMemo(() => layoutPile(photos.map((p) => p.orientation), cols), [cols]);

  // Mutable positions (drag writes here and to the element directly, so React
  // re-renders mid-drag never snap a print back). Reset when the columns change.
  const pos = useRef<Pos[]>([]);
  const stickerPos = useRef<Pos[]>([]);
  const [, bump] = useState(0);
  const [z, setZ] = useState(() => photos.map((_, i) => i + 1));
  const [open, setOpen] = useState<number | null>(null);
  const justDragged = useRef(false);

  useLayoutEffect(() => {
    const el = pileRef.current;
    if (!el) return;
    // Measure now, not on the observer's first callback, so the first paint has the pile.
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    pos.current = layout.items.map((p) => ({ x: p.x, y: p.y, rot: p.rot }));
    stickerPos.current = [
      { x: 0.9, y: -0.06, rot: 14 },
      { x: -0.05, y: layout.height - 0.12, rot: -12 },
    ];
    bump((n) => n + 1);
  }, [layout]);

  /** Bring print `i` to the top; renumber before the counter reaches the stickers (z 60). */
  const raise = (i: number) =>
    setZ((prev) => {
      const next = [...prev];
      next[i] = Math.max(...prev) + 1;
      if (next[i] < 50) return next;
      const order = next.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
      order.forEach(({ index }, rank) => (next[index] = rank + 1));
      return next;
    });

  const startDrag = (e: ReactPointerEvent<HTMLButtonElement>, store: Pos[], i: number, size: { w: number; h: number }, onDragStart?: () => void) => {
    if (e.button !== 0 || open !== null) return;
    const el = e.currentTarget;
    const start = { x: e.clientX, y: e.clientY };
    const base = { ...store[i] };
    const w = width || 1;
    let dragging = false;
    let lastX = e.clientX;
    let lean = 0;
    let targetLean = 0;
    let frame = 0;
    let current = { ...base };

    const apply = () => {
      frame = 0;
      lean += (targetLean - lean) * 0.18;
      targetLean *= 0.86;
      el.style.setProperty('--x', `${current.x * w}px`);
      el.style.setProperty('--y', `${current.y * w}px`);
      el.style.setProperty('--r', `${current.rot + lean}deg`);
      if (Math.abs(lean) > 0.05 || Math.abs(targetLean) > 0.05) frame = requestAnimationFrame(apply);
    };

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!dragging) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        dragging = true;
        el.setPointerCapture(ev.pointerId);
        el.classList.add('dragging');
        onDragStart?.();
      }
      // Lean into the direction of travel, like a print being slid across a table.
      targetLean = Math.min(Math.max((ev.clientX - lastX) * 0.7, -7), 7);
      lastX = ev.clientX;
      current = {
        x: Math.min(Math.max(base.x + dx / w, -0.3 * size.w), 1 - 0.7 * size.w),
        y: Math.min(Math.max(base.y + dy / w, -0.3 * size.h), layout.height - 0.7 * size.h),
        rot: base.rot,
      };
      store[i] = current;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      cancelAnimationFrame(frame);
      if (!dragging) return;
      el.classList.remove('dragging');
      // Settle with a slight random twist; the CSS transition eases it in.
      store[i] = { ...current, rot: base.rot + (Math.random() - 0.5) * 3 };
      el.style.setProperty('--r', `${store[i].rot}deg`);
      justDragged.current = true;
      setTimeout(() => (justDragged.current = false), 0);
    };

    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  };

  const squish = (el: HTMLElement) => {
    const art = el.firstElementChild as HTMLElement | null;
    if (!art) return;
    art.classList.remove('squish');
    void art.offsetWidth;
    art.classList.add('squish');
  };

  const stickerSize = Math.min(110, 0.2 * (width || 1));
  const stickers = [
    { Art: StickerSitting, w: stickerSize * 0.9, ratio: 152 / 130 },
    { Art: StickerCurled, w: stickerSize * 1.05, ratio: 100 / 160 },
  ];

  return (
    <>
      <div
        ref={pileRef}
        className="v2-pile"
        data-anchor="pile"
        style={{ height: width ? layout.height * width + 24 : undefined }}
      >
        {width > 0 &&
          pos.current.length === photos.length &&
          photos.map((photo, i) => {
            const item = layout.items[i];
            return (
              <button
                key={i}
                ref={(el) => (printRefs.current[i] = el)}
                type="button"
                className="v2-print"
                aria-label={`Open photo: ${photo.place}`}
                data-rot={pos.current[i].rot}
                style={{ ...vars(pos.current[i], width), width: item.w * width, height: item.h * width, zIndex: z[i] }}
                onPointerDown={(e) => startDrag(e, pos.current, i, item, () => raise(i))}
                onClick={() => {
                  if (justDragged.current) return;
                  raise(i);
                  setOpen(i);
                }}
              >
                {photo.src ? (
                  <img src={photo.src} alt="" loading="lazy" decoding="async" draggable={false} />
                ) : (
                  <span className="v2-print-empty">
                    <CameraDoodle />
                    {photo.place}
                  </span>
                )}
              </button>
            );
          })}

        {width > 0 &&
          stickerPos.current.length === stickers.length &&
          stickers.map(({ Art, w, ratio }, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="v2-sticker"
              style={{ ...vars(stickerPos.current[i], width), width: w, height: w * ratio }}
              onPointerDown={(e) => startDrag(e, stickerPos.current, i, { w: w / width, h: (w * ratio) / width })}
              onClick={(e) => {
                if (!justDragged.current) squish(e.currentTarget);
              }}
            >
              <span className="v2-sticker-art">
                <Art />
              </span>
            </button>
          ))}
      </div>

      {open !== null && (
        <Lightbox
          index={open}
          photos={photos}
          thumbFor={(i) => printRefs.current[i] ?? null}
          onIndex={(i) => {
            raise(i);
            setOpen(i);
          }}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
