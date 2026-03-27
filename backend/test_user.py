from db import users_collection
from extensions import bcrypt
from datetime import datetime

# Check if users exist
users = list(users_collection.find({}))
print(f"Total users in database: {len(users)}")

for user in users:
    print(f"User: {user['email']}, Role: {user['role']}")

# Create a test user if no users exist
if len(users) == 0:
    print("Creating test user...")
    hashed_password = bcrypt.generate_password_hash("password123").decode("utf-8")
    
    test_user = {
        "name": "Test Farmer",
        "email": "farmer@test.com",
        "password": hashed_password,
        "role": "farmer",
        "district": "Test District",
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(test_user)
    print("Test user created: farmer@test.com / password123")
    
    # Create test officer
    test_officer = {
        "name": "Test Officer",
        "email": "officer@test.com", 
        "password": hashed_password,
        "role": "officer",
        "district": "Test District",
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(test_officer)
    print("Test officer created: officer@test.com / password123")
else:
    print("Users already exist. You can use existing credentials or create new ones via registration.")
