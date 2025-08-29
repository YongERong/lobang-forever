import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.linear_model import Ridge
from sklearn.svm import SVR
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, make_scorer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline

# ----- 1. Load Dataset -----
df = pd.read_csv("tiktok_dataset_cleaned.csv")

# ----- 2. Select Features and Target -----
features = [
    "video_duration_sec", "verified_status", "author_ban_status",
    # "like_ratio", # Can be added back in if necessary
    "share_ratio", "comment_ratio"
]
target = "engagement_rate"

X = df[features]
y = df[target]

# ----- 3. Define Ensemble Model -----
# Imputer that fills NaNs with mean (or median)
imputer = SimpleImputer(strategy='mean')

estimators = [
    ("rf", make_pipeline(imputer, RandomForestRegressor(n_estimators=100, random_state=42))),
    ("svr", make_pipeline(imputer, StandardScaler(), SVR(C=1.0, epsilon=0.2))),
    ("ridge", make_pipeline(imputer, StandardScaler(), Ridge(alpha=1.0)))
]
# Pipelines for models that require scaling


final_estimator = GradientBoostingRegressor(n_estimators=100, random_state=42)

stacked_model = StackingRegressor(
    estimators=estimators,
    final_estimator=final_estimator,
    n_jobs=-1
)

# ----- 4. Cross-Validation -----
kf = KFold(n_splits=5, shuffle=True, random_state=42)
rmse_scorer = make_scorer(mean_squared_error, greater_is_better=False)
r2_scorer = make_scorer(r2_score)

rmse_scores = cross_val_score(stacked_model, X, y, cv=kf, scoring=rmse_scorer)
r2_scores = cross_val_score(stacked_model, X, y, cv=kf, scoring=r2_scorer)

print("Cross-Validated RMSE:")
print(f"  Mean: {abs(rmse_scores.mean()):.4f}, Std: {rmse_scores.std():.4f}")
print("Cross-Validated R²:")
print(f"  Mean: {r2_scores.mean():.4f}, Std: {r2_scores.std():.4f}")

# ----- 5. Train/Test Split Evaluation -----
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

stacked_model.fit(X_train, y_train)
y_pred = stacked_model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\n Train/Test Evaluation:")
print(f"  RMSE: {rmse:.4f}")
print(f"  R² Score: {r2:.4f}")

# ----- 6. Engagement Rate Distribution -----
plt.hist(y, bins=50)
plt.title("Engagement Rate Distribution")
plt.xlabel("Engagement Rate")
plt.ylabel("Frequency")
plt.tight_layout()
plt.show()

# ----- 7. Residuals Distribution -----
residuals = y_test - y_pred
plt.hist(residuals, bins=50, color="orange")
plt.title("Residuals Distribution")
plt.xlabel("Residual")
plt.ylabel("Frequency")
plt.tight_layout()
plt.show()

# ----- 8. Correlation -----
corr = df[features + [target]].corr()[target].sort_values(ascending=False)
print("\nFeature Correlation with Engagement Rate:")
print(corr)

# ----- 9. Save Model -----
joblib.dump(stacked_model, "tiktok_engagement_stacked_model.pkl")
print("\nEnsemble model saved as 'tiktok_engagement_stacked_model.pkl'")
