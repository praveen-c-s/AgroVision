from db import requests_collection, users_collection
from datetime import datetime, timedelta

def get_admin_stats():

    total_users = users_collection.count_documents({})
    total_farmers = users_collection.count_documents({"role": "farmer"})
    total_officers = users_collection.count_documents({"role": "officer"})

    pending_requests = requests_collection.count_documents({"status": "pending"})
    processed_requests = requests_collection.count_documents({"status": "processed"})

    # Most affected crop
    crop_pipeline = [
        {"$match": {"status": "processed"}},
        {"$group": {"_id": "$prediction.crop", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    top_crop = list(requests_collection.aggregate(crop_pipeline))

    # Most active officer
    officer_pipeline = [
        {"$match": {"status": "processed"}},
        {"$group": {"_id": "$officer_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    top_officer = list(requests_collection.aggregate(officer_pipeline))

    return {
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_officers": total_officers,
        "pending_requests": pending_requests,
        "processed_requests": processed_requests,
        "most_affected_crop": top_crop[0] if top_crop else None,
        "most_active_officer": top_officer[0] if top_officer else None
    }
