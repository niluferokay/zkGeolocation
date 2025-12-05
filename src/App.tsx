import { useState } from "react";
import confetti from "canvas-confetti";
import Map from "./components/Map";
import ProofPanel from "./components/ProofPanel";

type Coordinate = [number, number];

function App() {
  const [polygon, setPolygon] = useState<Coordinate[] | null>(null);
  const [proofStatus, setProofStatus] = useState<string>("");
  const [showQuestionMarks, setShowQuestionMarks] = useState(false);

  const handleProofResult = (result: "inside" | "outside" | null) => {
    if (result === "inside") {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Fire confetti from two sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    } else if (result === "outside") {
      // Show question marks animation
      setShowQuestionMarks(true);

      // Hide after 3 seconds
      setTimeout(() => {
        setShowQuestionMarks(false);
      }, 3000);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", position: "relative" }}>
      <h1 style={{ marginBottom: "20px" }}>ZK Geolocation Proof</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Step 1: Draw a Polygon</h2>
        <div style={{
          padding: "12px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          marginBottom: "10px"
        }}>
          <strong>How to draw:</strong>
          <ol style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
            <li>Use the search bar to navigate to your desired location</li>
            <li>Click the polygon tool (polygon icon) in the top-right corner</li>
            <li>Click on the map to place vertices (minimum 3, you can place as many as you want)</li>
            <li>Click the first point again OR click Finish to complete the polygon</li>
          </ol>
        </div>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Your polygon will be automatically converted to exactly 8 vertices for the ZK circuit.
        </p>
        {proofStatus && (
          <div style={{
            marginTop: "12px",
            padding: "12px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "14px",
            borderLeft: "4px solid #4caf50"
          }}>
            {proofStatus}
          </div>
        )}
      </div>

      <Map onPolygonDrawn={setPolygon} showQuestionMarks={showQuestionMarks} />

      <div style={{ marginTop: "20px" }}>
        <h2>Step 2: Prove Your Location</h2>
        <p>
          Click the button below to prove you're inside the polygon using a zero-knowledge proof.
        </p>
        <ProofPanel polygon={polygon} onProofResult={handleProofResult} onStatusChange={setProofStatus} />
      </div>
    </div>
  );
}

export default App;
