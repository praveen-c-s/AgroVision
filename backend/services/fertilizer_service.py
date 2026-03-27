def recommend_fertilizer(soil):

    recommendations = []

    N = soil.get("N")
    P = soil.get("P")
    K = soil.get("K")
    ph = soil.get("ph")

    if N < 50:
        recommendations.append("Apply Urea to increase Nitrogen")

    if P < 30:
        recommendations.append("Apply DAP fertilizer to increase Phosphorus")

    if K < 40:
        recommendations.append("Apply MOP fertilizer to increase Potassium")

    if ph < 5.5:
        recommendations.append("Apply Lime to increase soil pH")

    if ph > 7.5:
        recommendations.append("Apply Gypsum to reduce soil alkalinity")

    if not recommendations:
        recommendations.append("Soil nutrients are balanced")

    return recommendations