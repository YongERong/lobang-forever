from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.linear_model import RidgeCV
from sklearn.metrics import make_scorer, mean_squared_error, r2_score
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt

# Load your dataset
df = pd.read_csv("short_video_engagement.csv")

# Feature selection
features = [
    "like_ratio", "comment_ratio", "share_ratio", "watch_ratio",
    "title_length", "description_length",
    "edge_intensity", "color_histogram",
    "spectral_entropy", "audio_intensity"
]
target = "watch_duration"  # or use "engagement_score_norm"

X = df[features]
y = df[target]

# Custom RMSE scorer
def rmse_func(y_true, y_pred):
    return np.sqrt(mean_squared_error(y_true, y_pred))

rmse_scorer = make_scorer(rmse_func, greater_is_better=False)
r2_scorer = make_scorer(r2_score)

# Define base models
rf = RandomForestRegressor(n_estimators=100, random_state=42)
gbr = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    random_state=42
)

# Define stacking ensemble
stacked_model = StackingRegressor(
    estimators=[('rf', rf), ('gbr', gbr)],
    final_estimator=RidgeCV()
)

# ----- Cross-validation -----
kf = KFold(n_splits=5, shuffle=True, random_state=42)
rmse_scores = cross_val_score(stacked_model, X, y, scoring=rmse_scorer, cv=kf)
r2_scores = cross_val_score(stacked_model, X, y, scoring=r2_scorer, cv=kf)

print("📊 Stacked Model Cross-Validated RMSE:")
print(f"  Mean: {-rmse_scores.mean():.4f}, Std: {rmse_scores.std():.4f}")
print("📊 Stacked Model Cross-Validated R²:")
print(f"  Mean: {r2_scores.mean():.4f}, Std: {r2_scores.std():.4f}")

# ----- Train/test evaluation -----
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

stacked_model.fit(X_train, y_train)
y_pred = stacked_model.predict(X_test)

rmse = rmse_func(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n📈 Train/Test Evaluation for Stacked Model:")
print(f"  RMSE: {rmse:.4f}")
print(f"  R² Score: {r2:.4f}")

# ----- Save model -----
joblib.dump(stacked_model, "short_video_stacked_model.pkl")
print("\n✅ Stacked model saved as 'short_video_stacked_model.pkl'")

# ----- Optional: Feature correlation check -----
corr = df[features + [target]].corr()[target].sort_values(ascending=False)
print("\n🔗 Feature Correlation with Target:")
print(corr)

# ----- Optional: Plot Target Distribution -----
plt.hist(y, bins=50)
plt.title("Distribution of Target: Watch Duration")
plt.xlabel("Watch Duration")
plt.ylabel("Frequency")
plt.show()
