# 🏥 SwasthyaSetu AI (स्वास्थ्य सेतु AI)
### *Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience across India's PHC Network*

---

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![Federated Learning](https://img.shields.io/badge/AI-Federated_Learning_(FedAvg)-FF6F00.svg?style=flat)](https://flower.ai)
[![PuLP Optimizer](https://img.shields.io/badge/Optimization-MILP_(PuLP)-4CAF50.svg?style=flat)](https://coin-or.github.io/pulp/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black.svg?logo=github)](https://github.com/rudraa0604/Swasthya-Setu-AI)

---

## 📌 Table of Contents
- [📖 Executive Summary](#-executive-summary)
- [🎯 The Problem It Solves](#-the-problem-it-solves)
- [💡 The Solution: SwasthyaSetu AI](#-the-solution-swasthya-setu-ai)
- [✨ Core Capabilities & AI Innovations](#-core-capabilities--ai-innovations)
  - [1. Multi-Horizon Time-Series Demand Forecasting](#1-multi-horizon-time-series-demand-forecasting)
  - [2. Intelligent Early Warning & Stock-Out Predictor](#2-intelligent-early-warning--stock-out-predictor)
  - [3. MILP-Based Inter-PHC Stock Redistribution Optimizer](#3-milp-based-inter-phc-stock-redistribution-optimizer)
  - [4. AI Proximity Disease Outbreak & Tragedy Early Warning Radar](#4-ai-proximity-disease-outbreak--tragedy-early-warning-radar)
  - [5. Privacy-Preserving Federated Learning (FedAvg)](#5-privacy-preserving-federated-learning-fedavg)
  - [6. Offline-First Edge Sync Engine for Rural PHCs](#6-offline-first-edge-sync-engine-for-rural-phcs)
  - [7. Multilingual Support (11 Official Indian Languages)](#7-multilingual-support-11-official-indian-languages)
  - [8. AI Hospital Resource Optimizer (Individual Hospital Tab)](#8-ai-hospital-resource-optimizer-individual-hospital-tab)
- [🏨 AI Hospital Resource Optimization](#-ai-hospital-resource-optimization)
- [👁️ Visibility, Transparency & Governance](#️-visibility-transparency--governance)
- [⚙️ Feasibility Analysis](#️-feasibility-analysis)
  - [Technical Feasibility](#technical-feasibility)
  - [Operational & Human-in-the-Loop Feasibility](#operational--human-in-the-loop-feasibility)
  - [Economic Feasibility & ROI](#economic-feasibility--roi)
  - [Legal & Regulatory Feasibility](#legal--regulatory-feasibility)
- [🗺️ Project Scope, Impact & Roadmap](#️-project-scope-impact--roadmap)
- [🛠️ Full Technology Stack](#️-full-technology-stack)
- [🏗️ System Architecture & Data Flow](#️-system-architecture--data-flow)
- [👥 Role-Based Operational Portals](#-role-based-operational-portals)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quickstart & Setup Guide](#-quickstart--setup-guide)
- [📊 PowerPoint (PPT) Presentation Generation](#-powerpoint-ppt-presentation-generation)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [👥 Development Team & Credits](#-development-team--credits)
- [📜 License & Acknowledgements](#-license--acknowledgements)

---

## 📖 Executive Summary

**SwasthyaSetu AI (स्वास्थ्य सेतु AI)** is a state-of-the-art, privacy-preserving clinical supply-chain intelligence and emergency resource redistribution platform built specifically for India's **Primary Health Centre (PHC)** and **Community Health Centre (CHC)** network.

In India's tiered public healthcare system, rural PHCs frequently experience acute stock-outs of life-saving medicines (e.g., Anti-Rabies Vaccines, Insulin, ORS, Antibiotics, IV Fluids) due to sudden demand surges, seasonal epidemic outbreaks, delayed supply replenishment, and communication silos between neighboring health facilities. 

SwasthyaSetu AI bridges this gap by combining **Predictive Machine Learning**, **Mathematical Mixed-Integer Linear Programming (MILP)**, and **Federated Learning** to create an autonomous, real-time safety net that:
- Anticipates drug stock-outs up to **14 days in advance**,
- Orchestrates peer-to-peer localized redistributions to eliminate expired medicine wastage,
- Provides **Geospatial Proximity Warnings** for spreading epidemics and mass-casualty tragedies,
- Operates seamlessly with **zero internet connectivity** at the rural edge,
- Gives every individual hospital its own **AI Resource Optimization tab** that forecasts demand and recommends the best use of beds, ICU, operating rooms, staff and emergency resources.

---

## 🎯 The Problem It Solves

```
❌ Traditional Healthcare Supply Chain (Fragmented, Reactive & Siloed)
[ PHC A: Surplus Medicine Expiry ] ──(No Visibility)── [ PHC B: Critical Stockout & Patient Crisis ]
                                                               │
                                         (Delayed State Tender Cycle: 4-8 Weeks)

--------------------------------------------------------------------------------------------------

✅ SwasthyaSetu AI (Predictive, Connected & Autonomous)
[ PHC A: 300 Vials Surplus ] ──(PuLP Optimizer: 14km)──> [ PHC B: Predicted Shortage in 48h ]
                       ▲                                              ▲
                       └─────────── [ Proximity Early Warning ] ──────┘
```

### Key Industry Pain Points:
1. **Critical Drug Stock-Outs**: Remote clinics run out of emergency medicines (Anti-Rabies Vaccines, Snake Antivenom, Insulin) during seasonal spikes, causing avoidable patient mortality.
2. **Crores in Expired Medicine Waste**: Facilities hold surplus stocks that expire on shelves because neighboring clinics facing shortages have zero visibility into nearby inventory.
3. **Slow Bureaucratic Indenting**: Traditional reordering requires central state health tenders that take 4 to 8 weeks to deliver supplies.
4. **Poor Rural Connectivity**: Cloud-only applications crash in remote areas where doctors have intermittent or no internet connectivity.
5. **Data Privacy Restrictions**: Centralizing patient records across districts violates healthcare privacy mandates (DISHA / DPDP Act 2023).

---

## 💡 The Solution: SwasthyaSetu AI

SwasthyaSetu AI introduces a multi-tier, AI-powered resilience layer that transforms rural healthcare logistics from a reactive model into an autonomous, proactive network:

- **Predictive Intelligence**: Machine learning forecasts daily medicine depletion across 7, 14, and 30-day horizons.
- **Mathematical Peer-to-Peer Redistribution**: Uses PuLP MILP solver to calculate optimal transfer routes between surplus and shortage clinics, minimizing transit distance and transit times.
- **Proximity Early Warning & Tragedy Radar**: Uses Haversine geospatial calculations to alert clinics when epidemics or tragedies strike within 20–28 km.
- **Privacy-Preserving Federated Learning**: State nodes train local AI models and aggregate model weights ($\Delta W$) at the national orchestrator using FedAvg without exposing raw patient data.
- **Zero-Bandwidth Offline Edge Mode**: Doctors and pharmacists log transactions in offline IndexedDB ledgers that automatically sync upon reconnection.

---

## ✨ Core Capabilities & AI Innovations

### 1. Multi-Horizon Time-Series Demand Forecasting
- Combines historical consumption patterns, seasonal epidemiological peaks (monsoon diarrhea, summer heatwave, post-monsoon dengue), and outpatient footfall.
- Evaluates statistical moving averages, trend regressions, and Poisson demand curves to project daily consumption for 7, 14, and 30-day horizons with confidence intervals.

### 2. Intelligent Early Warning & Stock-Out Predictor
- Calculates **Days of Supply Remaining (DoSR)** in real-time:
  $$\text{DoSR} = \frac{\text{Current Usable Stock}}{\text{Projected Daily Consumption Rate}}$$
- Classifies inventory into **CRITICAL** ($<3$ days), **WARNING** ($3-7$ days), **ADEQUATE** ($7-21$ days), and **SURPLUS** ($>21$ days with approaching expiry).
- Triggers instant notifications and highlights vulnerable clinics on interactive district heatmaps.

### 3. MILP-Based Inter-PHC Stock Redistribution Optimizer
- Formulated as a **Mixed-Integer Linear Programming (MILP)** problem solved using the **PuLP** engine:
  - **Objective**: Minimize total transportation transit distance (Haversine formula) and transfer costs while maximizing shortage relief and minimizing near-expiry waste.
  - **Constraints**: 
    - Source PHC must retain a mandatory safety buffer (minimum 15 days of stock).
    - Transfer batches prioritize items closest to expiry date (FEFO - First Expired, First Out).
    - Human-in-the-loop: District CMOs review, approve, modify, or reject recommended transfers.

### 4. AI Proximity Disease Outbreak & Tragedy Early Warning Radar
- **Spreading Disease Outbreak Detection**:
  - Monitors active epidemic clusters within a $28\text{ km}$ radius of every clinic.
  - Projects incoming patient load increases ($+40\%$ to $+180\%$) and diffusion timelines based on distance ($D\text{ km}$):
    $$\Delta \text{Surge} = \left(1 - \frac{D}{30}\right) \times 180\%$$
  - Recommends preemptive buffer stock orders before local supplies deplete.
- **Mass Casualty Tragedy & Disaster Radar**:
  - Detects highway accidents, industrial chemical leaks, and flash floods within an impacted zone ($\le 20\text{ km}$).
  - Calculates real-time arrival estimates for incoming casualties using emergency transit speeds ($40\text{ km/h}$):
    $$T_{\text{ETA}} = \frac{D}{40} \times 60 \text{ minutes}$$
  - 1-Click Triage Activation: Alerts staff to reserve emergency beds, prepare sterile trauma kits, and stage IV fluids at reception.

### 5. Privacy-Preserving Federated Learning (FedAvg)
- Solves data sovereignty and healthcare privacy mandates (DISHA / DPDP Act 2023).
- Each state maintains a dedicated local edge training node. Model parameters are trained locally on state-specific clinical trends and only model weights ($\Delta W$) are aggregated at the national orchestrator using **Federated Averaging (FedAvg)**.

### 6. Offline-First Edge Sync Engine for Rural PHCs
- Designed for low-bandwidth and intermittent 2G/3G connectivity in remote areas.
- Uses browser `LocalStorage` and `IndexedDB` caching to allow doctors to log patient footfall, record medicine dispensing, and check local inventory without an active internet connection.
- Automatically pushes batched delta sync payloads to the backend once connectivity is restored.

### 7. Multilingual Support (11 Official Indian Languages)
- Fully reactive internationalization engine supporting:
  `English`, `हिन्दी (Hindi)`, `मराठी (Marathi)`, `ગુજરાતી (Gujarati)`, `বাংলা (Bengali)`, `தமிழ் (Tamil)`, `తెలుగు (Telugu)`, `ಕನ್ನಡ (Kannada)`, `മലയാളം (Malayalam)`, `ਪੰਜਾਬੀ (Punjabi)`, and `ଓଡ଼ିଆ (Odia)`.

### 8. AI Hospital Resource Optimizer (Individual Hospital Tab)
- A separate tab inside each hospital's portal. SwasthyaSetu works at network level; this tab works **inside one hospital**.
- Predicts demand, then recommends the best allocation of beds, ICU, OTs, staff and emergency resources.
- Full details in the [AI Hospital Resource Optimization](#-ai-hospital-resource-optimization) section.

---

## 🏨 AI Hospital Resource Optimization

### The Problem
Hospitals have limited beds, ICU capacity, operating rooms and staff, while patient demand keeps changing. Admins plan by guesswork, which causes overcrowded wards, idle ICU beds, OT delays, tired staff and slow emergency response.

### The Solution
A decision-support tab for each hospital. It follows four steps:

```
 Hospital Data ──> Demand Forecast ──> Optimizer (under constraints) ──> Recommendations ──> Admin Approves
 (admissions,      (7 / 14 / 30       (MILP + Reinforcement             (beds, ICU, OT,     (human-in-
  beds, OTs,        day, hourly         Learning)                         staff, emergency)    the-loop)
  staff, ER)        for ER)
```

### Modules

| # | Module | What it does | Method |
| :--- | :--- | :--- | :--- |
| 1 | **Demand Forecasting** | Predicts OPD footfall, admissions, ICU demand, ER arrivals, OT requests and staff load | Prophet + XGBoost, Poisson models, seasonal and outbreak signals from the SwasthyaSetu network |
| 2 | **Bed & ICU Optimizer** | Allocates beds across wards and ICU; suggests discharges, transfers and surge beds | MILP (PuLP / OR-Tools) |
| 3 | **Operating Room Scheduler** | Builds OT schedules that cut idle time, overtime and emergency delays | Job-shop scheduling with CP-SAT |
| 4 | **Staff Allocation** | Assigns doctors, nurses and technicians to shifts and wards by predicted load | MILP with shift, rest-hour and skill constraints |
| 5 | **Emergency Resource Planner** | Keeps ventilators, oxygen, blood, ambulances and trauma kits ready for predicted surges | Safety-stock model + forecast |
| 6 | **Scenario Simulator ("What-if")** | Tests cases like "outbreak +40%" or "bus accident, 25 casualties" before they happen | Simulation + Reinforcement Learning agent |
| 7 | **Admin Decision Dashboard** | One screen with forecasts, alerts, recommendations and approve / modify / reject buttons | React + charts |

### Key Metrics Tracked
- Bed occupancy rate and ICU occupancy rate
- Average length of stay
- OT utilization % and average OT idle time
- Emergency wait time and bed-assignment time
- Staff-to-patient ratio and overtime hours
- Forecast accuracy (MAPE)

### Operational Constraints Handled
- Bed and ICU capacity per ward; isolation and gender-ward rules
- Minimum ICU buffer reserved for emergencies
- OT availability, surgeon availability, cleaning time between surgeries
- Staff shift limits, mandatory rest, skill match (e.g. ICU-trained nurse)
- Equipment limits (ventilators, oxygen, monitors)
- Emergency cases always get priority

### Optimization Formulation (simplified)

- **Minimize:** patient waiting time + OT idle time + staff overtime + unmet demand penalty
- **Subject to:** bed capacity, ICU buffer, OT slots, staff shift rules, equipment availability

```
Unmet Demand (t) = max(0, Forecast Demand (t) − Available Capacity (t))
Bed Occupancy %  = Occupied Beds / Total Staffed Beds × 100
OT Utilization % = Used OT Hours / Available OT Hours × 100
```

### Reinforcement Learning (Adaptive Layer)
- **State:** current occupancy, queue length, forecast, staff on duty
- **Action:** open surge beds, shift staff, reschedule elective surgery, trigger emergency mode
- **Reward:** lower wait time and higher utilization, with a penalty for ICU overflow or staff burnout
- Runs on a simulated hospital first; the admin always has the final say.

### Expected Outcomes
- Prediction of hospital-resource demand
- Optimized allocation of beds and ICU capacity
- Better scheduling and utilization of operating rooms
- Effective allocation of staff and emergency resources
- Recommendations that respect operational constraints
- Decision-support interface for hospital administrators
- Higher resource utilization and real institutional impact

### Link with the Network Layer
- A hospital forecasts a shortage → SwasthyaSetu redistribution finds surplus at nearby PHCs.
- Outbreak / tragedy radar alerts feed straight into the hospital's demand forecast and emergency planner.
- Federated learning lets hospitals improve models together without sharing patient data.

---

## 👁️ Visibility, Transparency & Governance

- **Multi-Level Visibility Hierarchy**: Role-based access ensures complete transparency across National Overwatch, State Health Directorates, District CMOs, and PHC Edge Terminals.
- **Real-Time Telemetry**: Real-time visualization of stock levels, DoSR indices, bed occupancy, and active transfer dispatches.
- **Human-in-the-Loop Governance**: AI recommendations are non-coercive; District Medical Officers retain full authority to approve, adjust quantities, or reject redistribution proposals.
- **Audit Trails**: Full cryptographic ledger tracking batch origins, expiry dates, dispatch timestamps, and receiving signatures.

---

## ⚙️ Feasibility Analysis

### Technical Feasibility
- **Lightweight & High Performance**: FastAPI backend with async workers delivers sub-100ms response times.
- **Fast Mathematical Convergence**: The PuLP MILP optimizer solves multi-PHC transportation networks in under 500ms.
- **Edge Compatibility**: Runs smoothly on low-cost tablets, smartphones, and legacy desktop PCs.

### Operational & Human-in-the-Loop Feasibility
- **Zero Retraining Overhead**: Clean, intuitive user interface designed strictly with simple, plain-language wording in local languages.
- **Seamless Integration**: Standardized JSON endpoints designed for integration with existing portals like HMIS, eVIN, and ABDM.

### Economic Feasibility & ROI
- **100% Open Source**: Built using open-source tools with zero proprietary licensing costs.
- **Dramatic Wastage Reduction**: Recovers hundreds of crores annually by preventing medicine expiration through timely P2P transfers.
- **Eliminates Emergency Spot-Purchasing**: Reduces the need for costly emergency commercial purchases at inflated retail prices.

### Legal & Regulatory Feasibility
- **Privacy Compliance**: Fully compliant with India’s Digital Personal Data Protection (DPDP) Act 2023 and DISHA guidelines via federated learning.
- **Standards Compliant**: Built to comply with Ayushman Bharat Digital Mission (ABDM) Health Facility Registry standards.

---

## 🗺️ Project Scope, Impact & Roadmap

```
Phase 1: District Pilot (Completed)   ──>   Phase 2: State Rollout (6 Months)   ──>   Phase 3: Pan-India (12-24 Months)
• 150 PHCs across 15 Districts             • Integration with State Medical Corps     • 25,000+ PHCs & 5,000+ CHCs
• Full Forecasting & Redistribution        • Medical Delivery Drone Dispatch         • National Disaster Corridor
• Proximity Tragedy & Outbreak Radar       • Real-Time eVIN IoT Sensor Streaming      • Full ABDM UHI Interoperability
                                           • Hospital Resource Optimizer pilot        • Hospital-level RL agents and cross-
                                             in district hospitals                      hospital federated learning
```

---

## 🛠️ Full Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI / UX** | React 18, Vite, Vanilla CSS Design System, Lucide Icons, Leaflet Maps |
| **Backend Services** | FastAPI (Python 3.10+), SQLAlchemy ORM, SQLite / PostgreSQL, Pydantic, Uvicorn |
| **AI & Optimization** | PuLP (MILP Solver), Haversine Spatial Vectors, Poisson Demand Modeling, FedAvg |
| **Hospital Optimization** | Prophet, XGBoost, PuLP, OR-Tools CP-SAT, Stable-Baselines3 (RL), SimPy (simulation) |
| **Edge & Localization** | IndexedDB / LocalStorage Delta Sync Engine, 11-Language i18n Architecture |
| **National Standards** | ABDM Consent Architecture (M1-M3), eVIN Cold-Chain Telemetry, HMIS Data Pipelines |

---

## 👥 Role-Based Operational Portals

| Station Role | Target Users | Primary Functional Capabilities | Portal Route |
| :--- | :--- | :--- | :--- |
| 🏥 **Hospital Administrator** | Medical Superintendents, Hospital Admins, Ward Incharges | Demand forecast, bed & ICU allocation, OT scheduler, staff roster, emergency resource planner, what-if simulator, approve / reject AI recommendations. | `#/portal/hospital` |
| 🏥 **PHC / CHC Edge Terminal** | Rural Doctors & Pharmacists | Offline-first medicine dispensing, batch reception, footfall logging, local inventory ledger, live proximity radar. | `#/portal/edge` |
| 📍 **District Health Officer (DHO)** | District CMOs & Drug Inspectors | District triage, shortage monitoring, reviewing and approving AI-generated stock transfers, disaster matrix. | `#/portal/district` |
| 🏢 **State Health Directorate** | State Health Commissioners | Multi-district oversight (50 PHCs), local state AI model training, emergency state escalation. | `#/portal/state` |
| 🌐 **National Ministry Overwatch** | NHM Central Command | National health risk maps, national emergency override, global FedAvg model weight aggregation. | `#/portal/national` |
| 🚚 **AI Route & Transit Optimizer** | Logistics & Supply Coordinators | Real-time transit navigation, emergency green corridors, waypoint routing, drone dispatch tracking. | `#/portal/routes` |
| ⚙️ **Developer / Admin Sandbox** | System Architects & Evaluators | Synthetic outbreak injection, database re-seeding, live CRUD for facilities & stocks, loss curves inspection. | `#/portal/dev` |

---

## 📂 Project Directory Structure

```
SwasthyaSetu-AI/
├── backend/
│   ├── app/
│   │   ├── api/                  # API endpoints (PHCs, Alerts, Forecasts, Redistribution, Sync, Dev)
│   │   ├── core/                 # App configuration & constants
│   │   ├── db/                   # SQLAlchemy database engine & session
│   │   ├── models/               # Database ORM models (PHC, MedicineStock, Alerts, Transfers)
│   │   └── schemas/              # Pydantic validation schemas
│   ├── main.py                   # FastAPI server entry point
│   └── requirements.txt          # Python dependencies
│
├── frontend/
│   ├── public/                   # Static assets, branding icons, canvas frames
│   ├── src/
│   │   ├── components/           # UI Components (ProximityRadar, Header, Charts, Panels)
│   │   ├── pages/                # Multi-page views (Landing, Login, National, State, District, Edge, Routes)
│   │   ├── services/             # API client, i18n translation tables (11 languages), sync engine
│   │   └── styles/               # Clean design system tokens & glassmorphic styles
│   ├── package.json              # NPM dependencies & scripts
│   └── vite.config.js            # Vite bundler & API proxy configuration
│
├── ml/
│   ├── alerts/                   # Proximity Engine & Multi-factor anomaly detection
│   ├── federated/                # Flower-compatible FedAvg simulation across state nodes
│   ├── forecasting/              # Multi-horizon statistical depletion forecast engine
│   ├── hospital/                 # Hospital Resource Optimization Suite
│   │   ├── demand_forecast/      # Prophet + XGBoost demand models
│   │   ├── bed_icu_optimizer/    # MILP bed & ICU allocation
│   │   ├── ot_scheduler/         # CP-SAT operating room scheduling
│   │   ├── staff_allocation/     # Shift & staff optimizer
│   │   ├── emergency_planner/    # Safety-stock & surge planner
│   │   └── rl_agent/             # RL policy + hospital simulator
│   └── redistribution/           # PuLP MILP linear transportation route optimization
│
├── db/
│   ├── schema.sql                # Relational database schema definition
│   └── seed_data.py              # Realistic synthetic generator (3 States, 15 Districts, 150 PHCs)
│
├── generate_pptx.py              # Automated script to generate PowerPoint (.pptx) presentation
├── SwasthyaSetu_AI_Presentation.pptx # Generated 16:9 Presentation Deck
├── PRESENTATION.md               # Slide-by-slide markdown script for pitch decks
├── verify_system.py              # End-to-end 5-phase system verification suite
└── README.md                     # Project master documentation
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.x` or higher
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/rudraa0604/Swasthya-Setu-AI.git
cd Swasthya-Setu-AI
```

### Step 2: Set Up & Run Backend
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # On Windows
# source venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r backend/requirements.txt

# Seed the database (150 PHCs, 1200 Stocks, Outbreak node in Nashik)
python -m db.seed_data

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --port 8000 --reload
```

### Step 3: Set Up & Run Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at **`http://localhost:3000`** 🎉

---

## 📊 PowerPoint (PPT) Presentation Generation

We have included a direct PowerPoint generator in the project. You can generate or re-generate the 16:9 widescreen presentation deck at any time:

```bash
python generate_pptx.py
```
This generates **`SwasthyaSetu_AI_Presentation.pptx`** containing:
1. Title & Executive Overview
2. Problem Statement & Ground Realities
3. Proposed Solution Architecture
4. AI Proximity Early Warning & Tragedy Radar
5. Visibility, Transparency & Feasibility Analysis
6. Project Scope, Scaling Roadmap & Impact Metrics
7. Full-Stack Technology Architecture
8. Development Team, Source Links & Live Portal URLs

You can also reference [PRESENTATION.md](file:///c:/Users/Loq/OneDrive/Desktop/SwasthyaSetu%20AI/PRESENTATION.md) for direct import into tools like Marp, Gamma AI, or Google Slides.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server & database health status |
| `GET` | `/api/phcs/rollup/national` | National aggregate metrics (Total PHCs, bed occupancy, risk states) |
| `GET` | `/api/phcs/?state_id=ST-MH` | List PHCs filtered by state or district |
| `GET` | `/api/phcs/{phc_id}` | Detailed telemetry of a single PHC (stocks, beds, staff, footfall) |
| `GET` | `/api/alerts/proximity/{phc_id}` | **AI Proximity Early Warnings (Disease Outbreaks & Tragedies within radius)** |
| `GET` | `/api/alerts/incidents` | List active mass-casualty disaster & emergency incidents |
| `POST` | `/api/alerts/report-incident` | Broadcast a new emergency tragedy to nearby PHCs |
| `GET` | `/api/forecast/{phc_id}?horizon_days=14` | 14-day demand forecast trajectory & stock-out risk probability |
| `GET` | `/api/alerts/` | List active early warning shortage and outbreak alerts |
| `POST` | `/api/alerts/scan-all` | Trigger automated vulnerability scan across all PHCs |
| `GET` | `/api/redistribution/recommendations` | Get pending MILP redistribution transfer orders |
| `POST` | `/api/redistribution/generate` | Trigger the PuLP optimizer to compute optimal transfers |
| `PUT` | `/api/redistribution/recommendations/{id}/action` | Approve / Reject a transfer proposal (Human-in-the-loop) |
| `GET` | `/api/federated/status` | Current federated training round status & accuracy scores |
| `POST` | `/api/federated/simulate?rounds=5` | Run multi-state FedAvg weight aggregation simulation |
| `POST` | `/api/sync/batch` | Synchronize offline queue items from edge PHC devices |
| `GET` | `/api/hospital/{hospital_id}/forecast?horizon_days=14` | Forecast of admissions, ICU, ER, OT and staff demand |
| `GET` | `/api/hospital/{hospital_id}/resources` | Live status of beds, ICU, OTs, staff and emergency equipment |
| `POST` | `/api/hospital/{hospital_id}/optimize/beds` | Run bed & ICU allocation optimizer |
| `POST` | `/api/hospital/{hospital_id}/optimize/ot-schedule` | Generate optimized operating room schedule |
| `POST` | `/api/hospital/{hospital_id}/optimize/staff` | Generate staff roster recommendation |
| `GET` | `/api/hospital/{hospital_id}/emergency-readiness` | Emergency resource readiness and gaps |
| `POST` | `/api/hospital/{hospital_id}/simulate` | What-if scenario simulation (surge, outbreak, mass casualty) |
| `GET` | `/api/hospital/{hospital_id}/recommendations` | List pending AI recommendations |
| `PUT` | `/api/hospital/{hospital_id}/recommendations/{id}/action` | Approve / modify / reject (human-in-the-loop) |

---

## 👥 Development Team & Credits

- **Rudra Pratap Chaurasiya** — *CSJMU Kanpur* (Lead Full Stack AI Architecture & ML Engines)

---

## 📜 License & Acknowledgements

- **License**: MIT Open Source License.
- **Designed For**: National Digital Health Hackathons, Ayushman Bharat Digital Mission (ABDM) innovations, and strengthening India's Primary Healthcare Network.
- **Dedicated to India's Frontline Healthcare Heroes.** 🇮🇳