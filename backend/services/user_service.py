from db import users_collection
from bson import ObjectId

def get_user_profile(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    return user
