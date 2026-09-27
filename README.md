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
  - [6. Full Multilingual i18n Support (11 Indian Languages)](#6-full-multilingual-i18n-support-11-indian-languages)
  - [7. National Health Ecosystem Integrations (ABDM / eVIN / HMIS)](#7-national-health-ecosystem-integrations-abdm--evin--hmis)
- [🏗️ System Architecture & Data Flow](#️-system-architecture--data-flow)
- [👥 Role-Based Operational Stations](#-role-based-operational-stations)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quickstart & Local Setup Guide](#-quickstart--local-setup-guide)
- [🧪 Full System Verification Suite](#-full-system-verification-suite)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [👥 Development Team](#-development-team)
- [📜 License & Acknowledgements](#-license--acknowledgements)

---

## 📖 Executive Overview

**SwasthyaSetu AI (स्वास्थ्य सेतु AI)** is a state-of-the-art, privacy-preserving clinical supply-chain intelligence and resource redistribution platform designed specifically for India's **Primary Health Centre (PHC)** and **Community Health Centre (CHC)** network.

In India's tiered public healthcare system, rural PHCs frequently experience acute stock-outs of life-saving medicines (e.g., Anti-Rabies Vaccines, Insulin, ORS, Antibiotics, IV Saline) due to sudden demand spikes, seasonal epidemic outbreaks, delayed supply replenishment, and communication silos between neighboring districts. 

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

### 6. Full Multilingual i18n Support (11 Indian Languages)
- Fully reactive, zero-reload internationalization support across 11 official regional languages:
  - 🌐 **English** (`en`)
  - 🇮🇳 **हिन्दी / Hindi** (`hi`)
  - 🇮🇳 **मराठी / Marathi** (`mr`)
  - 🇮🇳 **ગુજરાતી / Gujarati** (`gu`)
  - 🇮🇳 **বাংলা / Bengali** (`bn`)
  - 🇮🇳 **தமிழ் / Tamil** (`ta`)
  - 🇮🇳 **తెలుగు / Telugu** (`te`)
  - 🇮🇳 **ಕನ್ನಡ / Kannada** (`kn`)
  - 🇮🇳 **മലയാളം / Malayalam** (`ml`)
  - 🇮🇳 **ਪੰਜਾਬੀ / Punjabi** (`pa`)
  - 🇮🇳 **ଓଡ଼ିଆ / Odia** (`or`)

### 7. National Health Ecosystem Integrations (ABDM / eVIN / HMIS)
- **ABDM (Ayushman Bharat Digital Mission)**: Adheres to standard facility registries and M1/M2/M3 consent architectures.
- **eVIN (electronic Vaccine Intelligence Network)**: Ingests IoT cold-chain temperature telemetry to detect temperature breaches.
- **HMIS (Health Management Information System)**: Ingests monthly disease surveillance summaries and seasonal epidemiological footfall data.

---

## 👥 Role-Based Operational Stations

| Station Role | Target Users | Primary Functional Capabilities |
| :--- | :--- | :--- |
| 🏥 **PHC / CHC Edge Terminal** | Rural Doctors & Pharmacists | Offline-first medicine dispensing, batch reception, footfall logging, local inventory ledger. |
| 📍 **District Health Officer (DHO)** | District CMOs & Drug Inspectors | District triage, shortage monitoring, reviewing and approving AI-generated stock transfers. |
| 🏢 **State Health Directorate** | State Health Commissioners | Multi-district oversight (50 PHCs), local state AI model training, emergency state escalation. |
| 🌐 **National Ministry Overwatch** | NHM Central Command | National health risk maps, national emergency override, global FedAvg model weight aggregation. |
| ⚙️ **Developer / Admin Sandbox** | System Architects & Evaluators | Synthetic outbreak injection, database re-seeding, live CRUD for facilities & stocks, loss curves inspection. |

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
│   ├── public/
│   │   ├── assets/               # Branding logos, icons, favicons
│   │   └── frames/               # 3D canvas sequence frames for interactive landing experience
│   ├── src/
│   │   ├── components/           # Reusable UI widgets (LanguageSelector, Header, Charts, Panels)
│   │   ├── pages/                # Dashboards (Landing, Login, National, State, District, PHC, Dev)
│   │   ├── services/             # API client, i18n translation tables (11 languages), sync engine
│   │   └── styles/               # Glassmorphic CSS tokens & responsive mobile breakpoints
│   ├── index.html                # Single Page Application HTML entry
│   ├── package.json              # NPM dependencies & scripts
│   └── vite.config.js            # Vite bundler & API proxy configuration
│
├── ml/
│   ├── alerts/                   # Early warning threshold & multi-factor anomaly algorithms
│   ├── federated/                # Flower-compatible FedAvg simulation across state nodes
│   ├── forecasting/              # Multi-horizon statistical depletion forecast engine
│   └── redistribution/           # PuLP MILP linear transportation route optimization
│
├── db/
│   ├── schema.sql                # Relational database schema definition
│   └── seed_data.py              # Realistic synthetic generator (3 States, 15 Districts, 150 PHCs)
│
├── docs/
│   ├── architecture.md           # Deep architectural specification
│   ├── design.md                 # UI/UX design tokens & layout guidelines
│   ├── phases.md                 # Development roadmap & milestones
│   ├── prd.md                    # Product Requirements Document
│   ├── rules.md                  # System design constraints & rules
│   ├── integration_abdm.md       # Ayushman Bharat Digital Mission integration guide
│   ├── integration_evin.md       # eVIN Cold-Chain Telemetry ingestion guide
│   └── integration_hmis.md       # HMIS historical footfall pipeline specification
│
├── verify_system.py              # End-to-end 5-phase system verification suite
├── package.json                  # Root runner script
├── brain.md                      # System brain specification
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

### Step 2: Set Up & Run Backend
```bash
# Create and activate Python virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Install Python backend & ML dependencies
pip install -r backend/requirements.txt

# Seed the database (150 PHCs, 1200 Stocks, Outbreak node in Nashik)
python -m db.seed_data

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --port 8000 --reload
```

### Step 3: Set Up & Run Frontend
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to: **`http://localhost:3000`** 🎉

---

## 🧪 Full System Verification Suite

You can execute the automated 5-phase verification test suite to validate database consistency, ML forecasting accuracy, early warning alert generation, PuLP optimization constraints, and federated training:

```bash
python verify_system.py
```

**Output:**
```
======================================================================
SWASTHYASETU AI — FULL SYSTEM VERIFICATION SUITE
======================================================================
[STEP 1] Testing Database Schema & Synthetic Data Seeding (Phase 1)...  -> PASSED
[STEP 2] Testing Demand Forecasting Engine (Phase 2)...                 -> PASSED
[STEP 3] Testing Early Warning Engine & Multi-Factor Alerts (Phase 3)..  -> PASSED
[STEP 4] Testing Redistribution Optimizer & Approval Flow (Phase 3).... -> PASSED
[STEP 5] Testing Multi-State Federated Learning Simulation (Phase 4)... -> PASSED
======================================================================
ALL VERIFICATION SUITE CHECKS PASSED SUCCESSFULLY! (100% DEMO READY)
======================================================================
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server & database health status |
| `GET` | `/api/phcs/rollup/national` | National aggregate metrics (Total PHCs, bed occupancy, risk states) |
| `GET` | `/api/phcs/?state_id=ST-MH` | List PHCs filtered by state or district |
| `GET` | `/api/phcs/{phc_id}` | Detailed telemetry of a single PHC (stocks, beds, staff, footfall) |
| `GET` | `/api/forecast/{phc_id}?horizon_days=14` | 14-day demand forecast trajectory & stock-out risk probability |
| `GET` | `/api/alerts/` | List active early warning shortage and outbreak alerts |
| `POST` | `/api/alerts/scan-all` | Trigger automated vulnerability scan across all PHCs |
| `GET` | `/api/redistribution/recommendations` | Get pending MILP redistribution transfer orders |
| `POST` | `/api/redistribution/generate` | Trigger the PuLP optimizer to compute optimal transfers |
| `PUT` | `/api/redistribution/recommendations/{id}/action` | Approve / Reject a transfer proposal (Human-in-the-loop) |
| `GET` | `/api/federated/status` | Current federated training round status & accuracy scores |
| `POST` | `/api/federated/simulate?rounds=5` | Run multi-state FedAvg weight aggregation simulation |
| `POST` | `/api/sync/batch` | Synchronize offline queue items from edge PHC devices |
| `POST` | `/api/dev/trigger-outbreak` | Inject simulated epidemic demand surge for stress testing |
| `POST` | `/api/dev/reseed-database` | Reset and re-seed the SQLite database with fresh synthetic data |

---

## 👥 Development Team

- **Rudra Pratap Chaurasiya** — *CSJMU KANPUR*
- **Sankalp Sachan** — *CSJMU KANPUR*
- **Mohammad Sirfan** — *CSJMU KANPUR*

---

## 📜 License & Acknowledgements

- **License**: MIT Open Source License.
- **Designed For**: National Digital Health Hackathons, Ayushman Bharat Digital Mission (ABDM) innovations, and strengthening India's Primary Healthcare Network.
- **Dedicated to India's Frontline Healthcare Heroes.** 🇮🇳