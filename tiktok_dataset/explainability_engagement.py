import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.inspection import permutation_importance

# -------------------------
# Load model and data
# -------------------------
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "tiktok_engagement_stacked_model.pkl")
data_path = os.path.join(base_dir, "tiktok_dataset_cleaned.csv")

model = joblib.load(model_path)
df = pd.read_csv(data_path)

# -------------------------
# Define features and target
# -------------------------
features = [
    "video_duration_sec",
    "verified_status",
    "author_ban_status",
    "like_ratio",
    "share_ratio",
    "comment_ratio"
 
]


X = df[features]
y = df["engagement_rate"]

# -------------------------
# Compute permutation importance
# -------------------------
print("Computing permutation importances...")
result = permutation_importance(model, X, y, n_repeats=10, random_state=42, n_jobs=-1)
importances = pd.Series(result.importances_mean, index=features).sort_values(ascending=True)

# -------------------------
# Plot setup
# -------------------------
plt.figure(figsize=(10, 6))
ax = sns.barplot(x=importances.values, y=importances.index, palette="Blues_r")

# -------------------------
# Threshold interpretation
# -------------------------
high_thresh = 0.02
med_thresh = 0.01

for i, (feature, score) in enumerate(importances.items()):
    if score >= high_thresh:
        level = "High"
        color = "darkgreen"
    elif score >= med_thresh:
        level = "Moderate"
        color = "orange"
    else:
        level = "Low"
        color = "gray"
    
    ax.text(score + 0.001, i, f"{level} impact", va="center", fontsize=10, color=color)

# -------------------------
# Add threshold lines
# -------------------------
plt.axvline(high_thresh, color='green', linestyle='--', linewidth=1)
plt.axvline(med_thresh, color='orange', linestyle='--', linewidth=1)
plt.title("Feature Importance (Permutation-based)", fontsize=14)
plt.xlabel("Importance Score (Mean Decrease in R²)")
plt.ylabel("Feature")
plt.tight_layout()

# -------------------------
# Add interpretation box
# -------------------------
caption = (
    "How to read:\n"
    "✔ Features on top contribute most to engagement rate prediction.\n"
    "✔ 'High impact' = removing this feature significantly reduces accuracy.\n"
    "✔ 'Moderate/Low impact' = some influence, but not dominant.\n"
    "✔ Use this to prioritise which features to monitor, improve, or explain."
)
plt.figtext(0.99, 0.01, caption, ha="right", va="bottom", fontsize=9, style='italic')

# Save the plot
plt.savefig("permutation_importance_annotated.png")
plt.show()
print("Saved annotated permutation importance plot as 'permutation_importance_annotated.png'")


