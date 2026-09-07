# Integration Guide: eVIN (electronic Vaccine Intelligence Network)

## 1. Overview
The electronic Vaccine Intelligence Network (eVIN) digitizes vaccine stocks and monitors the temperature of the cold chain across India. SwasthyaSetu AI is designed to seamlessly ingest eVIN telemetry as an auxiliary time-series data source.

## 2. Ingestion Pipeline
- **Endpoint**: eVIN REST API / Webhook subscriber
- **Payload Schema**:
  - `facility_id` (mapped to `phc_id`)
  - `vaccine_code` (e.g. `BCG`, `OPV`, `COVAXIN`, `COVISHIELD`)
  - `current_vial_stock`
  - `storage_temperature_celsius`
  - `cold_chain_alarm_flag`
- **Normalization**: Converted into `medicine_stocks` and cold-chain status monitoring metrics.

## 3. Resilience Advantage
When eVIN cold-chain alerts trigger (temperature breach), SwasthyaSetu AI marks the affected batch as compromised and immediately re-evaluates local stock depletion curves, proactively generating emergency redistribution recommendations from neighboring PHCs.
