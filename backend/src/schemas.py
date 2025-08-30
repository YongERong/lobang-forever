from pydantic import BaseModel


class VideoMetrics(BaseModel):
    video_duration_sec: int
    verified_status: int
    author_ban_status: int
    like_ratio: float
    share_ratio: float
    comment_ratio: float
