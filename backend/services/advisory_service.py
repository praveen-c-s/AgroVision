from db import advisory_collection

def get_advisory(disease_name, severity):

    advisory = advisory_collection.find_one(
        {"disease_name": disease_name},
        {"_id": 0}
    )

    if not advisory:
        return None

    treatment_field = advisory.get("treatment")

    if isinstance(treatment_field, dict):
        treatment_plan = treatment_field.get(severity.lower())
    else:
        treatment_plan = treatment_field

    return {
        "description": advisory.get("description"),
        "symptoms": advisory.get("symptoms"),
        "treatment": treatment_plan,
        "pesticide_name": advisory.get("pesticide_name"),
        "dosage": advisory.get("dosage"),
        "frequency": advisory.get("frequency"),
        "prevention": advisory.get("prevention"),
        "safety_precautions": advisory.get("safety_precautions")
    }
