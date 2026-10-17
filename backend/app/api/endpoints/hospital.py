"""
Hospital Resource Optimizer API Endpoints.
Provides individual hospital decision support:
- Live resource telemetry (beds, ICU, OTs, staff, equipment)
- Multi-horizon demand forecasting
- MILP Bed & ICU allocation optimizer
- CP-SAT Operating room scheduler
- Shift & staff optimizer
- Emergency readiness & safety-stock planner
- What-if scenario simulator
- Human-in-the-loop recommendation approval pipeline
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date

from backend.app.db.session import get_db
from ml.hospital.demand_forecast.forecaster import hospital_demand_forecaster
from ml.hospital.bed_icu_optimizer.optimizer import hospital_bed_optimizer
from ml.hospital.ot_scheduler.scheduler import hospital_ot_scheduler
from ml.hospital.staff_allocation.allocator import hospital_staff_allocator
from ml.hospital.emergency_planner.planner import hospital_emergency_planner
from ml.hospital.rl_agent.agent import hospital_rl_simulator

router = APIRouter()

# In-memory store for hospital recommendations with human-in-the-loop review
HOSPITAL_RECOMMENDATIONS_STORE: Dict[str, List[Dict[str, Any]]] = {}

def get_or_seed_recommendations(hospital_id: str) -> List[Dict[str, Any]]:
    if hospital_id not in HOSPITAL_RECOMMENDATIONS_STORE:
        HOSPITAL_RECOMMENDATIONS_STORE[hospital_id] = [
            {
                "id": "HREC-001",
                "hospital_id": hospital_id,
                "category": "bed_allocation",
                "title": "Transfer 3 Stabilized Patients from ICU to HDU",
                "department": "Critical Care ICU",
                "urgency": "high",
                "rationale": "ICU occupancy is at 83.3%. Moving 3 afebrile post-op patients to High Dependency Unit safeguards mandatory 15% emergency buffer.",
                "status": "pending",
                "created_at": datetime.utcnow().isoformat(),
                "action_taken": None
            },
            {
                "id": "HREC-002",
                "hospital_id": hospital_id,
                "category": "ot_scheduling",
                "title": "Reserve 12:30–14:30 Buffer in OR-1 for Emergency Trauma",
                "department": "Operating Theaters",
                "urgency": "medium",
                "rationale": "Forecast indicates high probability of emergency trauma arrivals from Asian Highway NH-60 sector.",
                "status": "pending",
                "created_at": datetime.utcnow().isoformat(),
                "action_taken": None
            },
            {
                "id": "HREC-003",
                "hospital_id": hospital_id,
                "category": "staff_allocation",
                "title": "Deploy 2 Additional ACLS Nurses to ER Evening Shift",
                "department": "Emergency & Trauma Triage",
                "urgency": "high",
                "rationale": "Hourly ER model predicts rush period between 19:00 and 22:00 hours. Reallocating from low-acuity day clinic.",
                "status": "pending",
                "created_at": datetime.utcnow().isoformat(),
                "action_taken": None
            },
            {
                "id": "HREC-004",
                "hospital_id": hospital_id,
                "category": "emergency_resource",
                "title": "Stage 15 Type-D Oxygen Cylinders at Respiratory Triage",
                "department": "Medical Gases & Cryogenics",
                "urgency": "medium",
                "rationale": "Ensures zero-latency response for incoming bronchial distress cases.",
                "status": "pending",
                "created_at": datetime.utcnow().isoformat(),
                "action_taken": None
            }
        ]
    return HOSPITAL_RECOMMENDATIONS_STORE[hospital_id]


# 1. Forecast endpoint
@router.get("/{hospital_id}/forecast")
def get_hospital_forecast(
    hospital_id: str,
    horizon_days: int = Query(14, ge=7, le=30, description="Forecast horizon in days (7, 14, 30)"),
    outbreak_factor: float = Query(1.0, description="Outbreak surge factor (1.0 = normal, 1.4 = +40% surge)")
):
    """
    Returns multi-horizon demand forecast for admissions, ICU, ER, OT and staff load.
    """
    forecast_data = hospital_demand_forecaster.generate_hospital_forecast(
        hospital_id=hospital_id,
        horizon_days=horizon_days,
        outbreak_risk_factor=outbreak_factor
    )
    return forecast_data


# Known hospital profiles (Private & Government)
HOSPITAL_PROFILES = {
    "HOSP-PVT-APOLLO": {
        "name": "Apollo Super Speciality Hospital",
        "district": "Pune",
        "state": "Maharashtra",
        "category": "private",
        "type": "Private Multi-Specialty & Robotic Surgery Tertiary Hospital",
        "beds": 350,
        "icu_beds": 45,
        "wards": [
            {"id": "W-ICU", "name": "Critical Care ICU & CCU", "total": 45, "occupied": 38, "free": 7, "occupancy_pct": 84.4, "is_critical": True},
            {"id": "W-HDU", "name": "High Dependency Unit (HDU)", "total": 30, "occupied": 26, "free": 4, "occupancy_pct": 86.7, "is_critical": False},
            {"id": "W-DLX", "name": "Executive Deluxe Suite Ward", "total": 40, "occupied": 34, "free": 6, "occupancy_pct": 85.0, "is_critical": False},
            {"id": "W-PVT-S", "name": "Private Single Room Ward", "total": 85, "occupied": 72, "free": 13, "occupancy_pct": 84.7, "is_critical": False},
            {"id": "W-TWIN", "name": "Twin-Sharing Semi-Private Ward", "total": 80, "occupied": 65, "free": 15, "occupancy_pct": 81.3, "is_critical": False},
            {"id": "W-DAYCARE", "name": "Day Care Chemotherapy & Dialysis", "total": 35, "occupied": 28, "free": 7, "occupancy_pct": 80.0, "is_critical": False},
            {"id": "W-SURGE", "name": "VIP Auxiliary Surge Overflow", "total": 35, "occupied": 0, "free": 35, "occupancy_pct": 0.0, "is_critical": False}
        ],
        "operating_rooms": [
            {"id": "OR-1", "name": "OT 1: Robotic Surgery (Da Vinci Xi)", "status": "active", "current_case": "Robotic Radical Prostatectomy", "utilization_pct": 88.0},
            {"id": "OR-2", "name": "OT 2: Cardiac & Vascular Hybrid OT", "status": "active", "current_case": "CABG Heart Bypass", "utilization_pct": 85.0},
            {"id": "OR-3", "name": "OT 3: Orthopedic & Joint Navigation", "status": "active", "current_case": "Robotic Knee Replacement", "utilization_pct": 82.0},
            {"id": "OR-4", "name": "OT 4: Emergency Trauma & Neuro Suite", "status": "active", "current_case": "Emergency Craniotomy", "utilization_pct": 74.0}
        ],
        "kpis": {
            "bed_occupancy_rate_pct": 81.2,
            "icu_occupancy_rate_pct": 84.4,
            "ot_utilization_rate_pct": 84.8,
            "emergency_avg_wait_mins": 9.5,
            "staff_to_patient_ratio": "1:3.2",
            "tpa_insurance_clearance_mins": 22.0,
            "forecast_mape_pct": 5.8
        }
    },
    "HOSP-PVT-FORTIS": {
        "name": "Fortis Memorial Super Speciality Hospital",
        "district": "Mumbai",
        "state": "Maharashtra",
        "category": "private",
        "type": "Private Quaternary Care & Transplant Centre",
        "beds": 380,
        "icu_beds": 50,
        "wards": [
            {"id": "W-ICU", "name": "Transplant & Surgical ICU", "total": 50, "occupied": 42, "free": 8, "occupancy_pct": 84.0, "is_critical": True},
            {"id": "W-HDU", "name": "Post-Transplant HDU", "total": 35, "occupied": 29, "free": 6, "occupancy_pct": 82.9, "is_critical": False},
            {"id": "W-DLX", "name": "Presidential Suites & Deluxe", "total": 45, "occupied": 36, "free": 9, "occupancy_pct": 80.0, "is_critical": False},
            {"id": "W-PVT-S", "name": "Single Patient Suites", "total": 110, "occupied": 94, "free": 16, "occupancy_pct": 85.5, "is_critical": False},
            {"id": "W-TWIN", "name": "Twin-Sharing Rooms", "total": 100, "occupied": 82, "free": 18, "occupancy_pct": 82.0, "is_critical": False},
            {"id": "W-SURGE", "name": "Standby Surge Ward", "total": 40, "occupied": 0, "free": 40, "occupancy_pct": 0.0, "is_critical": False}
        ],
        "operating_rooms": [
            {"id": "OR-1", "name": "OT 1: Liver & Renal Transplant Suite", "status": "active", "current_case": "Living Donor Liver Transplant", "utilization_pct": 91.0},
            {"id": "OR-2", "name": "OT 2: Minimally Invasive Laparoscopy", "status": "active", "current_case": "Bariatric Sleeve Gastrectomy", "utilization_pct": 84.0},
            {"id": "OR-3", "name": "OT 3: Spine & Neuro Navigation", "status": "active", "current_case": "Lumbar Discectomy", "utilization_pct": 80.0},
            {"id": "OR-4", "name": "OT 4: Emergency Polytrauma OT", "status": "active", "current_case": "Vascular Bypass", "utilization_pct": 72.0}
        ],
        "kpis": {
            "bed_occupancy_rate_pct": 82.5,
            "icu_occupancy_rate_pct": 84.0,
            "ot_utilization_rate_pct": 86.2,
            "emergency_avg_wait_mins": 10.2,
            "staff_to_patient_ratio": "1:3.0",
            "tpa_insurance_clearance_mins": 25.0,
            "forecast_mape_pct": 5.4
        }
    },
    "HOSP-PVT-MAX": {
        "name": "Max Super Speciality Hospital",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "category": "private",
        "type": "Private Multi-Specialty Hospital & Oncology Center",
        "beds": 320,
        "icu_beds": 40,
        "wards": [
            {"id": "W-ICU", "name": "Medical & Oncology ICU", "total": 40, "occupied": 33, "free": 7, "occupancy_pct": 82.5, "is_critical": True},
            {"id": "W-HDU", "name": "High Dependency Unit", "total": 30, "occupied": 25, "free": 5, "occupancy_pct": 83.3, "is_critical": False},
            {"id": "W-DLX", "name": "Deluxe Rooms", "total": 35, "occupied": 28, "free": 7, "occupancy_pct": 80.0, "is_critical": False},
            {"id": "W-PVT-S", "name": "Private Single Wards", "total": 95, "occupied": 79, "free": 16, "occupancy_pct": 83.2, "is_critical": False},
            {"id": "W-TWIN", "name": "Twin-Sharing Rooms", "total": 90, "occupied": 74, "free": 16, "occupancy_pct": 82.2, "is_critical": False},
            {"id": "W-SURGE", "name": "Surge Reserve Beds", "total": 30, "occupied": 0, "free": 30, "occupancy_pct": 0.0, "is_critical": False}
        ],
        "operating_rooms": [
            {"id": "OR-1", "name": "OT 1: Surgical Oncology Suite", "status": "active", "current_case": "Modified Radical Mastectomy", "utilization_pct": 86.0},
            {"id": "OR-2", "name": "OT 2: Gastrointestinal Laparoscopy", "status": "active", "current_case": "Laparoscopic Colectomy", "utilization_pct": 83.0},
            {"id": "OR-3", "name": "OT 3: Orthopedics & Trauma", "status": "active", "current_case": "Hip Replacement", "utilization_pct": 79.0},
            {"id": "OR-4", "name": "OT 4: Emergency Trauma Bay", "status": "active", "current_case": "Emergency Thoracotomy", "utilization_pct": 70.0}
        ],
        "kpis": {
            "bed_occupancy_rate_pct": 80.8,
            "icu_occupancy_rate_pct": 82.5,
            "ot_utilization_rate_pct": 83.0,
            "emergency_avg_wait_mins": 11.0,
            "staff_to_patient_ratio": "1:3.4",
            "tpa_insurance_clearance_mins": 26.0,
            "forecast_mape_pct": 6.0
        }
    },
    "HOSP-PVT-MANIPAL": {
        "name": "Manipal Hospital & Heart Institute",
        "district": "Bengaluru",
        "state": "Karnataka",
        "category": "private",
        "type": "Private Cardiac & Multi-Specialty Centre",
        "beds": 420,
        "icu_beds": 55,
        "wards": [
            {"id": "W-ICU", "name": "Cardiac ICU & Critical Care", "total": 55, "occupied": 46, "free": 9, "occupancy_pct": 83.6, "is_critical": True},
            {"id": "W-HDU", "name": "Cardiac Step-Down HDU", "total": 40, "occupied": 33, "free": 7, "occupancy_pct": 82.5, "is_critical": False},
            {"id": "W-DLX", "name": "Executive Suites", "total": 50, "occupied": 41, "free": 9, "occupancy_pct": 82.0, "is_critical": False},
            {"id": "W-PVT-S", "name": "Single Private Rooms", "total": 130, "occupied": 108, "free": 22, "occupancy_pct": 83.1, "is_critical": False},
            {"id": "W-TWIN", "name": "Semi-Private Twin Wards", "total": 115, "occupied": 95, "free": 20, "occupancy_pct": 82.6, "is_critical": False},
            {"id": "W-SURGE", "name": "Auxiliary Surge Wing", "total": 30, "occupied": 0, "free": 30, "occupancy_pct": 0.0, "is_critical": False}
        ],
        "operating_rooms": [
            {"id": "OR-1", "name": "OT 1: Adult Cardiac Surgery (Bypass / Valve)", "status": "active", "current_case": "Double Valve Replacement", "utilization_pct": 89.0},
            {"id": "OR-2", "name": "OT 2: Pediatric Cardiac & Congenital", "status": "active", "current_case": "Tetralogy of Fallot Repair", "utilization_pct": 85.0},
            {"id": "OR-3", "name": "OT 3: Robotic Joint Arthroplasty", "status": "active", "current_case": "Bilateral Knee Arthroplasty", "utilization_pct": 82.0},
            {"id": "OR-4", "name": "OT 4: Emergency Trauma & Vascular", "status": "active", "current_case": "Aortic Aneurysm Stent", "utilization_pct": 76.0}
        ],
        "kpis": {
            "bed_occupancy_rate_pct": 82.1,
            "icu_occupancy_rate_pct": 83.6,
            "ot_utilization_rate_pct": 85.5,
            "emergency_avg_wait_mins": 9.8,
            "staff_to_patient_ratio": "1:3.1",
            "tpa_insurance_clearance_mins": 20.0,
            "forecast_mape_pct": 5.2
        }
    },
    "HOSP-PVT-SAHYADRI": {
        "name": "Sahyadri Super Speciality Hospital",
        "district": "Nashik",
        "state": "Maharashtra",
        "category": "private",
        "type": "Private Multi-Specialty & Neurosciences Hospital",
        "beds": 280,
        "icu_beds": 35,
        "wards": [
            {"id": "W-ICU", "name": "Neuro & Surgical ICU", "total": 35, "occupied": 29, "free": 6, "occupancy_pct": 82.9, "is_critical": True},
            {"id": "W-HDU", "name": "High Dependency Unit", "total": 25, "occupied": 21, "free": 4, "occupancy_pct": 84.0, "is_critical": False},
            {"id": "W-DLX", "name": "Deluxe Rooms", "total": 30, "occupied": 24, "free": 6, "occupancy_pct": 80.0, "is_critical": False},
            {"id": "W-PVT-S", "name": "Single Private Wards", "total": 85, "occupied": 71, "free": 14, "occupancy_pct": 83.5, "is_critical": False},
            {"id": "W-TWIN", "name": "Twin-Sharing Wards", "total": 80, "occupied": 65, "free": 15, "occupancy_pct": 81.3, "is_critical": False},
            {"id": "W-SURGE", "name": "Auxiliary Standby Ward", "total": 25, "occupied": 0, "free": 25, "occupancy_pct": 0.0, "is_critical": False}
        ],
        "operating_rooms": [
            {"id": "OR-1", "name": "OT 1: Neuro-Microscopic Suite", "status": "active", "current_case": "Brain Tumor Excision", "utilization_pct": 87.0},
            {"id": "OR-2", "name": "OT 2: Laparoscopic & GI Surgery", "status": "active", "current_case": "Laparoscopic Hernioplasty", "utilization_pct": 84.0},
            {"id": "OR-3", "name": "OT 3: Orthopedic Trauma", "status": "active", "current_case": "Complex Pelvic ORIF", "utilization_pct": 80.0},
            {"id": "OR-4", "name": "OT 4: Emergency Trauma Bay", "status": "active", "current_case": "Emergency Laparotomy", "utilization_pct": 75.0}
        ],
        "kpis": {
            "bed_occupancy_rate_pct": 81.5,
            "icu_occupancy_rate_pct": 82.9,
            "ot_utilization_rate_pct": 84.0,
            "emergency_avg_wait_mins": 10.5,
            "staff_to_patient_ratio": "1:3.3",
            "tpa_insurance_clearance_mins": 24.0,
            "forecast_mape_pct": 5.9
        }
    },
    "HOSP-MH-NAS-DIST": {
        "name": "Nashik District Civil Hospital",
        "district": "Nashik",
        "state": "Maharashtra",
        "category": "government",
        "type": "Government District Civil Hospital",
        "beds": 320,
        "icu_beds": 30,
        "wards": [
            {"id": "W-ICU", "name": "Critical Care ICU", "total": 30, "occupied": 25, "free": 5, "occupancy_pct": 83.3, "is_critical": True},
            {"id": "W-HDU", "name": "High Dependency Unit (HDU)", "total": 24, "occupied": 20, "free": 4, "occupancy_pct": 83.3, "is_critical": False},
            {"id": "W-GEN-M", "name": "General Medical Ward (Male)", "total": 70, "occupied": 56, "free": 14, "occupancy_pct": 80.0, "is_critical": False},
            {"id": "W-GEN-F", "name": "General Medical Ward (Female)", "total": 70, "occupied": 58, "free": 12, "occupancy_pct": 82.8, "is_critical": False},
            {"id": "W-SURG", "name": "Post-Operative Surgical Ward", "total": 50, "occupied": 38, "free": 12, "occupancy_pct": 76.0, "is_critical": False},
            {"id": "W-PED", "name": "Pediatric & Neonatal Ward", "total": 40, "occupied": 28, "free": 12, "occupancy_pct": 70.0, "is_critical": False},
            {"id": "W-EMG-OBS", "name": "Emergency Observation Triage", "total": 20, "occupied": 16, "free": 4, "occupancy_pct": 80.0, "is_critical": False},
            {"id": "W-SURGE", "name": "Auxiliary Surge Ward (Standby)", "total": 20, "occupied": 0, "free": 20, "occupancy_pct": 0.0, "is_critical": False}
        ],
        "operating_rooms": [
            {"id": "OR-1", "name": "OT 1: Emergency & Polytrauma", "status": "active", "current_case": "Trauma Laparotomy", "utilization_pct": 78.0},
            {"id": "OR-2", "name": "OT 2: General & Laparoscopic", "status": "active", "current_case": "Laparoscopic Cholecystectomy", "utilization_pct": 85.0},
            {"id": "OR-3", "name": "OT 3: Orthopedic & Joint Repair", "status": "active", "current_case": "Femur ORIF", "utilization_pct": 82.0},
            {"id": "OR-4", "name": "OT 4: Obstetrics & Gynaecology", "status": "active", "current_case": "Elective C-Section", "utilization_pct": 72.0}
        ],
        "kpis": {
            "bed_occupancy_rate_pct": 78.4,
            "icu_occupancy_rate_pct": 83.3,
            "ot_utilization_rate_pct": 81.5,
            "emergency_avg_wait_mins": 14.2,
            "staff_to_patient_ratio": "1:4.2",
            "tpa_insurance_clearance_mins": 45.0,
            "forecast_mape_pct": 6.4
        }
    }
}

# 2. Live resources status
@router.get("/{hospital_id}/resources")
def get_hospital_resources(hospital_id: str):
    """
    Returns live telemetry for beds, ICU, operating rooms, staff and emergency equipment
    for Private or Government hospitals.
    """
    profile = HOSPITAL_PROFILES.get(hospital_id)
    if not profile:
        # Fallback profile
        profile = HOSPITAL_PROFILES["HOSP-PVT-APOLLO"] if "PVT" in hospital_id else HOSPITAL_PROFILES["HOSP-MH-NAS-DIST"]
    
    return {
        "hospital_id": hospital_id,
        "hospital_name": profile["name"],
        "category": profile.get("category", "private"),
        "district": profile.get("district", "Nashik"),
        "state": profile.get("state", "Maharashtra"),
        "type": profile["type"],
        "last_sync": datetime.utcnow().isoformat(),
        "summary_kpis": profile["kpis"],
        "wards": profile["wards"],
        "operating_rooms": profile["operating_rooms"],
        "active_staff": {
            "doctors_on_duty": 42 if profile.get("category") == "private" else 38,
            "nurses_on_duty": 84 if profile.get("category") == "private" else 76,
            "technicians_on_duty": 28,
            "current_shift": "Morning Shift (08:00 - 16:00)",
            "rest_compliance_pct": 100.0
        },
        "emergency_equipment": {
            "ventilators_total": 36 if profile.get("category") == "private" else 32,
            "ventilators_in_use": 28 if profile.get("category") == "private" else 24,
            "lmo_oxygen_kl": 8.2 if profile.get("category") == "private" else 6.8,
            "lmo_tank_capacity_kl": 12.0 if profile.get("category") == "private" else 10.0,
            "type_d_cylinders_filled": 95,
            "blood_o_neg_units": 15,
            "trauma_kits_ready": 42,
            "ambulances_ready": 8
        }
    }



# 3. Optimize beds
@router.post("/{hospital_id}/optimize/beds")
def optimize_beds(
    hospital_id: str,
    payload: Optional[Dict[str, Any]] = Body(None)
):
    """
    Runs MILP Bed & ICU allocation optimizer under ward and emergency buffer constraints.
    """
    buffer_pct = 0.15
    enable_surge = True
    if payload:
        buffer_pct = payload.get("min_icu_emergency_buffer_pct", 0.15)
        enable_surge = payload.get("enable_surge_capacity", True)

    result = hospital_bed_optimizer.optimize_bed_allocation(
        hospital_id=hospital_id,
        min_icu_emergency_buffer_pct=buffer_pct,
        enable_surge_capacity=enable_surge
    )
    return result


# 4. Optimize OT schedule
@router.post("/{hospital_id}/optimize/ot-schedule")
def optimize_ot_schedule(
    hospital_id: str,
    payload: Optional[Dict[str, Any]] = Body(None)
):
    """
    Generates optimized conflict-free operating room timetable.
    """
    date_str = payload.get("date") if payload else None
    result = hospital_ot_scheduler.generate_ot_schedule(
        hospital_id=hospital_id,
        date_str=date_str
    )
    return result


# 5. Optimize staff roster
@router.post("/{hospital_id}/optimize/staff")
def optimize_staff(
    hospital_id: str,
    payload: Optional[Dict[str, Any]] = Body(None)
):
    """
    Generates staff shift roster recommendation under rest and skill constraints.
    """
    outbreak_intensity = payload.get("outbreak_intensity", 1.0) if payload else 1.0
    result = hospital_staff_allocator.optimize_staff_roster(
        hospital_id=hospital_id,
        outbreak_intensity=outbreak_intensity
    )
    return result


# 6. Emergency readiness
@router.get("/{hospital_id}/emergency-readiness")
def get_emergency_readiness(
    hospital_id: str,
    surge_multiplier: float = Query(1.0, ge=1.0, le=3.0, description="Predicted surge factor")
):
    """
    Evaluates emergency equipment readiness, safety stock, and identified supply gaps.
    """
    result = hospital_emergency_planner.evaluate_emergency_readiness(
        hospital_id=hospital_id,
        predicted_surge_multiplier=surge_multiplier
    )
    return result


# 7. Scenario simulation
@router.post("/{hospital_id}/simulate")
def run_scenario_simulation(
    hospital_id: str,
    payload: Dict[str, Any] = Body(...)
):
    """
    Simulates what-if scenarios (epidemic outbreak, highway bus crash, heatwave)
    and evaluates RL policy recommendations.
    """
    scenario_type = payload.get("scenario_type", "outbreak_surge")
    surge_pct = payload.get("surge_intensity_pct", 40.0)
    casualties = payload.get("custom_casualties", 25)

    result = hospital_rl_simulator.simulate_scenario(
        hospital_id=hospital_id,
        scenario_type=scenario_type,
        surge_intensity_pct=surge_pct,
        custom_casualties=casualties
    )
    return result


# 8. List pending recommendations
@router.get("/{hospital_id}/recommendations")
def list_hospital_recommendations(
    hospital_id: str,
    status: Optional[str] = Query("all", description="Filter by status: pending, approved, rejected, all")
):
    """
    Lists AI recommendations for bed allocation, OT rescheduling, and staff mobilization.
    """
    recs = get_or_seed_recommendations(hospital_id)
    if status and status != "all":
        recs = [r for r in recs if r.get("status") == status]
    return recs


# 9. Human-in-the-loop action
@router.put("/{hospital_id}/recommendations/{id}/action")
def act_on_recommendation(
    hospital_id: str,
    id: str,
    payload: Dict[str, Any] = Body(...)
):
    """
    Human-in-the-loop governance: Approve, modify, or reject an AI recommendation.
    """
    action = payload.get("action", "approved") # approved, rejected, modified
    notes = payload.get("notes", "")

    recs = get_or_seed_recommendations(hospital_id)
    target = next((r for r in recs if r["id"] == id), None)

    if not target:
        raise HTTPException(status_code=404, detail=f"Recommendation with ID {id} not found.")

    target["status"] = action
    target["action_taken"] = {
        "action": action,
        "reviewed_at": datetime.utcnow().isoformat(),
        "notes": notes,
        "reviewer": "Medical Superintendent (Human-in-the-loop)"
    }

    return {
        "status": "success",
        "message": f"Recommendation {id} was {action} successfully.",
        "updated_recommendation": target
    }
