from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime, date

from backend.app.db.session import get_db
from backend.app.models.models import MedicineStock, ConsumptionLog, StaffAttendance, PatientFootfall, PHC
from backend.app.schemas.schemas import OfflineSyncBatch

router = APIRouter()

@router.post("/batch", response_model=Dict[str, Any])
def sync_offline_batch(batch: OfflineSyncBatch, db: Session = Depends(get_db)):
    """
    Ingests batched offline updates from a PHC edge terminal with conflict-safe timestamping.
    """
    phc = db.query(PHC).filter(PHC.id == batch.phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC facility not registered")

    processed_count = 0
    errors = []

    for item in batch.items:
        try:
            payload = item.payload
            
            if item.item_type == "consumption_log":
                log_entry = ConsumptionLog(
                    id=f"SYNC-{batch.phc_id[-4:]}-{int(datetime.utcnow().timestamp())}-{processed_count}",
                    phc_id=batch.phc_id,
                    medicine_name=payload.get("medicine_name"),
                    date=date.fromisoformat(payload.get("date", date.today().isoformat())),
                    quantity_used=int(payload.get("quantity_used", 0))
                )
                db.add(log_entry)

                # Update current stock
                stock = (
                    db.query(MedicineStock)
                    .filter(MedicineStock.phc_id == batch.phc_id, MedicineStock.medicine_name == payload.get("medicine_name"))
                    .first()
                )
                if stock:
                    stock.quantity = max(0, stock.quantity - int(payload.get("quantity_used", 0)))
                    stock.last_updated = datetime.utcnow()

            elif item.item_type == "stock_receipt":
                stock = (
                    db.query(MedicineStock)
                    .filter(MedicineStock.phc_id == batch.phc_id, MedicineStock.medicine_name == payload.get("medicine_name"))
                    .first()
                )
                if stock:
                    stock.quantity += int(payload.get("quantity_received", 0))
                    stock.last_updated = datetime.utcnow()

            elif item.item_type == "patient_footfall":
                ff = PatientFootfall(
                    id=f"SYNC-FF-{batch.phc_id[-4:]}-{int(datetime.utcnow().timestamp())}-{processed_count}",
                    phc_id=batch.phc_id,
                    date=date.fromisoformat(payload.get("date", date.today().isoformat())),
                    patient_count=int(payload.get("patient_count", 0)),
                    suspected_disease_tags=payload.get("suspected_disease_tags", "General Outpatient"),
                    is_outbreak_spike=bool(payload.get("is_outbreak_spike", False))
                )
                db.add(ff)

            processed_count += 1
        except Exception as e:
            errors.append(f"Item {item.item_type} failed: {str(e)}")

    db.commit()
    return {
        "status": "success",
        "phc_id": batch.phc_id,
        "items_synced": processed_count,
        "errors": errors,
        "server_sync_timestamp": datetime.utcnow().isoformat()
    }
