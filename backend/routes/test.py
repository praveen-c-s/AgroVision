import pandas as pd
import os

# Get project root (LeafVision)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

# Build path to CSV
DATA_PATH = os.path.join(BASE_DIR, "ml", "Crop_recommendation.csv")

df = pd.read_csv(DATA_PATH)

print("Apple temperature range:")
print(df[df["label"] == "apple"]["temperature"].describe())

print("\nPomegranate temperature range:")
print(df[df["label"] == "pomegranate"]["temperature"].describe())