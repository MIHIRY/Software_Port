/**
 * Original artwork for About v2 (cats instead of the reference's bread). Colours
 * come from the page tokens through `style`, so dark mode recolours everything.
 */
const fill = (c: 'line' | 'paper' | 'paper-2') => ({ fill: `var(--${c})` });
const stroke = (c: 'line' | 'paper', w: number) => ({ fill: 'none', stroke: `var(--${c})`, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

/** A sitting cat, facing out. 120 × 150. */
function SittingCat({ tail = true }: { tail?: boolean }) {
  return (
    <>
      {tail && <path d="M 102 140 C 126 140 132 116 118 102" style={stroke('line', 9)} />}
      <path
        d="M 34 14 L 44 38 C 52 35 68 35 76 38 L 86 14 L 92 46 C 100 62 96 80 84 88 C 98 96 106 116 106 134 C 106 144 98 148 88 148 L 34 148 C 22 148 16 140 18 128 C 20 112 28 98 38 90 C 24 82 20 64 28 46 Z"
        style={fill('line')}
      />
      <path d="M 44 64 C 48 59 53 59 57 64 M 65 64 C 69 59 74 59 78 64" style={stroke('paper', 2.5)} />
      <path d="M 58 72 L 64 72 L 61 76 Z" style={fill('paper')} />
    </>
  );
}

/** Books section: a cat asleep-ish on the three books from the reading list. */
export function CatOnBooks({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 340" className={className} role="img" aria-label="A cat sitting on a stack of three books">
      <g style={{ ...fill('paper-2'), stroke: 'var(--line)', strokeWidth: 3, strokeLinejoin: 'round' }}>
        <rect x="50" y="262" width="320" height="46" rx="6" />
        <rect x="80" y="218" width="270" height="44" rx="6" transform="rotate(-3 215 240)" />
        <rect x="62" y="178" width="292" height="42" rx="6" transform="rotate(2 208 199)" />
      </g>
      <g style={stroke('line', 2.5)}>
        {/* Page edges and spine bands. */}
        <path d="M 342 270 L 342 300 M 352 270 L 352 300 M 96 262 L 96 308" />
        <path d="M 110 222 L 112 260 M 318 214 L 320 252" />
        <path d="M 90 180 L 89 218 M 330 186 L 329 224" />
      </g>
      <g transform="translate(196 38) scale(0.96)">
        <SittingCat tail={false} />
      </g>
      {/* Tail spills over the top book's edge. */}
      <path d="M 296 176 C 320 180 330 204 318 226" style={stroke('line', 9)} />
    </svg>
  );
}

/** The pen tip: a small cat head that rides the end of the line. */
export function CatTip({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" className={className} aria-hidden="true">
      <path d="M 6 30 C 2 20 4 12 8 8 L 6 0 L 15 6 C 18 5 22 5 25 6 L 34 0 L 32 8 C 36 12 38 20 34 30 C 30 34 10 34 6 30 Z" style={{ ...fill('line'), stroke: 'var(--paper)', strokeWidth: 1.5 }} />
      <circle cx="14" cy="19" r="2" style={fill('paper')} />
      <circle cx="26" cy="19" r="2" style={fill('paper')} />
    </svg>
  );
}

/** Sticker: the sitting cat. */
export function StickerSitting() {
  return (
    <svg viewBox="0 0 130 152" aria-hidden="true">
      <SittingCat />
    </svg>
  );
}

/** Sticker: a cat curled into a loaf, asleep. */
export function StickerCurled() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <path d="M 20 80 C 18 50 50 28 90 30 C 128 32 148 56 146 80 C 146 90 138 94 128 94 L 34 94 C 24 94 20 88 20 80 Z" style={fill('line')} />
      <path d="M 22 60 L 18 32 L 34 45 C 40 43 48 43 54 45 L 66 32 L 64 58 C 66 72 56 80 44 80 C 32 80 22 72 22 60 Z" style={fill('line')} />
      <path d="M 31 62 C 34 59 38 59 41 62 M 47 62 C 50 59 54 59 57 62" style={stroke('paper', 2.5)} />
      <path d="M 72 90 C 100 96 128 90 140 74" style={stroke('paper', 3)} />
    </svg>
  );
}
