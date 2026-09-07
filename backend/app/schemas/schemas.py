from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date, datetime

# PHC Schemas
class PHCBase(BaseModel):
    id: str
    name: str
    district_id: str
    district_name: str
    state_id: str
    state_name: str
    lat: float
    lng: float
    sanctioned_staff_count: int = 10
    is_simulated: bool = True

class PHCCreate(PHCBase):
    pass

class PHCOut(PHCBase):
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Medicine Stock Schemas
class MedicineStockBase(BaseModel):
    phc_id: str
    medicine_name: str
    batch_id: str
    quantity: int
    buffer_threshold: int = 100
    daily_consumption_avg: float = 15.0
    expiry_date: date

class MedicineStockCreate(MedicineStockBase):
    pass

class MedicineStockOut(MedicineStockBase):
    id: str
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

# Consumption Log Schemas
class ConsumptionLogBase(BaseModel):
    phc_id: str
    medicine_name: str
    date: date
    quantity_used: int

class ConsumptionLogCreate(ConsumptionLogBase):
    pass

class ConsumptionLogOut(ConsumptionLogBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Bed Status Schemas
class BedStatusBase(BaseModel):
    phc_id: str
    total_beds: int = 20
    occupied_beds: int = 0
    icu_beds: int = 4
    icu_occupied: int = 0

class BedStatusCreate(BedStatusBase):
    pass

class BedStatusOut(BedStatusBase):
    id: str
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

# Staff Attendance Schemas
class StaffAttendanceBase(BaseModel):
    phc_id: str
    staff_id: str
    staff_name: str
    role: str
    date: date
    present_boolean: bool = True

class StaffAttendanceCreate(StaffAttendanceBase):
    pass

class StaffAttendanceOut(StaffAttendanceBase):
    id: str

    class Config:
        from_attributes = True

# Patient Footfall Schemas
class PatientFootfallBase(BaseModel):
    phc_id: str
    date: date
    patient_count: int
    suspected_disease_tags: Optional[str] = "General Outpatient"
    is_outbreak_spike: bool = False

class PatientFootfallCreate(PatientFootfallBase):
    pass

class PatientFootfallOut(PatientFootfallBase):
    id: str

    class Config:
        from_attributes = True

# Alert Schemas
class AlertBase(BaseModel):
    phc_id: str
    type: str
    severity: str
    message: str
    explanation: str
    resolved_boolean: bool = False

class AlertOut(AlertBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Redistribution Recommendation Schemas
class RedistributionRecommendationBase(BaseModel):
    from_phc_id: str
    to_phc_id: str
    medicine_name: str
    quantity: int
    urgency_score: float
    transport_distance_km: float
    reason: str
    status: str = "pending"

class RedistributionRecommendationOut(RedistributionRecommendationBase):
    id: str
    created_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    from_phc_name: Optional[str] = None
    to_phc_name: Optional[str] = None
    district_name: Optional[str] = None

    class Config:
        from_attributes = True

class RedistributionAction(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected|in_transit|completed)$")

# Forecasting Schemas
class DailyForecastPoint(BaseModel):
    date: str
    predicted_demand: float
    projected_stock_level: float
    confidence_lower: float
    confidence_upper: float

class ForecastResponse(BaseModel):
    phc_id: str
    phc_name: str
    medicine_name: str
    current_stock: int
    buffer_threshold: int
    daily_consumption_rate: float
    days_to_stockout: float
    stockout_date: Optional[str] = None
    stockout_probability_pct: float
    urgency_level: str  # Critical, Warning, Healthy
    forecast_horizon_days: int
    forecast_points: List[DailyForecastPoint]
    explanation: str

# Offline sync batch schema
class OfflineSyncItem(BaseModel):
    item_type: str  # stock_update, consumption_log, attendance, footfall
    payload: Dict[str, Any]
    client_timestamp: str

class OfflineSyncBatch(BaseModel):
    phc_id: str
    items: List[OfflineSyncItem]
