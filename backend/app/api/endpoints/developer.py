import uuid
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models.models import (
    PHC, MedicineStock, BedStatus, StaffAttendance, PatientFootfall, Alert, RedistributionRecommendation
)
from db.seed_data import seed_database
from ml.alerts.engine import early_warning_engine
from ml.redistribution.optimizer import redistribution_optimizer

router = APIRouter()

class StockUpdateInput(BaseModel):
    phc_id: str
    medicine_name: str
    batch_id: Optional[str] = "BAT-DEV-001"
    quantity: int
    buffer_threshold: int = 100
    daily_consumption_avg: float = 15.0
    expiry_date: Optional[str] = None

class OutbreakInjectionInput(BaseModel):
    district_name: str = "Nashik"
    surge_multiplier: float = 3.5
    disease_tags: str = "Dengue Fever, Viral Outbreak"
    target_medicine: str = "Paracetamol 500mg"
    target_stock_reduction_pct: int = 85

@router.get("/overview", response_model=Dict[str, Any])
def get_developer_system_overview(db: Session = Depends(get_db)):
    total_phcs = db.query(PHC).count()
    total_stocks = db.query(MedicineStock).count()
    total_footfalls = db.query(PatientFootfall).count()
    total_alerts = db.query(Alert).count()
    pending_recs = db.query(RedistributionRecommendation).filter(RedistributionRecommendation.status == "pending").count()
    
    return {
        "system_status": "ONLINE (Developer Master Console)",
        "total_phcs": total_phcs,
        "total_stock_records": total_stocks,
        "total_footfall_records": total_footfalls,
        "total_active_alerts": total_alerts,
        "pending_transfers": pending_recs,
        "database_backend": "SQLite / PostgreSQL (SQLAlchemy ORM)",
        "ml_engines": {
            "forecasting": "Time-Series Depletion Curve & Multi-horizon Regressor",
            "early_warning": "Dynamic Multi-factor Anomaly Engine",
            "redistribution": "PuLP Transportation Optimization Solver",
            "federated_learning": "Flower-compatible FedAvg Multi-Node Coordinator"
        }
    }

@router.post("/stocks", response_model=Dict[str, Any])
def add_or_update_stock(input_data: StockUpdateInput, db: Session = Depends(get_db)):
    stock = (
        db.query(MedicineStock)
        .filter(MedicineStock.phc_id == input_data.phc_id, MedicineStock.medicine_name == input_data.medicine_name)
        .first()
    )
    
    exp_date = (
        date.fromisoformat(input_data.expiry_date)
        if input_data.expiry_date
        else date.today() + timedelta(days=365)
    )

    if stock:
        stock.quantity = input_data.quantity
        stock.buffer_threshold = input_data.buffer_threshold
        stock.daily_consumption_avg = input_data.daily_consumption_avg
        stock.batch_id = input_data.batch_id
        stock.expiry_date = exp_date
        stock.last_updated = datetime.utcnow()
        action = "updated"
    else:
        stock = MedicineStock(
            id=str(uuid.uuid4())[:16],
            phc_id=input_data.phc_id,
            medicine_name=input_data.medicine_name,
            batch_id=input_data.batch_id,
            quantity=input_data.quantity,
            buffer_threshold=input_data.buffer_threshold,
            daily_consumption_avg=input_data.daily_consumption_avg,
            expiry_date=exp_date,
            last_updated=datetime.utcnow()
        )
        db.add(stock)
        action = "created"

    db.commit()
    return {"status": "success", "action": action, "stock_id": stock.id, "medicine": stock.medicine_name, "quantity": stock.quantity}

@router.delete("/stocks/{stock_id}", response_model=Dict[str, Any])
def delete_stock(stock_id: str, db: Session = Depends(get_db)):
    stock = db.query(MedicineStock).filter(MedicineStock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock record not found")
    db.delete(stock)
    db.commit()
    return {"status": "success", "message": f"Stock {stock_id} deleted"}

@router.post("/trigger-outbreak", response_model=Dict[str, Any])
def inject_outbreak_stress_test(input_data: OutbreakInjectionInput, db: Session = Depends(get_db)):
    """
    Developer tool: Injects a customized footfall surge and medicine deficit into all PHCs of a district
    to test the Early Warning System and Redistribution Optimizer in real-time.
    """
    phcs = db.query(PHC).filter(PHC.district_name == input_data.district_name).all()
    if not phcs:
        raise HTTPException(status_code=404, detail=f"No PHCs found in district {input_data.district_name}")

    today = date.today()
    updated_phcs = 0

    for phc in phcs:
        # 1. Inject outbreak footfall spike
        surge_count = int(80 * input_data.surge_multiplier)
        ff = (
            db.query(PatientFootfall)
            .filter(PatientFootfall.phc_id == phc.id, PatientFootfall.date == today)
            .first()
        )
        if ff:
            ff.patient_count = surge_count
            ff.is_outbreak_spike = True
            ff.suspected_disease_tags = input_data.disease_tags
        else:
            ff = PatientFootfall(
                id=str(uuid.uuid4())[:16],
                phc_id=phc.id,
                date=today,
                patient_count=surge_count,
                suspected_disease_tags=input_data.disease_tags,
                is_outbreak_spike=True
            )
            db.add(ff)

        # 2. Reduce target medicine stock to trigger emergency shortage
        stock = (
            db.query(MedicineStock)
            .filter(MedicineStock.phc_id == phc.id, MedicineStock.medicine_name == input_data.target_medicine)
            .first()
        )
        if stock:
            reduction_factor = (100 - input_data.target_stock_reduction_pct) / 100.0
            stock.quantity = max(5, int(stock.buffer_threshold * reduction_factor * 0.25))
            stock.last_updated = datetime.utcnow()

        # 3. Increase bed occupancy
        bed = db.query(BedStatus).filter(BedStatus.phc_id == phc.id).first()
        if bed:
            bed.occupied_beds = int(bed.total_beds * 0.95)
            bed.icu_occupied = bed.icu_beds

        updated_phcs += 1

    db.commit()

    # Re-run alert scan automatically
    for phc in phcs:
        alerts = early_warning_engine.scan_phc_for_alerts(phc, db)
        for a in alerts:
            db.add(a)
    db.commit()

    # Re-run redistribution optimizer automatically for the affected state
    if phcs:
        recs = redistribution_optimizer.generate_recommendations_for_state(phcs[0].state_id, db)
        for r in recs:
            existing = (
                db.query(RedistributionRecommendation)
                .filter(
                    RedistributionRecommendation.from_phc_id == r.from_phc_id,
                    RedistributionRecommendation.to_phc_id == r.to_phc_id,
                    RedistributionRecommendation.medicine_name == r.medicine_name,
                    RedistributionRecommendation.status == "pending"
                )
                .first()
            )
            if not existing:
                db.add(r)
        db.commit()

    return {
        "status": "success",
        "district": input_data.district_name,
        "phcs_affected": updated_phcs,
        "surge_footfall": f"{int(80 * input_data.surge_multiplier)} patients/day",
        "target_medicine_depleted": input_data.target_medicine,
        "message": f"Simulated {input_data.disease_tags} outbreak in {input_data.district_name}. Stock depletion, alerts, and redistribution recommendations regenerated!"
    }

@router.post("/reset-healthy", response_model=Dict[str, Any])
def reset_all_stocks_to_healthy(db: Session = Depends(get_db)):
    """
    Developer tool: Resets all medicine inventory stocks and bed statuses to optimal healthy levels.
    """
    stocks = db.query(MedicineStock).all()
    for s in stocks:
        s.quantity = int(s.buffer_threshold * 2.5)
        s.last_updated = datetime.utcnow()

    beds = db.query(BedStatus).all()
    for b in beds:
        b.occupied_beds = int(b.total_beds * 0.4)
        b.icu_occupied = 1

    # Clear active alerts
    db.query(Alert).filter(Alert.resolved_boolean == False).delete()
    db.commit()

    return {"status": "success", "message": f"Reset {len(stocks)} medicine stock rows to healthy surplus inventory."}

@router.post("/reseed-database", response_model=Dict[str, Any])
def trigger_database_reseed():
    """
    Developer tool: Completely wipes and re-seeds the synthetic 150 PHC database.
    """
    seed_database(num_phcs_per_district=10, history_days=45)
    return {"status": "success", "message": "Database completely re-seeded with 150 PHCs, 60-day historical time-series, and Nashik outbreak scenario."}
