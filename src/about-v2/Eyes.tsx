import { useEffect, useRef } from 'react';

/** How far the pupils travel (SVG units), and the cursor distance that gets full travel. */
const RANGE_X = 10;
const RANGE_Y = 13;
const REACH = 240;

/**
 * Original cartoon eyes. Pupils follow a mouse or pen; a tap makes them glance at
 * it; on touch-only devices they look around on their own when idle. They blink
 * now and then, and the brows lift when hovered.
 */
export default function Eyes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const lidsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const pupils = pupilsRef.current;
    const lids = lidsRef.current;
    if (!svg || !pupils || !lids) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    let lastInput = performance.now();
    let glanceTimer = 0;
    let blinkTimer = 0;
    let unblinkTimer = 0;

    const look = (dx: number, dy: number) => {
      pupils.style.transform = `translate(${dx}px, ${dy + 2}px)`;
    };
    const lookAt = (x: number, y: number) => {
      const r = svg.getBoundingClientRect();
      // Eye centres sit 60% of the way down the drawing.
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height * 0.6);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / REACH, 1);
      look((dx / dist) * RANGE_X * reach, (dy / dist) * RANGE_Y * reach);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      lastInput = performance.now();
      lookAt(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      lastInput = performance.now();
      lookAt(e.clientX, e.clientY);
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });

    if (!finePointer && !reduce) {
      const glance = () => {
        if (performance.now() - lastInput > 3500) {
          if (Math.random() < 0.3) look(0, 0);
          else {
            const angle = Math.random() * Math.PI * 2;
            const amount = 0.5 + Math.random() * 0.5;
            look(Math.cos(angle) * RANGE_X * amount, Math.sin(angle) * RANGE_Y * amount);
          }
        }
        glanceTimer = window.setTimeout(glance, 1800 + Math.random() * 2600);
      };
      glanceTimer = window.setTimeout(glance, 2000);
    }

    if (!reduce) {
      const blink = () => {
        if (!document.hidden) {
          lids.classList.add('blink');
          unblinkTimer = window.setTimeout(() => lids.classList.remove('blink'), 120);
        }
        blinkTimer = window.setTimeout(blink, 2600 + Math.random() * 4200);
      };
      blinkTimer = window.setTimeout(blink, 2200);
    }

    return () => {
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      clearTimeout(glanceTimer);
      clearTimeout(blinkTimer);
      clearTimeout(unblinkTimer);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 200 130" className="v2-eyes" aria-hidden="true">
      <g className="brows" style={{ fill: 'none', stroke: 'var(--ink)', strokeWidth: 5, strokeLinecap: 'round' }}>
        <path d="M 40 20 C 52 11 66 9 78 13" />
        <path d="M 122 13 C 134 9 148 11 160 20" />
      </g>
      <g ref={lidsRef} className="lids">
        <g style={{ fill: 'var(--paper)', stroke: 'var(--ink)', strokeWidth: 6 }}>
          <ellipse cx="66" cy="80" rx="33" ry="45" transform="rotate(-8 66 80)" />
          <ellipse cx="134" cy="80" rx="33" ry="45" transform="rotate(8 134 80)" />
        </g>
        <g ref={pupilsRef} className="pupils" style={{ fill: 'var(--ink)' }}>
          <circle cx="68" cy="84" r="9" />
          <circle cx="132" cy="84" r="9" />
        </g>
      </g>
    </svg>
  );
}
