import { useEffect, useRef } from 'react';
import { CatTip } from '../art';
import { moreCount } from '../content';
import { buildRoute, lengthAt, type Anchors, type Box } from './route';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** Sample spacing along the line for the scroll lookup table, in px. */
const SAMPLE = 8;

type Segment = { el: SVGPathElement; len: number; start: number };

/**
 * The page-long pen line. It is drawn as the reader scrolls (and erased when they
 * scroll back), with the intro drawing itself on first load. A small cat head rides
 * the end of the line. Rebuilt from live measurements whenever the layout changes.
 */
export default function Line() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const tip = tipRef.current;
    const page = svg?.closest<HTMLElement>('[data-v2-page]');
    if (!svg || !tip || !page) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let segments: Segment[] = [];
    let L = new Float64Array(0);
    let maxY = new Float64Array(0);
    let total = 0;
    let introLen = 0;
    let drawn = 0;
    let velocity = 0;
    let smoothScroll = scrollY;
    let built = false;
    let raf = 0;
    let lastT = 0;
    // Set on cleanup. Late callbacks (fonts.ready resolves whenever it likes) must
    // not rebuild into the SVG after a newer mount owns it.
    let disposed = false;

    const pageTop = () => page.getBoundingClientRect().top + scrollY;

    const measure = (): Anchors => {
      const origin = page.getBoundingClientRect();
      const box = (sel: string): Box | undefined => {
        const el = page.querySelector(sel);
        if (!el) return undefined;
        const r = el.getBoundingClientRect();
        return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
      };
      const h1 = page.querySelector('[data-anchor="h1"]')!;
      return {
        pageW: page.clientWidth,
        mobile: matchMedia('(max-width: 819px)').matches,
        hero: box('.v2-hello')!,
        h1: box('[data-anchor="h1"]')!,
        h1Size: parseFloat(getComputedStyle(h1).fontSize),
        nameLinks: box('[data-anchor="name-links"]'),
        portrait: box('[data-anchor="portrait"]')!,
        booksPhrase: box('[data-anchor="books-phrase"]'),
        booksArt: box('.v2-books-art'),
        booksCopy: box('.v2-books-copy'),
        books: box('.v2-books'),
        rows: box('.v2-rows'),
        rowName: box('[data-anchor="row-name"]'),
        tally: box('[data-anchor="tally"]'),
        tallyCount: moreCount,
        pile: box('[data-anchor="pile"]'),
        pills: box('[data-anchor="pills"]'),
        tail: box('[data-anchor="tail"]'),
      };
    };

    /** Where the drawing should be for a scroll position: the line keeps ~72% of a screen ahead, finishing at the bottom. */
    const targetFor = (scroll: number) => {
      if (reduce) return total;
      const vh = innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const t = Math.min(Math.max((scroll - (maxScroll - 0.7 * vh)) / (0.7 * vh), 0), 1);
      const k = 0.72 + 0.5 * t * t * (3 - 2 * t);
      const readingLine = scroll - pageTop() + k * vh;
      return Math.max(introLen, lengthAt(L, maxY, readingLine));
    };

    const paint = () => {
      let tipSeg: Segment | null = null;
      for (const s of segments) {
        const local = Math.min(Math.max(drawn - s.start, 0), s.len);
        s.el.style.strokeDashoffset = String(s.len - local);
        if (drawn > s.start && drawn <= s.start + s.len) tipSeg = s;
      }
      const show = !reduce && tipSeg && drawn > 40 && drawn < total - 2;
      tip.classList.toggle('on', Boolean(show));
      if (show && tipSeg) {
        const local = drawn - tipSeg.start;
        const p = tipSeg.el.getPointAtLength(local);
        const q = tipSeg.el.getPointAtLength(Math.max(0, local - 3));
        const dx = p.x - q.x;
        const lean = 14 * (dx / (Math.hypot(dx, p.y - q.y) || 1));
        tip.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${lean}deg)`;
      }
    };

    const frame = () => {
      // One clock for every frame. The rAF timestamp is the frame's *start*, which
      // can precede the performance.now() recorded in kick(): a negative dt there
      // made the pen jump straight to its target and skip the intro.
      const now = performance.now();
      const dt = Math.min(Math.max((now - lastT) / 1000, 0.001), 0.05);
      lastT = now;
      smoothScroll += (scrollY - smoothScroll) * (1 - Math.exp(-dt / 0.14));
      const target = targetFor(smoothScroll);
      const gap = target - drawn;
      if (Math.abs(gap) < 0.4 && Math.abs(scrollY - smoothScroll) < 0.5) {
        drawn = target;
        velocity = 0;
        paint();
        raf = 0;
        return;
      }
      // The pen chases its target: fast when far behind, slower through the intro.
      const want = gap > 0 ? Math.min(gap / 0.2 + 30, drawn < introLen ? 1300 : 3200) : Math.max(gap / 0.12 - 30, -6000);
      velocity += (want - velocity) * (1 - Math.exp(-dt / 0.09));
      let next = drawn + velocity * dt;
      if ((gap > 0 && next > target) || (gap < 0 && next < target)) {
        next = target;
        velocity = 0;
      }
      drawn = next;
      paint();
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (raf || reduce || disposed) return;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const rebuild = () => {
      if (disposed) return;
      const fraction = total ? drawn / total : 0;
      const a = measure();
      if (!a.hero || !a.h1 || !a.portrait) return;
      const route = buildRoute(a);
      const height = page.scrollHeight;
      svg.setAttribute('viewBox', `0 0 ${a.pageW} ${height}`);
      svg.style.height = `${height}px`;

      const els = route.map((stroke) => {
        const el = document.createElementNS(SVG_NS, 'path');
        el.setAttribute('d', stroke.d);
        el.style.strokeWidth = String(stroke.width);
        return el;
      });
      svg.replaceChildren(...els);

      let acc = 0;
      let lowest = -Infinity;
      const lens: number[] = [];
      const lows: number[] = [];
      segments = els.map((el, i) => {
        const len = el.getTotalLength();
        for (let l = 0; l <= len; l += SAMPLE) {
          lowest = Math.max(lowest, el.getPointAtLength(l).y);
          lens.push(acc + l);
          lows.push(lowest);
        }
        el.style.strokeDasharray = `${len} ${len + 2}`;
        const seg = { el, len, start: acc };
        acc += len;
        if (route[i].intro) introLen = acc;
        return seg;
      });
      L = Float64Array.from(lens);
      maxY = Float64Array.from(lows);
      total = acc;

      if (!built) {
        built = true;
        drawn = reduce ? total : targetFor(scrollY);
        smoothScroll = scrollY;
        // Decide "fresh visit at the top" a frame later: by then any scroll
        // restoration or route-change scroll-to-top has happened. At the top, the
        // intro draws itself from nothing.
        requestAnimationFrame(() => {
          if (disposed || reduce || scrollY >= 40) return;
          drawn = 0;
          smoothScroll = scrollY;
          paint();
          kick();
        });
      } else {
        drawn = fraction * total;
      }
      paint();
      kick();
    };

    let pending = 0;
    const scheduleRebuild = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        rebuild();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleRebuild);
    resizeObserver.observe(page);
    addEventListener('resize', scheduleRebuild);
    addEventListener('load', scheduleRebuild);
    addEventListener('scroll', kick, { passive: true });
    document.fonts?.ready.then(scheduleRebuild);
    rebuild();

    // Dev-only: draw everything at once, for checking the route without scrolling.
    if (import.meta.env.DEV) {
      (window as unknown as { __v2ShowAll?: () => void }).__v2ShowAll = () => {
        drawn = total;
        velocity = 0;
        smoothScroll = scrollY;
        paint();
      };
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      resizeObserver.disconnect();
      removeEventListener('resize', scheduleRebuild);
      removeEventListener('load', scheduleRebuild);
      removeEventListener('scroll', kick);
    };
  }, []);

  return (
    <>
      <svg ref={svgRef} className="v2-line" aria-hidden="true" />
      <div ref={tipRef} className="v2-tip" aria-hidden="true">
        <CatTip />
      </div>
    </>
  );
}
