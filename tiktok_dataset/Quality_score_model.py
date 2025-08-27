from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, make_scorer
import numpy as np
import pandas as pd
import joblib

# Load dataset
df = pd.read_csv("tiktok_dataset_cleaned.csv")

# Select features and target
# features = [
#     "video_duration_sec", "verified_status", "author_ban_status",
#     "like_ratio", "share_ratio", "comment_ratio"
# ]
features = [
    "video_duration_sec", "verified_status", "author_ban_status",
     "share_ratio", "comment_ratio"
]
target = "engagement_rate"

X = df[features]
y = df[target]

# ----- K-Fold Cross Validation -----
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# RMSE scorer (negative because sklearn expects higher = better)
rmse_scorer = make_scorer(mean_squared_error, greater_is_better=False)
r2_scorer = make_scorer(r2_score)

model = RandomForestRegressor(n_estimators=100, random_state=42)

rmse_scores = cross_val_score(model, X, y, cv=kf, scoring=rmse_scorer)
r2_scores = cross_val_score(model, X, y, cv=kf, scoring=r2_scorer)

print("Cross-Validated RMSE:")
print(f"Mean: {abs(rmse_scores.mean()):.4f}, Std: {rmse_scores.std():.4f}")
print("Cross-Validated R²:")
print(f"Mean: {r2_scores.mean():.4f}, Std: {r2_scores.std():.4f}")

# ----- Train/Test Evaluation -----
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"\nTrain/Test RMSE: {rmse:.4f}")
print(f"Train/Test R² Score: {r2:.4f}")

print(y.describe())
print(y.nunique())


# # ----- Save Model -----
# joblib.dump(model, "tiktok_engagement_model.pkl")
# print("\nModel saved as tiktok_engagement_model.pkl")

import matplotlib.pyplot as plt
plt.hist(y, bins=50)
plt.title("Distribution of Engagement Rate")
plt.xlabel("Engagement Rate")
plt.ylabel("Frequency")
plt.show()

corr = df[features + [target]].corr()[target].sort_values(ascending=False)
print(corr)
