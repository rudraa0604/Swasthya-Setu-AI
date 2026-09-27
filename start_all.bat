@echo off
echo ====================================================
echo Launching SwasthyaSetu AI (Backend + Vite Frontend)
echo ====================================================
start "SwasthyaSetu Backend (FastAPI)" cmd /k "cd /d %~dp0 && python backend\main.py"
start "SwasthyaSetu Frontend (Vite React)" cmd /k "cd /d %~dp0\frontend && npm run dev"
echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend API & Docs: http://localhost:8000/docs
