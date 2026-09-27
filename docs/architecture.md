# Architecture — SwasthyaSetu AI

## 1. System Overview (4-Layer Federated Architecture)

```
                    ┌───────────────────────────────┐
                    │   NATIONAL AGGREGATION LAYER   │
                    │  (Federated Model Aggregator,  │
                    │   National Dashboard, Redistribution │
                    │   Optimizer across states)     │
                    └───────────────┬─────────────────┘
                                    │ model weights only
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
     │  STATE NODE A    │  │  STATE NODE B    │  │  STATE NODE C    │
     │ Local model      │  │ Local model      │  │ Local model      │
     │ training +       │  │ training +       │  │ training +       │
     │ state dashboard  │  │ state dashboard  │  │ state dashboard  │
     └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
              ▼                     ▼                     ▼
     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
     │ District Nodes   │  │ District Nodes   │  │ District Nodes   │
     │ (aggregate PHCs) │  │ (aggregate PHCs) │  │ (aggregate PHCs) │
     └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
              ▼                     ▼                     ▼
     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
     │  PHC Edge App    │  │  PHC Edge App    │  │  PHC Edge App    │
     │ (offline-first,  │  │ (offline-first,  │  │ (offline-first,  │
     │  syncs on connect)│ │  syncs on connect)│ │  syncs on connect)│
     └──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Key principle:** Raw stock/patient data never crosses a state boundary.
Only aggregated model weights (federated learning) and aggregated,
non-sensitive stock-level summaries (for redistribution matching) move
between layers.

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| PHC Edge App | React PWA (or Flutter) + IndexedDB/SQLite | Offline-first, syncs when online |
| Backend API | FastAPI (Python) | REST APIs for CRUD, forecasting, alerts |
| Database | PostgreSQL + TimescaleDB extension | Time-series stock/consumption data |
| Forecasting | Prophet (baseline) / XGBoost (advanced) | Per PHC × medicine forecasting |
| Federated Learning | Flower (`flwr`) | Simulated multi-state federated rounds |
| Redistribution Optimizer | PuLP or Google OR-Tools | Linear programming / transportation problem |
| Frontend Dashboard | React + Recharts/Plotly + Mapbox | National/State/District/PHC views |
| Auth/Roles | JWT-based, role = PHC staff / District Officer / State Admin / National Admin | |
| Deployment (demo) | Docker Compose (local) | Simulate 3 "state" containers + 1 national aggregator |

## 3. Data Model (Core Entities)

```
PHC (id, name, district_id, state_id, lat, lng, sanctioned_staff_count)
MedicineStock (id, phc_id, medicine_name, batch_id, quantity, expiry_date, last_updated)
ConsumptionLog (id, phc_id, medicine_name, date, quantity_used)
BedStatus (id, phc_id, total_beds, occupied_beds, icu_beds, icu_occupied, timestamp)
StaffAttendance (id, phc_id, staff_id, role, date, present_boolean)
PatientFootfall (id, phc_id, date, patient_count, suspected_disease_tags)
Alert (id, phc_id, type[stock/bed/staff/outbreak], severity, message, created_at, resolved_boolean)
RedistributionRecommendation (id, from_phc_id, to_phc_id, medicine_name, quantity,
                                urgency_score, transport_distance_km, status[pending/approved/rejected], created_at)
FederatedModelUpdate (id, state_id, round_number, model_weights_ref, accuracy_metric, timestamp)
```

## 4. Forecasting Approach

- Input features: historical daily consumption, day-of-week/seasonality,
  recent footfall trend, disease-outbreak flag, population served
- Model: Prophet for baseline time-series (fast, interpretable) — upgrade to
  XGBoost with lag features if time permits
- Output: predicted daily demand for next N days + stock-out date +
  stock-out probability (based on current stock vs predicted depletion curve)

## 5. Redistribution Optimizer

Framed as a **transportation problem**:
- **Supply nodes**: PHCs with surplus (stock above buffer threshold)
- **Demand nodes**: PHCs with predicted deficit
- **Cost**: transport distance/time between nodes
- **Constraints**:
  - Cannot exceed available surplus
  - Cannot ship less than deficit needed (or partial-fill if no full match)
  - Medicine must not expire before estimated arrival + use
- **Objective**: minimize total transport cost while resolving maximum
  urgency-weighted deficit
- Output: ranked list of recommended transfers, each requiring District
  Officer approval before execution

## 6. Federated Learning Flow

1. National aggregator initializes a global forecasting model
2. Global model weights sent to each State Node
3. Each State Node trains locally on its own PHC-aggregated data
   (data never leaves the state)
4. State Node sends back only updated model weights + accuracy metric
5. National aggregator performs federated averaging (FedAvg) across states
6. Updated global model redistributed to all states — repeat each round

For the hackathon demo: simulate 3 state nodes as separate processes/containers
using the Flower framework's simulation mode, with synthetic per-state datasets.

## 7. Integration Points (documented, not necessarily built)

- **eVIN**: vaccine-specific stock/cold-chain data — SwasthyaSetu AI's medicine
  stock tracking would ingest this feed as an existing data source
- **ABDM**: FHIR-based interoperability standard — data schema should be
  designed to be ABDM-compatible for real-world plausibility
- **HMIS**: existing health management information system — footfall/patient
  data could source from here

## 8. Offline-First Design (PHC Edge Layer)

- PHC app stores entries locally (IndexedDB/SQLite) when offline
- Background sync pushes queued entries when connectivity returns
- Conflict resolution: last-write-wins with timestamp, flagged for review
  if conflicting entries exist
- SMS/USSD fallback path documented as a future extension for zero-connectivity PHCs
