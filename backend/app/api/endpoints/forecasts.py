from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.db.session import get_db
from backend.app.models.models import PHC, MedicineStock, ConsumptionLog, PatientFootfall
from backend.app.schemas.schemas import ForecastResponse
from ml.forecasting.engine import forecasting_engine

router = APIRouter()

@router.get("/{phc_id}", response_model=List[ForecastResponse])
def get_phc_forecasts(
    phc_id: str,
    horizon_days: int = Query(14, ge=7, le=30, description="Forecast horizon in days"),
    db: Session = Depends(get_db)
):
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")

    stocks = db.query(MedicineStock).filter(MedicineStock.phc_id == phc_id).all()
    if not stocks:
        raise HTTPException(status_code=404, detail="No stocks found for PHC")

    # Fetch footfall history for outbreak signals
    footfalls = (
        db.query(PatientFootfall)
        .filter(PatientFootfall.phc_id == phc_id)
        .order_by(PatientFootfall.date.desc())
        .limit(30)
        .all()
    )
    footfall_data = [{"date": f.date.isoformat(), "patient_count": f.patient_count} for f in reversed(footfalls)]

    results = []
    for stock in stocks:
        # Fetch historical consumption for this medicine
        logs = (
            db.query(ConsumptionLog)
            .filter(ConsumptionLog.phc_id == phc_id, ConsumptionLog.medicine_name == stock.medicine_name)
            .order_by(ConsumptionLog.date.asc())
            .all()
        )
        history = [{"date": l.date.isoformat(), "quantity": l.quantity_used} for l in logs]

        forecast_res = forecasting_engine.forecast_medicine_demand(
            phc_id=phc.id,
            phc_name=phc.name,
            medicine_name=stock.medicine_name,
            current_stock=stock.quantity,
            buffer_threshold=stock.buffer_threshold,
            daily_consumption_history=history,
            footfall_history=footfall_data,
            forecast_horizon_days=horizon_days
        )
        results.append(forecast_res)

    return results
