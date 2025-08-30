from fastapi import FastAPI
from scoring_manager import ScoringManager
from schemas import VideoMetrics
import logging

app = FastAPI()

scoring_manager = ScoringManager()
logging.basicConfig(level=logging.DEBUG)


@app.get("/health")
def health():
    return {"message": "health ok"}


    logging.info(metrics)
    prediction = scoring_manager.score(metrics)
    return {"score": prediction}
