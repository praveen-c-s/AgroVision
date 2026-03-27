from db import requests_collection
from bson import ObjectId


def get_farmer_history(farmer_id):

    requests = requests_collection.find(
        {"farmer_id": ObjectId(farmer_id)},
        {"image_path": 0}  # hide image path
    )

    history = []

    for req in requests:
        req["_id"] = str(req["_id"])
        req["farmer_id"] = str(req["farmer_id"])
        if "assigned_to" in req:
            req["assigned_to"] = str(req["assigned_to"])
        history.append(req)

    return history
