import pdfplumber
import re

def extract_soil_from_pdf(pdf_path):

    text = ""


    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    text = text.lower()

    def find_value(pattern):
        match = re.search(pattern, text)
        if match:
            return float(match.group(1))
        return None

    soil_data = {
        "N": find_value(r"nitrogen.*?\s(\d+\.?\d*)"),
        "P": find_value(r"phosphorus.*?\s(\d+\.?\d*)"),
        "K": find_value(r"potassium.*?\s(\d+\.?\d*)"),
        "temperature": find_value(r"temperature.*?\s(\d+\.?\d*)"),
        "humidity": find_value(r"humidity.*?\s(\d+\.?\d*)"),
        "ph": find_value(r"\bph\b[^0-9]*(\d+\.?\d*)"),
        "rainfall": find_value(r"rainfall.*?\s(\d+\.?\d*)"),
    }

    return soil_data