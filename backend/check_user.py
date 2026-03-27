from db import users_collection

# Check the specific user
user = users_collection.find_one({"email": "prav10@gmail.com"})

if user:
    print(f"User found: {user['email']}")
    print(f"Role: {user['role']}")
    print(f"District: {user.get('district', 'Not set')}")
    print(f"Created at: {user.get('created_at', 'Unknown')}")
    print(f"Password hash: {user['password'][:50]}...")  # Show first 50 chars of hash
else:
    print("User not found in database")
