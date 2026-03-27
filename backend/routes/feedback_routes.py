from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import feedback_collection
from datetime import datetime

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST"])
@jwt_required()
def submit_feedback():
    claims = get_jwt()
    if claims["role"] != "farmer":
        return jsonify({"error": "Only farmers allowed"}), 403

    data = request.json
    prediction_id = data.get("prediction_id")
    is_correct = data.get("is_correct")

    feedback_collection.insert_one({
        "prediction_id": prediction_id,
        "farmer_id": get_jwt_identity(),
        "is_correct": is_correct,
        "created_at": datetime.utcnow()
    })

    return jsonify({"message": "Feedback recorded"})
