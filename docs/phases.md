# Phases — SwasthyaSetu AI
**Implementation roadmap. Build strictly in this order.**

---

## Phase 0 — Setup (30–60 min)
- Scaffold repo structure: `/backend`, `/frontend`, `/ml`, `/db`, `/docs`
- Set up PostgreSQL (or SQLite for speed) with schema from architecture.md
- Set up FastAPI skeleton with health-check endpoint
- Set up React app skeleton
- **Deliverable**: empty-but-running stack (backend responds, frontend loads)

---

## Phase 1 — Core Data Layer (2–3 hrs)
- Implement data models: PHC, MedicineStock, ConsumptionLog, BedStatus,
  StaffAttendance, PatientFootfall
- Build a **synthetic data generator**: 3 states × 5 districts × ~10 PHCs,
  with realistic-looking daily consumption patterns, occasional stock dips,
  and one simulated "outbreak" event in one district
- Build basic CRUD APIs for all entities
- Build a minimal PHC data-entry form (with offline queue using
  IndexedDB/localStorage-equivalent, sync-on-reconnect)
- **Deliverable**: seeded database + working CRUD APIs + basic entry form

---

## Phase 2 — Forecasting Engine (2–3 hrs)
- Build the demand forecasting module (`/ml/forecasting`) using Prophet
  (or XGBoost) on the synthetic consumption data
- For each PHC × medicine: predict next 7/14/30-day demand, stock-out date,
  stock-out probability
- Expose forecasting results via API (`/api/forecast/{phc_id}`)
- **Deliverable**: forecasting API returning real predictions on synthetic data,
  with a basic accuracy check (e.g., holdout validation)

---

## Phase 3 — Early Warning + Redistribution (2–3 hrs)
- Build alert generation logic (`/ml/alerts`): threshold-based + forecast-based
  + outbreak-triggered (footfall spike detection)
- Build the redistribution optimizer (`/ml/redistribution`) using PuLP/OR-Tools:
  match shortage PHCs to surplus PHCs factoring distance, urgency, expiry
- Expose via API: `/api/alerts`, `/api/redistribution/recommendations`
- Build simple approval workflow: recommendation → District Officer
  approve/reject (UI + API status update)
- **Deliverable**: end-to-end pipeline — simulated stock drop → alert fires →
  redistribution recommendation generated → approvable in UI

---

## Phase 4 — Federated Learning Demo (2–4 hrs)
- Set up Flower (`flwr`) simulation with 3 "state" clients, each holding its
  own slice of synthetic data
- Each client trains a local forecasting model; only weights are shared with
  the Flower server (federated averaging)
- Log and visualize: per-round accuracy improvement of the *global* model vs
  any single state's *local-only* model (to prove federation adds value)
- **Deliverable**: runnable federated learning script/notebook + a results
  chart showing global model outperforming local-only models

---

## Phase 5 — Dashboard + Emergency Mode (2–3 hrs)
- Build National / State / District / PHC dashboard views (per design.md)
- Wire dashboard to backend APIs: stock levels, bed status, staff attendance,
  active alerts, pending redistribution recommendations
- Build "Emergency Mode" toggle: reprioritizes view to critical medicines,
  ICU beds, outbreak-affected districts
- Add a map view (Mapbox) showing PHC locations color-coded by risk level
- **Deliverable**: fully clickable dashboard demoing the whole pipeline visually

---

## Phase 6 — Polish & Pitch Prep (1–2 hrs)
- Write a 2-minute demo script walking through: Predict → Detect →
  Recommend → Redistribute, plus the federated learning proof
- Add a "Simulated Data" banner and an "Integrates with eVIN / ABDM / HMIS"
  note on the dashboard for credibility
- Prepare 5–8 slide deck (problem, architecture diagram, federated learning
  explanation, live demo, impact, roadmap beyond hackathon)
- Do a final pass against rules.md as a checklist

---

## Time Budget Guide (for a ~24hr hackathon)
| Phase | Hours |
|---|---|
| 0. Setup | 0.5–1 |
| 1. Core Data Layer | 2–3 |
| 2. Forecasting | 2–3 |
| 3. Alerts + Redistribution | 2–3 |
| 4. Federated Learning | 2–4 |
| 5. Dashboard | 2–3 |
| 6. Polish + Pitch | 1–2 |
| **Total** | **~12–19 hrs** (leaves buffer for debugging/sleep) |

If time is short, cut scope in this order: Emergency Mode map view →
multi-medicine forecasting (keep to 2–3 medicines) → federated learning
rounds (reduce to 2 rounds, 3 clients) — but never cut Phase 3
(redistribution) or Phase 4 (federated learning), since those are the
core differentiators.
