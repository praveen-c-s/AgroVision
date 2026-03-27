from db import db, users_collection
from datetime import datetime

alerts_collection = db["alerts"]


def send_district_alert(district, disease):

    farmers = users_collection.find({
        "role": "farmer",
        "district": district
    })

    for farmer in farmers:
        print(f"Alert sent to {farmer['email']} about {disease}")

    alerts_collection.update_one(
        {"district": district, "disease": disease},
        {"$set": {"status": "notified", "notified_at": datetime.utcnow()}}
    )
