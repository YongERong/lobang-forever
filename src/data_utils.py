import re
import yaml
import pandas as pd
from typing import Tuple, Optional, List

CAND_TEXT_COLS_FALLBACK = ["comment_text", "comment", "text", "content", "body", "message"]
CAND_LABEL_COLS_FALLBACK = ["label", "reward", "target", "class"]

def load_config(path: str) -> dict:
    with open(path, "r") as f:
        return yaml.safe_load(f)

def _first_present_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    for c in candidates:
        if c in df.columns:
            return c
    return None

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", " ", text)   # URLs
    text = re.sub(r"@\w+", " ", text)            # @mentions
    text = re.sub(r"#\w+", " ", text)            # #hashtags
    text = re.sub(r"[^\w\s]", " ", text)         # punctuation & emojis
    text = re.sub(r"\s+", " ", text).strip()     # extra spaces
    return text

def prepare_dataframe(cfg: dict) -> Tuple[pd.DataFrame, str, Optional[str]]:
    csv_path = cfg["dataset"]["path"]
    df = pd.read_csv(csv_path)

    cand_text = cfg["dataset"].get("text_columns", CAND_TEXT_COLS_FALLBACK)
    cand_label = cfg["dataset"].get("label_columns", CAND_LABEL_COLS_FALLBACK)

    text_col = _first_present_column(df, cand_text)
    label_col = _first_present_column(df, cand_label)

    if text_col is None:
        raise ValueError(f"Could not find a text column in {cand_text}. Columns found: {list(df.columns)}")

    # Clean
    df[text_col] = df[text_col].astype(str).apply(clean_text)

    # Normalize label if present
    if label_col is not None:
        mapping = {
            cfg["dataset"].get("positive_label_name", "rewardable"): 1,
            cfg["dataset"].get("negative_label_name", "unrewardable"): 0,
        }
        if df[label_col].dtype == object:
            df[label_col] = df[label_col].str.lower().map(mapping).astype("Int64")
        df[label_col] = pd.to_numeric(df[label_col], errors="coerce")
        df = df.dropna(subset=[label_col])
        df[label_col] = df[label_col].astype(int)

    return df, text_col, label_col

def maybe_add_weak_labels(df: pd.DataFrame, cfg: dict, label_col: Optional[str]):
    if label_col is not None:
        return df, label_col

    if not cfg["dataset"].get("use_weak_labels_if_no_label", False):
        return df, None

    score_col = cfg["dataset"].get("weak_label_from")
    if score_col not in df.columns:
        print(f"[WARN] weak_label_from column '{score_col}' not found; skipping weak labels.")
        return df, None

    thr = cfg["dataset"].get("weak_label_threshold", "auto_median")
    if isinstance(thr, str) and thr == "auto_median":
        threshold = float(df[score_col].median())
    else:
        threshold = float(thr)

    weak = (pd.to_numeric(df[score_col], errors="coerce").fillna(0) >= threshold).astype(int)
    df = df.copy()
    df["label"] = weak
    print(f"[INFO] Weak labels created from '{score_col}' using threshold {threshold:.3f}.")
    return df, "label"