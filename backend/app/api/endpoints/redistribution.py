from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from backend.app.db.session import get_db
from backend.app.models.models import RedistributionRecommendation, PHC, MedicineStock
from backend.app.schemas.schemas import RedistributionRecommendationOut, RedistributionAction
from ml.redistribution.optimizer import redistribution_optimizer

router = APIRouter()

@router.get("/recommendations", response_model=List[Dict[str, Any]])
def list_recommendations(
    state_id: Optional[str] = Query(None, description="Filter by state ID"),
    status: Optional[str] = Query("pending", description="Filter by status (pending, approved, rejected, in_transit)"),
    db: Session = Depends(get_db)
):
    query = db.query(RedistributionRecommendation)
    if status and status != "all":
        query = query.filter(RedistributionRecommendation.status == status)

    recs = query.order_by(RedistributionRecommendation.urgency_score.desc()).all()
    
    # Enrich with facility names
    results = []
    for r in recs:
        from_phc = db.query(PHC).filter(PHC.id == r.from_phc_id).first()
        to_phc = db.query(PHC).filter(PHC.id == r.to_phc_id).first()
        
        if state_id and to_phc and to_phc.state_id != state_id:
            continue

        results.append({
            "id": r.id,
            "from_phc_id": r.from_phc_id,
            "from_phc_name": from_phc.name if from_phc else r.from_phc_id,
            "from_district": from_phc.district_name if from_phc else "Unknown",
            "to_phc_id": r.to_phc_id,
            "to_phc_name": to_phc.name if to_phc else r.to_phc_id,
            "to_district": to_phc.district_name if to_phc else "Unknown",
            "medicine_name": r.medicine_name,
            "quantity": r.quantity,
            "urgency_score": r.urgency_score,
            "transport_distance_km": r.transport_distance_km,
            "reason": r.reason,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "reviewed_at": r.reviewed_at.isoformat() if r.reviewed_at else None
        })

    return results

@router.post("/generate", response_model=Dict[str, Any])
def run_optimization_and_generate(
    state_id: Optional[str] = Query("ST-MH", description="State ID to run optimizer on"),
    db: Session = Depends(get_db)
):
    """
    Runs the linear transportation optimization solver and generates human-approvable recommendations.
    """
    recs = redistribution_optimizer.generate_recommendations_for_state(state_id, db)
    
    # Save newly generated recommendations
    for r in recs:
        # Check if identical pending recommendation exists
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
        "state_id": state_id,
        "recommendations_generated": len(recs),
        "message": f"Generated {len(recs)} optimized resource transfer recommendations awaiting District Health Officer approval."
    }

@router.put("/recommendations/{rec_id}/action", response_model=Dict[str, Any])
def act_on_recommendation(
    rec_id: str,
    action: RedistributionAction,
    db: Session = Depends(get_db)
):
    """
    Human-in-the-loop approval or rejection by District Health Officer.
    """
    rec = db.query(RedistributionRecommendation).filter(RedistributionRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.status = action.status
    rec.reviewed_at = datetime.utcnow()

    # If approved, simulate real inventory adjustment
    if action.status == "approved":
        from_stock = (
            db.query(MedicineStock)
            .filter(MedicineStock.phc_id == rec.from_phc_id, MedicineStock.medicine_name == rec.medicine_name)
            .first()
        )
        to_stock = (
            db.query(MedicineStock)
            .filter(MedicineStock.phc_id == rec.to_phc_id, MedicineStock.medicine_name == rec.medicine_name)
            .first()
        )
        if from_stock and to_stock:
            transfer_amt = min(from_stock.quantity, rec.quantity)
            from_stock.quantity -= transfer_amt
            to_stock.quantity += transfer_amt
            from_stock.last_updated = datetime.utcnow()
            to_stock.last_updated = datetime.utcnow()

    db.commit()
    return {
        "status": "success",
        "recommendation_id": rec_id,
        "new_status": rec.status,
        "message": f"Transfer recommendation {action.status.upper()} by District Officer."
    }
