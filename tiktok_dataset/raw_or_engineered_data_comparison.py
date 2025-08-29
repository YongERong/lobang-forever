import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

# === Load Data ===
df = pd.read_csv("tiktok_dataset_cleaned.csv")

# === Define Raw and Engineered Feature Sets ===
features_raw = [
    "video_duration_sec", "verified_status", "author_ban_status",
    "video_view_count", "video_like_count", "video_share_count",
    "video_download_count", "video_comment_count"
]

features_engineered = [
    "video_duration_sec", "verified_status", "author_ban_status",
    "like_ratio", "share_ratio", "comment_ratio"
]

# === Drop missing data ===
df_raw = df.dropna(subset=features_raw).copy()
df_eng = df.dropna(subset=features_engineered).copy()

# === Standardize Raw Features ===
X_raw = df_raw[features_raw]
X_raw_scaled = StandardScaler().fit_transform(X_raw)

# === KMeans Clustering: RAW ===
kmeans_raw = KMeans(n_clusters=3, random_state=42)
clusters_raw = kmeans_raw.fit_predict(X_raw_scaled)
df_raw["cluster_raw"] = clusters_raw
sil_raw = silhouette_score(X_raw_scaled, clusters_raw)

# === PCA for RAW Features ===
pca_raw = PCA(n_components=2)
X_raw_pca = pca_raw.fit_transform(X_raw_scaled)

# === Standardize Engineered Features ===
X_eng = df_eng[features_engineered]
X_eng_scaled = StandardScaler().fit_transform(X_eng)

# === KMeans Clustering: ENGINEERED ===
kmeans_eng = KMeans(n_clusters=3, random_state=42)
clusters_eng = kmeans_eng.fit_predict(X_eng_scaled)
df_eng["cluster_eng"] = clusters_eng
sil_eng = silhouette_score(X_eng_scaled, clusters_eng)

# === PCA for ENGINEERED Features ===
pca_eng = PCA(n_components=2)
X_eng_pca = pca_eng.fit_transform(X_eng_scaled)

# === Cluster Summary: Mean Stats ===
print("\n=== RAW FEATURE CLUSTER MEANS ===")
print(df_raw.groupby("cluster_raw")[features_raw].mean())

print("\n=== ENGINEERED FEATURE CLUSTER MEANS ===")
print(df_eng.groupby("cluster_eng")[features_engineered].mean())

print("\n=== SILHOUETTE SCORES ===")
print(f"Raw Features: {sil_raw:.4f}")
print(f"Engineered Features: {sil_eng:.4f}")

# === Map Cluster Labels to Quality Levels (based on cluster mean inspection) ===
cluster_means = df_eng.groupby("cluster_eng")[["like_ratio", "share_ratio", "comment_ratio"]].mean()
sorted_clusters = cluster_means.mean(axis=1).sort_values().index.tolist()

quality_map = {
    sorted_clusters[0]: "Low Quality",
    sorted_clusters[1]: "Medium Quality",
    sorted_clusters[2]: "High Quality"
}

df_eng["quality_label"] = df_eng["cluster_eng"].map(quality_map)

# === PCA Plots ===
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.scatter(X_raw_pca[:, 0], X_raw_pca[:, 1], c=clusters_raw, cmap="plasma", alpha=0.7)
plt.title("Raw Features Clustering (3 Clusters)")

plt.subplot(1, 2, 2)
plt.scatter(X_eng_pca[:, 0], X_eng_pca[:, 1], c=clusters_eng, cmap="viridis", alpha=0.7)
plt.title("Engineered Features Clustering (3 Clusters)")

plt.suptitle("KMeans Clustering — Raw vs Engineered TikTok Features", fontsize=14)
plt.tight_layout()
plt.show()

# === Boxplots to Interpret Cluster Quality ===
plt.figure(figsize=(16, 5))
for i, feature in enumerate(["like_ratio", "share_ratio", "comment_ratio"]):
    plt.subplot(1, 3, i+1)
    sns.boxplot(data=df_eng, x="quality_label", y=feature, order=["Low Quality", "Medium Quality", "High Quality"])
    plt.title(f"{feature} by Inferred Quality")
plt.tight_layout()
plt.show()

# Sort clusters by mean engagement proxy
cluster_means = df_eng.groupby("cluster_eng")[["like_ratio", "share_ratio", "comment_ratio"]].mean()
sorted_clusters = cluster_means.mean(axis=1).sort_values().index.tolist()

# Map clusters to labels
quality_map = {
    sorted_clusters[0]: "Low Quality",
    sorted_clusters[1]: "Medium Quality",
    sorted_clusters[2]: "High Quality"
}
df_eng["quality_label"] = df_eng["cluster_eng"].map(quality_map)

# Preview samples from each cluster
print("\nLow Quality Samples:")
print(df_eng[df_eng["quality_label"] == "Low Quality"][features_engineered + ["quality_label"]].head(5))

print("\nMedium Quality Samples:")
print(df_eng[df_eng["quality_label"] == "Medium Quality"][features_engineered + ["quality_label"]].head(5))

print("\nHigh Quality Samples:")
print(df_eng[df_eng["quality_label"] == "High Quality"][features_engineered + ["quality_label"]].head(5))
