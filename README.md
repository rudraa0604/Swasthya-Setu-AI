# SwasthyaSetu AI (स्वास्थ्य सेतु AI)
**Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience**

SwasthyaSetu AI is an intelligent, privacy-preserving decision-support platform designed for India's Primary Health Centre (PHC) network. It enables real-time visibility, automated demand forecasting, stock-out early warnings, and human-in-the-loop cross-district redistribution recommendations, while ensuring that raw patient and facility health data never leaves state boundaries.

---

## Directory Structure

```
/
├── backend/                  # FastAPI Application Layer
│   ├── app/
│   │   ├── api/              # REST Endpoints (PHC, Stock, Forecasts, Alerts, Redistribution, FL)
│   │   ├── core/             # Configuration & Security (JWT, settings)
│   │   ├── db/               # Database session & base configuration
│   │   ├── models/           # SQLAlchemy Data Models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # Business logic & ML bridges
│   ├── main.py               # FastAPI entrypoint
│   └── requirements.txt      # Python backend dependencies
│
├── ml/                       # Modular Machine Learning & Optimization Subsystems
│   ├── forecasting/          # Time-series demand forecasting & stock-out probability models
│   ├── alerts/               # Early warning detection (threshold + forecast + outbreak)
│   ├── redistribution/       # PuLP-based Transportation & Resource Allocation Optimizer
│   ├── federated/            # Flower-based multi-state privacy-preserving federated learning
│   └── common/               # Shared ML utilities, evaluation metrics & synthetic data logic
│
├── frontend/                 # Responsive React Web Application (Vite + Modern UI)
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (cards, maps, charts, bilingual labels)
│   │   ├── pages/            # National, State, District, PHC & Emergency Mode views
│   │   ├── services/         # API clients & Offline-first IndexedDB/LocalStorage sync
│   │   └── styles/           # Modern theme & responsive CSS design tokens
│   ├── index.html
│   └── package.json
│
├── db/                       # Database initialization & simulation scripts
│   ├── schema.sql            # PostgreSQL / TimescaleDB DDL schema
│   └── seed_data.py          # Synthetic data generator (3 states × 5 districts × 10 PHCs)
│
├── docs/                     # Architectural Documentation & Integration Blueprints
│   ├── architecture.md       # 4-layer federated system design
│   ├── integration_evin.md   # eVIN vaccine cold-chain integration guide
│   ├── integration_abdm.md   # ABDM FHIR interoperability specifications
│   └── integration_hmis.md   # HMIS footfall data pipeline design
│
└── README.md
```

---

## Core Pipeline

```
[ Real-Time Data Layer ] ──> [ Forecasting Engine ] ──> [ Early Warning System ] ──> [ Redistribution Optimizer ] ──> [ Human Approval ]
            ▲                                                                                                                   │
            └────────────────────── [ Federated Model Weight Updates (FedAvg) ] ────────────────────────────────────────────────┘
```
