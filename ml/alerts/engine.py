import uuid
from datetime import datetime, date
from typing import List, Dict, Any
from backend.app.models.models import Alert, PHC, MedicineStock, BedStatus, StaffAttendance, PatientFootfall
from ml.forecasting.engine import forecasting_engine

class EarlyWarningEngine:
    """
    Early Warning Engine for Primary Health Centres.
    Generates multi-dimensional alerts (Stock, Beds, Staff, Outbreak)
    with clear, human-understandable explanations.
    """

    def scan_phc_for_alerts(self, phc: PHC, db_session) -> List[Alert]:
        alerts = []
        now = datetime.utcnow()
        today = date.today()

        # 1. OUTBREAK DETECTION (Footfall spike)
        footfalls = (
            db_session.query(PatientFootfall)
            .filter(PatientFootfall.phc_id == phc.id)
            .order_by(PatientFootfall.date.desc())
            .limit(30)
            .all()
        )
        if len(footfalls) >= 7:
            recent_ff = footfalls[0].patient_count
            baseline_counts = [f.patient_count for f in footfalls[1:]]
            avg_baseline = sum(baseline_counts) / len(baseline_counts)
            
            if recent_ff >= avg_baseline * 1.8 or footfalls[0].is_outbreak_spike:
                pct_surge = round(((recent_ff - avg_baseline) / max(1, avg_baseline)) * 100)
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="outbreak",
                    severity="critical" if pct_surge > 100 else "warning",
                    message=f"Epidemic Footfall Surge ({pct_surge}% above normal baseline)",
                    explanation=(
                        f"Detected {recent_ff} patients today vs 30-day average of {round(avg_baseline)}. "
                        f"Primary tags: {footfalls[0].suspected_disease_tags}. Immediate surge protocol recommended."
                    ),
                    created_at=now,
                    resolved_boolean=False
                ))

        # 2. MEDICINE STOCK ALERTS (Threshold + Forecast-Based)
        stocks = db_session.query(MedicineStock).filter(MedicineStock.phc_id == phc.id).all()
        for stock in stocks:
            # Check threshold
            if stock.quantity <= 0:
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="stock",
                    severity="critical",
                    message=f"STOCK-OUT: {stock.medicine_name}",
                    explanation=f"Zero inventory remaining. Facility cannot dispense this essential medicine.",
                    created_at=now,
                    resolved_boolean=False
                ))
            elif stock.quantity < (stock.buffer_threshold * 0.3):
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="stock",
                    severity="critical",
                    message=f"Critical Shortage: {stock.medicine_name} ({stock.quantity} units left)",
                    explanation=(
                        f"Stock is at {stock.quantity} units (below 30% of buffer threshold {stock.buffer_threshold}). "
                        f"Estimated depletion within ~{round(stock.quantity / max(1.0, stock.daily_consumption_avg), 1)} days."
                    ),
                    created_at=now,
                    resolved_boolean=False
                ))
            elif stock.quantity < stock.buffer_threshold:
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="stock",
                    severity="warning",
                    message=f"Low Stock Buffer: {stock.medicine_name} ({stock.quantity} units)",
                    explanation=f"Stock fell below designated buffer threshold of {stock.buffer_threshold} units.",
                    created_at=now,
                    resolved_boolean=False
                ))

        # 3. BED OCCUPANCY ALERTS
        bed_status = db_session.query(BedStatus).filter(BedStatus.phc_id == phc.id).order_by(BedStatus.timestamp.desc()).first()
        if bed_status:
            total_beds = max(1, bed_status.total_beds)
            occupancy_pct = (bed_status.occupied_beds / total_beds) * 100
            
            if occupancy_pct >= 90 or (bed_status.icu_beds > 0 and bed_status.icu_occupied >= bed_status.icu_beds):
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="bed",
                    severity="critical",
                    message=f"Bed Saturation Alert ({bed_status.occupied_beds}/{total_beds} beds occupied)",
                    explanation=(
                        f"General bed occupancy at {round(occupancy_pct)}%. "
                        f"ICU Status: {bed_status.icu_occupied}/{bed_status.icu_beds} beds occupied. "
                        f"Facility nearing maximum clinical admission capacity."
                    ),
                    created_at=now,
                    resolved_boolean=False
                ))

        # 4. STAFF DEFICIT ALERTS
        attendances = (
            db_session.query(StaffAttendance)
            .filter(StaffAttendance.phc_id == phc.id, StaffAttendance.date == today)
            .all()
        )
        if attendances:
            present_count = sum(1 for a in attendances if a.present_boolean)
            total_staff = len(attendances)
            
            # Check if Medical Officer is present
            mo_present = any(a.present_boolean for a in attendances if "Medical Officer" in a.role or "Doctor" in a.role)
            
            if not mo_present:
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="staff",
                    severity="critical",
                    message=f"Medical Officer Absent Today",
                    explanation=f"No Medical Officer on duty at {phc.name}. Emergency triage capabilities compromised.",
                    created_at=now,
                    resolved_boolean=False
                ))
            elif present_count < (total_staff * 0.6):
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    type="staff",
                    severity="warning",
                    message=f"Severe Staff Deficit ({present_count}/{total_staff} Present)",
                    explanation=f"Attendance is at {round((present_count / total_staff) * 100)}% of sanctioned strength.",
                    created_at=now,
                    resolved_boolean=False
                ))

        return alerts

early_warning_engine = EarlyWarningEngine()
