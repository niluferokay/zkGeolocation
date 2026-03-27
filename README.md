
# Geolocation Proof (ZK Geofence)

A privacy-preserving geolocation verification system using Zero-Knowledge Proofs.  
Prove you are inside a defined geographic area, without revealing your exact location.

The initial prototype was developed during **Funding the Commons residency in Buenos Aires, Argentina**, where the idea emerged through collaboration in a shared, experimental environment.

**Project presentation:** *[Proof of Impact.pdf](https://github.com/user-attachments/files/26306429/Proof.of.Impact.pdf)*

### Use Cases
This system is particularly relevant for scenarios where:
- Location needs to be verified, but not disclosed
- Users may be vulnerable to surveillance or risk
- Trust in data is required without compromising privacy

###  Features
- 🗺️ Interactive map with polygon drawing
- 🔐 Zero-Knowledge proof generation and verification
- 📍 Location search functionality
- ✨ Automatic 8-vertex polygon conversion

## Setup

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```
