from sqlalchemy import Column, String, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.db.session import Base

class PHC(Base):
    __tablename__ = "phcs"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    district_id = Column(String(64), nullable=False, index=True)
    district_name = Column(String(255), nullable=False)
    state_id = Column(String(64), nullable=False, index=True)
    state_name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    sanctioned_staff_count = Column(Integer, default=10)
    is_simulated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    stocks = relationship("MedicineStock", back_populates="phc", cascade="all, delete-orphan")
    consumption_logs = relationship("ConsumptionLog", back_populates="phc", cascade="all, delete-orphan")
    bed_statuses = relationship("BedStatus", back_populates="phc", cascade="all, delete-orphan")
    staff_attendances = relationship("StaffAttendance", back_populates="phc", cascade="all, delete-orphan")
    patient_footfalls = relationship("PatientFootfall", back_populates="phc", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="phc", cascade="all, delete-orphan")


class MedicineStock(Base):
    __tablename__ = "medicine_stocks"

    id = Column(String(64), primary_key=True, index=True)
    phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(255), nullable=False, index=True)
    batch_id = Column(String(64), nullable=False)
    quantity = Column(Integer, nullable=False)
    buffer_threshold = Column(Integer, default=100)
    daily_consumption_avg = Column(Float, default=15.0)
    expiry_date = Column(Date, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    phc = relationship("PHC", back_populates="stocks")


class ConsumptionLog(Base):
    __tablename__ = "consumption_logs"

    id = Column(String(64), primary_key=True, index=True)
    phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(255), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    quantity_used = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    phc = relationship("PHC", back_populates="consumption_logs")


class BedStatus(Base):
    __tablename__ = "bed_statuses"

    id = Column(String(64), primary_key=True, index=True)
    phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    total_beds = Column(Integer, default=20)
    occupied_beds = Column(Integer, default=0)
    icu_beds = Column(Integer, default=4)
    icu_occupied = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    phc = relationship("PHC", back_populates="bed_statuses")


class StaffAttendance(Base):
    __tablename__ = "staff_attendances"

    id = Column(String(64), primary_key=True, index=True)
    phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    staff_id = Column(String(64), nullable=False)
    staff_name = Column(String(255), nullable=False)
    role = Column(String(64), nullable=False)  # Medical Officer, Staff Nurse, Pharmacist, Lab Technician, ANM
    date = Column(Date, nullable=False, index=True)
    present_boolean = Column(Boolean, default=True)

    phc = relationship("PHC", back_populates="staff_attendances")


class PatientFootfall(Base):
    __tablename__ = "patient_footfalls"

    id = Column(String(64), primary_key=True, index=True)
    phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    patient_count = Column(Integer, nullable=False)
    suspected_disease_tags = Column(String(255), default="General Outpatient")
    is_outbreak_spike = Column(Boolean, default=False)

    phc = relationship("PHC", back_populates="patient_footfalls")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, index=True)
    phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(32), nullable=False)  # stock, bed, staff, outbreak
    severity = Column(String(16), nullable=False)  # critical, warning, info
    message = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_boolean = Column(Boolean, default=False)

    phc = relationship("PHC", back_populates="alerts")


class RedistributionRecommendation(Base):
    __tablename__ = "redistribution_recommendations"

    id = Column(String(64), primary_key=True, index=True)
    from_phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    to_phc_id = Column(String(64), ForeignKey("phcs.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    urgency_score = Column(Float, nullable=False)  # 0.0 - 1.0
    transport_distance_km = Column(Float, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(32), default="pending")  # pending, approved, rejected, in_transit, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    from_phc = relationship("PHC", foreign_keys=[from_phc_id])
    to_phc = relationship("PHC", foreign_keys=[to_phc_id])


class FederatedModelUpdate(Base):
    __tablename__ = "federated_model_updates"

    id = Column(String(64), primary_key=True, index=True)
    state_id = Column(String(64), nullable=False, index=True)
    round_number = Column(Integer, nullable=False)
    model_weights_ref = Column(String(255), nullable=False)
    accuracy_metric = Column(Float, nullable=False)
    local_samples_count = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
