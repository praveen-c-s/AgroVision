from flask import Blueprint, jsonify
from middleware.auth_middleware import role_required
from db import predictions_collection

analytics_bp = Blueprint("analytics_bp", __name__)

@analytics_bp.route("/analytics", methods=["GET"])
@role_required("admin")
def analytics():

    total = predictions_collection.count_documents({})

    disease_counts = list(
        predictions_collection.aggregate([
            {"$group": {"_id": "$disease_name", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ])
    )

    return jsonify({
        "total_predictions": total,
        "disease_statistics": disease_counts
    })
