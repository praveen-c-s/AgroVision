def calculate_severity(disease_name, confidence):

    if "healthy" in disease_name.lower():
        return "None"

    if confidence >= 90:
        return "Low"
    elif confidence >= 70:
        return "Medium"
    else:
        return "High"
