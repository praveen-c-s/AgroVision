from db import requests_collection, users_collection
from bson import ObjectId
from datetime import datetime, timedelta
from db import requests_collection

# ---------------------------------------------------
# 🔹 Helper: Convert ObjectId to string recursively
# ---------------------------------------------------
def serialize_data(data):

    if isinstance(data, list):
        return [serialize_data(item) for item in data]

    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():

            if isinstance(value, ObjectId):
                new_data[key] = str(value)

            elif isinstance(value, dict) or isinstance(value, list):
                new_data[key] = serialize_data(value)

            else:
                new_data[key] = value

        return new_data

    return data


# ---------------------------------------------------
# 🔹 ADMIN DASHBOARD STATS
# ---------------------------------------------------
def get_admin_stats():

    total_users = users_collection.count_documents({})
    total_farmers = users_collection.count_documents({"role": "farmer"})
    total_officers = users_collection.count_documents({"role": "officer"})

    pending_requests = requests_collection.count_documents({"status": "pending"})
    processed_requests = requests_collection.count_documents({"status": "processed"})

    # ---------------------------------
    # Most affected crop
    # ---------------------------------
    crop_pipeline = [
        {"$match": {"status": "processed"}},
        {
            "$group": {
                "_id": "$prediction.crop",
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]

    top_crop = list(requests_collection.aggregate(crop_pipeline))

    # ---------------------------------
    # Most active officer
    # ---------------------------------
    officer_pipeline = [
        {"$match": {"status": "processed"}},
        {
            "$group": {
                "_id": "$officer_id",
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]

    top_officer = list(requests_collection.aggregate(officer_pipeline))

    # ---------------------------------
    # Monthly trend
    # ---------------------------------
    trend_pipeline = [
        {"$match": {"status": "processed"}},
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$processed_at"},
                    "month": {"$month": "$processed_at"}
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]

    monthly_trend = list(requests_collection.aggregate(trend_pipeline))

    stats = {
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_officers": total_officers,
        "pending_requests": pending_requests,
        "processed_requests": processed_requests,
        "most_affected_crop": top_crop[0] if top_crop else None,
        "most_active_officer": top_officer[0] if top_officer else None,
        "monthly_trend": monthly_trend
    }

    return serialize_data(stats)


# ---------------------------------------------------
# 🔹 DISTRICT-WISE DISEASE TRENDS
# ---------------------------------------------------
def get_district_trends():

    pipeline = [
        {"$match": {"status": "processed"}},
        {
            "$group": {
                "_id": {
                    "district": "$district",
                    "disease": "$prediction.disease_name"
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}}
    ]

    data = list(requests_collection.aggregate(pipeline))

    return serialize_data(data)

def get_district_wise():

    pipeline = [
        {
            "$match": {
                "status": "processed",
                "district": {"$exists": True}   # ✅ important
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
        },
        {"$sort": {"count": -1}}
    ]

    results = list(requests_collection.aggregate(pipeline))

    formatted = []

    for item in results:
        district = item.get("_id", {}).get("district")
        disease = item.get("_id", {}).get("disease")

        if district and disease:
            formatted.append({
                "district": district,
                "disease": disease,
                "cases": item.get("count", 0)
            })

    return formatted

def detect_disease_spike():

    today = datetime.utcnow()
    last_week = today - timedelta(days=7)
    previous_week = today - timedelta(days=14)

    recent_pipeline = [
        {
            "$match": {
                "status": "processed",
                "district": {"$exists": True},   # ✅ important
                "processed_at": {"$gte": last_week}
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

    previous_pipeline = [
        {
            "$match": {
                "status": "processed",
                "district": {"$exists": True},   # ✅ important
                "processed_at": {
                    "$gte": previous_week,
                    "$lt": last_week
                }
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

    recent = list(requests_collection.aggregate(recent_pipeline))
    previous = list(requests_collection.aggregate(previous_pipeline))

    spike_alerts = []

    for r in recent:

        # SAFE access
        district = r.get("_id", {}).get("district")
        disease = r.get("_id", {}).get("disease")
        recent_count = r.get("count", 0)

        if not district or not disease:
            continue

        prev_count = 0

        for p in previous:
            if p.get("_id") == r.get("_id"):
                prev_count = p.get("count", 0)

        if prev_count > 0:
            increase = ((recent_count - prev_count) / prev_count) * 100

            if increase >= 50:
                spike_alerts.append({
                    "alert": True,
                    "district": district,
                    "disease": disease,
                    "increase_percent": round(increase, 2)
                })

    return spike_alerts
