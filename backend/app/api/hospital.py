"""
Direct re-export of hospital router as referenced in documentation:
Backend: backend/app/api/hospital.py
"""
from backend.app.api.endpoints.hospital import router

__all__ = ["router"]
