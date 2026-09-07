import os
import random
import uuid
from datetime import date, datetime, timedelta
import math

from backend.app.core.config import settings
from backend.app.db.session import SessionLocal, Base, engine
from backend.app.models.models import (
    PHC, MedicineStock, ConsumptionLog, BedStatus,
    StaffAttendance, PatientFootfall, Alert, RedistributionRecommendation, FederatedModelUpdate
)

# Seed coordinates for districts in 3 states
DISTRICT_CENTROIDS = {
    # Maharashtra
    "Pune": {"lat": 18.5204, "lng": 73.8567, "state": "Maharashtra (Simulated)", "state_id": "ST-MH"},
    "Nashik": {"lat": 19.9975, "lng": 73.7898, "state": "Maharashtra (Simulated)", "state_id": "ST-MH"},
    "Nagpur": {"lat": 21.1458, "lng": 79.0882, "state": "Maharashtra (Simulated)", "state_id": "ST-MH"},
    "Thane": {"lat": 19.2183, "lng": 72.9781, "state": "Maharashtra (Simulated)", "state_id": "ST-MH"},
    "Satara": {"lat": 17.6805, "lng": 73.9930, "state": "Maharashtra (Simulated)", "state_id": "ST-MH"},
    # Karnataka
    "Bengaluru Rural": {"lat": 13.2285, "lng": 77.5828, "state": "Karnataka (Simulated)", "state_id": "ST-KA"},
    "Mysuru": {"lat": 12.2958, "lng": 76.6394, "state": "Karnataka (Simulated)", "state_id": "ST-KA"},
    "Belagavi": {"lat": 15.8497, "lng": 74.4977, "state": "Karnataka (Simulated)", "state_id": "ST-KA"},
    "Dharwad": {"lat": 15.4589, "lng": 75.0078, "state": "Karnataka (Simulated)", "state_id": "ST-KA"},
    "Ballari": {"lat": 15.1394, "lng": 76.9214, "state": "Karnataka (Simulated)", "state_id": "ST-KA"},
    # Uttar Pradesh
    "Varanasi": {"lat": 25.3176, "lng": 82.9739, "state": "Uttar Pradesh (Simulated)", "state_id": "ST-UP"},
    "Lucknow": {"lat": 26.8467, "lng": 80.9462, "state": "Uttar Pradesh (Simulated)", "state_id": "ST-UP"},
    "Gorakhpur": {"lat": 26.7606, "lng": 83.3732, "state": "Uttar Pradesh (Simulated)", "state_id": "ST-UP"},
    "Prayagraj": {"lat": 25.4358, "lng": 81.8463, "state": "Uttar Pradesh (Simulated)", "state_id": "ST-UP"},
    "Agra": {"lat": 27.1767, "lng": 78.0081, "state": "Uttar Pradesh (Simulated)", "state_id": "ST-UP"}
}

MEDICINE_SPECS = [
    {"name": "Paracetamol 500mg", "base_daily": 35, "buffer": 200, "shelf_life_days": 540},
    {"name": "Amoxicillin 250mg", "base_daily": 20, "buffer": 150, "shelf_life_days": 365},
    {"name": "ORS Sachet (Oral Rehydration Salts)", "base_daily": 45, "buffer": 250, "shelf_life_days": 720},
    {"name": "Rabies Vaccine (Anti-Rabies)", "base_daily": 5, "buffer": 30, "shelf_life_days": 180},
    {"name": "Insulin Regular 40IU", "base_daily": 8, "buffer": 50, "shelf_life_days": 240},
    {"name": "Doxycycline 100mg", "base_daily": 15, "buffer": 100, "shelf_life_days": 365},
    {"name": "IV Normal Saline 500ml", "base_daily": 25, "buffer": 180, "shelf_life_days": 720},
    {"name": "Artesunate (Anti-Malarial)", "base_daily": 6, "buffer": 40, "shelf_life_days": 300}
]

STAFF_ROLES = [
    ("Medical Officer", 2),
    ("Staff Nurse", 4),
    ("Pharmacist", 1),
    ("Lab Technician", 1),
    ("ANM / Healthcare Worker", 2)
]

def seed_database(num_phcs_per_district=10, history_days=45):
    random.seed(42)  # Deterministic seed for reproducible demo
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    today = date.today()
    
    print("=" * 60)
    print("Seeding SwasthyaSetu AI Database...")
    print(f"Generating data for 3 States, 15 Districts, {num_phcs_per_district} PHCs each = {15 * num_phcs_per_district} PHCs total.")
    print(f"History horizon: {history_days} days. Outbreak target: Nashik District (Maharashtra).")
    print("=" * 60)
    
    phc_list = []
    
    # 1. Create PHCs
    for district_name, meta in DISTRICT_CENTROIDS.items():
        state_id = meta["state_id"]
        state_name = meta["state"]
        dist_code = district_name[:3].upper().replace(" ", "")
        
        for i in range(1, num_phcs_per_district + 1):
            phc_id = f"PHC-{state_id[3:]}-{dist_code}-{i:02d}"
            # Scatter coordinates slightly around centroid (within ~20km)
            lat_jitter = meta["lat"] + (random.random() - 0.5) * 0.25
            lng_jitter = meta["lng"] + (random.random() - 0.5) * 0.25
            
            phc = PHC(
                id=phc_id,
                name=f"{district_name} PHC #{i} ({'Rural' if i > 3 else 'Community Health Sub-center'})",
                district_id=f"DIST-{dist_code}",
                district_name=district_name,
                state_id=state_id,
                state_name=state_name,
                lat=round(lat_jitter, 5),
                lng=round(lng_jitter, 5),
                sanctioned_staff_count=10,
                is_simulated=True
            )
            db.add(phc)
            phc_list.append(phc)
    
    db.commit()
    print(f"Created {len(phc_list)} PHC records.")
    
    # 2. Populate Stocks, Historical Consumption, Footfall, Beds, Staff
    consumption_records = []
    stock_records = []
    footfall_records = []
    bed_records = []
    staff_records = []
    
    for phc in phc_list:
        is_nashik_outbreak = (phc.district_name == "Nashik" and phc.id.endswith(("-01", "-02", "-03", "-04")))
        is_pune_surplus = (phc.district_name == "Pune" and phc.id.endswith(("-01", "-02", "-03")))
        is_lucknow_shortage = (phc.district_name == "Lucknow" and phc.id.endswith(("-01", "-02")))
        
        # A. Footfall history
        for d in range(history_days, -1, -1):
            cur_date = today - timedelta(days=d)
            # Base footfall
            day_of_week = cur_date.weekday()
            dow_multiplier = 1.2 if day_of_week in [0, 1] else (0.7 if day_of_week == 6 else 1.0)
            
            if is_nashik_outbreak and d <= 10:
                # Outbreak surge in last 10 days
                surge_multiplier = 2.8 + (10 - d) * 0.25
                patient_count = int(random.randint(90, 140) * surge_multiplier)
                disease_tags = "Dengue Fever,Viral Outbreak,Dehydration"
                is_spike = True
            else:
                patient_count = int(random.randint(45, 95) * dow_multiplier)
                disease_tags = "General Outpatient,Seasonal Flu"
                is_spike = False
                
            footfall_records.append(PatientFootfall(
                id=str(uuid.uuid4())[:16],
                phc_id=phc.id,
                date=cur_date,
                patient_count=patient_count,
                suspected_disease_tags=disease_tags,
                is_outbreak_spike=is_spike
            ))
            
            # B. Consumption Logs for each medicine
            for med in MEDICINE_SPECS:
                med_name = med["name"]
                base_daily = med["base_daily"]
                
                # Consumption scales with footfall
                footfall_factor = patient_count / 70.0
                daily_used = max(1, int(random.gauss(base_daily, base_daily * 0.15) * footfall_factor))
                
                if is_nashik_outbreak and d <= 10 and med_name in ["Paracetamol 500mg", "ORS Sachet (Oral Rehydration Salts)", "IV Normal Saline 500ml"]:
                    daily_used = int(daily_used * 2.5)  # Heavy consumption during outbreak
                    
                consumption_records.append(ConsumptionLog(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    medicine_name=med_name,
                    date=cur_date,
                    quantity_used=daily_used
                ))
        
        # C. Current Medicine Stock (Today's remaining quantity)
        for med in MEDICINE_SPECS:
            med_name = med["name"]
            base_daily = med["base_daily"]
            buffer_th = med["buffer"]
            
            if is_nashik_outbreak and med_name in ["Paracetamol 500mg", "IV Normal Saline 500ml", "ORS Sachet (Oral Rehydration Salts)"]:
                # Severe depletion -> 1-3 days left
                current_qty = random.randint(20, 60)
            elif is_pune_surplus and med_name in ["Paracetamol 500mg", "IV Normal Saline 500ml", "ORS Sachet (Oral Rehydration Salts)"]:
                # High surplus -> 30-45 days left
                current_qty = random.randint(1800, 2600)
            elif is_lucknow_shortage and med_name == "Rabies Vaccine (Anti-Rabies)":
                # Critical shortage of rabies vaccine
                current_qty = random.randint(2, 6)
            else:
                # Normal healthy distribution (12-25 days worth)
                current_qty = random.randint(int(base_daily * 10), int(base_daily * 28))
                
            expiry = today + timedelta(days=random.randint(120, med["shelf_life_days"]))
            stock_records.append(MedicineStock(
                id=str(uuid.uuid4())[:16],
                phc_id=phc.id,
                medicine_name=med_name,
                batch_id=f"BAT-{med_name[:3].upper()}-{random.randint(100, 999)}",
                quantity=current_qty,
                buffer_threshold=buffer_th,
                daily_consumption_avg=round(float(base_daily), 1),
                expiry_date=expiry,
                last_updated=datetime.utcnow()
            ))
            
        # D. Bed Status
        total_beds = 20
        icu_beds = 4
        if is_nashik_outbreak:
            occupied = random.randint(18, 20)
            icu_occ = random.randint(3, 4)
        else:
            occupied = random.randint(6, 14)
            icu_occ = random.randint(0, 2)
            
        bed_records.append(BedStatus(
            id=str(uuid.uuid4())[:16],
            phc_id=phc.id,
            total_beds=total_beds,
            occupied_beds=occupied,
            icu_beds=icu_beds,
            icu_occupied=icu_occ,
            timestamp=datetime.utcnow()
        ))
        
        # E. Staff Attendance
        for role, count in STAFF_ROLES:
            for s_idx in range(1, count + 1):
                # Nashik has higher absenteeism or strain during outbreak
                present = random.random() > (0.25 if is_nashik_outbreak else 0.08)
                staff_records.append(StaffAttendance(
                    id=str(uuid.uuid4())[:16],
                    phc_id=phc.id,
                    staff_id=f"STF-{phc.id[-6:]}-{role[:3].upper()}-{s_idx}",
                    staff_name=f"{role} #{s_idx} ({phc.name.split()[0]})",
                    role=role,
                    date=today,
                    present_boolean=present
                ))
    
    # Bulk insert
    print(f"Writing {len(footfall_records)} footfall records...")
    db.bulk_save_objects(footfall_records)
    print(f"Writing {len(consumption_records)} daily consumption log records...")
    db.bulk_save_objects(consumption_records)
    print(f"Writing {len(stock_records)} medicine stock records...")
    db.bulk_save_objects(stock_records)
    print(f"Writing {len(bed_records)} bed status records...")
    db.bulk_save_objects(bed_records)
    print(f"Writing {len(staff_records)} staff attendance records...")
    db.bulk_save_objects(staff_records)
    
    db.commit()
    db.close()
    print("Database seeding completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    seed_database()
