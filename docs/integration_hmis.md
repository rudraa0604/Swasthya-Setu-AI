# Integration Guide: HMIS (Health Management Information System)

## 1. Overview
HMIS is the standard reporting portal for monthly/daily health statistics across Indian states.

## 2. Ingestion Pipeline
- **Inputs**: Outpatient / Inpatient footfall counts, disease syndromic surveillance indicators (IDSP alerts, viral fevers, ARI, vector-borne outbreaks).
- **Processing**:
  - Ingested as `patient_footfalls`.
  - Machine learning anomaly detector (`/ml/alerts`) detects spikes (> 2.5 standard deviations above 30-day moving average).
  - Outbreak signals immediately feed into demand multipliers for associated medicines (e.g. Paracetamol, ORS, Doxycycline, IV Fluids).
