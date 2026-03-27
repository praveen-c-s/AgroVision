print("RUNNING FROM:", __file__)
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import JWT_SECRET_KEY
from extensions import bcrypt, jwt
from db import users_collection
from dotenv import load_dotenv


# Load env variables
load_dotenv()

# -----------------------
# App Setup
# -----------------------
app = Flask(__name__, static_url_path="/uploads", static_folder="uploads")
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

bcrypt.init_app(app)
jwt.init_app(app)

# -----------------------
# Register Blueprints
# -----------------------
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.predict_routes import predict_bp
from routes.analytics_routes import analytics_bp
from routes.request_routes import request_bp
from routes.admin_routes import admin_bp
from routes.farmer_routes import farmer_bp
from routes.feedback_routes import feedback_bp
from routes.crop_routes import crop_bp
from routes.pest_routes import pest_bp


app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(request_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(farmer_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(crop_bp, url_prefix="/api")
app.register_blueprint(pest_bp, url_prefix="/api")

# -----------------------
# Create Default Admin
# -----------------------
def create_admin_if_not_exists():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env")
        return

    existing_admin = users_collection.find_one({"email": admin_email})

    if not existing_admin:
        hashed_password = bcrypt.generate_password_hash(admin_password).decode("utf-8")

        users_collection.insert_one({
            "name": "System Admin",
            "email": admin_email,
            "password": hashed_password,
            "role": "admin"
        })

        print("✅ Admin user created")
    else:
        print("ℹ️ Admin already exists")

create_admin_if_not_exists()

# -----------------------
# Health Route
# -----------------------
@app.route("/")
def home():
    return {"message": "AgroVision API Running"}

# -----------------------
# Run
# -----------------------
if __name__ == "__main__":
    app.run(debug=True)
