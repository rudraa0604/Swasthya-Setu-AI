import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SwasthyaSetu AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./swasthya_setu.db")
    IS_SIMULATED: bool = True
    
    # 3 Simulated States for demo
    SIMULATED_STATES: list = [
        {"id": "ST-MH", "name": "Maharashtra (Simulated)", "districts": ["Pune", "Nashik", "Nagpur", "Thane", "Satara"]},
        {"id": "ST-KA", "name": "Karnataka (Simulated)", "districts": ["Bengaluru Rural", "Mysuru", "Belagavi", "Dharwad", "Ballari"]},
        {"id": "ST-UP", "name": "Uttar Pradesh (Simulated)", "districts": ["Varanasi", "Lucknow", "Gorakhpur", "Prayagraj", "Agra"]}
    ]
    
    CRITICAL_MEDICINES: list = [
        "Paracetamol 500mg",
        "Amoxicillin 250mg",
        "ORS Sachet (Oral Rehydration Salts)",
        "Rabies Vaccine (Anti-Rabies)",
        "Insulin Regular 40IU",
        "Doxycycline 100mg",
        "IV Normal Saline 500ml",
        "Artesunate (Anti-Malarial)"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
