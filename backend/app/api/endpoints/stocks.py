from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, date

from backend.app.db.session import get_db
from backend.app.models.models import MedicineStock, ConsumptionLog, PHC
from backend.app.schemas.schemas import MedicineStockOut, ConsumptionLogCreate, ConsumptionLogOut

router = APIRouter()

@router.get("/{phc_id}", response_model=List[MedicineStockOut])
def get_phc_stocks(phc_id: str, db: Session = Depends(get_db)):
    stocks = db.query(MedicineStock).filter(MedicineStock.phc_id == phc_id).all()
    return stocks

@router.post("/consumption", response_model=ConsumptionLogOut)
def record_consumption(log_in: ConsumptionLogCreate, db: Session = Depends(get_db)):
    stock = (
        db.query(MedicineStock)
        .filter(MedicineStock.phc_id == log_in.phc_id, MedicineStock.medicine_name == log_in.medicine_name)
        .first()
    )
    if not stock:
        raise HTTPException(status_code=404, detail="Medicine stock not found for PHC")

    # Deduct stock quantity
    stock.quantity = max(0, stock.quantity - log_in.quantity_used)
    stock.last_updated = datetime.utcnow()

    log_entry = ConsumptionLog(
        id=f"LOG-{log_in.phc_id[-4:]}-{int(datetime.utcnow().timestamp())}",
        phc_id=log_in.phc_id,
        medicine_name=log_in.medicine_name,
        date=log_in.date,
        quantity_used=log_in.quantity_used
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
