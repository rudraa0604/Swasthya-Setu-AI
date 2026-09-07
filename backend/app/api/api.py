from fastapi import APIRouter
from backend.app.api.endpoints import phcs, stocks, forecasts, alerts, redistribution, federated, sync, developer

api_router = APIRouter()

api_router.include_router(phcs.router, prefix="/phcs", tags=["PHCs & Rollups"])
api_router.include_router(stocks.router, prefix="/stocks", tags=["Medicine Stocks"])
api_router.include_router(forecasts.router, prefix="/forecast", tags=["Demand Forecasting"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Early Warning Alerts"])
api_router.include_router(redistribution.router, prefix="/redistribution", tags=["Redistribution Optimizer"])
api_router.include_router(federated.router, prefix="/federated", tags=["Federated Learning"])
api_router.include_router(sync.router, prefix="/sync", tags=["Offline Edge Sync"])
api_router.include_router(developer.router, prefix="/dev", tags=["Developer Admin Operations"])

