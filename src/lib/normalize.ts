type Coordinate = [number, number];

interface NormalizedCoords {
  point: [number, number];
  polygon: [number, number][];
  origin: { latitude: number; longitude: number };
}

/**
 * Normalize coordinates for the ZK proof circuit
 * Converts lat/lng to grid coordinates with proper scaling
 */
export function normalizeCoordinates(
  userLat: number,
  userLng: number,
  polygon: Coordinate[]
): NormalizedCoords {
  // Extract lats and lons from polygon (polygon format is [lon, lat])
  const lats = polygon.map(([, lat]) => lat);
  const lons = polygon.map(([lon]) => lon);

  // Include user location in bounds calculation to ensure it's in range
  const allLats = [...lats, userLat];
  const allLons = [...lons, userLng];

  // Calculate origin as center of bounds (including user location)
  const origin = {
    latitude: (Math.min(...allLats) + Math.max(...allLats)) / 2,
    longitude: (Math.min(...allLons) + Math.max(...allLons)) / 2,
  };

  const scale = 100000; // Higher precision
  const gridCenter = Math.pow(2, 31); // Use center of 32-bit space

  function normalize(lat: number, lon: number): [number, number] {
    const dLat = (lat - origin.latitude) * scale;
    const dLon = (lon - origin.longitude) * scale;
    return [Math.floor(dLon + gridCenter), Math.floor(dLat + gridCenter)];
  }

  const point = normalize(userLat, userLng);
  const normalizedPolygon = polygon.map(([lon, lat]) => normalize(lat, lon));

  return {
    point,
    polygon: normalizedPolygon,
    origin,
  };
}

/**
 * Validate that coordinates are within the allowed grid range
 */
export function validateCoordinates(
  point: [number, number],
  polygon: [number, number][]
): { valid: boolean; min: number; max: number; allowedMax: number } {
  const allowedMax = Math.pow(2, 32) - 1; // 4,294,967,295 for grid_bits=32
  const all = [point, ...polygon].flat();
  const max = Math.max(...all);
  const min = Math.min(...all);

  return {
    valid: max < allowedMax && min >= 0,
    min,
    max,
    allowedMax,
  };
}
