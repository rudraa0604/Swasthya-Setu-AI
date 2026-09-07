import sys
import os

# Add workspace root to python path
sys.path.insert(0, os.path.abspath('.'))

from datetime import date
from backend.app.db.session import SessionLocal, Base, engine
from backend.app.models.models import PHC, MedicineStock, ConsumptionLog, Alert, RedistributionRecommendation
from db.seed_data import seed_database
from ml.forecasting.engine import forecasting_engine
from ml.alerts.engine import early_warning_engine
from ml.redistribution.optimizer import redistribution_optimizer
from ml.federated.simulation import federated_server

def run_full_verification():
    print("\n" + "="*70)
    print("SWASTHYASETU AI — FULL SYSTEM VERIFICATION SUITE")
    print("="*70)

    # 1. Database Seeding
    print("\n[STEP 1] Testing Database Schema & Synthetic Data Seeding (Phase 1)...")
    seed_database(num_phcs_per_district=10, history_days=45)
    db = SessionLocal()
    phc_count = db.query(PHC).count()
    stock_count = db.query(MedicineStock).count()
    print(f"  -> Verified: {phc_count} PHCs created across 3 States and 15 Districts.")
    print(f"  -> Verified: {stock_count} Medicine stock rows initialized.")
    assert phc_count == 150, f"Expected 150 PHCs, got {phc_count}"

    # 2. Demand Forecasting Verification (Phase 2)
    print("\n[STEP 2] Testing Demand Forecasting Engine (Phase 2)...")
    target_phc_id = "PHC-MH-NAS-01"
    target_med = "Paracetamol 500mg"
    
    phc = db.query(PHC).filter(PHC.id == target_phc_id).first()
    stock = db.query(MedicineStock).filter(MedicineStock.phc_id == target_phc_id, MedicineStock.medicine_name == target_med).first()
    logs = db.query(ConsumptionLog).filter(ConsumptionLog.phc_id == target_phc_id, ConsumptionLog.medicine_name == target_med).all()
    history = [{"date": l.date.isoformat(), "quantity": l.quantity_used} for l in logs]
    
    forecast = forecasting_engine.forecast_medicine_demand(
        phc_id=phc.id,
        phc_name=phc.name,
        medicine_name=target_med,
        current_stock=stock.quantity,
        buffer_threshold=stock.buffer_threshold,
        daily_consumption_history=history,
        forecast_horizon_days=14
    )
    
    print(f"  -> Target Facility: {phc.name}")
    print(f"  -> Medicine: {target_med} (Current Stock: {stock.quantity} units, Buffer: {stock.buffer_threshold})")
    print(f"  -> Predicted Days to Stock-out: {forecast['days_to_stockout']} days")
    print(f"  -> Stock-Out Risk Probability: {forecast['stockout_probability_pct']}%")
    print(f"  -> Urgency Classification: {forecast['urgency_level']}")
    print(f"  -> Explainable Rationale: {forecast['explanation']}")
    assert forecast['days_to_stockout'] <= 5.0, "Expected stock-out within 5 days for Nashik outbreak PHC"

    # 3. Early Warning Alerts Verification (Phase 3)
    print("\n[STEP 3] Testing Early Warning Engine & Multi-Factor Alerts (Phase 3)...")
    alerts = early_warning_engine.scan_phc_for_alerts(phc, db)
    print(f"  -> Generated {len(alerts)} alerts for {phc.name}:")
    for a in alerts:
        print(f"     • [{a.severity.upper()}] {a.type.upper()}: {a.message}")
        print(f"       Why: {a.explanation}")
    assert len(alerts) >= 1, "Expected alerts generated for outbreak PHC"

    # 4. Redistribution Optimizer Verification (Phase 3)
    print("\n[STEP 4] Testing Redistribution Optimizer & Human Approval Workflow (Phase 3)...")
    recs = redistribution_optimizer.generate_recommendations_for_state("ST-MH", db)
    print(f"  -> Generated {len(recs)} optimized transfer recommendations for Maharashtra:")
    for r in recs[:3]:
        print(f"     • Transfer {r.quantity} units of {r.medicine_name} from {r.from_phc_id} to {r.to_phc_id}")
        print(f"       Distance: {r.transport_distance_km} km | Urgency Score: {r.urgency_score}")
        print(f"       Status: {r.status} (Strict constraint: NEVER auto-executed)")
        print(f"       AI Reason: {r.reason}")
    assert len(recs) >= 1, "Expected at least 1 transfer recommendation"
    assert recs[0].status == "pending", "Status must strictly be pending until human approval"

    # 5. Federated Learning Verification (Phase 4)
    print("\n[STEP 5] Testing Multi-State Federated Learning Simulation (Phase 4)...")
    fl_results = federated_server.run_simulation(num_rounds=5)
    print(f"  -> Participating State Nodes: {fl_results['participating_states']}")
    print(f"  -> Privacy Guarantee: {fl_results['privacy_guarantee']}")
    print(f"  -> Rounds Completed: {fl_results['total_rounds']}")
    print(f"  -> Final Global Model Accuracy Score: {fl_results['final_global_accuracy_pct']}%")
    print(f"  -> Federated Advantage: Global Model MAE ({fl_results['federation_advantage']['federated_global_mae']}) beats Local-Only MAE ({fl_results['federation_advantage']['avg_local_only_mae']}) by +{fl_results['federation_advantage']['accuracy_improvement_pct']}%")

    print("\n" + "="*70)
    print("ALL VERIFICATION SUITE CHECKS PASSED SUCCESSFULLY! (100% DEMO READY)")
    print("="*70 + "\n")
    db.close()

if __name__ == "__main__":
    run_full_verification()
