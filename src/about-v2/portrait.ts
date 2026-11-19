/**
 * Original one-line portrait of Mihir: wavy hair, full beard, easy smile.
 * Drawn by the page's line, stroke by stroke (each entry is one pen-down).
 *
 * Coordinates live in a 300 × 420 box (the portrait slot is 5:7). Only absolute
 * M / C / L commands, so the line engine can fit them to any box by mapping
 * number pairs.
 */
export const PORTRAIT_BOX = { w: 300, h: 420 };

const strokes = {
  // Ear: starts on the right edge, so a pen arriving from the right begins here.
  ear: 'M 226 204 C 246 192 242 160 222 166',
  // Hair: a loose wave over the top, starting at the left temple.
  hair: 'M 76 154 C 58 126 62 94 86 80 C 88 56 114 42 136 52 C 146 32 178 32 190 50 C 214 42 236 62 230 90 C 248 106 244 136 222 152',
  curlLeft: 'M 104 96 C 112 80 134 80 138 94 C 142 106 124 110 120 100',
  curlRight: 'M 166 84 C 176 72 196 76 196 90 C 196 102 180 104 178 94',
  // Face and beard in one sweep: left temple, cheek, scalloped beard, right cheek.
  face: 'M 80 146 C 72 190 76 232 92 262 C 98 276 104 286 112 296 C 118 288 124 296 128 306 C 136 298 142 310 150 316 C 158 308 166 318 172 306 C 178 298 186 306 192 294 C 200 286 208 274 214 258 C 226 226 228 186 220 146',
  browLeft: 'M 100 150 C 110 142 126 140 136 148',
  browRight: 'M 166 146 C 176 138 192 138 204 146',
  // Eyes, closed and smiling.
  eyeLeft: 'M 106 174 C 112 166 124 166 132 174',
  eyeRight: 'M 170 172 C 176 164 188 164 196 172',
  // Nose: down from the brow, with a little hook at the tip.
  nose: 'M 152 160 C 150 182 146 200 138 214 C 146 222 158 222 166 214',
  moustache: 'M 120 238 C 132 226 148 228 152 236 C 158 228 174 226 186 238',
  smile: 'M 132 254 C 142 264 160 264 172 254',
  neckLeft: 'M 128 314 C 130 346 128 376 122 412',
  // Last: the pen leaves the portrait from the bottom of the neck.
  neckRight: 'M 178 304 C 178 340 182 374 188 412',
};

const middle = [strokes.curlLeft, strokes.curlRight, strokes.face, strokes.browLeft, strokes.browRight, strokes.eyeLeft, strokes.eyeRight, strokes.nose, strokes.moustache, strokes.smile, strokes.neckLeft];

/** Stroke order for a pen arriving from the right (desktop) or the left (phones). */
export const portraitStrokes = {
  fromRight: [strokes.ear, strokes.hair, ...middle, strokes.neckRight],
  fromLeft: [strokes.hair, strokes.ear, ...middle, strokes.neckRight],
};
