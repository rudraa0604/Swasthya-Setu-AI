from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any

from backend.app.db.session import get_db
from backend.app.models.models import PHC, MedicineStock, BedStatus, StaffAttendance, Alert, PatientFootfall
from backend.app.schemas.schemas import PHCOut, PHCCreate

router = APIRouter()

@router.get("/", response_model=List[PHCOut])
def list_phcs(
    state_id: Optional[str] = Query(None, description="Filter by state ID (e.g. ST-MH)"),
    district_name: Optional[str] = Query(None, description="Filter by district name"),
    db: Session = Depends(get_db)
):
    query = db.query(PHC)
    if state_id:
        query = query.filter(PHC.state_id == state_id)
    if district_name:
        query = query.filter(PHC.district_name == district_name)
    return query.all()

@router.post("/", response_model=PHCOut)
def create_phc(phc_in: PHCCreate, db: Session = Depends(get_db)):
    existing = db.query(PHC).filter(PHC.id == phc_in.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="PHC ID already exists")
    new_phc = PHC(**phc_in.dict())
    db.add(new_phc)
    db.commit()
    db.refresh(new_phc)
    return new_phc

@router.put("/{phc_id}", response_model=PHCOut)
def update_phc(phc_id: str, phc_in: PHCCreate, db: Session = Depends(get_db)):
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")
    for field, value in phc_in.dict(exclude_unset=True).items():
        if field != "id":
            setattr(phc, field, value)
    db.commit()
    db.refresh(phc)
    return phc

@router.delete("/{phc_id}", response_model=Dict[str, Any])
def delete_phc(phc_id: str, db: Session = Depends(get_db)):
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")
    db.delete(phc)
    db.commit()
    return {"status": "success", "message": f"PHC {phc_id} deleted successfully"}

@router.get("/{phc_id}", response_model=Dict[str, Any])
def get_phc_detail(phc_id: str, db: Session = Depends(get_db)):
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")

    stocks = db.query(MedicineStock).filter(MedicineStock.phc_id == phc_id).all()
    bed = db.query(BedStatus).filter(BedStatus.phc_id == phc_id).order_by(BedStatus.timestamp.desc()).first()
    staff = db.query(StaffAttendance).filter(StaffAttendance.phc_id == phc_id).all()
    recent_footfall = (
        db.query(PatientFootfall)
        .filter(PatientFootfall.phc_id == phc_id)
        .order_by(PatientFootfall.date.desc())
        .limit(14)
        .all()
    )
    active_alerts = db.query(Alert).filter(Alert.phc_id == phc_id, Alert.resolved_boolean == False).all()

    # Risk level evaluation
    critical_stocks = [s for s in stocks if s.quantity < (s.buffer_threshold * 0.3)]
    risk_level = "Critical" if (critical_stocks or any(a.severity == "critical" for a in active_alerts)) else (
        "Warning" if any(s.quantity < s.buffer_threshold for s in stocks) else "Healthy"
    )

    return {
        "phc": {
            "id": phc.id,
            "name": phc.name,
            "district_id": phc.district_id,
            "district_name": phc.district_name,
            "state_id": phc.state_id,
            "state_name": phc.state_name,
            "lat": phc.lat,
            "lng": phc.lng,
            "sanctioned_staff_count": phc.sanctioned_staff_count,
            "risk_level": risk_level
        },
        "stocks": [
            {
                "id": s.id,
                "medicine_name": s.medicine_name,
                "batch_id": s.batch_id,
                "quantity": s.quantity,
                "buffer_threshold": s.buffer_threshold,
                "daily_consumption_avg": s.daily_consumption_avg,
                "expiry_date": s.expiry_date.isoformat() if s.expiry_date else None,
                "status": "Critical" if s.quantity < (s.buffer_threshold * 0.3) else ("Warning" if s.quantity < s.buffer_threshold else "Healthy")
            } for s in stocks
        ],
        "bed_status": {
            "total_beds": bed.total_beds if bed else 20,
            "occupied_beds": bed.occupied_beds if bed else 0,
            "available_beds": (bed.total_beds - bed.occupied_beds) if bed else 20,
            "icu_beds": bed.icu_beds if bed else 4,
            "icu_occupied": bed.icu_occupied if bed else 0,
            "icu_available": (bed.icu_beds - bed.icu_occupied) if bed else 4
        } if bed else None,
        "staff_summary": {
            "total_sanctioned": phc.sanctioned_staff_count,
            "present_today": sum(1 for st in staff if st.present_boolean),
            "absent_today": sum(1 for st in staff if not st.present_boolean),
            "staff_list": [
                {"name": st.staff_name, "role": st.role, "present": st.present_boolean} for st in staff
            ]
        },
        "footfall_trend": [
            {"date": f.date.isoformat(), "count": f.patient_count, "is_spike": f.is_outbreak_spike, "tags": f.suspected_disease_tags}
            for f in reversed(recent_footfall)
        ],
        "active_alerts": [
            {"id": a.id, "type": a.type, "severity": a.severity, "message": a.message, "explanation": a.explanation, "created_at": a.created_at.isoformat()}
            for a in active_alerts
        ]
    }

@router.get("/rollup/national", response_model=Dict[str, Any])
def get_national_rollup(db: Session = Depends(get_db)):
    """
    National Level Roll-up summary for Executive Health Ministry View.
    """
    total_phcs = db.query(func.count(PHC.id)).scalar() or 0
    total_states = db.query(func.count(func.distinct(PHC.state_id))).scalar() or 0
    total_districts = db.query(func.count(func.distinct(PHC.district_name))).scalar() or 0
    
    # Bed metrics
    total_beds = db.query(func.sum(BedStatus.total_beds)).scalar() or 0
    occupied_beds = db.query(func.sum(BedStatus.occupied_beds)).scalar() or 0
    total_icu = db.query(func.sum(BedStatus.icu_beds)).scalar() or 0
    occupied_icu = db.query(func.sum(BedStatus.icu_occupied)).scalar() or 0

    # Stock-out counts
    critical_stock_count = (
        db.query(func.count(MedicineStock.id))
        .filter(MedicineStock.quantity < (MedicineStock.buffer_threshold * 0.3))
        .scalar() or 0
    )
    
    # Active alerts
    critical_alerts = db.query(func.count(Alert.id)).filter(Alert.severity == "critical", Alert.resolved_boolean == False).scalar() or 0
    total_alerts = db.query(func.count(Alert.id)).filter(Alert.resolved_boolean == False).scalar() or 0

    # Outbreak areas
    outbreak_phcs = (
        db.query(func.count(func.distinct(PatientFootfall.phc_id)))
        .filter(PatientFootfall.is_outbreak_spike == True)
        .scalar() or 0
    )

    # State level aggregates for Map/Rollup
    states_meta = [
        {"id": "ST-MH", "name": "Maharashtra (Simulated)", "risk": "High (Outbreak in Nashik)", "color": "#ef4444"},
        {"id": "ST-KA", "name": "Karnataka (Simulated)", "risk": "Low / Healthy", "color": "#10b981"},
        {"id": "ST-UP", "name": "Uttar Pradesh (Simulated)", "risk": "Moderate (Vaccine Shortage in Lucknow)", "color": "#f59e0b"}
    ]

    return {
        "total_phcs_monitored": total_phcs,
        "total_states": total_states,
        "total_districts": total_districts,
        "critical_alerts_count": critical_alerts,
        "total_alerts_count": total_alerts,
        "critical_stock_shortages": critical_stock_count,
        "outbreak_hotspot_phcs": outbreak_phcs,
        "bed_occupancy": {
            "total_beds": total_beds,
            "occupied_beds": occupied_beds,
            "occupancy_rate_pct": round((occupied_beds / max(1, total_beds)) * 100, 1),
            "icu_total": total_icu,
            "icu_occupied": occupied_icu,
            "icu_occupancy_rate_pct": round((occupied_icu / max(1, total_icu)) * 100, 1)
        },
        "states_summary": states_meta
    }
