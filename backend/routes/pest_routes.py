from flask import Blueprint, request, jsonify
import os
from services.pest_service import predict_pest

pest_bp = Blueprint("pest", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@pest_bp.route("/predict-pest", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    result = predict_pest(file_path)

    os.remove(file_path)  # Clean up

    return jsonify(result)