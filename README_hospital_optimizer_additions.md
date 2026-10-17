# README Additions: Hospital Resource Optimization

Paste each block in the place shown in its heading.

---

## 1. Table of Contents (add under "Core Capabilities")

```md
  - [8. AI Hospital Resource Optimizer (Individual Hospital Tab)](#8-ai-hospital-resource-optimizer-individual-hospital-tab)
```

Also add this line in the Table of Contents after "Core Capabilities":

```md
- [🏨 AI Hospital Resource Optimization](#-ai-hospital-resource-optimization)
```

---

## 2. Executive Summary (add one bullet to the list)

```md
- Gives every individual hospital its own **AI Resource Optimization tab** that forecasts demand and recommends the best use of beds, ICU, operating rooms, staff and emergency resources.
```

---

## 3. Core Capabilities (add after "7. Multilingual Support")

```md
### 8. AI Hospital Resource Optimizer (Individual Hospital Tab)
- A separate tab inside each hospital's portal. SwasthyaSetu works at network level; this tab works **inside one hospital**.
- Predicts demand, then recommends the best allocation of beds, ICU, OTs, staff and emergency resources.
- Full details in the [AI Hospital Resource Optimization](#-ai-hospital-resource-optimization) section.
```

---

## 4. New Section (add after "Core Capabilities & AI Innovations")

```md
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
```

---

## 5. Role-Based Portals table (add one row)

```md
| 🏨 **Hospital Administrator** | Medical Superintendents, Hospital Admins, Ward Incharges | Demand forecast, bed & ICU allocation, OT scheduler, staff roster, emergency resource planner, what-if simulator, approve / reject AI recommendations. | `#/portal/hospital` |
```

---

## 6. Directory Structure (add these entries)

```md
├── ml/
│   └── hospital/
│       ├── demand_forecast/      # Prophet + XGBoost demand models
│       ├── bed_icu_optimizer/    # MILP bed & ICU allocation
│       ├── ot_scheduler/         # CP-SAT operating room scheduling
│       ├── staff_allocation/     # Shift & staff optimizer
│       ├── emergency_planner/    # Safety-stock & surge planner
│       └── rl_agent/             # RL policy + hospital simulator
```

Backend: `backend/app/api/hospital.py`
Frontend: `frontend/src/pages/HospitalPortal.jsx`

---

## 7. Technology Stack table (add one row)

```md
| **Hospital Optimization** | Prophet, XGBoost, PuLP, OR-Tools CP-SAT, Stable-Baselines3 (RL), SimPy (simulation) |
```

---

## 8. API Endpoints table (add these rows)

```md
| `GET` | `/api/hospital/{hospital_id}/forecast?horizon_days=14` | Forecast of admissions, ICU, ER, OT and staff demand |
| `GET` | `/api/hospital/{hospital_id}/resources` | Live status of beds, ICU, OTs, staff and emergency equipment |
| `POST` | `/api/hospital/{hospital_id}/optimize/beds` | Run bed & ICU allocation optimizer |
| `POST` | `/api/hospital/{hospital_id}/optimize/ot-schedule` | Generate optimized operating room schedule |
| `POST` | `/api/hospital/{hospital_id}/optimize/staff` | Generate staff roster recommendation |
| `GET` | `/api/hospital/{hospital_id}/emergency-readiness` | Emergency resource readiness and gaps |
| `POST` | `/api/hospital/{hospital_id}/simulate` | What-if scenario simulation (surge, outbreak, mass casualty) |
| `GET` | `/api/hospital/{hospital_id}/recommendations` | List pending AI recommendations |
| `PUT` | `/api/hospital/{hospital_id}/recommendations/{id}/action` | Approve / modify / reject (human-in-the-loop) |
```

---

## 9. Roadmap (add under Phase 2 / Phase 3)

```md
Phase 2: • Hospital Resource Optimizer pilot in district hospitals
Phase 3: • Hospital-level RL agents and cross-hospital federated learning
```
