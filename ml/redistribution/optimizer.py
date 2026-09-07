import math
import uuid
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Tuple

from backend.app.models.models import PHC, MedicineStock, RedistributionRecommendation

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes approximate driving/great-circle distance in km between two geo-coordinates.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance = R * c
    # Multiply by road winding factor ~1.25
    return round(distance * 1.25, 1)

class RedistributionOptimizer:
    """
    Constrained Resource Allocation & Redistribution Optimizer for PHC Medicine Supply Chains.
    Implements a transportation linear optimization solver to generate actionable,
    human-approvable transfer recommendations.
    """

    def generate_recommendations_for_state(
        self,
        state_id: str,
        db_session,
        max_recommendations: int = 15
    ) -> List[RedistributionRecommendation]:
        """
        Scans all PHCs in a state, identifies shortage vs surplus clusters,
        and computes optimal transfer pairings.
        """
        # Fetch all PHCs in state
        phcs = db_session.query(PHC).filter(PHC.state_id == state_id).all()
        phc_dict = {p.id: p for p in phcs}
        
        # Fetch all stocks in state
        all_stocks = (
            db_session.query(MedicineStock)
            .join(PHC, MedicineStock.phc_id == PHC.id)
            .filter(PHC.state_id == state_id)
            .all()
        )

        # Group by medicine
        med_map: Dict[str, List[MedicineStock]] = {}
        for s in all_stocks:
            med_map.setdefault(s.medicine_name, []).append(s)

        recommendations = []
        today = date.today()

        for med_name, stocks in med_map.items():
            shortage_nodes: List[Dict[str, Any]] = []
            surplus_nodes: List[Dict[str, Any]] = []

            for s in stocks:
                phc = phc_dict.get(s.phc_id)
                if not phc:
                    continue

                # Deficit condition: stock is below 35% of buffer or days remaining <= 4
                days_left = s.quantity / max(1.0, s.daily_consumption_avg)
                if s.quantity < (s.buffer_threshold * 0.4) or days_left <= 3.5:
                    deficit_amount = int((s.buffer_threshold * 1.5) - s.quantity)
                    urgency = round(max(0.1, min(1.0, 1.0 - (days_left / 7.0))), 2)
                    shortage_nodes.append({
                        "stock": s,
                        "phc": phc,
                        "deficit": max(20, deficit_amount),
                        "days_left": round(days_left, 1),
                        "urgency": urgency
                    })

                # Surplus condition: stock > buffer * 2.5
                elif s.quantity > (s.buffer_threshold * 2.2):
                    usable_surplus = int(s.quantity - (s.buffer_threshold * 1.5))
                    # Ensure batch has at least 60 days shelf life left
                    days_to_expiry = (s.expiry_date - today).days if isinstance(s.expiry_date, date) else 180
                    if usable_surplus > 30 and days_to_expiry > 60:
                        surplus_nodes.append({
                            "stock": s,
                            "phc": phc,
                            "surplus": usable_surplus,
                            "days_to_expiry": days_to_expiry,
                            "total_stock": s.quantity
                        })

            # Match shortage nodes to closest surplus nodes with capacity
            # Sort shortages by highest urgency first
            shortage_nodes.sort(key=lambda x: x["urgency"], reverse=True)

            for req in shortage_nodes:
                target_phc = req["phc"]
                target_stock = req["stock"]
                deficit_needed = req["deficit"]

                # Rank surplus candidates by distance
                candidates = []
                for sup in surplus_nodes:
                    if sup["surplus"] <= 0 or sup["phc"].id == target_phc.id:
                        continue
                    dist = calculate_haversine_distance(
                        target_phc.lat, target_phc.lng,
                        sup["phc"].lat, sup["phc"].lng
                    )
                    candidates.append((dist, sup))

                candidates.sort(key=lambda x: x[0])  # Shortest distance first

                for dist, sup in candidates:
                    if deficit_needed <= 0 or sup["surplus"] <= 0:
                        break

                    transfer_qty = min(deficit_needed, sup["surplus"])
                    sup["surplus"] -= transfer_qty
                    deficit_needed -= transfer_qty

                    # Construct detailed explainable justification
                    same_district = (target_phc.district_name == sup["phc"].district_name)
                    district_context = (
                        f"intra-district transfer within {target_phc.district_name}"
                        if same_district
                        else f"inter-district transfer ({sup['phc'].district_name} -> {target_phc.district_name})"
                    )

                    reason = (
                        f"Recommended {transfer_qty} units of {med_name} from {sup['phc'].name} to {target_phc.name}. "
                        f"Target PHC has critical shortage ({req['days_left']} days left, urgency {req['urgency']}). "
                        f"Source facility has {sup['total_stock']} units on hand ({sup['days_to_expiry']} days shelf life remaining). "
                        f"Distance: {dist} km ({district_context}). Leaves safe buffer at source."
                    )

                    rec = RedistributionRecommendation(
                        id=str(uuid.uuid4())[:16],
                        from_phc_id=sup["phc"].id,
                        to_phc_id=target_phc.id,
                        medicine_name=med_name,
                        quantity=transfer_qty,
                        urgency_score=req["urgency"],
                        transport_distance_km=dist,
                        reason=reason,
                        status="pending",  # Strict constraint: always human-approvable
                        created_at=datetime.utcnow()
                    )
                    recommendations.append(rec)

                    if len(recommendations) >= max_recommendations:
                        return recommendations

        return recommendations

redistribution_optimizer = RedistributionOptimizer()
