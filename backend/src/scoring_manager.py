import math
from typing import Any, Dict
import logging

import joblib
import numpy as np
from sklearn.inspection import permutation_importance
from schemas import VideoMetrics

logging.basicConfig(level=logging.DEBUG)


class ScoringManager:
    def __init__(self):
        with open("models/tiktok_engagement_stacked_model.pkl", "rb") as f:
            self.stacked_engagement_model = joblib.load(f)
        with open("models/tiktok_classification_pipeline.pkl", "rb") as f:
            self.classification_pipeline = joblib.load(f)
        with open("models/short_video_stacked_model.pkl", "rb") as f:
            self.watch_duration_model = joblib.load(f)

    def quality_classification(self, metrics: VideoMetrics):
        prediction = self.classification_pipeline.predict(
            [
                [
                    metrics.video_duration_sec,
                    metrics.verified_status,
                    metrics.author_ban_status,
                    metrics.like_ratio,
                    metrics.share_ratio,
                    metrics.comment_ratio,
                ]
            ]
        )
        quality_map = ["High Quality", "Medium Quality", "Low Quality"]
        return quality_map[prediction[0]]

    def quality_score(self, metrics: VideoMetrics):
        prediction = self.stacked_engagement_model.predict(
            [
                [
                    metrics.video_duration_sec,
                    metrics.verified_status,
                    metrics.author_ban_status,
                    metrics.share_ratio,
                    metrics.comment_ratio,
                ]
            ]
        )
        return prediction[0]
    
    def watch_duration_score(self, metrics: VideoMetrics):
        prediction = self.watch_duration_model.predict([[
            metrics.like_ratio, metrics.comment_ratio, metrics.share_ratio,
            metrics.title_length, metrics.description_length,
            metrics.edge_intensity, metrics.color_histogram,
            metrics.spectral_entropy, metrics.audio_intensity]]
        )
        return prediction[0]


    def video2metrics(
        self,
    ):
        pass


    def score(self, metrics):
        quality_score = self.quality_score(metrics)
        quality_class = self.quality_classification(metrics)
        watch_duration = self.watch_duration_score(metrics)

        return {
            "quality_score": quality_score,
            "quality_class": quality_class,
            "watch_duration": watch_duration
        }
    
