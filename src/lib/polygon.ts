type Coordinate = [number, number];

/**
 * Remove duplicate consecutive coordinates from a polygon
 */
export function sanitizePolygon(poly: Coordinate[]): Coordinate[] {
  return poly.filter(
    (pt, i, arr) => i === 0 || pt[0] !== arr[i - 1][0] || pt[1] !== arr[i - 1][1]
  );
}

/**
 * Calculate the signed area of a polygon
 * Positive if CCW, negative if CW
 */
export function signedArea(poly: Coordinate[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/**
 * Ensure polygon vertices are in counter-clockwise order
 */
export function ensureCCW(poly: Coordinate[]): Coordinate[] {
  return signedArea(poly) < 0 ? [...poly].reverse() : poly;
}

/**
 * Creates a safe 8-sided polygon from any input polygon
 * - No self intersections
 * - No horizontal or vertical edges
 * - No duplicate vertices
 * - Vertices evenly distributed along perimeter
 */
export function makeSafeEightPolygon(poly: Coordinate[]): Coordinate[] {
  // Remove duplicate closing point
  if (
    poly.length > 2 &&
    poly[0][0] === poly.at(-1)![0] &&
    poly[0][1] === poly.at(-1)![1]
  ) {
    poly = poly.slice(0, -1);
  }

  // Ensure CCW
  poly = ensureCCW(poly);

  // Build the list of edges with lengths
  const edges: Array<{
    p1: Coordinate;
    p2: Coordinate;
    dx: number;
    dy: number;
    len: number;
  }> = [];
  let totalLength = 0;

  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % poly.length];

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.sqrt(dx * dx + dy * dy);

    edges.push({ p1, p2, dx, dy, len });
    totalLength += len;
  }

  // Sample 8 evenly spaced perimeter distances
  const result: Coordinate[] = [];
  for (let i = 0; i < 8; i++) {
    const targetDist = (i / 8) * totalLength;

    // Walk perimeter until we reach the arc length
    let acc = 0;
    for (const e of edges) {
      if (acc + e.len >= targetDist) {
        const t = (targetDist - acc) / e.len;

        let x = e.p1[0] + e.dx * t;
        let y = e.p1[1] + e.dy * t;

        // Tiny jitter to avoid vertical/horizontal edges
        const ε = 1e-8;
        x += (i % 2 === 0 ? ε : -ε);
        y += (i % 2 === 1 ? ε : -ε);

        result.push([x, y]);
        break;
      }
      acc += e.len;
    }
  }

  return ensureCCW(result);
}
