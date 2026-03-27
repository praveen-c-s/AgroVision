import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # VERY IMPORTANT

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["agrovision"]

requests_collection = db["requests"]   
users_collection = db["users"]
feedback_collection = db["feedback"]
advisory_collection = db["advisory_rules"]
predictions_collection = db["predictions"]