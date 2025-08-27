from sklearn.model_selection import KFold, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import make_scorer, mean_squared_error, r2_score
import pandas as pd
import numpy as np
import joblib

# Load your dataset
df = pd.read_csv("short_video_engagement.csv")

# Define features and target
features = [
    "like_ratio", "comment_ratio", "share_ratio", "watch_ratio",
    "title_length", "description_length",
    "edge_intensity", "color_histogram",
    "spectral_entropy", "audio_intensity"
]
target = "engagement_score_norm"
X = df[features]
y = df[target]

# Define RMSE as a custom scorer
def rmse_func(y_true, y_pred):
    return np.sqrt(mean_squared_error(y_true, y_pred))

rmse_scorer = make_scorer(rmse_func, greater_is_better=False)  # negative for scoring API
r2_scorer = make_scorer(r2_score)

# Initialize model and KFold
model = RandomForestRegressor(n_estimators=100, random_state=42)
kfold = KFold(n_splits=5, shuffle=True, random_state=42)

# Perform cross-validation
rmse_scores = cross_val_score(model, X, y, scoring=rmse_scorer, cv=kfold)
r2_scores = cross_val_score(model, X, y, scoring=r2_scorer, cv=kfold)

# Display results (flip sign of RMSE scores)
print("Cross-Validated RMSE:")
print(f"Mean: {-rmse_scores.mean():.4f}, Std: {rmse_scores.std():.4f}")
print("Cross-Validated R²:")
print(f"Mean: {r2_scores.mean():.4f}, Std: {r2_scores.std():.4f}")

# ----- Save Model -----
joblib.dump(model, "short_video_model.pkl")
print("\nModel saved as short_video_model.pkl")