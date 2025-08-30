import joblib


class ScoringManager:
    def __init__(self):
        with open("models/tiktok_engagement_stacked_model.pkl", "rb") as f:
            self.model = joblib.load(f)

    def predict(
        self,
        video_duration_sec,
        verified_status,
        author_ban_status,
        like_ratio,
        share_ratio,
        comment_ratio,
    ):
        prediction = self.model.predict(
            [
                [
                    video_duration_sec,
                    verified_status,
                    author_ban_status,
                    like_ratio,
                    share_ratio,
                    comment_ratio,
                ]
            ]
        )
        return prediction[0]
