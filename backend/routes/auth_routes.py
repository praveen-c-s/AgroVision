from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from services.auth_service import register_user, login_user
from db import users_collection
from extensions import bcrypt
from db import users_collection
from bson import ObjectId

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    result = register_user(request.json)
    return jsonify(result)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user["_id"]),   # MUST BE STRING
        additional_claims={
            "role": user["role"],
            "district": user.get("district")
            
        }
    )

    return jsonify({
        "access_token": access_token,
        "data": {
            "_id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "district": user.get("district")
        }
    })

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """
    Get current user profile
    """
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "district": user.get("district")
    })
