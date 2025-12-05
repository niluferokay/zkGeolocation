export function convertCoords(lat: number, lng: number) {
  const SCALE = 1000; // 0.001-degree precision

  return {
    x: Math.floor((lng + 180) * SCALE),
    y: Math.floor((lat + 90) * SCALE),
  };
}
