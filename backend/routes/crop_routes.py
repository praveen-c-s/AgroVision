from flask import Blueprint, request, jsonify
from services.crop_service import predict_crop

crop_bp = Blueprint("crop_bp", __name__)

@crop_bp.route("/predict-crop", methods=["POST"])
def predict_crop_route():
    try:
        data = request.json

        input_data = [
            data["N"],
            data["P"],
            data["K"],
            data["temperature"],
            data["humidity"],
            data["ph"],
            data["rainfall"]
        ]

        result = predict_crop(input_data)

        return jsonify({
            "success": True,
            "recommendations": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500