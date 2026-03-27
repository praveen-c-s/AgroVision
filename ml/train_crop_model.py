import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score


# Load dataset
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "Crop_recommendation.csv")

data = pd.read_csv(DATA_PATH)

X = data.drop("label", axis=1)
y = data["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create pipeline (scaling + RF)
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("rf", RandomForestClassifier(random_state=42))
])

# Hyperparameter tuning
param_grid = {
    "rf__n_estimators": [200, 300],
    "rf__max_depth": [10, 15, None],
    "rf__min_samples_split": [2, 5],
}

grid = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    n_jobs=-1
)

grid.fit(X_train, y_train)

# Evaluate
y_pred = grid.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Improved Model Accuracy:", round(accuracy * 100, 2), "%")

# Save best model
MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")
joblib.dump(grid.best_estimator_, MODEL_PATH)

print("✅ Improved model saved.")