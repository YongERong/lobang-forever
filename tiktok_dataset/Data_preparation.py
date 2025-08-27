
import pandas as pd

# Load CSV
df = pd.read_csv("tiktok_dataset.csv")  

# Drop unneeded columns
df = df.drop(columns=["#", "video_id", "video_transcription_text", "claim_status"])

# Handle missing values
df = df.dropna(subset=[
    "video_view_count", "video_like_count", "video_share_count",
    "video_download_count", "video_comment_count"
])

# Convert verified_status to binary
df["verified_status"] = df["verified_status"].map({
    "verified": 1,
    "not verified": 0
})

# Convert author_ban_status to ordinal
df["author_ban_status"] = df["author_ban_status"].map({
    "active": 2,
    "under scrutiny": 1,
    "banned": 0
})

# Avoid divide-by-zero errors
df = df[df["video_view_count"] > 0]

# Compute new features
df["engagement_rate"] = (
    df["video_like_count"] +
    df["video_share_count"] +
    df["video_download_count"] +
    df["video_comment_count"]
) / df["video_view_count"]

df["like_ratio"] = df["video_like_count"] / df["video_view_count"]
df["share_ratio"] = df["video_share_count"] / df["video_view_count"]
df["comment_ratio"] = df["video_comment_count"] / df["video_view_count"]

# show sample
# print(df[[
#     "engagement_rate", "like_ratio", "share_ratio", "comment_ratio"
# ]].head())

df.to_csv('tiktok_dataset_cleaned.csv', index=False)
