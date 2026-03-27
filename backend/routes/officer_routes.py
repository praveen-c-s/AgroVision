from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.officer_analytics_service import get_officer_stats

officer_bp = Blueprint("officer", __name__)

@officer_bp.route("/officer/dashboard", methods=["GET"])
@jwt_required()
def officer_dashboard():
    claims = get_jwt()
    if claims["role"] != "officer":
        return jsonify({"error": "Only officers allowed"}), 403

    officer_id = get_jwt_identity()
    stats = get_officer_stats(officer_id)

    return jsonify(stats)
