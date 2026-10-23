# 🏥 SWASTHYASETU AI — PITCH DECK & PRESENTATION SCRIPT
### *Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience*

---

## 📑 Slide-by-Slide Outline for PPT / Pitch Decks

### 🏷️ Slide 1: Title & Vision
- **Title**: SwasthyaSetu AI (स्वास्थ्य सेतु AI)
- **Subtitle**: Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience across India's PHC Network
- **Tagline**: *Predictive Redistribution • Proximity Outbreak Detection • Mass Casualty Tragedy Early Warning*
- **Key Metrics Highlighted**:
  - 🚨 **Zero Stock-Outs**: 14-day proactive depletion forecasts.
  - ⚡ **Autonomous P2P Redistribution**: MILP mathematical optimization in hours instead of 6-week state indents.
  - 🔒 **Privacy-First**: DISHA/DPDP compliant Federated Averaging (FedAvg).

---

### 🚨 Slide 2: Problem Statement & Ground Realities
- **The Core Crisis**:
  1. **Fatal Medicine Stock-Outs**: Rural PHCs frequently run out of critical life-saving drugs (Anti-Rabies Vaccines, Insulin, ORS, IV Saline, Antibiotics) during sudden demand spikes.
  2. **Preventable Expiration Waste**: Clinics hold crores of near-expiry stocks with zero visibility into neighboring shortages (PHC A throws away 400 vials while PHC B 15km away turns patients away).
  3. **Bureaucratic Procurement Delays**: Centralized state-level indent tender cycles take 4 to 8 weeks to respond to local crises.
  4. **Intermittent Connectivity Silos**: Remote sub-centers have zero or spotty 2G internet, rendering conventional centralized cloud portals useless.

---

### 💡 Slide 3: Proposed Solution — SwasthyaSetu AI
- **Unified Multi-Tier AI Platform**:
  1. **Multi-Horizon Time-Series Forecasting**: Machine learning models predicting 7, 14, and 30-day medicine consumption using Poisson distributions and seasonal epidemiological trends.
  2. **MILP Redistribution Engine (PuLP)**: Linear programming optimizer that matches surplus clinics with shortage clinics, minimizing transit distance (Haversine formula) and prioritizing First-Expired-First-Out (FEFO) batches.
  3. **Proximity Outbreak & Tragedy Radar**: Real-time AI early warning for epidemic spread ($<28\text{ km}$) and mass casualty disasters ($<20\text{ km}$) with arrival ETAs.
  4. **Offline-First Edge Sync**: IndexedDB browser architecture for zero-downtime offline operation in remote villages.
  5. **Federated Learning (FedAvg)**: Cross-state training without centralizing sensitive patient data.

---

### 📡 Slide 4: AI Proximity Early Warning & Tragedy Radar
- **Nearby Disease Outbreak Diffusion**:
  - Continuously models disease spread radius ($R \le 28\text{ km}$) between adjacent PHCs.
  - Computes incoming patient surge: $\Delta\text{Surge} = (1 - D/30) \times 180\%$.
  - Recommends proactive medicine buffer reserves before local depletion occurs.
- **Mass Casualty Tragedy Radar**:
  - Detects highway accidents, industrial chemical leaks, and flash floods ($<20\text{ km}$).
  - Computes ambulance casualty arrival ETA: $T_{\text{ETA}} = \frac{D}{40} \times 60\text{ mins}$.
  - 1-Click Triage Activation: Alerts staff to reserve emergency beds, prepare sterile trauma kits, and stage IV fluids at reception.

---

### 👁️ Slide 5: Visibility & Feasibility Analysis
- **Visibility & Transparency**:
  - 4-Tier Interactive Command Hierarchy: National Overwatch $\rightarrow$ State Directorate $\rightarrow$ District CMO $\rightarrow$ PHC Edge.
  - Live Days of Supply Remaining (DoSR) and geospatial vulnerability heatmaps.
  - Human-in-the-Loop: CMOs review, modify, or approve AI-recommended transfers.
- **Technical Feasibility**:
  - Modern, lightweight stack (FastAPI + React 18 + SQLite/PostgreSQL + PuLP).
  - Fast convergence ($<500\text{ ms}$ for 150 PHCs).
- **Economic Feasibility**:
  - 100% Open-source architecture; eliminates proprietary licensing costs.
  - Reduces expired drug waste and eliminates expensive emergency commercial spot-purchasing.
- **Regulatory & Compliance**:
  - Compliant with India's DPDP Act 2023 and DISHA standards.
  - Interoperable with ABDM Health Facility Registry, eVIN cold-chain, and HMIS datasets.

---

### 🗺️ Slide 6: Project Scope & Scaling Roadmap
- **Phase 1: District Pilot (Completed & Verified)**:
  - 150 PHCs simulated across 15 districts (Maharashtra, Karnataka, UP).
  - Full demand forecasting, MILP redistribution, and 11-language localization.
- **Phase 2: State-Wide Rollout (Next 6 Months)**:
  - Integration with State Medical Services Corporations (e.g., MPMSCL, KMSCL).
  - Integration with autonomous medical delivery drone corridors.
- **Phase 3: National Scale (Next 12–24 Months)**:
  - Pan-India scaling across 25,000+ PHCs and 5,000+ CHCs.
  - National disaster pharmaceutical green-corridor network.

---

### 🛠️ Slide 7: Technology Stack & System Architecture
| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI / UX** | React 18, Vite, Lucide Icons, Leaflet Maps, Glassmorphic CSS Design System |
| **Backend Core** | FastAPI (Python 3.10+), SQLAlchemy ORM, SQLite / PostgreSQL, Pydantic, Uvicorn |
| **AI & Optimization** | PuLP MILP Solver, Haversine Spatial Vectors, Poisson Footfall Modeling, FedAvg |
| **Edge & Localization** | IndexedDB / LocalStorage Delta Sync, 11 Indian Languages i18n Engine |
| **National Standards** | ABDM M1-M3 Consent Architecture, eVIN IoT Telemetry, HMIS Surveillance Ingestion |

---

### 👥 Slide 8: Development Team & Links
- **Core Team**:
  - **Rudra Pratap Chaurasiya** — *CSJMU Kanpur* (Lead Full Stack AI Architecture & ML Engines)
- **Source Links**:
  - 💻 **GitHub Repository**: [https://github.com/rudraa0604/Swasthya-Setu-AI](https://github.com/rudraa0604/Swasthya-Setu-AI)
  - 🌐 **Web App Interface**: `http://localhost:3000`
  - 📡 **Interactive API Docs**: `http://localhost:8000/docs`
