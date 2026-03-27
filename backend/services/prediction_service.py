import numpy as np
from PIL import Image
import io
from datetime import datetime

from models.model_loader import model, IMG_SIZE
from class_names import class_names
from utils.severity import calculate_severity
from services.advisory_service import get_advisory


def predict_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)

    # -----------------------
    # Prediction
    # -----------------------
    predictions = model.predict(img_array)

    predicted_index = int(np.argmax(predictions))
    predicted_label = class_names[predicted_index]
    confidence = float(np.max(predictions)) * 100

    # -----------------------
    # Confidence Level
    # -----------------------
    if confidence >= 90:
        confidence_level = "Very High"
    elif confidence >= 75:
        confidence_level = "High"
    elif confidence >= 50:
        confidence_level = "Moderate"
    else:
        confidence_level = "Low"

    # -----------------------
    # Severity
    # -----------------------
    severity = calculate_severity(predicted_label, confidence)

    # -----------------------
    # Crop + Disease Split
    # -----------------------
    if "_" in predicted_label:
        parts = predicted_label.split("_", 1)
        crop = parts[0].replace(",", "").replace("(", "").replace(")", "")
        disease = parts[1].replace("_", " ")
    else:
        crop = predicted_label
        disease = "Unknown"

    # -----------------------
    # Healthy Check
    # -----------------------
    is_healthy = "healthy" in predicted_label.lower()

    # -----------------------
    # Fetch Advisory
    # -----------------------
    advisory = get_advisory(predicted_label, severity)

    prediction_data = {
        "crop": crop,
        "disease": disease,
        "disease_name": predicted_label,
        "confidence": round(confidence, 2),
        "confidence_level": confidence_level,
        "severity": severity,
        "is_healthy": is_healthy
    }

    return prediction_data, advisory
