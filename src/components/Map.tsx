import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useRef } from "react";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { sanitizePolygon, makeSafeEightPolygon } from "../lib/polygon";
import MapSearch from "./MapSearch";

type Coordinate = [number, number];

interface MapProps {
  onPolygonDrawn: (polygon: Coordinate[]) => void;
  showQuestionMarks?: boolean;
}

export default function Map({ onPolygonDrawn, showQuestionMarks }: MapProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const handleCreated = (e: any) => {
    const layer = e.layer;

    // Extract coordinates from the drawn polygon
    let coords: Coordinate[] = layer.toGeoJSON().geometry.coordinates[0];
    const originalVertexCount = coords.length - 1; // Subtract closing point
    coords = sanitizePolygon(coords);

    console.log(`📐 Original polygon: ${originalVertexCount} vertices drawn`);
    console.log("📍 Original coordinates:", coords);

    // Create safe 8-sided polygon
    const safePolygon = makeSafeEightPolygon(coords);

    console.log(`✨ Converted to safe 8-sided polygon (added ${8 - originalVertexCount} vertices)`);
    console.log("🟢 Final 8-vertex polygon:", safePolygon);

    // Clear all previous drawings and show ONLY the 8-vertex polygon
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();

      // Convert [lon, lat] to [lat, lon] for Leaflet
      const leafletCoords: [number, number][] = safePolygon.map(([lon, lat]) => [lat, lon]);

      // Add ONLY the 8-vertex polygon with rainbow gradient
      const processedPolygon = L.polygon(leafletCoords, {
        color: '#ff0000',        // Starting color (will be animated by CSS)
        fillColor: '#ff00ff',    // Magenta fill
        fillOpacity: 0.15,       // Semi-transparent
        weight: 3,               // Thicker border
        dashArray: '10, 5',      // Dashed line pattern
        className: 'safe-polygon' // Applies rainbow animation from CSS
      });

      featureGroupRef.current.addLayer(processedPolygon);
    }

    onPolygonDrawn(safePolygon);
  };

  return (
    <div style={{ height: "500px", width: "100%", position: "relative" }}>
      {showQuestionMarks && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden"
        }}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${40 + Math.random() * 40}px`,
                color: ['#ff6b6b', '#ee5a6f', '#c44569'][Math.floor(Math.random() * 3)],
                fontWeight: 'bold',
                animation: 'fadeInOut 3s ease-in-out',
                opacity: 0
              }}
            >
              ?
            </div>
          ))}
        </div>
      )}
      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <MapSearch />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              marker: false,
              circle: false,
              polyline: false,
              rectangle: false,
              polygon: {
                showArea: true,
                drawError: {
                  color: '#e74c3c',
                  message: 'Draw a polygon with at least 3 vertices',
                },
                shapeOptions: {
                  color: '#3388ff',
                  weight: 3,
                  fillOpacity: 0.2,
                },
              },
              circlemarker: false,
            }}
            edit={{
              edit: false,
              remove: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
