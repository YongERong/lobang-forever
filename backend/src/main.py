from fastapi import FastAPI
from scoring_manager import ScoringManager

app = FastAPI()

scoring_manager = ScoringManager()


@app.get("/health")
def health():
    return {"message": "health ok"}


@app.get("/score")
def score(
    video_duration_sec,
    verified_status,
    author_ban_status,
    like_ratio,
    share_ratio,
    comment_ratio,
):
    prediction = scoring_manager.predict(
        video_duration_sec,
        verified_status,
        author_ban_status,
        like_ratio,
        share_ratio,
        comment_ratio,
    )
    return {"score": prediction}
