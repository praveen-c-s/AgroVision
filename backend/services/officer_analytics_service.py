from db import requests_collection
from datetime import datetime

def get_officer_stats(officer_id):

    processed = requests_collection.count_documents({
        "officer_id": officer_id,
        "status": "processed"
    })

    pending = requests_collection.count_documents({
        "officer_id": officer_id,
        "status": "pending"
    })

    avg_processing_time_pipeline = [
        {"$match": {"officer_id": officer_id, "status": "processed"}},
        {
            "$project": {
                "processing_time": {
                    "$subtract": ["$processed_at", "$created_at"]
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "avg_time": {"$avg": "$processing_time"}
            }
        }
    ]

    result = list(requests_collection.aggregate(avg_processing_time_pipeline))
    avg_time = result[0]["avg_time"] if result else 0

    return {
        "processed_requests": processed,
        "pending_requests": pending,
        "average_processing_time_ms": avg_time
    }
