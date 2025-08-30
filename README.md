# Lobang Forever

## Frontend

- React + Vite + TS

```
cd frontend
npm install
npm run dev
```

## Machine learning
### Project Structure

#### tiktok_dataset/`

| File                             | Description |
|----------------------------------|-------------|
| `Classification_model.py`        | Classifies content into **high**, **medium**, or **low** quality tiers. Designed for interpretability by non-technical stakeholders. |
| `Data_preparation.py`            | Performs data cleaning (e.g., dropping missing values) and **feature engineering** (e.g., like/share/comment ratios, engagement rate). Final dataset is uploaded to Supabase. |
| `Engagement_model.py`            | Ensemble regression model that predicts **engagement rate** from video features. |
| `raw_or_engineered_data_comparison.py` | Applies **PCA** to both raw and engineered features to compare classifier performance across feature sets. |
| `overfitting_check.py`           | Visualizes **train/test RMSE and R²** scores to diagnose overfitting in the classification and regression models. |
| `Quality_score_model.py`         | Computes a **quality score** as a weighted sum of engagement rate, retention, sentiment, and creator status (if used). |

---

#### `short_video_dataset/`

| File                             | Description |
|----------------------------------|-------------|
| `data_preparation.py`            | Cleans the dataset and engineers key features such as **like ratio, comment ratio, share ratio, watch ratio**, and **engagement score** (continuous). |
| `overfitting_check.py`           | Similar to the one in `tiktok_dataset`, this script checks for overfitting via RMSE and R² plots. |
| `Watch_duration_model.py`        | Regression model that predicts **watch duration** of videos. Often ensembled to boost prediction accuracy. |
