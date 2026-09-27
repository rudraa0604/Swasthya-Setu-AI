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
    status_val = status if isinstance(status, str) else getattr(status, "default", "pending")
    state_val = state_id if isinstance(state_id, str) else (getattr(state_id, "default", None) if state_id is not None else None)

    query = db.query(RedistributionRecommendation)
    if status_val and status_val != "all":
        query = query.filter(RedistributionRecommendation.status == status_val)

    recs = query.order_by(RedistributionRecommendation.urgency_score.desc()).all()
    
    # Enrich with facility names
    results = []
    for r in recs:
        from_phc = db.query(PHC).filter(PHC.id == r.from_phc_id).first()
        to_phc = db.query(PHC).filter(PHC.id == r.to_phc_id).first()
        
        if state_val and to_phc and to_phc.state_id != state_val:
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

@router.get("/routes", response_model=Dict[str, Any])
@router.post("/optimize-routes", response_model=Dict[str, Any])
def get_optimized_routes(
    state_id: Optional[str] = Query("ST-MH", description="State ID (e.g. ST-MH)"),
    district_name: Optional[str] = Query(None, description="Optional district filter (e.g. Nashik)"),
    vehicle_capacity: int = Query(600, ge=100, le=5000, description="Vehicle cargo unit capacity"),
    max_stops: int = Query(6, ge=2, le=12, description="Max stops per vehicle loop"),
    db: Session = Depends(get_db)
):
    """
    Runs the multi-stop Vehicle Routing Problem (VRP) AI optimization engine.
    Calculates turn-by-turn waypoints, direct vs loop km savings, fuel reduction,
    and cold-chain compliance for medicine transport vans.
    """
    state_val = state_id if isinstance(state_id, str) else getattr(state_id, "default", "ST-MH")
    dist_val = district_name if isinstance(district_name, str) else getattr(district_name, "default", None)
    cap_val = vehicle_capacity if isinstance(vehicle_capacity, int) else getattr(vehicle_capacity, "default", 600)
    stops_val = max_stops if isinstance(max_stops, int) else getattr(max_stops, "default", 6)

    route_plan = redistribution_optimizer.optimize_delivery_routes(
        state_id=state_val,
        db_session=db,
        district_name=dist_val,
        vehicle_capacity=cap_val,
        max_stops_per_van=stops_val
    )
    return route_plan

@router.post("/find-best-path", response_model=Dict[str, Any])
@router.get("/find-best-path", response_model=Dict[str, Any])
def find_best_path_endpoint(
    origin_id: Optional[str] = Query("PHC-MH-PUN-01", description="Origin PHC or Supply Depot ID"),
    destination_id: Optional[str] = Query("PHC-MH-NAS-01", description="Destination PHC or Outbreak Node ID"),
    objective: Optional[str] = Query("fastest", description="Objective: fastest, shortest, cold_chain, eco, drone"),
    vehicle_type: Optional[str] = Query("reefer_van", description="Vehicle type: reefer_van, ambulance, rapid_carrier, drone"),
    avoid_obstructions: Optional[bool] = Query(True, description="Avoid hazardous segments"),
    db: Session = Depends(get_db)
):
    """
    AI Best Path Finder: Evaluates geo-terrain, highway networks, cold-chain safety,
    and road telemetry to find the optimal delivery trajectory between health facilities.
    """
    orig_val = origin_id if isinstance(origin_id, str) else getattr(origin_id, "default", "PHC-MH-PUN-01")
    dest_val = destination_id if isinstance(destination_id, str) else getattr(destination_id, "default", "PHC-MH-NAS-01")
    obj_val = objective if isinstance(objective, str) else getattr(objective, "default", "fastest")
    veh_val = vehicle_type if isinstance(vehicle_type, str) else getattr(vehicle_type, "default", "reefer_van")
    avoid_val = avoid_obstructions if isinstance(avoid_obstructions, bool) else getattr(avoid_obstructions, "default", True)

    result = redistribution_optimizer.find_best_path(
        origin_id=orig_val,
        destination_id=dest_val,
        db_session=db,
        objective=obj_val,
        vehicle_type=veh_val,
        avoid_obstructions=avoid_val
    )
    return result

@router.post("/simulate-reroute", response_model=Dict[str, Any])
def simulate_incident_reroute_endpoint(
    origin_id: str = Query("PHC-MH-PUN-01"),
    destination_id: str = Query("PHC-MH-NAS-01"),
    blocked_lat: float = Query(19.2000),
    blocked_lng: float = Query(73.5000),
    hazard_type: str = Query("Monsoon Flash Flood / Road Inundation"),
    hazard_radius_km: float = Query(3.5),
    db: Session = Depends(get_db)
):
    """
    Dynamic Incident & Disaster Rerouter: Injects an active roadblock/hazard
    and dynamically recalculates the best safe detour.
    """
    result = redistribution_optimizer.simulate_incident_reroute(
        origin_id=origin_id,
        destination_id=destination_id,
        blocked_lat=blocked_lat,
        blocked_lng=blocked_lng,
        hazard_type=hazard_type,
        hazard_radius_km=hazard_radius_km,
        db_session=db
    )
    return result
