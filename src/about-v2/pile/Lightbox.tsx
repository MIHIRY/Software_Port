import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Photo } from '../content';

const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

type Props = {
  index: number;
  photos: Photo[];
  /** The print the photo flies out of and back into. */
  thumbFor: (i: number) => HTMLElement | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Where photo `i` sits when open: centred, leaving room for its caption. */
function fitBox(photo: Photo) {
  const vw = innerWidth;
  const vh = innerHeight;
  const maxW = Math.min(vw * (vw < 700 ? 0.92 : 0.8), 1100);
  const maxH = vh * 0.82 - 64;
  const aspect = photo.orientation === 'landscape' ? 4 / 3 : 3 / 4;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { w, h, x: (vw - w) / 2, y: (vh - h - 64) / 2 + 8 };
}

/** The transform that puts the open photo exactly over its print (FLIP). */
function overThumb(thumb: HTMLElement, box: ReturnType<typeof fitBox>) {
  const r = thumb.getBoundingClientRect();
  const rot = parseFloat(thumb.style.getPropertyValue('--r')) || 0;
  const dx = r.left + r.width / 2 - (box.x + box.w / 2);
  const dy = r.top + r.height / 2 - (box.y + box.h / 2);
  return `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${thumb.offsetWidth / box.w})`;
}

/**
 * Full-screen view of one print. Opens by flying out of the print, steps with
 * arrows / keys / swipes / horizontal wheel, closes back into the print. Traps
 * focus, makes the page inert, and returns focus to the print on close.
 */
export default function Lightbox({ index, photos, thumbFor, onIndex, onClose }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [, refit] = useState(0);
  const locked = useRef(false);
  const closing = useRef(false);
  const reduce = useRef(matchMedia('(prefers-reduced-motion: reduce)').matches);
  const photo = photos[index];
  const box = fitBox(photo);

  // Open: start exactly over the print, then animate to the centre.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const thumb = thumbFor(index);
    if (!frame) return;
    if (thumb && !reduce.current) {
      frame.style.transition = 'none';
      frame.style.transform = overThumb(thumb, fitBox(photos[index]));
      void frame.offsetWidth;
      frame.style.transition = `transform 0.45s ${EASE}`;
    }
    frame.style.transform = 'none';
    if (thumb) thumb.style.visibility = 'hidden';
    setOn(true);
    closeRef.current?.focus();
    // Mount only: steps manage the thumbnail themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const frame = frameRef.current;
    const thumb = thumbFor(index);
    setOn(false);
    const finish = () => {
      // Lift inert before focusing: a focus() inside an inert page is ignored.
      document.querySelector('[data-v2-page]')?.removeAttribute('inert');
      if (thumb) {
        thumb.style.visibility = '';
        thumb.focus({ preventScroll: true });
      }
      onClose();
    };
    if (!frame || !thumb || reduce.current) return finish();
    frame.style.transition = `transform 0.45s ${EASE}`;
    frame.style.transform = overThumb(thumb, fitBox(photos[index]));
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      finish();
    };
    frame.addEventListener('transitionend', end, { once: true });
    setTimeout(end, 600);
  }, [index, onClose, photos, thumbFor]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (locked.current || closing.current) return;
      locked.current = true;
      setTimeout(() => (locked.current = false), 330);
      const next = (index + dir + photos.length) % photos.length;
      const frame = frameRef.current;
      const swap = () => {
        const oldThumb = thumbFor(index);
        const newThumb = thumbFor(next);
        if (oldThumb) oldThumb.style.visibility = '';
        if (newThumb) newThumb.style.visibility = 'hidden';
        onIndex(next);
      };
      if (!frame || reduce.current) return swap();
      frame.style.transition = 'transform 0.22s ease-in, opacity 0.22s ease-in';
      frame.style.transform = `translateX(${-dir * 70}px) rotate(${-dir * 2}deg)`;
      frame.style.opacity = '0';
      setTimeout(() => {
        swap();
        frame.style.transition = 'none';
        frame.style.transform = `translateX(${dir * 70}px) rotate(${dir * 2}deg)`;
        void frame.offsetWidth;
        frame.style.transition = `transform 0.32s ${EASE}, opacity 0.25s`;
        frame.style.transform = 'none';
        frame.style.opacity = '1';
      }, 200);
    },
    [index, onIndex, photos.length, thumbFor],
  );

  // Keyboard, focus trap, inert page, scroll lock, resize.
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('[data-v2-page]');
    page?.setAttribute('inert', '');
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const startW = innerWidth;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        const items = [...(rootRef.current?.querySelectorAll<HTMLElement>('button') ?? [])].filter((b) => b.offsetParent !== null);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => (innerWidth !== startW ? close() : refit((n) => n + 1));
    addEventListener('keydown', onKey);
    addEventListener('resize', onResize);
    return () => {
      page?.removeAttribute('inert');
      document.body.style.overflow = overflow;
      removeEventListener('keydown', onKey);
      removeEventListener('resize', onResize);
    };
  }, [close, step]);

  // Touch: swipe sideways to step; tap or swipe vertically to close. Trackpad: wheel.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const wheelLock = useRef(false);

  return createPortal(
    <div
      ref={rootRef}
      className={`v2-lb${on ? ' on' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${photo.place}`}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchMove={(e) => e.preventDefault()}
      onTouchEnd={(e) => {
        const t = touch.current;
        if (!t) return;
        const dx = e.changedTouches[0].clientX - t.x;
        const dy = e.changedTouches[0].clientY - t.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > 1.2 * Math.abs(dy)) step(dx < 0 ? 1 : -1);
        else if (Math.hypot(dx, dy) < 12 || Math.abs(dy) > 80) close();
      }}
      onWheel={(e) => {
        if (Math.abs(e.deltaX) > 12 && !wheelLock.current) {
          wheelLock.current = true;
          setTimeout(() => (wheelLock.current = false), 500);
          step(e.deltaX > 0 ? 1 : -1);
        } else if (Math.abs(e.deltaY) > 8) close();
      }}
    >
      <div className="v2-lb-scrim" onClick={close} />
      <div ref={frameRef} className="v2-lb-frame" style={{ left: box.x, top: box.y, width: box.w, height: box.h }}>
        {photo.src ? (
          <img src={photo.src} alt={photo.alt} />
        ) : (
          <div className="v2-print-empty v2-lb-empty">Your photo goes here</div>
        )}
      </div>
      <p className="v2-lb-caption" style={{ top: box.y + box.h + 14 }}>
        {photo.place}
      </p>
      <button ref={closeRef} type="button" className="v2-lb-btn v2-lb-close" aria-label="Close" onClick={close}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }}>
          <path d="M 1 1 L 13 13 M 13 1 L 1 13" />
        </svg>
      </button>
      <button type="button" className="v2-lb-btn v2-lb-prev" aria-label="Previous photo" onClick={() => step(-1)}>
        ←
      </button>
      <button type="button" className="v2-lb-btn v2-lb-next" aria-label="Next photo" onClick={() => step(1)}>
        →
      </button>
    </div>,
    document.body,
  );
}
