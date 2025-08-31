import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
import joblib
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

# === Download Data from Supabase ===
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)
response = (
    supabase.table("tiktok_dataset_cleaned")
    .select("*")
    .csv()
    .execute()
)

if response.data:
    csv_data = response.data
    with open("tiktok_dataset_cleaned.csv", "w+", encoding="utf-8") as f:
        f.write(csv_data)
    print("Data successfully downloaded as output.csv")
else:
    print("Error or no data returned:", response.error)


# === Load Data ===
df = pd.read_csv("tiktok_dataset_cleaned.csv")

# === Define Engineered Features ===
features_engineered = [
    "video_duration_sec",
    "verified_status",
    "author_ban_status",
    "like_ratio",
    "share_ratio",
    "comment_ratio",
]

# === Drop missing values ===
df = df.dropna(subset=features_engineered).copy()


# === Assemble Pipeline ===
pipeline = Pipeline(
    [("scaler", StandardScaler()), ("model", KMeans(n_clusters=3, random_state=42))]
)


# === Train Pipeline ===
X = df[features_engineered]
pipeline.fit(X)
clusters = pipeline.predict(X)
df["cluster"] = clusters

# === Determine Quality Labels ===
cluster_means = df.groupby("cluster")[
    ["like_ratio", "share_ratio", "comment_ratio"]
].mean()
sorted_clusters = cluster_means.mean(axis=1).sort_values().index.tolist()

quality_map = {
    sorted_clusters[0]: "Low Quality",
    sorted_clusters[1]: "Medium Quality",
    sorted_clusters[2]: "High Quality",
}

df["quality_label"] = df["cluster"].map(quality_map)

# === Save to CSV ===
df.to_csv("tiktok_quality_classification_pipeline.csv", index=False)
print("Classification results saved to 'tiktok_quality_classification.csv'.")


# === Pickle K-Means Pipeline ===
with open("tiktok_classification_pipeline.pkl", "wb") as f:
    joblib.dump(pipeline, f, protocol=5)
