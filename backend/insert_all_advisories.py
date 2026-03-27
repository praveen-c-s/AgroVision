from db import advisory_collection
from class_names import class_names


# ================= FUNGAL TEMPLATE =================

fungal_template = {
    "description": "Fungal disease affecting crop leaves and reducing yield.",
    "symptoms": "Leaf spots, yellowing, wilting.",
    "treatment": "Remove infected leaves and apply recommended fungicide.",
    "pesticide_name": "Mancozeb 75% WP",
    "dosage": "2g per liter of water",
    "frequency": "Every 7–10 days",
    "prevention": "Avoid overhead watering and ensure proper spacing.",
    "safety_precautions": "Wear gloves and mask while spraying.",

    "farmer_summary": "Your crop shows signs of a fungal infection. Early fungicide treatment can help control the disease.",

    "immediate_action": [
        "Remove infected leaves immediately",
        "Spray recommended fungicide",
        "Avoid overhead watering",
        "Monitor nearby plants"
    ],

    "spread_risk": "Fungal diseases spread quickly in humid and wet conditions."
}


# ================= BACTERIAL TEMPLATE =================

bacterial_template = {
    "description": "Bacterial infection causing leaf damage and crop loss.",
    "symptoms": "Water-soaked spots and yellow halos.",
    "treatment": "Apply copper-based bactericide.",
    "pesticide_name": "Copper Oxychloride",
    "dosage": "3g per liter of water",
    "frequency": "Every 7 days",
    "prevention": "Use disease-free seeds and avoid leaf wetness.",
    "safety_precautions": "Use protective gloves and avoid inhalation.",

    "farmer_summary": "Your crop shows symptoms of bacterial infection which can spread through water and plant contact.",

    "immediate_action": [
        "Remove infected leaves",
        "Apply copper bactericide spray",
        "Avoid touching healthy plants after infected ones",
        "Disinfect farming tools"
    ],

    "spread_risk": "Bacterial diseases spread through water splash, infected tools, and plant contact."
}


# ================= VIRAL TEMPLATE =================

viral_template = {
    "description": "Viral infection affecting plant growth and yield.",
    "symptoms": "Leaf curling, mosaic patterns.",
    "treatment": "Remove infected plants immediately.",
    "pesticide_name": "No direct cure. Control vectors.",
    "dosage": "N/A",
    "frequency": "N/A",
    "prevention": "Control aphids and whiteflies.",
    "safety_precautions": "Dispose infected plants safely.",

    "farmer_summary": "Your crop may be infected by a plant virus. Viral diseases usually spread through insects.",

    "immediate_action": [
        "Remove infected plants immediately",
        "Control aphids and whiteflies",
        "Monitor nearby plants",
        "Avoid replanting infected seedlings"
    ],

    "spread_risk": "Viral diseases spread mainly through insect vectors such as aphids and whiteflies."
}


# ================= HEALTHY TEMPLATE =================

healthy_template = {
    "description": "Crop appears healthy.",
    "symptoms": "No visible disease symptoms.",
    "treatment": "No treatment required.",
    "pesticide_name": "None",
    "dosage": "N/A",
    "frequency": "N/A",
    "prevention": "Maintain proper irrigation and fertilization.",
    "safety_precautions": "None",

    "farmer_summary": "Your crop appears healthy and shows no disease symptoms.",

    "immediate_action": [
        "Continue regular monitoring",
        "Maintain proper irrigation",
        "Apply balanced fertilizers",
        "Inspect plants weekly"
    ],

    "spread_risk": "No disease detected. Risk level is minimal."
}


# ================= INSERT ADVISORIES =================

for disease in class_names:

    # Skip if already exists
    if advisory_collection.find_one({"disease_name": disease}):
        continue

    # Select template
    if "healthy" in disease.lower():
        template = healthy_template

    elif "virus" in disease.lower() or "mosaic" in disease.lower():
        template = viral_template

    elif "bacterial" in disease.lower():
        template = bacterial_template

    else:
        template = fungal_template

    advisory_data = {
        "disease_name": disease,
        **template
    }

    advisory_collection.insert_one(advisory_data)

    print(f"Inserted advisory for: {disease}")


print("\nAll advisories inserted successfully!")