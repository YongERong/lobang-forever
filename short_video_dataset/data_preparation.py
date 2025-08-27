import pandas as pd
from sklearn.preprocessing import MinMaxScaler


# Load dataset
df = pd.read_csv("multimodal_dataset.csv")  # Update with actual filename

scaler = MinMaxScaler()

# Drop rows with missing critical values
df = df.dropna(subset=[
    "views", "likes", "comments", "shares", "watch_duration", "engagement_score"
])

# Avoid divide-by-zero
df = df[df["views"] > 0]

# Normalized engagement ratios
df["like_ratio"] = df["likes"] / df["views"]
df["comment_ratio"] = df["comments"] / df["views"]
df["share_ratio"] = df["shares"] / df["views"]
df["watch_ratio"] = df["watch_duration"] / df["views"]
df["engagement_score_continuous"] = (
    df["likes"] +
    df["shares"] +
    df["comments"]
) / df["views"] + (df["watch_duration"] / df["views"])
# This gives (engagements per view) + (average watch time per view)

df["engagement_score_norm"] = scaler.fit_transform(
    df[["engagement_score_continuous"]]
)

df.to_csv("short_video_engagement.csv", index=False)
