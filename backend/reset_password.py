from db import users_collection
from extensions import bcrypt

# Reset password for prav10@gmail.com to "password123"
new_password = "password123"
hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

# Update the user's password
result = users_collection.update_one(
    {"email": "prav10@gmail.com"},
    {"$set": {"password": hashed_password}}
)

if result.modified_count > 0:
    print(f"✅ Password reset successful for prav10@gmail.com")
    print(f"📧 Email: prav10@gmail.com")
    print(f"🔑 New Password: {new_password}")
else:
    print("❌ Failed to reset password - user not found")
