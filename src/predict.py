import pandas as pd
from transformers import pipeline
from data_utils import load_config, prepare_dataframe

def main(config_path: str, csv_path: str, out_path: str):
    cfg = load_config(config_path)
    cfg_for_infer = {**cfg, "dataset": {**cfg["dataset"], "path": csv_path}}
    df, text_col, _ = prepare_dataframe(cfg_for_infer)

    model_dir = cfg["training"]["output_dir"]
    clf = pipeline("text-classification", model=model_dir, tokenizer=model_dir)

    results = clf(df[text_col].tolist())
    df["pred_label_name"] = [r["label"] for r in results]
    df["pred_confidence"] = [r["score"] for r in results]

    # Optional: map to 0/1 using config label names
    pos = cfg["dataset"].get("positive_label_name", "rewardable")
    neg = cfg["dataset"].get("negative_label_name", "unrewardable")
    mapping = {pos: 1, neg: 0}
    df["pred_label"] = df["pred_label_name"].str.lower().map(mapping)

    df.to_csv(out_path, index=False)
    print(f"[OK] Wrote predictions to {out_path}")

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", type=str, default="config.yaml")
    ap.add_argument("--csv", type=str, required=True)
    ap.add_argument("--out", type=str, default="predicted_comments.csv")
    args = ap.parse_args()
    main(args.config, args.csv, args.out)