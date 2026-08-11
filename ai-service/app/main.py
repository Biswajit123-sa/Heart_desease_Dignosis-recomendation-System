from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from loguru import logger


from app.config import PatientInput, HealthReport
from app.agents import run_agentic_workflow

app = FastAPI(
    title="Heart Disease AI Diagnosis System",
    description="Consolidated AI-powered heart disease risk prediction using ML + LangGraph + RAG + Gemini",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    logger.info("Heart Disease AI Diagnosis Service Starting Up...")

@app.get("/")
def root():
    return {"message": "Heart Disease AI Diagnosis API is running", "docs": "/docs"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/predict", response_model=HealthReport)
def predict(patient: PatientInput):
    try:
        feature_dict = patient.to_feature_dict()
        final_state = run_agentic_workflow(patient.model_dump(), feature_dict)
        return HealthReport(**final_state["final_report"])
    except RuntimeError as e:
        logger.error(f"Inference/Runtime error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error in workflow execution")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

