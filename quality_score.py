import os
import pandas as pd
import joblib
import numpy as np
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# ---- Set Relative Model Paths ----
ROOT_DIR = os.getcwd()
ENGAGEMENT_MODEL_PATH = os.path.join(ROOT_DIR, "tiktok_dataset", "tiktok_engagement_stacked_model.pkl")
RETENTION_MODEL_PATH = os.path.join(ROOT_DIR, "short_video_dataset", "short_video_stacked_model.pkl")

# ---- Load Models ----
engagement_model = joblib.load(ENGAGEMENT_MODEL_PATH)
retention_model = joblib.load(RETENTION_MODEL_PATH)
# analyzer = SentimentIntensityAnalyzer()

# ---- Load Video Data ----
# df = pd.read_csv("input_videos.csv")  
df = pd.read_csv("tiktok_dataset/tiktok_dataset_cleaned.csv")

# ---- Engagement Prediction ----
engagement_features = [
    "video_duration_sec", "verified_status", "author_ban_status",
    "share_ratio", "comment_ratio"
]
df["engagement_rate"] = engagement_model.predict(df[engagement_features])

# ---- Retention Prediction ----
retention_features = [
    "like_ratio", "comment_ratio", "share_ratio", "watch_ratio",
    "title_length", "description_length",
    "edge_intensity", "color_histogram",
    "spectral_entropy", "audio_intensity"
]
df["viewer_retention"] = retention_model.predict(df[retention_features])

# ---- Sentiment Score ----
# def compute_sentiment(text):
#     if pd.isna(text) or not isinstance(text, str):
#         return 0.0
#     return analyzer.polarity_scores(text)["compound"]

# df["sentiment_score"] = df["comments"].apply(compute_sentiment)

# ---- Verified Creator Bonus ----
df["verified_bonus"] = df["verified_status"].apply(lambda x: 1 if x == 1 else 0)

# ---- Final Weighted Quality Score ----
w1, w2, w3, w4 = 0.4, 0.3, 0.2, 0.1
df["quality_score"] = (
    w1 * df["engagement_rate"] +
    w2 * df["viewer_retention"] +
    # w3 * df["sentiment_score"] +
    w4 * df["verified_bonus"]
)

# ---- Output ----
df[[
    "engagement_rate", "viewer_retention", "sentiment_score", "verified_bonus", "quality_score"
]].to_csv("output_quality_scores.csv", index=False)

print(df[["quality_score"]].describe())
print("\n Quality scores saved to output_quality_scores.csv")
