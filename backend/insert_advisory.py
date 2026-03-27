from db import advisory_collection

advisory_collection.insert_one({
    "disease_name": "Tomato_Early_blight",
    "description": "Fungal disease causing dark brown circular spots.",
    "symptoms": "Yellowing leaves and concentric rings.",
    "treatment": "Remove infected leaves and apply fungicide.",
    "pesticide_name": "Mancozeb 75% WP",
    "dosage": "2g per liter of water",
    "frequency": "Every 7–10 days",
    "prevention": "Avoid overhead watering and ensure spacing.",
    "safety_precautions": "Wear gloves and mask while spraying."
})

print("Advisory inserted successfully!")
