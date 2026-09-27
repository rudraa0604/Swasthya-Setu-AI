# PRD — SwasthyaSetu AI
**Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience**

Theme: Resilience | Hackathon MVP

---

## 1. Problem Statement

Public healthcare systems across India face persistent supply chain vulnerabilities.
There is no real-time visibility into:
- Medicine stock levels across Primary Health Centres (PHCs)
- Patient footfall and resource utilisation
- Bed availability
- Medical personnel attendance

This leads to **stock-outs in one district while surplus sits unused in another**,
and limits India's capacity to respond fast during health emergencies (outbreaks,
epidemics, natural disasters).

## 2. Goal

Build a **federated AI platform** that gives real-time visibility, forecasts demand,
generates early warnings for stock-outs, and recommends automated cross-district
resource redistribution — while keeping raw health data local to each state
(privacy-preserving, federated learning across states).

## 3. Target Users

| User | Need |
|---|---|
| PHC Staff (nurse/pharmacist) | Log stock, attendance, patient footfall — fast, offline-capable |
| District Health Officer | See district-wide stock/bed/staff status, approve/reject redistribution recommendations |
| State Health Department | Monitor state-wide trends, train local model, share model updates nationally |
| National Health Ministry (NHM-level) | National dashboard, cross-state resilience view, outbreak-level emergency mode |

## 4. Core Features (MVP scope)

### 4.1 Real-Time Visibility Dashboard
- Medicine stock per PHC (current qty, consumption rate)
- Bed availability per PHC
- Staff attendance per PHC (doctors/nurses present vs sanctioned)
- Roll-up views: PHC → District → State → National

### 4.2 Demand Forecasting Engine
- Predict medicine demand per PHC per medicine, next 7/14/30 days
- Predict stock-out date and stock-out probability
- Factor in: consumption trend, seasonality, disease-outbreak signal, population

### 4.3 Early Warning System
- Threshold-based alerts (stock below X% of buffer)
- Forecast-based alerts ("87% probability of stock-out in 5 days")
- Outbreak-triggered alerts (footfall/disease-case spike in a district)
- Alerts for beds and staffing shortfalls too, not just medicine

### 4.4 Cross-District Redistribution Recommender
- Detects shortage PHC + nearby surplus PHC/district
- Recommends transfer quantity, considering:
  - distance/transport time
  - urgency (days-to-stock-out)
  - shelf life / expiry of medicine batch
- **Human-in-the-loop**: recommends, does NOT auto-execute transfers
  (District Officer must approve)

### 4.5 Federated Predictive Modelling
- Each state trains its forecasting model on its own local data
- Only model weight updates are shared with the national aggregator
- Raw patient/stock-level data never leaves the state server
- National model is periodically redistributed back to states (improves
  forecasting even for data-sparse states)

### 4.6 Emergency Mode
- Triggered manually or by outbreak-detection signal
- Switches dashboard to prioritized view: critical medicines, ICU beds,
  available specialist staff, active redistribution recommendations

## 5. Out of Scope (for hackathon MVP)

- Full India-scale rollout (use 2–3 simulated states, 5–10 districts)
- Auto-executing transfers without human approval
- Full ABDM/eVIN/HMIS live integration (mock/simulate the interface, document
  how real integration would work)
- Mobile app — a responsive web dashboard is enough for demo
- Multi-language support beyond English + Hindi labels

## 6. Success Metrics (for demo/judging)

- Forecasting model correctly flags a simulated stock-out before it happens
- Redistribution engine produces a sensible, cost-aware transfer recommendation
- Federated learning demo visibly shows: local training → weight sharing only →
  aggregated model improves accuracy across all simulated states
- Dashboard clearly shows PHC → District → State → National rollup
- System works with intermittent/offline PHC data entry (sync-on-reconnect)

## 7. Key Differentiators to Emphasize

1. **Predict → Detect → Recommend → Redistribute** pipeline (not just a CRUD dashboard)
2. Real federated learning demo (data stays local, only weights travel)
3. Redistribution as a constrained optimization problem, not a naive lookup
4. Offline-first PHC data entry (realistic for rural connectivity)
5. Positioned as a layer on top of existing systems (eVIN, HMIS, ABDM) —
   not a from-scratch replacement
