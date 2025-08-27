import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# === LOAD YOUR OWN CLEANED DATA HERE ===
df = pd.read_csv("short_video_engagement.csv")

# === SELECT FEATURES AND TARGET ===
features = [
    "like_ratio", "comment_ratio", "share_ratio", "watch_ratio",
    "title_length", "description_length",
    "edge_intensity", "color_histogram",
    "spectral_entropy", "audio_intensity"
]
target = "engagement_score_norm"

X = df[features]
y = df[target]

# === TRAIN/TEST SPLIT ===
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# === MODEL TRAINING ===
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# === PREDICTIONS ===
train_pred = model.predict(X_train)
test_pred = model.predict(X_test)

# === METRICS ===
train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
train_r2 = r2_score(y_train, train_pred)
test_r2 = r2_score(y_test, test_pred)

print(f"Train RMSE: {train_rmse:.4f}, R²: {train_r2:.4f}")
print(f"Test  RMSE: {test_rmse:.4f}, R²: {test_r2:.4f}")

# === VISUALIZATION ===
plt.figure(figsize=(12, 6))

# Train
plt.subplot(1, 2, 1)
plt.scatter(y_train, train_pred, alpha=0.6, label="Train Predictions", color="steelblue")
plt.plot([y_train.min(), y_train.max()], [y_train.min(), y_train.max()], 'k--')
plt.xlabel("Actual Engagement Score (Train)")
plt.ylabel("Predicted Engagement Score")
plt.title("Training Set: Predicted vs Actual")
plt.legend()

# Test
plt.subplot(1, 2, 2)
plt.scatter(y_test, test_pred, alpha=0.6, label="Test Predictions", color="darkorange")
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--')
plt.xlabel("Actual Engagement Score (Test)")
plt.ylabel("Predicted Engagement Score")
plt.title("Test Set: Predicted vs Actual")
plt.legend()

plt.suptitle("Overfitting Diagnostic — Engagement Score Model", fontsize=16)
plt.tight_layout(rect=[0, 0.03, 1, 0.95])
plt.show()
