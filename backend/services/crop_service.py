import os
import joblib

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "crop_model.pkl")

model = joblib.load(MODEL_PATH)


def predict_crop(N, P, K, temperature, humidity, ph, rainfall):

    data = [N, P, K, temperature, humidity, ph, rainfall]

    probabilities = model.predict_proba([data])[0]
    classes = model.classes_

    crop_probs = list(zip(classes, probabilities))
    crop_probs.sort(key=lambda x: x[1], reverse=True)

    top_3 = [
        {
            "crop": crop,
            "confidence": round(float(prob) * 100, 2)
        }
        for crop, prob in crop_probs[:3]
    ]

    return {
        "top_recommendations": top_3,
        "note": "Crop recommendation based on provided soil parameters."
    }