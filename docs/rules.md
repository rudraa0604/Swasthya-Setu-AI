# Rules — SwasthyaSetu AI
**Rules the coding agent (Antigravity) must follow throughout this project.**

## 1. Scope Discipline
- This is a **hackathon MVP**, not a production system. Do not over-engineer.
- Simulate at the scale of **3 states × 5 districts × ~10 PHCs**. Never attempt
  full-India scale data or infrastructure.
- If a feature in prd.md is marked "Out of Scope," do not implement it unless
  explicitly asked.

## 2. Critical Design Constraints (never violate these)
- **No auto-execution of resource transfers.** The redistribution engine only
  ever produces a *recommendation* with status `pending`. A transfer only
  becomes `approved` via an explicit human action (simulated District Officer
  approval in the UI).
- **Federated learning must never centralize raw data.** Only model weights
  (or gradients) cross state boundaries in code. If you ever find yourself
  writing code that sends raw PHC/patient-level rows to the national layer,
  stop and flag it — that violates the core architecture.
- **Offline-first for PHC data entry.** Any PHC-facing data entry UI must
  queue writes locally and sync later — never assume constant connectivity.

## 3. Code Structure
- Follow the folder structure defined in architecture.md exactly:
  `/backend`, `/frontend`, `/ml`, `/db`, `/docs`
- Keep forecasting, redistribution optimization, and federated learning as
  **separate, independently testable modules** inside `/ml` — do not couple
  them into one monolithic script.
- Use clear, consistent naming: `snake_case` for Python, `camelCase` for
  JS/TS, `PascalCase` for React components.

## 4. Data & Privacy
- All simulated data must be clearly marked as synthetic (e.g., a
  `is_simulated: true` flag or a `SIMULATED_DATA` banner in the dashboard).
- Never hardcode or fabricate real patient names, real PHC identifiers, or
  real government data as if it were authentic — use clearly fictional
  district/state names or label real Indian state/district names as
  "simulated for demo purposes."

## 5. Explainability
- Every AI output (forecast, alert, redistribution recommendation) must be
  shown to the user with a short explanation of *why* (e.g., "Recommended
  because District A has 87% stock-out probability in 5 days and District B
  has 3,200 surplus units 40km away"). Never show a bare number with no reasoning.

## 6. Incremental Development
- Follow phases.md in order. Do not jump ahead to Phase 4 before Phase 1–3
  are functional and demonstrable.
- After each phase, produce a short status summary: what works, what's
  mocked/simulated, what's left.
- Prefer a working, simpler version over an incomplete, ambitious one —
  a full pipeline with basic models beats a broken pipeline with fancy ones.

## 7. Communication Style (for the agent)
- Before writing code for a new phase, restate what you're about to build
  in 2–3 sentences and confirm it matches phases.md.
- If any requirement is ambiguous, make a reasonable assumption, state it
  explicitly, and proceed — do not block on clarifying questions unless
  truly necessary.
- Do not silently skip a requirement from prd.md — if something is
  deprioritized due to time, say so explicitly.

## 8. Testing & Demo-Readiness
- Every module must have at least a minimal smoke test or a demo script
  that proves it works end-to-end with simulated data.
- Prioritize a working **demo path**: seed data → forecast → alert →
  redistribution recommendation → (simulated) approval → dashboard update.
  This full loop must work before polishing UI further.

## 9. Attribution & Honesty
- Do not claim integration with real eVIN/ABDM/HMIS APIs unless actually
  implemented — document these as "designed for integration with X" instead.
- Do not fabricate accuracy numbers for the forecasting model — report
  actual metrics computed on the simulated dataset.
