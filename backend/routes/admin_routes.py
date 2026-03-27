from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from services.analytics_service import get_admin_stats,get_district_trends,detect_disease_spike,get_district_wise
from bson import ObjectId
from db import users_collection

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():

    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    stats_data = get_admin_stats()

    return jsonify({
        "success": True,
        "data": stats_data
    })

@admin_bp.route("/district-trends", methods=["GET"])
@jwt_required()
def district_trends():

    claims = get_jwt()
    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = get_district_trends()

    return jsonify({
        "success": True,
        "data": data
    })
@admin_bp.route("/district-wise", methods=["GET"])
@jwt_required()
def district_wise():

    claims = get_jwt()
    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = get_district_wise()

    return jsonify({
        "success": True,
        "data": data
    })


@admin_bp.route("/disease-spike", methods=["GET"])
@jwt_required()
def disease_spike():

    claims = get_jwt()
    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = detect_disease_spike()

    return jsonify({
        "success": True,
        "spikes": data
    })

@admin_bp.route("/approve-officer/<user_id>", methods=["PUT"])
@jwt_required()
def approve_officer(user_id):

    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"approved": True}}
    )

    return jsonify({"message": "Officer approved successfully"})
@admin_bp.route("/pending-officers", methods=["GET"])
@jwt_required()
def pending_officers():

    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    officers = list(users_collection.find(
        {"role": "officer", "approved": False},
        {"password": 0}
    ))

    for officer in officers:
        officer["_id"] = str(officer["_id"])

    return jsonify(officers)