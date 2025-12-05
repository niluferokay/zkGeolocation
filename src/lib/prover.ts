import * as snarkjs from "snarkjs";

interface ProofInput {
  point: [number, number];
  polygon: [number, number][];
}

interface ProofResult {
  proof: any;
  publicSignals: any;
}

export async function generateProof(input: ProofInput): Promise<ProofResult> {
  const wasmPath = "/circuits/Main.wasm";
  const zkeyPath = "/circuits/Main_final.zkey";

  console.log("⚙️ Loading wasm + zkey...");
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  return { proof, publicSignals };
}

export async function verifyProof(proof: any, publicSignals: any): Promise<boolean> {
  const vkey = await fetch("/circuits/verification_key.json").then((r) => r.json());
  return snarkjs.groth16.verify(vkey, publicSignals, proof);
}
