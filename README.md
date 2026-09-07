# 🏥 SwasthyaSetu AI (स्वास्थ्य सेतु AI)
### *Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience across India's PHC Network*

---

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![Federated Learning](https://img.shields.io/badge/AI-Federated_Learning_(FedAvg)-FF6F00.svg?style=flat)](https://flower.ai)
[![PuLP Optimizer](https://img.shields.io/badge/Optimization-MILP_(PuLP)-4CAF50.svg?style=flat)](https://coin-or.github.io/pulp/)
[![Deployment](https://img.shields.io/badge/Deployed_on-Render-46E3B7.svg?style=flat&logo=render&logoColor=black)](https://render.com)

---

## 📌 Table of Contents
- [📖 Executive Overview](#-executive-overview)
- [🎯 The Problem It Solves](#-the-problem-it-solves)
- [✨ Core Capabilities & Innovations](#-core-capabilities--innovations)
  - [1. Multi-Horizon Time-Series Demand Forecasting](#1-multi-horizon-time-series-demand-forecasting)
  - [2. Intelligent Early Warning & Stock-Out Predictor](#2-intelligent-early-warning--stock-out-predictor)
  - [3. MILP-Based Inter-PHC Stock Redistribution Optimizer](#3-milp-based-inter-phc-stock-redistribution-optimizer)
  - [4. Privacy-Preserving Federated Learning (FedAvg)](#4-privacy-preserving-federated-learning-fedavg)
  - [5. Offline-First Edge Sync Engine for Rural PHCs](#5-offline-first-edge-sync-engine-for-rural-phcs)
  - [6. Multi-Tiered Hierarchical Command Center](#6-multi-tiered-hierarchical-command-center)
  - [7. National Health Ecosystem Integrations (ABDM / eVIN / HMIS)](#7-national-health-ecosystem-integrations-abdm--evin--hmis)
- [🏗️ System Architecture & Data Flow](#️-system-architecture--data-flow)
- [💻 Technology Stack](#-technology-stack)
- [👥 User Roles & Dashboard Capabilities](#-user-roles--dashboard-capabilities)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quickstart & Local Setup Guide](#-quickstart--local-setup-guide)
- [🌐 Cloud Deployment on Render](#-cloud-deployment-on-render)
- [📡 API Endpoints Overview](#-api-endpoints-overview)
- [🧪 Simulation & Stress-Testing Suite](#-simulation--stress-testing-suite)
- [📜 License & Acknowledgements](#-license--acknowledgements)

---

## 📖 Executive Overview

**SwasthyaSetu AI (स्वास्थ्य सेतु AI)** is a state-of-the-art, privacy-preserving clinical supply-chain intelligence and resource redistribution platform designed specifically for India's **Primary Health Centre (PHC)** and **Community Health Centre (CHC)** network.

In India's tiered public healthcare system, rural PHCs frequently experience acute stock-outs of life-saving medicines (e.g., Anti-Rabies Vaccines, Insulin, ORS, Antibiotics) due to demand spikes, seasonal epidemic outbreaks, delayed supply replenishment, and communication silos between neighboring districts. 

SwasthyaSetu AI solves this crisis by combining **Predictive AI**, **Mathematical Linear Programming (MILP)**, and **Federated Learning** to create an autonomous, real-time safety net that balances medicine stocks, anticipates shortages up to 14 days in advance, and orchestrates localized peer-to-peer redistributions with complete human-in-the-loop governance.

---

## 🎯 The Problem It Solves

```
❌ Traditional System (Fragmented & Reactive)
[ PHC A: Surplus Medicine Expiry ] ──(No Visibility)── [ PHC B: Critical Stockout & Patient Loss ]
                                                               │
                                         (Delayed State Indent: 3-6 Weeks)

--------------------------------------------------------------------------------------------------

✅ SwasthyaSetu AI (Predictive, Connected & Autonomous)
[ PHC A: 300 Vials Surplus ] ──(PuLP Optimizer: 14km)──> [ PHC B: Predicted Shortage in 48h ]
                       ▲                                              ▲
                       └─────────── [ Automated Early Warning ] ──────┘
```

1. **Eliminates Medicine Expiry & Wastage**: Proactively redistributes near-expiry surplus stock from low-consumption clinics to high-demand clusters.
2. **Prevents Stock-Out Emergencies**: Warns Medical Officers 7–14 days before a drug runs out based on historical trends, seasonal footfall, and disease patterns.
3. **Bypasses Bureaucratic Delays**: Enables peer-to-peer inter-district/intra-district redistributions in hours instead of waiting weeks for state-level central tenders.
4. **Preserves Data Privacy**: Patient records and sensitive hospital telemetry never leave the state node; only mathematical model weights are shared across national servers.
5. **Functions in Zero-Connectivity Zones**: Guarantees uninterrupted operation in remote rural clinics through an offline-first browser engine and delta sync.

---

## ✨ Core Capabilities & Innovations

### 1. Multi-Horizon Time-Series Demand Forecasting
- Combines historical consumption patterns, seasonal epidemics (monsoon diarrhea, summer heatwave, post-monsoon dengue), and outpatient footfall.
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

### 4. Privacy-Preserving Federated Learning (FedAvg)
- Solves data sovereignty and healthcare privacy mandates (DISHA / DPDP Act 2023).
- Each state maintains a dedicated local edge training node. Model parameters are trained locally on state-specific clinical trends and only model weights ($\Delta W$) are aggregated at the national orchestrator using **Federated Averaging (FedAvg)**.

### 5. Offline-First Edge Sync Engine for Rural PHCs
- Designed for low-bandwidth and intermittent 2G/3G connectivity in remote areas.
- Uses browser `LocalStorage` and `IndexedDB` caching to allow doctors to log patient footfall, record medicine dispensing, and check local inventory without an active internet connection.
- Automatically pushes batched delta sync payloads to the backend once connectivity is restored.

### 6. Multi-Tiered Hierarchical Command Center
- Dynamic role-based user interfaces tailored for:
  - 🇮🇳 **National Health Authority** (National overview, federal model training, cross-state resilience).
  - 🏛️ **State Health Mission Director** (Statewide inventory rollups, district heatmaps, outbreak alerts).
  - 🩺 **District Chief Medical Officer (CMO)** (Supply balancing, transfer approval, emergency stock mobilization).
  - 🏥 **PHC Medical Officer / Pharmacist** (Daily dispensing, offline logging, local stock health).
  - 🚨 **Emergency Ops Command** (Disaster response, mass-casualty surge redistribution).
  - ⚙️ **Developer & Admin Sandbox** (Live outbreak simulation, stress-testing, database re-seeding).

### 7. National Health Ecosystem Integrations (ABDM / eVIN / HMIS)
- **ABDM (Ayushman Bharat Digital Mission)**: Interoperable with FHIR R4 standard payloads (`MedicationRequest`, `Encounter`, `Organization`).
- **eVIN (electronic Vaccine Intelligence Network)**: Ingests real-time cold-chain IoT temperature alarms and vial telemetry.
- **HMIS (Health Management Information System)**: Ingests block-level disease prevalence and historical footfall statistics.

---

## 🏗️ System Architecture & Data Flow

```
                                  ┌─────────────────────────────────────────┐
                                  │   National Orchestrator & Rollup Hub    │
                                  │   (FedAvg Model Weight Aggregator)      │
                                  └────────────────────┬────────────────────┘
                                                       │ Federated Weights
                         ┌─────────────────────────────┴─────────────────────────────┐
                         ▼                                                           ▼
       ┌──────────────────────────────────┐                        ┌──────────────────────────────────┐
       │   State Node A (Maharashtra)     │                        │    State Node B (Karnataka)      │
       │   Local Model Training & DB      │                        │    Local Model Training & DB     │
       └─────────────────┬────────────────┘                        └─────────────────┬────────────────┘
                         │                                                           │
          ┌──────────────┴──────────────┐                             ┌──────────────┴──────────────┐
          ▼                             ▼                             ▼                             ▼
  ┌──────────────┐              ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
  │ District CMO │              │ District CMO │              │ District CMO │              │ District CMO │
  │  (Pune Div)  │              │ (Nashik Div) │              │(Bengaluru R) │              │ (Mysuru Div) │
  └───────┬──────┘              └───────┬──────┘              └───────┬──────┘              └───────┬──────┘
          │                             │                             │                             │
    ┌─────┴─────┐                 ┌─────┴─────┐                 ┌─────┴─────┐                 ┌─────┴─────┐
    ▼           ▼                 ▼           ▼                 ▼           ▼                 ▼           ▼
 ┌─────┐     ┌─────┐           ┌─────┐     ┌─────┐           ┌─────┐     ┌─────┐           ┌─────┐     ┌─────┐
 │ PHC │     │ PHC │           │ PHC │     │ PHC │           │ PHC │     │ PHC │           │ PHC │     │ PHC │
 │ 001 │     │ 002 │           │ 003 │     │ 004 │           │ 005 │     │ 006 │           │ 007 │     │ 008 │
 └─────┘     └─────┘           └─────┘     └─────┘           └─────┘     └─────┘           └─────┘     └─────┘
    ▲           ▲
    └──[ PuLP Localized Redistribution Loop ]
```

---

## 💻 Technology Stack

### Backend & ML Services
- **Framework**: [FastAPI](https://fastapi.tiangolo.com) (Python 3.10+) with high-concurrency async endpoints.
- **Data Layer & ORM**: SQLAlchemy 2.0 with SQLite / PostgreSQL relational schemas.
- **Optimization Engine**: [PuLP](https://coin-or.github.io/pulp/) (Mixed-Integer Linear Programming with CBC solver).
- **ML & Data Processing**: Scikit-Learn, NumPy, Pandas (Time-series depletion, trend decomposition).
- **Federated Engine**: Federated Averaging (`FedAvg`) simulation engine with differential privacy weights.
- **Validation**: Pydantic v2 Settings & Models.

### Frontend Application
- **Core**: React 18 (SPA Architecture) with Vite build system.
- **Icons & Visuals**: [Lucide React](https://lucide.dev) & Custom SVG Canvas charts.
- **Animations**: GSAP (GreenSock Animation Platform) for silky-smooth landing page micro-interactions.
- **Styling**: Vanilla CSS Design Tokens (Glassmorphism, High-contrast Healthcare UI, Responsive Grids).
- **Internationalization (i18n)**: Bilingual interface supporting **English** and **Hindi (हिन्दी)**.

---

## 👥 User Roles & Dashboard Capabilities

| Role | Target User | Key Actions & Tools |
| :--- | :--- | :--- |
| 🇮🇳 **National Health Authority** | Ministry Officials, DGHS | Monitor national medicine availability, track cross-state supply index, inspect Federated Learning convergence rounds. |
| 🏛️ **State Health Mission** | State Health Directors, NHM | Analyze district vulnerability heatmaps, oversee state-wide procurement buffers, monitor disease outbreak clusters. |
| 🩺 **District CMO** | Chief Medical Officers, DTOs | Review AI-generated redistribution proposals, approve/reject inter-PHC transport orders, manage stock buffer safety limits. |
| 🏥 **PHC Edge Portal** | Medical Officers, Pharmacists | Offline-capable medicine dispensing, daily patient footfall entry, local stockout countdown, real-time alert acknowledgements. |
| 🚨 **Emergency Ops Mode** | Disaster Management / Epidemic Squad | Instant crisis mobilization, surge capacity override, priority routing of vaccines and critical emergency fluids. |
| ⚙️ **Developer / Admin Sandbox** | System Architects & Evaluators | Trigger synthetic outbreak stress tests, re-seed demo databases, test live edge-sync queues, inspect model loss curves. |

---

## 📂 Project Directory Structure

```
SwasthyaSetu-AI/
├── backend/
│   ├── app/
│   │   ├── api/                  # API routers (PHCs, Alerts, Forecasting, Redistribution, Dev)
│   │   ├── core/                 # Config settings & system constants
│   │   ├── db/                   # Database session and base configuration
│   │   ├── models/               # SQLAlchemy models (PHC, MedicineStock, Alerts, Transfers)
│   │   └── schemas/              # Pydantic data validation schemas
│   ├── main.py                   # FastAPI server entry point + React SPA static file handler
│   └── requirements.txt          # Python backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, Stats Cards, Panels, Modals)
│   │   ├── pages/                # Role dashboards (Landing, National, State, District, PHC, Admin)
│   │   ├── services/             # API client & Offline LocalStorage sync manager
│   │   └── styles/               # Global CSS design tokens, themes & layout styling
│   ├── index.html                # Single Page App HTML template
│   ├── package.json              # Frontend scripts & NPM dependencies
│   └── vite.config.js            # Vite configuration
│
├── ml/
│   ├── alerts/                   # Early warning threshold & risk calculation algorithms
│   ├── federated/                # FedAvg simulation engine for privacy-preserving training
│   ├── forecasting/              # Multi-horizon time-series depletion forecast engine
│   └── redistribution/           # PuLP MILP optimizer for route and transfer allocation
│
├── db/
│   └── seed_data.py              # Realistic synthetic generator (3 States, 15 Districts, 150 PHCs)
│
├── docs/
│   ├── integration_abdm.md       # Ayushman Bharat Digital Mission (ABDM) integration guide
│   ├── integration_evin.md       # eVIN Cold-Chain Telemetry ingestion guide
│   └── integration_hmis.md       # HMIS historical footfall pipeline specification
│
├── .gitignore                    # Git ignore configuration
├── package.json                  # Root monorepo script runner
└── README.md                     # Project master documentation
```

---

## 🚀 Quickstart & Local Setup Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.x` or higher
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/rudraa0604/Swasthya-Setu-AI.git
cd Swasthya-Setu-AI
```

### Step 2: Set Up Backend
```bash
# Create and activate a Python virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Seed the database with 150 simulated PHCs across 3 States
python -m db.seed_data
```

### Step 3: Set Up Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 4: Run the Application
```bash
# Run the FastAPI server (serves both API and Frontend)
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Now open your browser and visit: **`http://localhost:8000`** 🎉

*(For independent frontend hot-reloading during development, run `npm run dev` inside `/frontend` on port 3000).*

---

## 🌐 Cloud Deployment on Render

This repository is optimized for **Single-Service Full-Stack Deployment** on [Render](https://render.com).

### Render Web Service Configuration:
1. Create a **New Web Service** and link this repository.
2. Fill in the following deployment parameters:

| Field | Value |
| :--- | :--- |
| **Name** | `swasthya-setu-ai` |
| **Environment** | `Python 3` |
| **Region** | Singapore / Frankfurt / Oregon |
| **Branch** | `main` |
| **Build Command** | `npm --prefix frontend install && npm --prefix frontend run build && pip install -r backend/requirements.txt && python -m db.seed_data` |
| **Start Command** | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

### Environment Variables:
| Variable Key | Value | Purpose |
| :--- | :--- | :--- |
| `PYTHONPATH` | `.` | Ensures root-level module resolution |
| `DATABASE_URL` | `sqlite:///./swasthya_setu.db` | Default database connection string |
| `PYTHON_VERSION` | `3.10.12` | Specifies runtime Python version |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server & database health status |
| `GET` | `/api/phcs/rollup/national` | National aggregate metrics (Stock health, alerts count) |
| `GET` | `/api/phcs/?state_id=ST-MH` | List PHCs filtered by state or district |
| `GET` | `/api/phcs/{phc_id}` | Detailed status of a single PHC (stock, beds, staff) |
| `GET` | `/api/forecast/{phc_id}?horizon_days=14` | 14-day demand forecast & depletion curves |
| `GET` | `/api/alerts/` | List active early warning shortage alerts |
| `POST` | `/api/alerts/scan-all` | Run automated stock-out vulnerability scan across all PHCs |
| `GET` | `/api/redistribution/recommendations` | Get pending MILP redistribution transfer proposals |
| `POST` | `/api/redistribution/generate` | Trigger the PuLP optimizer to compute optimal transfers |
| `PUT` | `/api/redistribution/recommendations/{id}/action` | Approve / Reject a transfer proposal (Human-in-the-loop) |
| `GET` | `/api/federated/status` | Current federated training accuracy and state node weights |
| `POST` | `/api/federated/simulate?rounds=5` | Run FedAvg multi-state federated learning simulation |
| `POST` | `/api/sync/batch` | Synchronize offline queue items from edge PHC devices |
| `POST` | `/api/dev/trigger-outbreak` | Simulate an epidemic demand spike for stress-testing |

---

## 🧪 Simulation & Stress-Testing Suite

To experience the platform's reactive intelligence:
1. Open the **Developer Admin Panel** (`/developer-admin`).
2. Click **"Trigger Outbreak Stress Test"** (e.g., Dengue surge in Pune, MH).
3. Observe how consumption jumps by $300\%$, triggering **Early Warning Alerts**.
4. Go to the **District Dashboard** and click **"Generate AI Redistribution"**.
5. Watch the **PuLP Optimizer** identify neighboring PHCs with surplus Paracetamol & Saline and compute optimal, minimum-distance transfer routes.
6. Approve the recommendation and watch both clinics return to stable inventory equilibrium.

---

## 📜 License & Acknowledgements

- **License**: MIT Open Source License.
- **Designed For**: National Digital Health Hackathons, Ayushman Bharat Digital Mission (ABDM) innovations, and Indian Public Health System strengthening.
- **Built With Pride for India's Healthcare Heroes.** 🇮🇳
