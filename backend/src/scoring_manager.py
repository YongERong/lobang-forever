import math
from typing import Any, Dict

import joblib
import numpy as np
from sklearn.inspection import permutation_importance
from schemas import VideoMetrics


class ScoringManager:
    def __init__(self):
        with open("models/tiktok_engagement_stacked_model.pkl", "rb") as f:
            self.stacked_engagement_model = joblib.load(f)
        with open("models/tiktok_classification_pipeline.pkl", "rb") as f:
            self.classification_pipeline = joblib.load(f)

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
                    metrics.like_ratio,
                    metrics.share_ratio,
                    metrics.comment_ratio,
                ]
            ]
        )
        # Ensure we return a native float and map NaN/Inf to a safe numeric
        return self._sanitize_value(prediction[0], float)

    def video2metrics(
        self,
    ):
        pass

    def _sanitize_value(self, value: Any, expected_type: type):
        """Coerce numpy scalars and Python types to expected_type.

        - Convert numpy types to native scalars.
        - For floats: if NaN or infinite, replace with 0.0.
        - For ints: attempt int conversion, otherwise raise TypeError.
        """
        # unwrap numpy scalar
        if isinstance(value, (np.generic,)):
            try:
                value = value.item()
            except (AttributeError, TypeError, ValueError):
                # fallback to cast
                pass

        # None is not allowed; treat as zero-equivalent
        if value is None:
            return expected_type(0)

        # Floats
        if expected_type is float:
            try:
                f = float(value)
            except (TypeError, ValueError) as exc:
                msg = "Unable to coerce {val!r} to float".format(val=value)
                raise TypeError(msg) from exc
            if not math.isfinite(f):
                # replace NaN/Inf with safe numeric sentinel
                return 0.0
            return f

        # Ints
        if expected_type is int:
            try:
                return int(value)
            except (TypeError, ValueError) as exc:
                raise TypeError(f"Unable to coerce {value!r} to int") from exc

        # Fallback: return as-is
        return value

    # def _sanitize_metrics(self, metrics: VideoMetrics) -> VideoMetrics:
    #     """Return a new VideoMetrics instance with sanitized, native types.

    # Replace numpy scalars, coerce types, and map NaN/Inf to 0.0.
    #     """
    #     fields = {
    #         "video_duration_sec": int,
    #         "verified_status": int,
    #         "author_ban_status": int,
    #         "like_ratio": float,
    #         "share_ratio": float,
    #         "comment_ratio": float,
    #     }

    #     sanitized: Dict[str, Any] = {}
    #     for name, typ in fields.items():
    #         raw = getattr(metrics, name)
    #         sanitized[name] = self._sanitize_value(raw, typ)

    #     return VideoMetrics(**sanitized)

    def explain(self, quality_score: float, metrics: VideoMetrics):
        features = [
            "video_duration_sec",
            "verified_status",
            "author_ban_status",
            "like_ratio",
            "share_ratio",
            "comment_ratio",
        ]
        importances = permutation_importance(
                self.stacked_engagement_model,
                [
                    [
                        metrics.video_duration_sec,
                        metrics.verified_status,
                        metrics.author_ban_status,
                        metrics.like_ratio,
                        metrics.share_ratio,
                        metrics.comment_ratio,
                    ]
                ],
                [quality_score],
                n_repeats=10,
                random_state=42,
                n_jobs=-1,
            ).importances_mean
        # Replace NaN/Inf in importances and convert to native floats for JSON
        importances = np.nan_to_num(importances, nan=0.0, posinf=0.0, neginf=0.0)
        shap_data = [
            {"feature": feature_name, "importance": float(self._sanitize_value(importance_value, float))}
            for feature_name, importance_value in zip(features, importances)
        ]
        return shap_data
    
    def score(self, metrics):
        quality_score = self.quality_score(metrics)
        quality_class = self.quality_classification(metrics)
        explanation = self.explain(quality_score, metrics)

        # Return a JSON-serializable mapping instead of a raw tuple. All numeric
        # values are sanitized in their producers, but we convert here defensively.
        return {
            "quality_score": float(self._sanitize_value(quality_score, float)),
            "quality_class": quality_class,
            "explanation": explanation,
        }

