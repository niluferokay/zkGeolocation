# Geolocation Proof

A privacy-preserving geolocation verification system using Zero-Knowledge Proofs. Prove you're inside a polygon without revealing your exact location!

## Features

- 🗺️ Interactive map with polygon drawing
- 🔐 Zero-Knowledge proof generation and verification
- 📍 Location search functionality
- ✨ Automatic 8-vertex polygon conversion

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Circuit Files

⚠️ **IMPORTANT**: The circuit files are NOT included in this repository. You must generate them yourself.

#### Prerequisites

Install **Rust** (required to build Circom):
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
```

Install **Circom** compiler:
```bash
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
cd ..
```

#### Generate the Circuit Files

1. **Download Powers of Tau** (trusted setup ceremony file):
```bash
cd circuits
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_16.ptau
```

2. **Compile the circuit**:
```bash
circom Main.circom --r1cs --wasm --sym
```

3. **Generate proving key**:
```bash
npx snarkjs groth16 setup Main.r1cs powersOfTau28_hez_final_16.ptau Main_0000.zkey
npx snarkjs zkey contribute Main_0000.zkey Main_final.zkey --name="First contribution" -v
```

4. **Export verification key**:
```bash
npx snarkjs zkey export verificationkey Main_final.zkey verification_key.json
```

5. **Move files to public folder**:
```bash
cd ..
mkdir -p public/circuits
cp circuits/Main_js/Main.wasm public/circuits/
cp circuits/Main_final.zkey public/circuits/
cp circuits/verification_key.json public/circuits/
```

You should now have:
- `public/circuits/Main.wasm` (~194 KB)
- `public/circuits/Main_final.zkey` (~18.9 MB)
- `public/circuits/verification_key.json` (~3 KB)

### 3. Run the App

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

