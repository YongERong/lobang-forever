import os
import joblib
import shap
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.inspection import permutation_importance
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# -----------------------------
# Load Model and Data
# -----------------------------
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "short_video_stacked_model.pkl")
data_path = os.path.join(base_dir, "short_video_engagement.csv")

model = joblib.load(model_path)
df = pd.read_csv(data_path)

# -----------------------------
# Define Features
# -----------------------------
features = [
    "like_ratio", "comment_ratio", "share_ratio", "watch_ratio",
    "title_length", "description_length",
    "edge_intensity", "color_histogram",
    "spectral_entropy", "audio_intensity"
]

X = df[features]
y = df["watch_duration"]

X_sample = X.sample(100, random_state=42)

# -----------------------------
# SHAP Explanation
# -----------------------------
explainer = shap.Explainer(model.predict, X_sample)
shap_values = explainer(X_sample)

plt.figure()
shap.summary_plot(shap_values, X_sample, show=False)
plt.title("SHAP Summary: Watch Duration")
plt.savefig("shap_summary_watch_duration.png", bbox_inches="tight")

# -----------------------------
# Permutation Importance
# -----------------------------
perm_result = permutation_importance(model, X, y, scoring='r2', n_repeats=10, random_state=42)
perm_df = pd.DataFrame({
    'feature': features,
    'importance': perm_result.importances_mean,
    'std': perm_result.importances_std
}).sort_values(by='importance', ascending=False)

plt.figure(figsize=(10, 6))
sns.barplot(data=perm_df, x="importance", y="feature", orient="h", palette="viridis")
plt.title("Permutation Importance (R^2 Drop) for Watch Duration")
plt.xlabel("Importance")
plt.tight_layout()
plt.savefig("permutation_importance_watch_duration.png")
plt.close()

# -----------------------------
# Text-based Interpretation
# -----------------------------
threshold = 0.01  # Adjust if needed
print("\nTop Influential Features (SHAP Average Impact > {:.3f}):".format(threshold))
for i in range(len(shap_values.values[0])):
    feature_name = X_sample.columns[i]
    avg_impact = abs(shap_values.values[:, i]).mean()
    if avg_impact > threshold:
        print(f"- {feature_name}: contributes significantly to watch duration (avg impact = {avg_impact:.4f})")

print("\nVisualizations saved:")
print("- shap_summary_watch_duration.png")
print("- shap_bar_watch_duration.png")
print("- permutation_importance_watch_duration.png")

# Compute average SHAP impact
mean_shap = np.abs(shap_values.values).mean(axis=0)
shap_df = pd.DataFrame({
    "feature": X_sample.columns,
    "importance": mean_shap
}).sort_values("importance", ascending=True)

# -------------------------
# Plot SHAP bar chart
# -------------------------
plt.figure(figsize=(12, 8))
sns.barplot(data=shap_df, x="importance", y="feature", palette="viridis")

# -------------------------
# Add threshold lines
# -------------------------
high_thresh = 0.01
med_thresh = 0.005
plt.axvline(high_thresh, color='green', linestyle='--', linewidth=1)
plt.axvline(med_thresh, color='orange', linestyle='--', linewidth=1)

plt.title("Feature Importance (SHAP-based)", fontsize=14)
plt.xlabel("Mean |SHAP Value| (Average Impact on Watch Duration Prediction)")
plt.ylabel("Feature")
plt.tight_layout()

# -------------------------
# Add interpretation box
# -------------------------
caption = (
    "How to read:\n"
    "✔ Features on top contribute most to predicted watch duration.\n"
    "✔ Green line: 'High impact' threshold — strong influence on model output.\n"
    "✔ Orange line: 'Moderate impact' threshold — moderate influence.\n"
    "✔ Use this to prioritise content features (e.g., shares, comments, titles)."
)
plt.figtext(0.99, 0.01, caption, ha="right", va="bottom", fontsize=9, style='italic')

# -------------------------
# Save plot
# -------------------------
plt.savefig("shap_bar_watch_duration_annotated.png", dpi=300)
plt.close()
print("✅ Saved annotated SHAP bar plot for watch duration.")