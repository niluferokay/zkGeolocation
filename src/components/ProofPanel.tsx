import { useState } from "react";
import { generateProof, verifyProof } from "../lib/prover";
import { normalizeCoordinates, validateCoordinates } from "../lib/normalize";

type Coordinate = [number, number];

interface ProofPanelProps {
  polygon: Coordinate[] | null;
  onProofResult: (result: "inside" | "outside" | null) => void;
  onStatusChange?: (status: string) => void;
}

export default function ProofPanel({ polygon, onProofResult, onStatusChange }: ProofPanelProps) {
  const [isProving, setIsProving] = useState(false);

  const updateStatus = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  async function handleProveLocation() {
    if (!polygon) {
      updateStatus("⚠️ Please draw a polygon first!");
      return;
    }

    updateStatus("📍 Getting GPS location...");
    setIsProving(true);

    let position: GeolocationPosition;
    try {
      position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        })
      );
    } catch (error) {
      updateStatus("❌ Failed to get GPS location. Please enable location services.");
      setIsProving(false);
      onProofResult(null);
      return;
    }

    const { latitude, longitude } = position.coords;
    console.log("📍 User location:", { latitude, longitude });

    // Normalize coordinates
    const { point, polygon: normalizedPolygon } = normalizeCoordinates(
      latitude,
      longitude,
      polygon
    );

    console.log("🧮 Point:", point);
    console.log("🧮 Polygon (8 vertices):", normalizedPolygon);

    // Validate coordinates are within allowed grid range
    const validation = validateCoordinates(point, normalizedPolygon);
    if (!validation.valid) {
      console.error("❌ Polygon or point exceeds allowed grid range:", validation);
      updateStatus(
        `❌ Polygon too large! The polygon must be much smaller. Zoom in on the map and draw a polygon covering a few city blocks, not the entire city. (Max: ${validation.allowedMax}, Got: ${validation.max})`
      );
      setIsProving(false);
      onProofResult(null);
      return;
    }

    updateStatus("⚙️ Generating proof...");

    try {
      const input = {
        point,
        polygon: normalizedPolygon,
      };

      const { proof, publicSignals } = await generateProof(input);

      const verified = await verifyProof(proof, publicSignals);
      const inside = Number(publicSignals[0]);

      if (verified && inside === 1) {
        updateStatus("✅ Verified: You are inside the polygon!");
        onProofResult("inside");
      } else {
        updateStatus("❌ Verified: You are outside the polygon!");
        onProofResult("outside");
      }
    } catch (err) {
      console.error("❌ Proof error:", err);
      updateStatus("❌ Proof failed! Check console for details.");
      onProofResult(null);
    } finally {
      setIsProving(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleProveLocation}
        disabled={!polygon || isProving}
        style={{
          width: "100%",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "500",
          cursor: !polygon || isProving ? "not-allowed" : "pointer",
          opacity: !polygon || isProving ? 0.6 : 1,
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (polygon && !isProving) {
            e.currentTarget.style.backgroundColor = "#45a049";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4caf50";
        }}
      >
        {isProving ? "Generating Proof..." : "Prove Location"}
      </button>
    </div>
  );
}
