// Hex math for flat-topped or pointy-topped hexagons. We'll use pointy-topped hexes.
// In pointy-topped hex:
// x = size * sqrt(3) * (q + r/2)
// y = size * (3/2) * r

export const HEX_RADIUS = 52; // outer radius in pixels

export interface HexCoord {
  q: number;
  r: number;
}

// 6 neighbor directions in axial coordinates
export const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function axialToPixel(q: number, r: number, radius = HEX_RADIUS): { x: number; y: number } {
  const x = radius * Math.sqrt(3) * (q + r / 2);
  const y = radius * (3 / 2) * r;
  return { x, y };
}

export function getHexNeighbors(q: number, r: number): HexCoord[] {
  return HEX_DIRECTIONS.map((dir) => ({
    q: q + dir.q,
    r: r + dir.r,
  }));
}

export function areHexesAdjacent(a: HexCoord, b: HexCoord): boolean {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return HEX_DIRECTIONS.some((dir) => dir.q === dq && dir.r === dr);
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

// Kenney Hexagon Isometric Grid Constants
export const ISO_SCALE = 1.4;
export const ISO_TILE_WIDTH = 65 * ISO_SCALE; // ~91px
export const ISO_TILE_HEIGHT = 89 * ISO_SCALE; // ~124.6px
export const ISO_STEP_X = 64 * ISO_SCALE; // horizontal column pitch
export const ISO_STEP_Y = 52 * ISO_SCALE; // vertical row pitch

export interface IsometricHexPosition {
  x: number; // top-left x for the tile image
  y: number; // top-left y for the tile image
  cx: number; // center x of the top hexagon face
  cy: number; // center y of the top hexagon face
  width: number;
  height: number;
}

export function axialToIsometric(q: number, r: number, scale = ISO_SCALE): IsometricHexPosition {
  const stepX = 64 * scale;
  const stepY = 52 * scale;
  const width = 65 * scale;
  const height = 89 * scale;
  
  const x = stepX * (q + r / 2);
  const y = stepY * r;
  const cx = x + width / 2;
  const cy = y + 35 * scale;

  return { x, y, cx, cy, width, height };
}

// Generate the 6 vertices for the top face of the Kenney isometric hex
export function getIsometricHexPoints(cx: number, cy: number, scale = ISO_SCALE, offset = 0): string {
  const halfW = (32 + offset) * scale;
  const coneH = (18 + offset) * scale;
  const halfConeH = (17 + offset) * scale;

  // 6 points in clockwise order:
  // Top, Upper-Right, Lower-Right, Bottom, Lower-Left, Upper-Left
  const pts = [
    `${cx.toFixed(1)},${(cy - coneH - halfConeH).toFixed(1)}`, // (32, 0)
    `${(cx + halfW).toFixed(1)},${(cy - halfConeH).toFixed(1)}`, // (64, 18)
    `${(cx + halfW).toFixed(1)},${(cy + halfConeH).toFixed(1)}`, // (64, 52)
    `${cx.toFixed(1)},${(cy + coneH + halfConeH).toFixed(1)}`, // (32, 70)
    `${(cx - halfW).toFixed(1)},${(cy + halfConeH).toFixed(1)}`, // (0, 52)
    `${(cx - halfW).toFixed(1)},${(cy - halfConeH).toFixed(1)}`, // (0, 18)
  ];
  return pts.join(' ');
}

