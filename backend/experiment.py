import joblib

with open("models/tiktok_engagement_stacked_model.pkl", "rb") as f:
    model = joblib.load(f)

with open("models/tiktok_classification_scaler.pkl", "rb") as f:
    classification_scaler = joblib.load(f)

with open("models/tiktok_classification.pkl", "rb") as f:
    classification_model = joblib.load(f)

features = [
    "video_duration_sec",
    "verified_status",
    "author_ban_status",
    "share_ratio",
    "comment_ratio",
]


features = [
    "video_duration_sec",
    "verified_status",
    "author_ban_status",
    # "like_ratio", # Can be added back in if necessary
    "share_ratio",
    "comment_ratio",
]
target = "engagement_rate"

test_data = [[32, 0, 2.00, 0.549096, 0.135111, 0.004855]]

predicted_score = model.predict(test_data)

transformed_data = classification_scaler.transform(test_data)
predicted_class = classification_model.predict(transformed_data)

quality_map = ["High Quality", "Medium Quality", "Low Quality"]

print(predicted_score[0])
print(quality_map[predicted_class[0]])
