"""
Emergency Resource Planner Module for Hospital Resource Optimization.
Calculates dynamic safety-stock levels for ventilators, medical oxygen, blood bank units,
trauma triage kits, and ambulances to absorb unexpected surge events.
"""

import math
from typing import List, Dict, Any, Optional

class HospitalEmergencyPlanner:
    """
    Dynamic safety-stock and readiness planner for critical emergency assets.
    """

    def __init__(self):
        # Service level factor Z (e.g. 99% availability = Z = 2.33)
        self.z_service_level = 2.33

    def evaluate_emergency_readiness(
        self,
        hospital_id: str,
        predicted_surge_multiplier: float = 1.0
    ) -> Dict[str, Any]:
        """
        Calculates live status, safety stock requirements, and identified gaps.
        """
        # Critical equipment inventory
        resources = [
            {
                "id": "EQ-VENT",
                "name": "ICU Mechanical Ventilators",
                "category": "Life Support",
                "total_available": 32,
                "currently_in_use": 24,
                "current_buffer": 8,
                "recommended_safety_stock": max(6, int(8 * predicted_surge_multiplier)),
                "unit": "units"
            },
            {
                "id": "EQ-O2-BULK",
                "name": "Liquid Medical Oxygen (LMO Bulk Tank)",
                "category": "Oxygenation",
                "total_available": 10.0, # KL
                "currently_in_use": 6.8,  # KL
                "current_buffer": 3.2,
                "recommended_safety_stock": round(max(3.0, 3.5 * predicted_surge_multiplier), 1),
                "unit": "KL"
            },
            {
                "id": "EQ-O2-CYL",
                "name": "Type-D Jumbo Oxygen Cylinders",
                "category": "Oxygenation",
                "total_available": 120,
                "currently_in_use": 85,
                "current_buffer": 35,
                "recommended_safety_stock": max(30, int(35 * predicted_surge_multiplier)),
                "unit": "cylinders"
            },
            {
                "id": "EQ-BLOOD-O-NEG",
                "name": "Blood Bank: O-Negative (Universal Donor)",
                "category": "Transfusion",
                "total_available": 28,
                "currently_in_use": 16,
                "current_buffer": 12,
                "recommended_safety_stock": max(10, int(14 * predicted_surge_multiplier)),
                "unit": "units"
            },
            {
                "id": "EQ-BLOOD-OTH",
                "name": "Blood Bank: General Groups (A+, B+, O+, AB+)",
                "category": "Transfusion",
                "total_available": 140,
                "currently_in_use": 82,
                "current_buffer": 58,
                "recommended_safety_stock": max(50, int(60 * predicted_surge_multiplier)),
                "unit": "units"
            },
            {
                "id": "EQ-TRAUMA-KIT",
                "name": "Sterile Mass-Casualty Trauma Triage Kits",
                "category": "Disaster Kits",
                "total_available": 50,
                "currently_in_use": 12,
                "current_buffer": 38,
                "recommended_safety_stock": max(30, int(40 * predicted_surge_multiplier)),
                "unit": "kits"
            },
            {
                "id": "EQ-AMB-ALS",
                "name": "ALS (Advanced Life Support) Ambulances",
                "category": "Transport",
                "total_available": 6,
                "currently_in_use": 3,
                "current_buffer": 3,
                "recommended_safety_stock": max(2, int(3 * predicted_surge_multiplier)),
                "unit": "vehicles"
            },
            {
                "id": "EQ-AMB-BLS",
                "name": "BLS (Basic Life Support) Patient Ambulances",
                "category": "Transport",
                "total_available": 8,
                "currently_in_use": 4,
                "current_buffer": 4,
                "recommended_safety_stock": max(3, int(4 * predicted_surge_multiplier)),
                "unit": "vehicles"
            }
        ]

        evaluated_items = []
        critical_gaps = []

        for r in resources:
            buffer_diff = r["current_buffer"] - r["recommended_safety_stock"]
            status = "safe" if buffer_diff >= 0 else ("warning" if buffer_diff >= -2 else "critical_deficit")

            if buffer_diff < 0:
                deficit_amount = abs(buffer_diff)
                critical_gaps.append({
                    "item_id": r["id"],
                    "item_name": r["name"],
                    "deficit_amount": deficit_amount,
                    "unit": r["unit"],
                    "urgency": "high" if status == "critical_deficit" else "medium",
                    "action_required": f"Preemptively restock {deficit_amount} {r['unit']} of {r['name']} to meet safety-stock threshold."
                })

            evaluated_items.append({
                **r,
                "buffer_variance": buffer_diff,
                "readiness_status": status,
                "availability_pct": round(((r["total_available"] - r["currently_in_use"]) / max(1, r["total_available"])) * 100, 1)
            })

        # Overall readiness score (0 - 100%)
        readiness_score = round(sum(1 for e in evaluated_items if e["readiness_status"] == "safe") / len(evaluated_items) * 100, 1)

        return {
            "hospital_id": hospital_id,
            "readiness_index_score": readiness_score,
            "readiness_level": "Optimal" if readiness_score >= 85 else ("Moderate Readiness" if readiness_score >= 65 else "Surge Risk Alert"),
            "surge_multiplier_applied": predicted_surge_multiplier,
            "monitored_equipment": evaluated_items,
            "identified_readiness_gaps": critical_gaps,
            "preemptive_recommendations": [
                "Trigger automated replenishment request to District Medical Depot for O-Negative blood units.",
                "Verify backup manifold pressure for LMO oxygen line ahead of predicted admissions peak.",
                "Stage 2 ALS ambulances at ER rapid-deployment bay for emergency highway transit."
            ]
        }

hospital_emergency_planner = HospitalEmergencyPlanner()
