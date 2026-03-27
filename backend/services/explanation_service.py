def generate_crop_explanation(crop, soil):

    reasons = []

    if soil.get("rainfall", 0) > 150:
        reasons.append("High rainfall supports crop growth")

    if soil.get("humidity", 0) > 70:
        reasons.append("High humidity conditions are suitable")

    if soil.get("N", 0) > 70:
        reasons.append("Nitrogen rich soil promotes plant growth")

    if soil.get("ph", 0) >= 6 and soil.get("ph", 0) <= 7:
        reasons.append("Soil pH is ideal for most crops")

    return f"{crop.capitalize()} recommended because: " + ", ".join(reasons)