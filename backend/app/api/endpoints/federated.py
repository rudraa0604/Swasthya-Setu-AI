from fastapi import APIRouter, Query
from typing import Dict, Any

from ml.federated.simulation import federated_server

router = APIRouter()

@router.get("/status", response_model=Dict[str, Any])
def get_federated_status():
    """
    Returns current federated learning status, round history, and privacy guarantees.
    """
    if not federated_server.round_history:
        # Run a baseline simulation if not yet executed
        return federated_server.run_simulation(num_rounds=5)
    
    return {
        "status": "active",
        "total_rounds": len(federated_server.round_history),
        "participating_states": ["Maharashtra (Simulated)", "Karnataka (Simulated)", "Uttar Pradesh (Simulated)"],
        "privacy_guarantee": "ZERO raw patient/stock records transmitted. Aggregation uses strictly model weight vectors (FedAvg).",
        "rounds_history": federated_server.round_history,
        "latest_round": federated_server.round_history[-1] if federated_server.round_history else None
    }

@router.post("/simulate", response_model=Dict[str, Any])
def run_federated_simulation(
    rounds: int = Query(5, ge=2, le=10, description="Number of federated averaging rounds")
):
    """
    Triggers simulated federated learning round across 3 state nodes.
    """
    result = federated_server.run_simulation(num_rounds=rounds)
    return result
