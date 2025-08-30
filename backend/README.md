## FastAPI Backend

Purpose
This folder implements a small FastAPI-based backend that loads pre-trained models
and exposes prediction / scoring endpoints used by the frontend and experiments.

Model artifacts
- models/tiktok_classification_pipeline.pkl  - full classification pipeline (scaler + classifier)
- models/tiktok_engagement_stacked_model.pkl - stacked model for engagement prediction
- models/short_video_stacked_model.pkl      - stacked model for short-video predictions

Notes
- The service entrypoint is `src/main.py` (FastAPI). Models are loaded at runtime
	so ensure any required virtual environment and dependencies from `requirements.txt`
	are installed before starting the server.

