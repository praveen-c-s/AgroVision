from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt
from services.user_service import get_user_profile
from bson import ObjectId
from db import users_collection
user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()
    claims = get_jwt()

    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password": 0}
    )

    if not user:
        return jsonify({"error": "User not found"}), 404

    # 🔥 Convert ObjectId to string
    user["_id"] = str(user["_id"])
    
    
    if "created_at" in user:
     user["created_at"] = user["created_at"].isoformat() + "Z"
    return jsonify({
        "user": user,
        "role": claims.get("role")
    })
