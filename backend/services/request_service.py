import os
import uuid
from datetime import datetime
from bson import ObjectId
from werkzeug.utils import secure_filename
from db import db, users_collection

from services.prediction_service import predict_image
from services.pest_service import predict_pest
from services.crop_service import predict_crop
from services.soil_extraction_service import extract_soil_from_pdf
from services.soil_health_service import generate_soil_health
from services.fertilizer_service import recommend_fertilizer
from services.explanation_service import generate_crop_explanation

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

requests_collection = db["requests"]


# -------------------------------------------------
# CREATE REQUEST
# -------------------------------------------------
def create_request(file, farmer_id, description, soil_pdf=None, request_type="prediction", crop=None, symptoms=None):

    farmer = users_collection.find_one({"_id": ObjectId(farmer_id)})
    if not farmer:
        return None

    district = farmer.get("district")

    image_path = None
    if file:
        image_name = str(uuid.uuid4()) + "_" + secure_filename(file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, image_name)
        file.save(image_path)

    soil_report_path = None
    if soil_pdf:
        soil_name = str(uuid.uuid4()) + "_" + secure_filename(soil_pdf.filename)
        soil_report_path = os.path.join(UPLOAD_FOLDER, soil_name)
        soil_pdf.save(soil_report_path)

    request_data = {
        "farmer_id": ObjectId(farmer_id),
        "district": district,
        "image_path": image_path,
        "soil_report_path": soil_report_path,
        "description": description,
        "crop": crop,
        "symptoms": symptoms,
        "analysis_type": None,
        "status": "pending",

        # AI Stage
        "prediction": None,
        "ai_advisory": None,

        # Officer Stage
        "final_advisory": None,
        "officer_notes": None,

        "officer_id": None,

        "created_at": datetime.utcnow(),
        "processed_at": None,
        "completed_at": None,
        "processing_time_sec": None,

        "request_type": request_type
    }

    result = requests_collection.insert_one(request_data)
    return str(result.inserted_id)


# -------------------------------------------------
# FARMER HISTORY
# -------------------------------------------------
def get_assigned_requests(officer_id):
    """
    Get all requests assigned to a specific officer
    """
    requests = list(requests_collection.find({
        "officer_id": ObjectId(officer_id),
        "status": {"$in": ["assigned", "scheduled", "ai_generated", "reviewed"]}
    }).sort("created_at", -1))

    for r in requests:
        r["_id"] = str(r["_id"])
        r["farmer_id"] = str(r["farmer_id"])
        r["officer_id"] = str(r["officer_id"])

    return requests


def get_farmer_requests(farmer_id):

    requests = list(requests_collection.find(
        {"farmer_id": ObjectId(farmer_id)}
    ).sort("created_at", -1))

    for r in requests:
        r["_id"] = str(r["_id"])
        r["farmer_id"] = str(r["farmer_id"])

        if r.get("officer_id"):
            r["officer_id"] = str(r["officer_id"])

        # Hide AI results until completed
        if r.get("status") != "completed":
            r["prediction"] = None
            r["ai_advisory"] = None
            r["final_advisory"] = None
            r["officer_notes"] = None

    return requests


# -------------------------------------------------
# OFFICER PENDING (DISTRICT BASED)
# -------------------------------------------------
def get_pending_requests(officer_id):

    officer = users_collection.find_one({"_id": ObjectId(officer_id)})
    if not officer:
        return []

    district = officer.get("district")

    requests = list(requests_collection.find({
        "status": "pending",
        "district": district
    }))

    for r in requests:
        r["_id"] = str(r["_id"])
        r["farmer_id"] = str(r["farmer_id"])

    return requests


# -------------------------------------------------
# PROCESS REQUEST (AI STAGE)
# -------------------------------------------------

def process_request(request_id, officer_id, analysis_type, soil_override=None):

    request = requests_collection.find_one({
        "_id": ObjectId(request_id),
        "status": "assigned",
        "officer_id": ObjectId(officer_id)
    })

    if not request:
        return None

    # 🔒 Strict request_type control
    if request["request_type"] == "soil_test":
        return None

    if request["request_type"] == "prediction" and "crop" in analysis_type:
        return None

    if request["request_type"] == "crop" and ("disease" in analysis_type or "pest" in analysis_type):
        return None

    start_time = datetime.utcnow()

    final_prediction = {}
    final_advisory = {}

    # Disease
    if "disease" in analysis_type:
        if not request.get("image_path"):
            final_prediction["disease"] = {"error": "No image uploaded"}
        else:
            disease_pred, disease_adv = predict_image(request["image_path"])
            final_prediction["disease"] = disease_pred
            final_advisory["disease"] = disease_adv

    # Pest
    # Pest
    # Pest
    if "pest" in analysis_type:
        if not request.get("image_path"):
            final_prediction["pest"] = {"error": "No image uploaded"}
        else:
            pest_pred = predict_pest(request["image_path"])

            # Save detection separately
            final_prediction["pest"] = {
                "top_predictions": pest_pred.get("top_predictions"),
                "is_uncertain": pest_pred.get("is_uncertain"),
                "warning": pest_pred.get("warning")
            }

            # Save advisory properly
            final_advisory["pest"] = {
                "advisory": pest_pred.get("advisory"),
                "disclaimer": pest_pred.get("disclaimer")
            }

    # Crop
    if "crop" in analysis_type:
        soil_data = None
        soil_health = None
        fertilizer = None

        if soil_override:
            soil_data = soil_override

        elif request.get("soil_report_path"):
            soil_path = os.path.join(os.getcwd(), request["soil_report_path"])
            soil_data = extract_soil_from_pdf(soil_path)

        if not soil_data:
            final_prediction["crop_recommendation"] = {
                "error": "No soil data available"
            }

        else:

            # Soil analysis
            soil_health = generate_soil_health(soil_data)
            fertilizer = recommend_fertilizer(soil_data)

            # Crop prediction
            crop_prediction = predict_crop(
                soil_data.get("N"),
                soil_data.get("P"),
                soil_data.get("K"),
                soil_data.get("temperature"),
                soil_data.get("humidity"),
                soil_data.get("ph"),
                soil_data.get("rainfall")
            )

            # AI explanation
            top_crop = crop_prediction["top_recommendations"][0]["crop"]
            explanation = generate_crop_explanation(top_crop, soil_data)

            # Final prediction structure
            final_prediction["crop_recommendation"] = {
                "source": "Officer Input" if soil_override else "Extracted From PDF",
                "soil_parameters_used": soil_data,
                "top_recommendations": crop_prediction["top_recommendations"],
                "explanation": explanation
            }

            final_prediction["soil_health"] = soil_health
            final_prediction["fertilizer_recommendation"] = fertilizer

    end_time = datetime.utcnow()

    requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {
            "status": "ai_generated",
            "analysis_type": analysis_type,
            "prediction": final_prediction,
            "ai_advisory": final_advisory,
            "processed_at": end_time,
            "processing_time_sec": (end_time - start_time).total_seconds()
        }}
    )

    return {
        "prediction": final_prediction,
        "advisory": final_advisory
    }



   