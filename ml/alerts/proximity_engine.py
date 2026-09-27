import math
import uuid
from datetime import datetime, date
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import PHC, PatientFootfall, Alert, MedicineStock, BedStatus

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points on the earth in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

class IncidentRecord:
    def __init__(
        self,
        incident_id: str,
        title: str,
        incident_type: str,  # "road_accident", "chemical_leak", "flood_waterborne", "food_poisoning", "heatwave"
        location_name: str,
        lat: float,
        lng: float,
        severity: str,  # "critical", "warning"
        estimated_casualties: int,
        affected_radius_km: float,
        disease_or_trauma_type: str,
        recommended_supplies: List[str],
        recommended_beds: int,
        created_at: Optional[datetime] = None
    ):
        self.id = incident_id
        self.title = title
        self.incident_type = incident_type
        self.location_name = location_name
        self.lat = lat
        self.lng = lng
        self.severity = severity
        self.estimated_casualties = estimated_casualties
        self.affected_radius_km = affected_radius_km
        self.disease_or_trauma_type = disease_or_trauma_type
        self.recommended_supplies = recommended_supplies
        self.recommended_beds = recommended_beds
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "incident_type": self.incident_type,
            "location_name": self.location_name,
            "lat": self.lat,
            "lng": self.lng,
            "severity": self.severity,
            "estimated_casualties": self.estimated_casualties,
            "affected_radius_km": self.affected_radius_km,
            "disease_or_trauma_type": self.disease_or_trauma_type,
            "recommended_supplies": self.recommended_supplies,
            "recommended_beds": self.recommended_beds,
            "created_at": self.created_at.isoformat()
        }

# In-memory active incidents repository with realistic seed tragedy scenario
ACTIVE_INCIDENTS: Dict[str, IncidentRecord] = {
    "INC-MH-NAS-01": IncidentRecord(
        incident_id="INC-MH-NAS-01",
        title="Major Multi-Vehicle Highway Crash on NH-60",
        incident_type="road_accident",
        location_name="Nashik-Pune Expressway, Milestone 42 (Near Dindori Junction)",
        lat=20.025,
        lng=73.805,
        severity="critical",
        estimated_casualties=35,
        affected_radius_km=18.0,
        disease_or_trauma_type="Mass Trauma & Severe Hemorrhage",
        recommended_supplies=[
            "IV Normal Saline 500ml",
            "Anti-Tetanus Toxoid",
            "Trauma Dressing & Sterile Bandages",
            "Emergency Pain Relief (Diclofenac/Paracetamol)"
        ],
        recommended_beds=8
    ),
    "INC-MH-NAS-02": IncidentRecord(
        incident_id="INC-MH-NAS-02",
        title="Sudden River Water Contamination & Gastroenteritis Cluster",
        incident_type="flood_waterborne",
        location_name="Godavari River Basin (Niphad Sector)",
        lat=20.090,
        lng=73.910,
        severity="warning",
        estimated_casualties=60,
        affected_radius_km=22.0,
        disease_or_trauma_type="Acute Diarrheal Outbreak & Dehydration",
        recommended_supplies=[
            "ORS Sachet (Oral Rehydration Salts)",
            "Amoxicillin 250mg",
            "IV Normal Saline 500ml",
            "Water Purification Tablets"
        ],
        recommended_beds=6
    )
}

class ProximityEarlyWarningEngine:
    """
    AI Engine for Detecting:
    1. Nearby Spreading Disease Outbreaks (clustering & spatial diffusion).
    2. Nearby Tragedies / Disasters / Mass Casualty Incidents with ETA and Trauma Inflow prediction.
    """

    def get_active_incidents(self) -> List[Dict[str, Any]]:
        return [inc.to_dict() for inc in ACTIVE_INCIDENTS.values()]

    def report_incident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        inc_id = data.get("id") or f"INC-{str(uuid.uuid4())[:8].upper()}"
        rec = IncidentRecord(
            incident_id=inc_id,
            title=data.get("title", "Emergency Mass Casualty Incident"),
            incident_type=data.get("incident_type", "road_accident"),
            location_name=data.get("location_name", "District Location"),
            lat=float(data.get("lat", 20.0)),
            lng=float(data.get("lng", 73.8)),
            severity=data.get("severity", "critical"),
            estimated_casualties=int(data.get("estimated_casualties", 25)),
            affected_radius_km=float(data.get("affected_radius_km", 20.0)),
            disease_or_trauma_type=data.get("disease_or_trauma_type", "Emergency Trauma Care"),
            recommended_supplies=data.get("recommended_supplies", ["IV Normal Saline 500ml", "Anti-Tetanus Toxoid", "Trauma Dressing & Sterile Bandages"]),
            recommended_beds=int(data.get("recommended_beds", 6))
        )
        ACTIVE_INCIDENTS[inc_id] = rec
        return rec.to_dict()

    def remove_incident(self, incident_id: str) -> bool:
        if incident_id in ACTIVE_INCIDENTS:
            del ACTIVE_INCIDENTS[incident_id]
            return True
        return False

    def scan_proximity_alerts_for_phc(self, phc: PHC, db: Session) -> Dict[str, Any]:
        """
        Calculates all proximity risks for a given PHC:
        1. Nearby Spreading Disease Outbreaks
        2. Nearby Incident / Mass Casualty Warnings
        """
        all_phcs = db.query(PHC).all()
        
        # 1. SCAN FOR NEARBY SPREADING DISEASE OUTBREAKS
        disease_proximity_alerts = []
        for other in all_phcs:
            if other.id == phc.id:
                continue
            
            # Check if other PHC has active outbreak spike or high footfall
            recent_ff = (
                db.query(PatientFootfall)
                .filter(PatientFootfall.phc_id == other.id)
                .order_by(PatientFootfall.date.desc())
                .limit(7)
                .all()
            )
            if not recent_ff:
                continue

            latest_ff = recent_ff[0]
            is_spike = latest_ff.is_outbreak_spike or (latest_ff.patient_count >= 130)

            if is_spike:
                dist_km = haversine_km(phc.lat, phc.lng, other.lat, other.lng)
                if dist_km <= 28.0:  # Within disease spread diffusion radius
                    # Calculate expected influx risk
                    risk_pct = max(40, round((1.0 - (dist_km / 30.0)) * 180))
                    disease_tag = latest_ff.suspected_disease_tags or "Viral Fever & Dehydration"
                    
                    # Estimate incoming timeline
                    hours_window = "12 - 24 Hours" if dist_km < 8.0 else ("24 - 48 Hours" if dist_km < 18.0 else "48 - 72 Hours")
                    
                    # Specific medicine recommendations based on disease tag
                    needed_meds = []
                    if "Dengue" in disease_tag or "Viral" in disease_tag or "Fever" in disease_tag:
                        needed_meds = ["Paracetamol 500mg", "IV Normal Saline 500ml", "ORS Sachet (Oral Rehydration Salts)"]
                    elif "Diarrhea" in disease_tag or "Gastro" in disease_tag or "Cholera" in disease_tag:
                        needed_meds = ["ORS Sachet (Oral Rehydration Salts)", "Amoxicillin 250mg", "IV Normal Saline 500ml", "Doxycycline 100mg"]
                    elif "Rabies" in disease_tag:
                        needed_meds = ["Rabies Vaccine (Anti-Rabies)", "Anti-Tetanus Toxoid"]
                    else:
                        needed_meds = ["Paracetamol 500mg", "Amoxicillin 250mg", "IV Normal Saline 500ml"]

                    disease_proximity_alerts.append({
                        "epicenter_phc_id": other.id,
                        "epicenter_phc_name": other.name,
                        "epicenter_district": other.district_name,
                        "distance_km": dist_km,
                        "disease_name": disease_tag,
                        "epicenter_patient_count": latest_ff.patient_count,
                        "projected_inflow_surge_pct": risk_pct,
                        "expected_arrival_window": hours_window,
                        "urgency": "critical" if dist_km < 10.0 else "warning",
                        "recommended_medicines": needed_meds,
                        "recommended_action": f"Prepare +{risk_pct}% buffer for {', '.join(needed_meds[:2])}. Inform local ASHA health workers."
                    })

        # Sort closest first
        disease_proximity_alerts.sort(key=lambda x: x["distance_km"])

        # 2. SCAN FOR NEARBY INCIDENTS / TRAGEDIES
        incident_proximity_alerts = []
        for inc in ACTIVE_INCIDENTS.values():
            dist_km = haversine_km(phc.lat, phc.lng, inc.lat, inc.lng)
            if dist_km <= inc.affected_radius_km:
                # Calculate patient arrival ETA in minutes: assuming 35-45 km/h ambulance speed
                eta_minutes = max(10, round((dist_km / 40.0) * 60))
                # Calculate estimated patient share coming to this PHC
                expected_patients = max(5, round(inc.estimated_casualties * (1.0 - (dist_km / inc.affected_radius_km)) * 0.7))

                incident_proximity_alerts.append({
                    "incident_id": inc.id,
                    "title": inc.title,
                    "incident_type": inc.incident_type,
                    "location_name": inc.location_name,
                    "distance_km": dist_km,
                    "eta_minutes": eta_minutes,
                    "severity": inc.severity if dist_km < (inc.affected_radius_km * 0.6) else "warning",
                    "expected_incoming_patients": expected_patients,
                    "disease_or_trauma_type": inc.disease_or_trauma_type,
                    "recommended_supplies": inc.recommended_supplies,
                    "recommended_beds": inc.recommended_beds,
                    "created_at": inc.created_at.isoformat(),
                    "recommended_action": f"Ready {inc.recommended_beds} triage beds immediately. Stage {inc.recommended_supplies[0]} at admission desk."
                })

        # Sort closest first
        incident_proximity_alerts.sort(key=lambda x: x["distance_km"])

        return {
            "phc_id": phc.id,
            "phc_name": phc.name,
            "district_name": phc.district_name,
            "lat": phc.lat,
            "lng": phc.lng,
            "nearby_disease_spread_alerts": disease_proximity_alerts,
            "nearby_incident_alerts": incident_proximity_alerts,
            "total_proximity_threats": len(disease_proximity_alerts) + len(incident_proximity_alerts),
            "highest_urgency": "critical" if any(a["urgency"] == "critical" for a in disease_proximity_alerts) or any(i["severity"] == "critical" for i in incident_proximity_alerts) else ("warning" if (disease_proximity_alerts or incident_proximity_alerts) else "safe")
        }

proximity_warning_engine = ProximityEarlyWarningEngine()
