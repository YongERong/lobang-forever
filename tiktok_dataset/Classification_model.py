import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# === Load Data ===
df = pd.read_csv("tiktok_dataset_cleaned.csv")

# === Define Engineered Features ===
features_engineered = [
    "video_duration_sec", "verified_status", "author_ban_status",
    "like_ratio", "share_ratio", "comment_ratio"
]

# === Drop missing values ===
df = df.dropna(subset=features_engineered).copy()

# === Feature Scaling ===
X = df[features_engineered]
X_scaled = StandardScaler().fit_transform(X)

# === KMeans Clustering (3 clusters) ===
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X_scaled)
df["cluster"] = clusters

# === Determine Quality Labels ===
cluster_means = df.groupby("cluster")[["like_ratio", "share_ratio", "comment_ratio"]].mean()
sorted_clusters = cluster_means.mean(axis=1).sort_values().index.tolist()

quality_map = {
    sorted_clusters[0]: "Low Quality",
    sorted_clusters[1]: "Medium Quality",
    sorted_clusters[2]: "High Quality"
}

df["quality_label"] = df["cluster"].map(quality_map)

# === Save to CSV ===
# df.to_csv("tiktok_quality_classification.csv", index=False)
# print("Classification results saved to 'tiktok_quality_classification.csv'.")
