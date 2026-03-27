from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import requests_collection
from bson import ObjectId

farmer_bp = Blueprint("farmer", __name__)

@farmer_bp.route("/farmer/history", methods=["GET"])
@jwt_required()
def farmer_history():
    claims = get_jwt()
    if claims["role"] != "farmer":
        return jsonify({"error": "Only farmers allowed"}), 403

    farmer_id = get_jwt_identity()

    requests = list(
        requests_collection.find(
            {"farmer_id": farmer_id, "status": "processed"},
            {"_id": 0}
        )
    )

    return jsonify({
        "total_predictions": len(requests),
        "history": requests
    })
