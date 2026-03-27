from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from db import users_collection
from datetime import datetime
from bson import ObjectId

bcrypt = Bcrypt()

# ----------------------------
# Register User
# ----------------------------
def register_user(data):

    if users_collection.find_one({"email": data["email"]}):
        return {"error": "Email already registered"}, 400

    hashed_password = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    role = data.get("role", "farmer")

    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password,
        "role": role,
        "district": data.get("district"),
        "approved": False if role == "officer" else True,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(user)

    return {"message": "User registered successfully"}, 201

# ----------------------------
# Login User
# ----------------------------
def login_user(data):

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return None

    if not bcrypt.check_password_hash(user["password"], data["password"]):
        return None
    if user["role"] == "officer" and not user.get("approved", False):
       return {"error": "Officer approval pending"}, 403

    # ✅ CLEAN JWT STRUCTURE
    access_token = create_access_token(
        identity=str(user["_id"]),  # only user_id
        additional_claims={
            "role": user["role"]
        }
    )

    return {
        "access_token": access_token,
        "role": user["role"],
        "district": user.get("district")
    }
