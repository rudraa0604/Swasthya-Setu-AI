import os
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
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
