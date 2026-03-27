def classify(value, low, high):

    if value < low:
        return "Low"
    elif value > high:
        return "High"
    else:
        return "Medium"


def generate_soil_health(soil):

    N = soil.get("N")
    P = soil.get("P")
    K = soil.get("K")
    ph = soil.get("ph")

    return {
        "Nitrogen": {
            "value": N,
            "status": classify(N, 50, 100)
        },
        "Phosphorus": {
            "value": P,
            "status": classify(P, 30, 60)
        },
        "Potassium": {
            "value": K,
            "status": classify(K, 40, 80)
        },
        "pH": {
            "value": ph,
            "status": "Ideal" if 6 <= ph <= 7.5 else "Needs Correction"
        }
    }