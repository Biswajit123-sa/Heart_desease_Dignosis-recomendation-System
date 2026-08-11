import joblib
import pandas as pd
from pathlib import Path
from functools import lru_cache
# pyrefly: ignore [missing-import]
from loguru import logger
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from xgboost import XGBClassifier

from app.config import settings, PredictionResult

def load_dataset(path: str | None = None) -> pd.DataFrame:
    path = path or settings.RAW_DATA_PATH
    return pd.read_csv(path)

def split_features_target(df: pd.DataFrame):
    X = df[settings.ML_FEATURE_COLUMNS]
    y = df[settings.ML_TARGET_COLUMN]
    return X, y

def train_test_data(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    X, y = split_features_target(df)
    return train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)

def train_and_select_model():
    df = load_dataset()
    logger.info(f"Loaded dataset with shape {df.shape}")

    X_train, X_test, y_train, y_test = train_test_data(df)

    candidates = {
        "logistic_regression": LogisticRegression(max_iter=1000),
        "random_forest": RandomForestClassifier(n_estimators=300, max_depth=8, random_state=42),
        "xgboost": XGBClassifier(
            n_estimators=300, max_depth=4, learning_rate=0.05,
            eval_metric="logloss", random_state=42
        ),
    }

    best_model, best_name, best_auc = None, None, -1

    for name, model in candidates.items():
        model.fit(X_train, y_train)
        probs = model.predict_proba(X_test)[:, 1]
        preds = model.predict(X_test)
        auc = roc_auc_score(y_test, probs)
        acc = accuracy_score(y_test, preds)
        logger.info(f"{name}: AUC={auc:.4f}, Accuracy={acc:.4f}")

        if auc > best_auc:
            best_model, best_name, best_auc = model, name, auc

    logger.info(f"Selected best model: {best_name} (AUC={best_auc:.4f})")

    out_path = Path(settings.ML_MODEL_PATH)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": best_model, "model_name": best_name, "features": settings.ML_FEATURE_COLUMNS}, out_path)
    logger.info(f"Model saved to {out_path}")

    return best_model, best_name, best_auc

@lru_cache(maxsize=1)
def _load_model_bundle():
    try:
        return joblib.load(settings.ML_MODEL_PATH)
    except FileNotFoundError as e:
        raise RuntimeError("ML model is not loaded. Train it first via scripts/train_model.py") from e

def predict_risk(feature_dict: dict) -> PredictionResult:
    try:
        bundle = _load_model_bundle()
        model = bundle["model"]
        features = bundle["features"]

        row = pd.DataFrame([{f: feature_dict[f] for f in features}])
        proba = float(model.predict_proba(row)[0, 1])
        label = "High Risk" if proba >= 0.5 else "Low Risk"

        return PredictionResult(
            risk_label=label,
            risk_probability=round(proba, 4),
            risk_score=round(proba * 100),
            model_version=bundle.get("model_name", "v1"),
        )
    except Exception as e:
        raise RuntimeError(f"Inference failed: {e}") from e

def evaluate_saved_model(model_path: str | None = None):
    model_path = model_path or settings.ML_MODEL_PATH
    bundle = joblib.load(model_path)
    model = bundle["model"]

    df = load_dataset()
    _, X_test, _, y_test = train_test_data(df)

    preds = model.predict(X_test)
    print("Classification report:\n", classification_report(y_test, preds))
    print("Confusion matrix:\n", confusion_matrix(y_test, preds))

if __name__ == "__main__":
    evaluate_saved_model()


