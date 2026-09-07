-- SwasthyaSetu AI Database Schema
-- Compatible with PostgreSQL / TimescaleDB & SQLite

-- 1. Primary Health Centres (PHC)
CREATE TABLE IF NOT EXISTS phcs (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district_id VARCHAR(64) NOT NULL,
    district_name VARCHAR(255) NOT NULL,
    state_id VARCHAR(64) NOT NULL,
    state_name VARCHAR(255) NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    sanctioned_staff_count INT NOT NULL DEFAULT 10,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Medicine Stock
CREATE TABLE IF NOT EXISTS medicine_stocks (
    id VARCHAR(64) PRIMARY KEY,
    phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    batch_id VARCHAR(64) NOT NULL,
    quantity INT NOT NULL,
    buffer_threshold INT NOT NULL DEFAULT 100,
    daily_consumption_avg FLOAT NOT NULL DEFAULT 15.0,
    expiry_date DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Daily Consumption Log (Time-Series)
CREATE TABLE IF NOT EXISTS consumption_logs (
    id VARCHAR(64) PRIMARY KEY,
    phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    quantity_used INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bed Status & Occupancy
CREATE TABLE IF NOT EXISTS bed_statuses (
    id VARCHAR(64) PRIMARY KEY,
    phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    total_beds INT NOT NULL DEFAULT 20,
    occupied_beds INT NOT NULL DEFAULT 0,
    icu_beds INT NOT NULL DEFAULT 4,
    icu_occupied INT NOT NULL DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Staff Attendance Log
CREATE TABLE IF NOT EXISTS staff_attendances (
    id VARCHAR(64) PRIMARY KEY,
    phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    staff_id VARCHAR(64) NOT NULL,
    staff_name VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL, -- Doctor, Staff Nurse, Pharmacist, Lab Technician, ANM
    date DATE NOT NULL,
    present_boolean BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. Patient Footfall & Disease Signals (Time-Series)
CREATE TABLE IF NOT EXISTS patient_footfalls (
    id VARCHAR(64) PRIMARY KEY,
    phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    patient_count INT NOT NULL,
    suspected_disease_tags VARCHAR(255), -- e.g. "Dengue,Viral Fever"
    is_outbreak_spike BOOLEAN NOT NULL DEFAULT FALSE
);

-- 7. Early Warning Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL, -- stock, bed, staff, outbreak
    severity VARCHAR(16) NOT NULL, -- critical, warning, info
    message TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_boolean BOOLEAN DEFAULT FALSE
);

-- 8. Cross-District Redistribution Recommendations
CREATE TABLE IF NOT EXISTS redistribution_recommendations (
    id VARCHAR(64) PRIMARY KEY,
    from_phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    to_phc_id VARCHAR(64) NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    urgency_score FLOAT NOT NULL, -- 0.0 to 1.0 (higher = more urgent)
    transport_distance_km FLOAT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'pending', -- pending, approved, rejected, in_transit, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- 9. Federated Model Updates (Weight sharing metrics only)
CREATE TABLE IF NOT EXISTS federated_model_updates (
    id VARCHAR(64) PRIMARY KEY,
    state_id VARCHAR(64) NOT NULL,
    round_number INT NOT NULL,
    model_weights_ref VARCHAR(255) NOT NULL,
    accuracy_metric FLOAT NOT NULL,
    local_samples_count INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_stock_phc ON medicine_stocks(phc_id);
CREATE INDEX IF NOT EXISTS idx_consumption_phc_med ON consumption_logs(phc_id, medicine_name, date);
CREATE INDEX IF NOT EXISTS idx_alerts_phc ON alerts(phc_id, resolved_boolean);
CREATE INDEX IF NOT EXISTS idx_redistribution_status ON redistribution_recommendations(status);
