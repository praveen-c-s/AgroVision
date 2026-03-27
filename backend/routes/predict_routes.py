from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from services.prediction_service import predict_image
from db import predictions_collection

predict_bp = Blueprint("predict_bp", __name__)

@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    current_user = get_jwt_identity()

    prediction_data, advisory_data = predict_image(request.files["file"])

    predictions_collection.insert_one({
        **prediction_data,
        "user_id": current_user["user_id"],
        "timestamp": datetime.utcnow()
    })

    return jsonify({
        "success": True,
        "data": {
            "prediction": prediction_data,
            "advisory": advisory_data
        }
    })
