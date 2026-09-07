from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from backend.app.db.session import get_db
from backend.app.models.models import Alert, PHC
from backend.app.schemas.schemas import AlertOut
from ml.alerts.engine import early_warning_engine

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
    query = (
        db.query(Alert)
        .join(PHC, Alert.phc_id == PHC.id)
        .filter(Alert.resolved_boolean == resolved)
    )
    if severity:
        query = query.filter(Alert.severity == severity)
    if state_id:
        query = query.filter(PHC.state_id == state_id)
    if district_name:
        query = query.filter(PHC.district_name == district_name)

    return query.order_by(Alert.created_at.desc()).limit(limit).all()

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
