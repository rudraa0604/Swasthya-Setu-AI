# Design — SwasthyaSetu AI
**UI/UX guidelines for the dashboard and PHC edge app.**

## 1. Design Principles

- **Clarity over decoration.** This is a decision-support tool for health
  officers under time pressure — every screen should answer "what needs my
  attention right now?" within 3 seconds.
- **Status at a glance.** Use consistent color coding everywhere:
  - 🟢 Green = healthy / sufficient stock or staffing
  - 🟡 Yellow = warning / approaching threshold
  - 🔴 Red = critical / stock-out imminent or occurred
- **Explain every AI output.** No number appears without a one-line reason
  next to it (see rules.md §5).
- **Progressive disclosure.** National view shows aggregates; drill down to
  state → district → PHC for detail. Never dump PHC-level granularity on
  the national dashboard by default.

## 2. Screens

### 2.1 National Dashboard
- Top summary cards: Total PHCs monitored, Active critical alerts, Pending
  redistribution recommendations, States in Emergency Mode
- India map (state-level choropleth) color-coded by aggregate risk level
- Table: top 10 highest-urgency alerts across the country
- Toggle: "Federated Model Status" panel showing last sync round, states
  participating, global model accuracy trend (this is your differentiator —
  give it real visual space, don't hide it in a settings tab)

### 2.2 State Dashboard
- District-level map/list, same color coding
- State's local model training status (federated learning round info)
- List of pending redistribution recommendations awaiting district approval

### 2.3 District Dashboard
- List of PHCs in the district with stock/bed/staff status
- Redistribution recommendations: approve/reject buttons, with the
  optimizer's reasoning shown (distance, urgency, cost)
- Footfall trend chart (to visually justify outbreak alerts)

### 2.4 PHC Detail View
- Medicine stock table: current qty, consumption rate, forecasted stock-out date
- Bed availability (total vs occupied, ICU separately)
- Staff attendance today vs sanctioned strength
- Forecast chart: predicted demand curve vs current stock line (visually
  shows when they'll cross = stock-out)

### 2.5 PHC Edge Data-Entry App (offline-first)
- Extremely simple, large-tap-target form: select medicine → enter
  quantity used/received → submit
- Clear "Saved locally, will sync when online" indicator when offline
- Sync status icon always visible (online/offline/syncing)
- Minimal text, icon-heavy — designed for fast entry, not analysis

### 2.6 Emergency Mode View
- Full-screen takeover style, high contrast
- Only shows: critical medicines, ICU bed availability, available
  specialist staff, active redistribution recommendations for the
  outbreak-affected district(s)
- Large "Approve Transfer" actions front and center

## 3. Visual Language

- **Typography**: one clean sans-serif (e.g., Inter) — headings bold,
  body regular. Avoid more than 2 font weights on any screen.
- **Color palette**: neutral background (white/light gray), status colors
  reserved strictly for the green/yellow/red system above — don't use red
  or green decoratively elsewhere, or the status signal gets diluted.
- **Charts**: line charts for forecast-vs-stock, bar charts for
  district/state comparisons, choropleth map for geographic risk —
  keep chart types consistent across similar data so users pattern-match fast.
- **Iconography**: use simple, universally recognizable icons (pill bottle
  for medicine, bed icon for beds, person icon for staff) — this matters
  for PHC staff with varying literacy levels.

## 4. Accessibility & Localization
- All labels in English + Hindi (toggle or dual display)
- High color contrast (don't rely on color alone — pair color with
  icon/text label for colorblind accessibility)
- PHC edge app must work on low-end Android devices / small screens —
  design mobile-first for that screen specifically

## 5. What to Avoid
- Don't build a "chatbot" interface as the primary interaction — this is a
  monitoring/decision tool, not a conversational assistant.
- Don't overload the national dashboard with every possible metric —
  ruthlessly prioritize the 4–5 numbers a national officer actually needs
  during an emergency.
- Don't animate transitions heavily — this tool may be used on low-bandwidth
  connections; keep it fast and light.
