print("THIS IS THE NEW REQUEST ROUTES FILE")
import os
import uuid
from datetime import datetime
from bson import ObjectId
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from werkzeug.utils import secure_filename
from services.soil_extraction_service import extract_soil_from_pdf
from bson import ObjectId
from db import users_collection

from services.request_service import (
    create_request,
    get_farmer_requests,
    get_pending_requests,
    get_assigned_requests as service_get_assigned_requests,
    process_request
)

requests_collection = db["requests"]
request_bp = Blueprint("requests", __name__, url_prefix="/requests")

# =========================================================
# GET SINGLE REQUEST BY ID
# =========================================================
@request_bp.route("/<request_id>", methods=["GET"])
@jwt_required()
def get_request(request_id):
    """
    Get a single request by ID
    """
    try:
        request_data = requests_collection.find_one({"_id": ObjectId(request_id)})

        if not request_data:
            return jsonify({"error": "Request not found"}), 404

        # Convert ObjectIds
        request_data["_id"] = str(request_data["_id"])

        farmer_id = request_data.get("farmer_id")

        if farmer_id:
            farmer = users_collection.find_one({"_id": farmer_id})
            request_data["farmer_name"] = farmer.get("name") if farmer else "Unknown"
            request_data["farmer_id"] = str(farmer_id)

        if "officer_id" in request_data:
            request_data["officer_id"] = str(request_data["officer_id"])

        # Ensure advisory fields exist
        request_data["final_advisory_en"] = request_data.get("final_advisory_en", "")
        request_data["final_advisory_ml"] = request_data.get("final_advisory_ml", "")
        request_data["officer_notes"] = request_data.get("officer_notes", "")

        return jsonify(request_data), 200

    except Exception as e:
        return jsonify({"error": "Invalid request ID"}), 400

# =========================================================
# FARMER → SUBMIT REQUEST
# =========================================================
@request_bp.route("/", methods=["POST"])
@jwt_required()
def submit_request():
    if get_jwt()["role"] != "farmer":
        return jsonify({"error": "Only farmers allowed"}), 403
    
    farmer_id = get_jwt_identity()
    file = request.files.get("file")
    soil_pdf = request.files.get("soil_report")
    description = request.form.get("description", "").strip()
    crop = request.form.get("crop")
    symptoms = request.form.get("symptoms")
    request_type = request.form.get("request_type", "prediction")
    
    # Validation
    if request_type not in ["prediction", "crop", "soil_test"]:
        return jsonify({"error": "Invalid request_type"}), 400
    
    if request_type == "prediction" and not file:
        return jsonify({"error": "Image required for prediction"}), 400
    if request_type == "crop" and not soil_pdf:
        return jsonify({"error": "Soil report PDF required"}), 400
    
    request_id = create_request(
    file,
    farmer_id,
    description,
    soil_pdf,
    request_type,
    crop,
    symptoms
)
    
    if not request_id:
        return jsonify({"error": "Failed to create request"}), 500
    
    return jsonify({
        "message": "Request submitted successfully",
        "request_id": request_id
    }), 201

# =========================================================
# FARMER → VIEW OWN REQUESTS
# =========================================================
@request_bp.route("/my", methods=["GET"])
@jwt_required()
def my_requests():
    if get_jwt()["role"] != "farmer":
        return jsonify({"error": "Access denied"}), 403
    
    farmer_id = get_jwt_identity()
    data = get_farmer_requests(farmer_id)
    return jsonify({"data": data}), 200

# =========================================================
# OFFICER → VIEW PENDING REQUESTS
# =========================================================
@request_bp.route("/assigned", methods=["GET"])
@jwt_required()
def assigned_requests():

    officer_id = get_jwt_identity()

    data = service_get_assigned_requests(officer_id)

    for r in data:

        r["_id"] = str(r["_id"])
        r["farmer_id"] = str(r.get("farmer_id"))

        # ADD THESE LINES
        r["description"] = r.get("description", "")
        r["request_type"] = r.get("request_type", "")
        r["status"] = r.get("status", "")
        r["created_at"] = r.get("created_at")

        farmer = users_collection.find_one(
            {"_id": ObjectId(r["farmer_id"])}
        )

        r["farmer_name"] = farmer.get("name") if farmer else "Unknown"

    return jsonify({"data": data}), 200

# =========================================================
# OFFICER → VIEW PENDING REQUESTS
# =========================================================
@request_bp.route("/pending", methods=["GET"])
@jwt_required()
def pending_requests():

    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403

    officer_id = get_jwt_identity()

    officer = users_collection.find_one({"_id": ObjectId(officer_id)})

    # Block unapproved officers
    if not officer.get("approved", False):
        return jsonify({
            "success": False,
            "message": "Officer approval pending"
        }), 403

    data = get_pending_requests(officer_id)

    # Attach farmer name
    for r in data:

        r["_id"] = str(r["_id"])
        r["farmer_id"] = str(r.get("farmer_id"))

        # ADD THESE FIELDS
        r["description"] = r.get("description", "")
        r["request_type"] = r.get("request_type", "")
        r["status"] = r.get("status", "")
        r["created_at"] = r.get("created_at")

        farmer = users_collection.find_one(
            {"_id": ObjectId(r["farmer_id"])}
        )

        r["farmer_name"] = farmer.get("name") if farmer else "Unknown"

    return jsonify({"data": data}), 200


# =========================================================
# OFFICER → VIEW COMPLETED REQUESTS
# =========================================================
@request_bp.route("/completed", methods=["GET"])
@jwt_required()
def completed_requests():

    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403

    officer_id = ObjectId(get_jwt_identity())

    data = list(requests_collection.find({
        "officer_id": officer_id,
        "status": "completed"
    }))

    for r in data:

        r["_id"] = str(r["_id"])
        r["officer_id"] = str(r.get("officer_id"))
        r["farmer_id"] = str(r.get("farmer_id"))

        # Get farmer name
        farmer = users_collection.find_one(
            {"_id": ObjectId(r["farmer_id"])}
        )

        r["farmer_name"] = farmer.get("name") if farmer else "Unknown"

    return jsonify({"data": data}), 200

# =========================================================
# OFFICER → CLAIM REQUEST
# =========================================================
@request_bp.route("/<request_id>/claim", methods=["POST"])
@jwt_required()
def claim_request(request_id):
    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403
    
    officer_id = get_jwt_identity()
    
    updated = requests_collection.update_one(
        {"_id": ObjectId(request_id), "status": "pending"},
        {"$set": {
            "status": "assigned",
            "officer_id": ObjectId(officer_id)
        }}
    )
    
    if updated.modified_count == 0:
        return jsonify({"error": "Request not available"}), 400
    
    return jsonify({"message": "Request claimed successfully"}), 200

# =========================================================
# OFFICER → PROCESS AI
# =========================================================
@request_bp.route("/<request_id>/process", methods=["POST"])
@jwt_required()
def process(request_id):
    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403
    
    officer_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or "analysis_type" not in data:
        return jsonify({"error": "analysis_type required"}), 400
    
    result = process_request(
        request_id,
        officer_id,
        data.get("analysis_type"),
        data.get("soil_data")
    )
    
    if not result:
        return jsonify({"error": "Request not assigned or invalid"}), 400
    
    return jsonify({
        "message": "AI generated successfully",
        "data": result
    }), 200

# =========================================================
# OFFICER → REVIEW AI RESULT
# =========================================================
@request_bp.route("/<request_id>/review", methods=["POST"])
@jwt_required()
def review(request_id):
    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403
    
    officer_id = get_jwt_identity()
    data = request.get_json()
    
    updated = requests_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "status": "ai_generated",
            "officer_id": ObjectId(officer_id)
        },
        {"$set": {
    "final_advisory_en": data.get("final_advisory_en"),
    "final_advisory_ml": data.get("final_advisory_ml"),
    "officer_notes": data.get("officer_notes"),
    "status": "reviewed"
}}
    )
    
    if updated.modified_count == 0:
        return jsonify({"error": "Not ready for review"}), 400
    
    return jsonify({"message": "Review completed"}), 200

# =========================================================
# OFFICER → COMPLETE REQUEST (SEND TO FARMER)
# =========================================================
@request_bp.route("/<request_id>/complete", methods=["POST"])
@jwt_required()
def complete(request_id):
    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403
    
    officer_id = get_jwt_identity()
    
    updated = requests_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "status": "reviewed",
            "officer_id": ObjectId(officer_id)
        },
        {"$set": {
            "status": "completed",
            "completed_at": datetime.utcnow()
        }}
    )
    
    if updated.modified_count == 0:
        return jsonify({"error": "Not ready for completion"}), 400
    
    return jsonify({"message": "Request completed successfully"}), 200

# =========================================================
# OFFICER → SCHEDULE SOIL TEST
# =========================================================
@request_bp.route("/<request_id>/schedule", methods=["POST"])
@jwt_required()
def schedule(request_id):
    if get_jwt()["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403
    
    data = request.get_json() or {}
    
    updated = requests_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "request_type": "soil_test",
            "status": "assigned"   # MUST be assigned
        },
        {"$set": {
            "appointment_date": data.get("appointment_date"),
            "appointment_location": data.get("appointment_location"),
            "status": "scheduled"
        }}
    )
    
    if updated.modified_count == 0:
        return jsonify({"error": "Scheduling failed"}), 400
    
    return jsonify({"message": "Soil test scheduled"}), 200

# =========================================================
# OFFICER → UPLOAD SOIL REPORT
# =========================================================
@request_bp.route("/<request_id>/upload-report", methods=["POST"])
@jwt_required()
def upload_report(request_id):

    if "soil_report" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["soil_report"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # create uploads folder
    upload_folder = os.path.join(os.getcwd(), "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    # generate unique name
    soil_name = str(uuid.uuid4()) + "_" + secure_filename(file.filename)

    soil_path = os.path.join(upload_folder, soil_name)

    # save file
    file.save(soil_path)

    # update database
    requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "soil_report_path": soil_path,
                "status": "completed"
            }
        }
    )

    return jsonify({"message": "Soil report uploaded successfully"})

# =========================================================
# FARMER → DOWNLOAD SOIL REPORT
# =========================================================
@request_bp.route("/<request_id>/download-report", methods=["GET"])
@jwt_required()
def download_soil_report(request_id):

    request_data = requests_collection.find_one({"_id": ObjectId(request_id)})

    if not request_data:
        return jsonify({"error": "Request not found"}), 404

    file_path = request_data.get("soil_report_path")

    if not file_path:
        return jsonify({"error": "No report found"}), 404

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    return send_file(file_path, as_attachment=True)
@request_bp.route("/<request_id>/extract-soil", methods=["POST"])
@jwt_required()
def extract_soil(request_id):

    request_data = requests_collection.find_one({"_id": ObjectId(request_id)})

    if not request_data:
        return jsonify({"error": "Request not found"}), 404

    pdf_path = request_data.get("soil_report_path")

    if not pdf_path:
        return jsonify({"error": "No soil report uploaded"}), 400

    soil_data = extract_soil_from_pdf(pdf_path)

    return jsonify({"soil_data": soil_data})
@request_bp.route("/<request_id>/report", methods=["POST"])
@jwt_required()
def submit_report(request_id):

    file = request.files.get("soil_report")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename)

    upload_folder = os.path.join(os.getcwd(), "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    path = os.path.join(upload_folder, filename)

    file.save(path)

    requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "soil_report_path": path,
                "status": "completed"
            }
        }
    )

    return jsonify({"message": "Report uploaded"})