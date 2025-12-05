# ZK Geolocation Proof

A privacy-preserving geolocation verification system using Zero-Knowledge Proofs. Prove you're inside a polygon without revealing your exact location!

## Features

- 🗺️ Interactive map with polygon drawing
- 🌈 Rainbow gradient polygon visualization
- 🔐 Zero-Knowledge proof generation and verification
- 📍 Location search functionality
- ✨ Automatic 8-vertex polygon conversion

## Setup

### Installation

```bash
npm install
```

### Circuit Files Setup

⚠️ **IMPORTANT**: The circuit files are NOT included in this repository.

You need to add these files to `public/circuits/`:
- `Main.wasm` - Circuit WebAssembly file
- `Main_final.zkey` - Proving key
- `verification_key.json` - Verification key

### Running

```bash
npm run dev        # Development
npm run build      # Production build
npm run preview    # Preview build
```

## License

MIT
