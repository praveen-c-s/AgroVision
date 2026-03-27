# services/pest_advisory_service.py

PEST_ADVISORY = {

    "bollworm": {
        "risk_level": "High",
        "immediate_action": [
            "Inspect crop leaves and fruits for larvae",
            "Remove heavily infested parts",
            "Spray recommended pesticide immediately"
        ],
        "spread_risk": "Bollworms spread quickly and damage fruits and flowers.",

        "chemical_control": {
            "pesticide": "Chlorpyrifos 20 EC",
            "dosage": "2 ml per liter",
            "spray_interval": "7-10 days"
        },

        "organic_control": {
            "solution": "Neem oil spray",
            "dosage": "5 ml per liter"
        }
    },

    "armyworm": {
        "risk_level": "High",
        "immediate_action": [
            "Inspect leaves regularly",
            "Remove visible larvae",
            "Spray insecticide if infestation increases"
        ],
        "spread_risk": "Armyworms move in groups and can destroy crops quickly.",

        "chemical_control": {
            "pesticide": "Emamectin Benzoate",
            "dosage": "0.4 g per liter",
            "spray_interval": "10 days"
        },

        "organic_control": {
            "solution": "Garlic-chili extract spray",
            "dosage": "Weekly"
        }
    },

    "aphids": {
        "risk_level": "Medium",
        "immediate_action": [
            "Check underside of leaves",
            "Wash leaves with water spray",
            "Apply recommended insecticide"
        ],
        "spread_risk": "Aphids multiply rapidly and spread plant viruses.",

        "chemical_control": {
            "pesticide": "Imidacloprid 17.8 SL",
            "dosage": "0.3 ml per liter",
            "spray_interval": "10-14 days"
        },

        "organic_control": {
            "solution": "Soap water spray",
            "dosage": "15 ml liquid soap per liter"
        }
    },

    "mites": {
        "risk_level": "Medium",
        "immediate_action": [
            "Inspect leaves for tiny mites",
            "Remove heavily damaged leaves",
            "Spray miticide if infestation spreads"
        ],
        "spread_risk": "Mites spread rapidly in hot and dry conditions.",

        "chemical_control": {
            "pesticide": "Spiromesifen 22.9 SC",
            "dosage": "1 ml per liter",
            "spray_interval": "15 days"
        },

        "organic_control": {
            "solution": "Neem oil spray",
            "dosage": "3-5 ml per liter"
        }
    },

    "grasshopper": {
        "risk_level": "Medium",
        "immediate_action": [
            "Monitor nearby plants",
            "Remove grasshoppers manually if possible",
            "Spray insecticide if population increases"
        ],
        "spread_risk": "Grasshoppers move across fields and feed on leaves rapidly.",

        "chemical_control": {
            "pesticide": "Malathion 50 EC",
            "dosage": "2 ml per liter",
            "spray_interval": "7 days"
        },

        "organic_control": {
            "solution": "Garlic extract spray",
            "dosage": "Weekly"
        }
    },

    "beetle": {
        "risk_level": "Medium",
        "immediate_action": [
            "Inspect plants for feeding damage",
            "Remove beetles manually",
            "Apply insecticide if infestation increases"
        ],
        "spread_risk": "Beetles feed on leaves and may spread quickly.",

        "chemical_control": {
            "pesticide": "Carbaryl 50 WP",
            "dosage": "2 g per liter",
            "spray_interval": "10 days"
        },

        "organic_control": {
            "solution": "Neem cake soil application",
            "dosage": "As per soil area"
        }
    },

    "stem_borer": {
        "risk_level": "High",
        "immediate_action": [
            "Check stems for bore holes",
            "Remove infected plants",
            "Apply recommended pesticide"
        ],
        "spread_risk": "Stem borers damage plant stems and reduce crop yield.",

        "chemical_control": {
            "pesticide": "Chlorantraniliprole 18.5 SC",
            "dosage": "0.4 ml per liter",
            "spray_interval": "15 days"
        },

        "organic_control": {
            "solution": "Light traps for adult moths",
            "dosage": "Install in field"
        }
    },

    "sawfly": {
        "risk_level": "Medium",
        "immediate_action": [
            "Inspect leaves for larvae",
            "Remove larvae manually",
            "Apply pesticide if infestation spreads"
        ],
        "spread_risk": "Sawfly larvae feed on leaves and can spread quickly.",

        "chemical_control": {
            "pesticide": "Lambda-cyhalothrin 5 EC",
            "dosage": "1 ml per liter",
            "spray_interval": "10 days"
        },

        "organic_control": {
            "solution": "Hand picking larvae",
            "dosage": "Manual removal"
        }
    },

    "mosquito": {
        "risk_level": "Low",
        "immediate_action": [
            "Remove stagnant water sources",
            "Improve drainage",
            "Maintain field sanitation"
        ],
        "spread_risk": "Mosquitoes breed in stagnant water.",

        "chemical_control": {
            "pesticide": "Temephos",
            "dosage": "As per label instructions",
            "spray_interval": "As required"
        },

        "organic_control": {
            "solution": "Eliminate stagnant water",
            "dosage": "Field sanitation"
        }
    }
}


def get_pest_advisory(pest_name):

    pest = pest_name.lower()

    advisory = PEST_ADVISORY.get(pest)

    if advisory:
        return advisory

    return {
        "message": "No advisory available for this pest."
    }