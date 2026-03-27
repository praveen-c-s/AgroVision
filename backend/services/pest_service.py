import os
import json
import numpy as np
import tensorflow as tf
import cv2

from services.pest_advisory_service import get_pest_advisory

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model + labels paths
MODEL_PATH = os.path.join(BASE_DIR, "agrovision_pest_model_finetuned.h5")
LABEL_PATH = os.path.join(BASE_DIR, "class_labels.json")

IMG_SIZE = 224  # IMPORTANT: Must match model training size

# Load model
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("✅ Pest model loaded successfully.")

# Load class labels
with open(LABEL_PATH, "r") as f:
    index_to_class = json.load(f)

print("✅ Pest class labels loaded.")

def predict_pest(image_path):

    img = cv2.imread(image_path)

    if img is None:
        return {"error": "Invalid image file"}

    # Preprocess
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img / 255.0
    img = np.expand_dims(img, axis=0).astype(np.float32)

    # Prediction
    predictions = model.predict(img)[0]

    # Top 2 predictions
    top_2_indices = predictions.argsort()[-2:][::-1]

    results = []

    for idx in top_2_indices:
        label = index_to_class[idx] if isinstance(index_to_class, list) else index_to_class[str(idx)]
        results.append({
            "label": label,
            "confidence": round(float(predictions[idx]) * 100, 2)
        })

    confidence_diff = results[0]["confidence"] - results[1]["confidence"]
    is_uncertain = confidence_diff < 10

    # ================= Advisory Logic =================

    if is_uncertain:

        advisory = {}

        for result in results:
            pest_name = result["label"]
            advisory[pest_name] = get_pest_advisory(pest_name)

        warning = "Model confidence is low. Manual verification recommended."

    else:

        pest_name = results[0]["label"]

        advisory = {
            pest_name: get_pest_advisory(pest_name)
        }

        warning = None

    # ================= Return Response =================

    return {
        "top_predictions": results,
        "is_uncertain": is_uncertain,
        "warning": warning,
        "advisory": advisory,
        "disclaimer": "AI advisory for educational support only. Officer verification required before pesticide use."
    }