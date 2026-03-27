from datetime import datetime, timedelta
from db import db

requests_collection = db["requests"]
alerts_collection = db["alerts"]

SPIKE_THRESHOLD = 5  # configurable


def detect_disease_spike():

    one_week_ago = datetime.utcnow() - timedelta(days=7)

    pipeline = [
        {
            "$match": {
                "status": "processed",
                "processed_at": {"$gte": one_week_ago}
            }
        },
        {
            "$group": {
                "_id": {
                    "district": "$district",
                    "disease": "$prediction.disease_name"
                },
                "count": {"$sum": 1}
            }
        }
    ]

    results = list(requests_collection.aggregate(pipeline))

    for item in results:
        if item["count"] >= SPIKE_THRESHOLD:

            alerts_collection.insert_one({
                "district": item["_id"]["district"],
                "disease": item["_id"]["disease"],
                "count": item["count"],
                "created_at": datetime.utcnow(),
                "status": "active"
            })
