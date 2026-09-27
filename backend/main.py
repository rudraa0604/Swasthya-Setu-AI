import sys
import os

# Ensure project root is in sys.path regardless of execution directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.core.config import settings
from backend.app.api.api import api_router
from backend.app.db.session import engine, Base

# Create tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience across India's PHC Network."
)

@app.on_event("startup")
def startup_populate_data():
    """Ensure database has initial simulated PHCs, alerts, and recommendations on boot."""
    try:
        from backend.app.db.session import SessionLocal
        from backend.app.models.models import PHC, Alert, RedistributionRecommendation
        from db.seed_data import seed_database
        from ml.alerts.engine import early_warning_engine
        from ml.redistribution.optimizer import redistribution_engine

        db = SessionLocal()
        phc_count = db.query(PHC).count()
        if phc_count < 10:
            print("Database empty or incomplete. Auto-seeding initial Indian PHC network data...")
            seed_database(num_phcs_per_district=10, history_days=45)
            # Reopen session after seed
            db = SessionLocal()

        # Check if alerts exist, if not scan
        alert_count = db.query(Alert).count()
        if alert_count == 0:
            print("Generating initial Early Warning alerts...")
            all_phcs = db.query(PHC).all()
            for p in all_phcs:
                gen_alerts = early_warning_engine.scan_phc_for_alerts(p, db)
                for a in gen_alerts:
                    db.add(a)
            db.commit()

        # Check if recommendations exist, if not generate
        rec_count = db.query(RedistributionRecommendation).count()
        if rec_count == 0:
            print("Generating initial Redistribution Recommendations...")
            from ml.redistribution.optimizer import redistribution_optimizer
            recs = redistribution_optimizer.generate_recommendations_for_state("ST-MH", db)
            for r in recs:
                db.add(r)
            db.commit()

        db.close()
        print("SwasthyaSetu AI Backend data initialization ready.")
    except Exception as e:
        print(f"Startup data check warning: {e}")



# CORS Middleware to allow React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "healthy", "database": "connected"}

# Serve Frontend static files if dist folder exists
frontend_dist = os.path.join(os.getcwd(), "frontend", "dist")
index_html = os.path.join(frontend_dist, "index.html")

if os.path.exists(frontend_dist):
    assets_path = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.api_route("/", methods=["GET", "HEAD"])
    async def serve_root():
        if os.path.exists(index_html):
            return FileResponse(index_html)
        return {"status": "online", "message": "SwasthyaSetu AI Backend"}

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        if os.path.exists(index_html):
            return FileResponse(index_html)
        return {"detail": "Not Found"}
else:
    @app.api_route("/", methods=["GET", "HEAD"])
    def root():
        return {
            "platform": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "online",
            "mode": "Simulated Hackathon Demo",
            "privacy": "Preserved via Local State Nodes & Federated Weight Aggregation"
        }

if __name__ == "__main__":
    import uvicorn
    # Determine module path based on current working directory
    is_in_backend_dir = os.path.exists("app") and os.path.exists("main.py")
    app_module = "main:app" if is_in_backend_dir else "backend.main:app"
    uvicorn.run(app_module, host="0.0.0.0", port=8000, reload=True)

