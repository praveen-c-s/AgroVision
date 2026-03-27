import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "agrovision"
MODEL_PATH = "trained_plant_disease_model.h5"
IMG_SIZE = 128

SECRET_KEY = "supersecret"
JWT_SECRET_KEY = "supersecurelongjwtsecretkey123456789"