from pydantic import BaseModel


class VideoMetrics(BaseModel):
    video_duration_sec: int
    verified_status: int
    author_ban_status: int
    share_ratio: float
    comment_ratio: float

    like_ratio: float
    title_length: int
    description_length: int
    edge_intensity: float
    color_histogram: float
    spectral_entropy: float
    audio_intensity: float



