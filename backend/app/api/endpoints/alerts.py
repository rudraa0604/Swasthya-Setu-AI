from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from backend.app.db.session import get_db
from backend.app.models.models import Alert, PHC
from backend.app.schemas.schemas import AlertOut
from ml.alerts.engine import early_warning_engine
from ml.alerts.proximity_engine import proximity_warning_engine

router = APIRouter()

@router.get("/", response_model=List[AlertOut])
def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity: critical, warning, info"),
    state_id: Optional[str] = Query(None, description="Filter by state ID"),
    district_name: Optional[str] = Query(None, description="Filter by district"),
    resolved: bool = Query(False, description="Filter resolved status"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    resolved_val = resolved if isinstance(resolved, bool) else getattr(resolved, "default", False)
    limit_val = limit if isinstance(limit, int) else getattr(limit, "default", 50)
    sev_val = severity if isinstance(severity, str) else (getattr(severity, "default", None) if severity is not None else None)
    st_val = state_id if isinstance(state_id, str) else (getattr(state_id, "default", None) if state_id is not None else None)
    dist_val = district_name if isinstance(district_name, str) else (getattr(district_name, "default", None) if district_name is not None else None)

    query = (
        db.query(Alert)
        .join(PHC, Alert.phc_id == PHC.id)
        .filter(Alert.resolved_boolean == resolved_val)
    )
    if sev_val:
        query = query.filter(Alert.severity == sev_val)
    if st_val:
        query = query.filter(PHC.state_id == st_val)
    if dist_val:
        query = query.filter(PHC.district_name == dist_val)

    return query.order_by(Alert.created_at.desc()).limit(limit_val).all()

@router.get("/proximity/{phc_id}", response_model=Dict[str, Any])
def get_phc_proximity_early_warnings(phc_id: str, db: Session = Depends(get_db)):
    """
    AI Proximity Early Warning Scanner:
    1. Detects disease outbreaks spreading within 25km radius.
    2. Detects mass casualty incidents / tragedies with arrival ETA and trauma supply needs.
    """
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")
    
    return proximity_warning_engine.scan_proximity_alerts_for_phc(phc, db)

@router.get("/incidents", response_model=List[Dict[str, Any]])
def list_active_incidents():
    """
    Returns all active emergency incidents and disaster tragedies.
    """
    return proximity_warning_engine.get_active_incidents()

@router.post("/report-incident", response_model=Dict[str, Any])
def report_emergency_incident(incident_data: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """
    Report or simulate an emergency mass casualty tragedy (Highway Crash, Chemical Leak, Flood, Food Poisoning).
    Broadcasts real-time proximity alerts to all clinics within the affected radius.
    """
    result = proximity_warning_engine.report_incident(incident_data)
    return {
        "status": "success",
        "message": f"Emergency Alert broadcasted to all PHCs within {result.get('affected_radius_km')}km radius!",
        "incident": result
    }

@router.delete("/incidents/{incident_id}", response_model=Dict[str, Any])
def resolve_emergency_incident(incident_id: str):
    """
    Resolves / clears an emergency incident alert.
    """
    success = proximity_warning_engine.remove_incident(incident_id)
    if not success:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"status": "success", "message": f"Incident {incident_id} marked resolved."}

@router.get("/district-threat-matrix/{district_name}", response_model=Dict[str, Any])
def get_district_threat_matrix(district_name: str, db: Session = Depends(get_db)):
    """
    Returns high-level threat matrix across all clinics in a district.
    """
    phcs = db.query(PHC).filter(PHC.district_name == district_name).all()
    matrix = []
    for p in phcs:
        warns = proximity_warning_engine.scan_proximity_alerts_for_phc(p, db)
        matrix.append(warns)
    
    return {
        "district_name": district_name,
        "clinics_monitored": len(phcs),
        "total_active_threats": sum(m["total_proximity_threats"] for m in matrix),
        "clinics_with_warnings": [m for m in matrix if m["total_proximity_threats"] > 0]
    }

@router.post("/scan-all", response_model=Dict[str, Any])
def trigger_alert_scan(db: Session = Depends(get_db)):
    """
    Scans all PHCs in the database and updates active alerts.
    """
    phcs = db.query(PHC).all()
    # Clear existing active alerts to avoid duplication on rescan
    db.query(Alert).filter(Alert.resolved_boolean == False).delete()
    
    generated_alerts = []
    for phc in phcs:
        alerts = early_warning_engine.scan_phc_for_alerts(phc, db)
        for a in alerts:
            db.add(a)
            generated_alerts.append(a)

    db.commit()
    return {
        "status": "success",
        "phcs_scanned": len(phcs),
        "total_alerts_generated": len(generated_alerts),
        "critical_count": sum(1 for a in generated_alerts if a.severity == "critical"),
        "warning_count": sum(1 for a in generated_alerts if a.severity == "warning")
    }

@router.put("/{alert_id}/resolve", response_model=Dict[str, Any])
def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.resolved_boolean = True
    db.commit()
    return {"status": "success", "message": f"Alert {alert_id} resolved"}

