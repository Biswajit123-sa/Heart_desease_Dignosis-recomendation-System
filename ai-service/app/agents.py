import json
from google import genai as google_genai
from google.genai import types as genai_types
from groq import Groq
from typing import TypedDict, Optional
# pyrefly: ignore [missing-import]
from loguru import logger
from langgraph.graph import StateGraph, END
from functools import lru_cache

from app.config import settings, HealthReport
from app.ml import predict_risk
from app.rag import retrieve_relevant_context

# --- LangGraph Shared State Schema ---
class AgentState(TypedDict, total=False):
    patient_input: dict
    feature_dict: dict
    prediction: dict
    risk_level: str
    key_risk_factors: list[dict]
    risk_summary: str
    retrieved_context: list[dict]
    recommendations: list[str]
    preventive_measures: list[str]
    medical_insights: str
    future_outlook: str
    final_report: dict
    errors: list[str]

# --- LLM Helpers: Groq (risk analysis, RAG, recommendations) ---
def generate_groq_text(prompt: str, temperature: float = 0.4, model: str | None = None) -> str:
    chosen_model = model or settings.GROQ_MODEL
    logger.info(f"[LLM:Groq] Calling model '{chosen_model}'...")
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured.")
    client = Groq(api_key=settings.GROQ_API_KEY)
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=chosen_model,
        temperature=temperature,
    )
    return chat_completion.choices[0].message.content.strip()

# --- LLM Helpers: Gemini (final report generation only) ---
def generate_gemini_text(prompt: str, temperature: float = 0.4) -> str:
    logger.info(f"[LLM:Gemini] Calling model '{settings.GEMINI_MODEL}'...")
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured.")
    client = google_genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=genai_types.GenerateContentConfig(temperature=temperature),
    )
    return response.text.strip()

# --- Agentic AI Tools ---
def ml_prediction_tool(feature_dict: dict) -> dict:
    """Tool to execute the heart disease machine learning model prediction."""
    logger.info("[Tool] Executing ml_prediction_tool...")
    prediction = predict_risk(feature_dict)
    return prediction.model_dump()

def rag_retrieval_tool(query: str, top_k: int = 4) -> list[dict]:
    """Tool to query the local medical reference literature database."""
    logger.info(f"[Tool] Executing rag_retrieval_tool with query: '{query}'")
    return retrieve_relevant_context(query, top_k=top_k)

# --- Agent 1: Prediction Agent ---
def prediction_agent(state: AgentState) -> AgentState:
    logger.info("[PredictionAgent] Running model inference...")
    prediction = ml_prediction_tool(state["feature_dict"])
    state["prediction"] = prediction
    return state

# --- Agent 2: Risk Analysis Agent ---
FACTOR_WEIGHTS = {
    "Smoking": 0.9,
    "Diabetes": 0.85,
    "Hypertension": 0.85,
    "High_Cholesterol": 0.8,
    "Chest_Pain": 0.8,
    "Family_History": 0.6,
    "Obesity": 0.55,
    "Physically_Inactive": 0.5,
    "Sex": 0.3,
}

FACTOR_LABELS = {
    "Smoking": "Smoking",
    "Diabetes": "Diabetes",
    "Hypertension": "Hypertension",
    "High_Cholesterol": "High Cholesterol",
    "Chest_Pain": "Chest Pain",
    "Family_History": "Family History of Heart Disease",
    "Obesity": "Obesity",
    "Physically_Inactive": "Physical Inactivity",
    "Sex": "Sex (Male)",
}

def _risk_level_from_score(score: int) -> str:
    if score < 25:
        return "Low"
    if score < 50:
        return "Moderate"
    if score < 75:
        return "High"
    return "Very High"

def _build_future_risk_prompt(state: AgentState) -> str:
    factor_names = [f["name"] for f in state.get("key_risk_factors", [])]
    return f"""You are a cardiovascular health risk assessment assistant. Analyze the following patient profile and provide a personalized, specific 1-2 sentence projection of their future cardiovascular health risk if no lifestyle changes are made.

Patient Age: {state.get('patient_input', {}).get('age', 'N/A')}
Sex: {'Male' if state.get('patient_input', {}).get('sex') == 1 else 'Female'}
Risk Level: {state.get('risk_level', 'N/A')} (Score: {state.get('prediction', {}).get('risk_score', 'N/A')}/100)
Current Risk Factors: {', '.join(factor_names) if factor_names else 'None identified'}

Based on the specific combination of risk factors above, provide a direct, medically grounded projection of how this patient's risk could progress over the next 5-10 years. Your response must be uniquely tailored to this patient. Use extremely simple, patient-friendly language. Avoid complex medical jargon. Calibrate severity strictly to the risk score of {state.get('prediction', {}).get('risk_score', 'N/A')}/100. Do not give diagnostic statements. Keep it to a maximum of 2 short sentences. No headers or markdown."""

def risk_analysis_agent(state: AgentState) -> AgentState:
    logger.info("[RiskAnalysisAgent] Analyzing key risk factors...")
    features = state["feature_dict"]
    prediction = state["prediction"]

    key_factors = []
    for col, weight in FACTOR_WEIGHTS.items():
        present = bool(features.get(col, 0))
        if present:
            key_factors.append({
                "name": FACTOR_LABELS[col],
                "present": True,
                "weight": weight,
            })

    # Age as a contextual factor
    age = features.get("Age", 0)
    if age >= 55:
        key_factors.append({"name": "Age 55+", "present": True, "weight": 0.7})

    key_factors.sort(key=lambda f: f["weight"], reverse=True)
    risk_level = _risk_level_from_score(prediction["risk_score"])

    top_names = ", ".join(f["name"] for f in key_factors[:3]) or "no major risk factors"
    summary = (
        f"The model predicts a {prediction['risk_label']} "
        f"({prediction['risk_score']}/100). The most significant contributing "
        f"factors identified are: {top_names}."
    )

    state["key_risk_factors"] = key_factors
    state["risk_level"] = risk_level
    state["risk_summary"] = summary

    # Groq generates the future risk projection dynamically
    logger.info("[RiskAnalysisAgent] Projecting future risk via Groq...")
    prompt = _build_future_risk_prompt(state)
    future_outlook = ""
    current_prompt = prompt

    for attempt in range(1, 3):
        try:
            res = generate_groq_text(current_prompt, model=settings.GROQ_MODEL_RISK)
            if len(res.split()) < 10:
                raise ValueError("Response too short — requesting more detail.")
            future_outlook = res
            logger.info(f"[RiskAnalysisAgent] Future outlook generated on attempt {attempt}.")
            break
        except Exception as e:
            logger.warning(f"[RiskAnalysisAgent] Attempt {attempt} failed: {e}. Refining prompt...")
            current_prompt = (
                prompt
                + "\n\nIMPORTANT: Your previous response was too short or incomplete. "
                "Provide a richer, more specific 2-3 sentence projection based on the exact risk factors listed."
            )
    else:
        # Last-resort: derive a minimal but data-driven string from actual patient values
        factor_str = ", ".join(f["name"] for f in key_factors) or "no identified risk factors"
        future_outlook = (
            f"Based on a risk score of {prediction['risk_score']}/100 and the presence of {factor_str}, "
            f"continued exposure to these factors may contribute to progressive cardiovascular strain over time. "
            f"Medical consultation is recommended to evaluate individual risk trajectories."
        )
        logger.warning("[RiskAnalysisAgent] Groq projection failed after retries — using data-derived fallback.")

    state["future_outlook"] = future_outlook
    return state

# --- Agent 3: RAG Retrieval Agent ---
def rag_retrieval_agent(state: AgentState) -> AgentState:
    logger.info("[RAGRetrievalAgent] Executing agentic context retrieval...")
    factor_names = [f["name"] for f in state.get("key_risk_factors", [])]

    # First search: patient-specific factors
    query = (
        f"Heart disease risk, prevention and lifestyle guidance for a patient with "
        f"risk factors: {', '.join(factor_names) if factor_names else 'general cardiovascular health'}."
    )
    context = rag_retrieval_tool(query)

    # Agentic re-query: if insufficient context, reformulate and search again
    if not context or len(context) < 2:
        logger.info("[RAGRetrievalAgent] Insufficient context retrieved. Reformulating query for broader guidelines...")
        broader_query = (
            f"Cardiovascular health guidelines, heart disease prevention, and lifestyle recommendations "
            f"for {state.get('risk_level', 'moderate')} risk patients."
        )
        context = rag_retrieval_tool(broader_query)

    state["retrieved_context"] = context
    return state

# --- Agent 4: Recommendation Agent ---
def _build_recommendation_prompt(state: AgentState) -> str:
    context_text = "\n\n".join(c["text"] for c in state.get("retrieved_context", []))
    factor_names = [f["name"] for f in state.get("key_risk_factors", [])]

    return f"""You are a cardiovascular health assistant generating PERSONALIZED, SAFE, non-diagnostic lifestyle recommendations for a patient based on an AI risk prediction and retrieved medical reference literature.

Patient risk level: {state['risk_level']} (Score: {state.get('prediction', {}).get('risk_score', 'N/A')}/100)
Key risk factors present: {', '.join(factor_names) if factor_names else 'None significant'}

Relevant medical reference material (use this as grounding, do not contradict it):
---
{context_text}
---

Your task: Generate uniquely tailored recommendations and preventive measures for THIS specific patient profile. Use very simple, easy-to-understand language. Do NOT produce generic boilerplate. Every item must directly address at least one of the patient's identified risk factors or their specific risk level.

Respond ONLY with valid JSON in this exact shape, no markdown fences, no preamble:
{{
  "recommendations": ["...", "...", "..."],
  "preventive_measures": ["...", "...", "..."]
}}

Provide exactly 3-5 very short recommendations and 3-5 very short preventive measures. Calibrate advice to risk score {state.get('prediction', {}).get('risk_score', 'N/A')}/100:
- Low scores (0-24): Focus on habit preservation and general wellness.
- Moderate scores (25-49): Focus on lifestyle improvements and monitoring.
- High scores (50-74): Prioritize clinical consultation and active risk reduction.
- Very High scores (75-100): Emphasize urgent care-seeking and strict risk-factor management.
Keep each item to one concise actionable sentence without medical jargon. No drug/medication names. No prescriptions."""

def _build_emergency_recommendation_prompt(state: AgentState) -> str:
    """Simplified direct prompt used when the structured JSON prompt fails repeatedly."""
    factor_names = [f["name"] for f in state.get("key_risk_factors", [])]
    return f"""You MUST respond with ONLY a valid JSON object. No other text.

Generate cardiovascular health recommendations for a patient with:
- Risk Level: {state.get('risk_level', 'Unknown')} ({state.get('prediction', {}).get('risk_score', 'N/A')}/100)
- Risk Factors: {', '.join(factor_names) if factor_names else 'None'}

Return this exact structure:
{{"recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"], "preventive_measures": ["pm1", "pm2", "pm3", "pm4", "pm5"]}}"""

def recommendation_agent(state: AgentState) -> AgentState:
    logger.info("[RecommendationAgent] Synthesizing recommendations via Groq...")
    prompt = _build_recommendation_prompt(state)

    max_attempts = 3
    critique = ""

    for attempt in range(1, max_attempts + 1):
        # On final attempt, switch to a stripped-down direct prompt to ensure JSON output
        if attempt == max_attempts:
            logger.info("[RecommendationAgent] Final attempt: switching to emergency direct prompt.")
            current_prompt = _build_emergency_recommendation_prompt(state)
        elif critique:
            logger.info(f"[RecommendationAgent] Attempt {attempt}: Applying self-correction...")
            current_prompt = (
                prompt
                + f"\n\nCRITIQUE OF PREVIOUS ATTEMPT:\n{critique}\n"
                "Fix all issues above and output a corrected, strictly valid JSON response."
            )
        else:
            current_prompt = prompt

        try:
            raw = generate_groq_text(current_prompt, model=settings.GROQ_MODEL_RECOMMENDATION)
            cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            parsed = json.loads(cleaned)
            recs = parsed.get("recommendations", [])
            prevs = parsed.get("preventive_measures", [])

            # --- Agentic Self-Check / Policy Validation ---
            violations = []

            # Rule 1: No prescriptive drug/medication names
            forbidden_words = [
                "statin", "beta-blocker", "aspirin", "lisinopril", "metoprolol",
                "amlodipine", "drug", "medication", "pill", "prescribe",
            ]
            for r in recs + prevs:
                for word in forbidden_words:
                    if word in r.lower():
                        violations.append(
                            f"Prohibited term '{word}' in: '{r}'. "
                            "Use only lifestyle and care-seeking language."
                        )

            # Rule 2: Chest pain + high risk → no high-intensity exercise advice
            has_chest_pain = bool(state["feature_dict"].get("Chest_Pain", 0))
            is_high_risk = state.get("risk_level") in ["High", "Very High"]
            if has_chest_pain and is_high_risk:
                for r in recs + prevs:
                    if any(w in r.lower() for w in ["vigorous", "intense", "heavy exercise", "run", "gym"]):
                        violations.append(
                            f"Safety violation: Patient has chest pain + high risk but "
                            f"recommendation suggests high-intensity activity: '{r}'. "
                            "Replace with gentle/low-impact activity and medical consultation."
                        )

            if violations:
                critique = "Violations found:\n" + "\n".join(f"- {v}" for v in violations)
                logger.warning(f"[RecommendationAgent] Attempt {attempt} validation failed: {violations}")
                continue

            # Passed all checks
            state["recommendations"] = recs
            state["preventive_measures"] = prevs
            logger.info("[RecommendationAgent] Recommendations validated and accepted.")
            break

        except Exception as e:
            critique = (
                f"JSON parse error or execution failure: {e}. "
                "You MUST respond with a single valid JSON object only — no extra text."
            )
            logger.warning(f"[RecommendationAgent] Attempt {attempt} failed: {e}")

    else:
        # All attempts exhausted — ask Groq one final time with the most minimal prompt
        logger.error("[RecommendationAgent] All self-correction attempts exhausted. Requesting Groq emergency generation.")
        try:
            raw = generate_groq_text(_build_emergency_recommendation_prompt(state), temperature=0.2, model=settings.GROQ_MODEL_RECOMMENDATION)
            cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            parsed = json.loads(cleaned)
            state["recommendations"] = parsed.get("recommendations", [])
            state["preventive_measures"] = parsed.get("preventive_measures", [])
            logger.info("[RecommendationAgent] Emergency Groq generation succeeded.")
        except Exception as e:
            logger.error(f"[RecommendationAgent] Emergency generation also failed: {e}. State will have empty lists.")
            state["recommendations"] = []
            state["preventive_measures"] = []

    return state

# --- Agent 5: Report Generation Agent (Gemini only) ---
def _build_report_prompt(state: AgentState) -> str:
    factor_names = [f["name"] for f in state.get("key_risk_factors", [])]
    return f"""You are a medical communication assistant. Write a very short, clear, empathetic 2-3 sentence summary paragraph (no headers, no bullet points, no markdown) explaining this patient's heart disease risk assessment in extremely plain, simple language a non-expert could easily understand. Avoid all medical jargon.

Risk level: {state['risk_level']}
Risk score: {state['prediction']['risk_score']}/100
Key risk factors: {', '.join(factor_names) if factor_names else 'none significant'}

Ensure the tone scales precisely with the risk score of {state['prediction']['risk_score']}/100:
- Low (0-24): Reassuring, focused on maintaining good habits.
- Moderate (25-49): Encouraging, emphasising actionable lifestyle improvement.
- High (50-74): Serious, urging prompt professional assessment.
- Very High (75-100): Urgent, recommending immediate medical consultation.

Do not provide a diagnosis. Encourage follow-up with a healthcare professional. Output only the paragraph text, nothing else."""

def report_generation_agent(state: AgentState) -> AgentState:
    logger.info("[ReportGenerationAgent] Generating final patient report via Gemini...")
    try:
        medical_insights = generate_gemini_text(_build_report_prompt(state))
        logger.info("[ReportGenerationAgent] Gemini report generated successfully.")
    except Exception as e:
        # Minimal fallback: use the already-computed patient-specific risk_summary
        logger.warning(f"[ReportGenerationAgent] Gemini generation failed: {e}. Using risk summary as fallback.")
        medical_insights = state.get("risk_summary", "Risk assessment completed. Please consult a healthcare professional for further guidance.")

    breakdown = {
        "prediction_agent": state.get("prediction", {}),
        "risk_analysis_agent": {
            "key_risk_factors": state.get("key_risk_factors", []),
            "risk_level": state.get("risk_level", ""),
            "risk_summary": state.get("risk_summary", ""),
            "future_outlook": state.get("future_outlook", "")
        },
        "rag_retrieval_agent": {
            "retrieved_context": state.get("retrieved_context", [])
        },
        "recommendation_agent": {
            "recommendations": state.get("recommendations", []),
            "preventive_measures": state.get("preventive_measures", [])
        },
        "report_generation_agent": {
            "medical_insights": medical_insights
        }
    }

    report = HealthReport(
        patient_summary=state.get("risk_summary", ""),
        risk_score=state["prediction"]["risk_score"],
        risk_level=state["risk_level"],
        key_risk_factors=[f["name"] for f in state.get("key_risk_factors", [])],
        medical_insights=medical_insights,
        recommendations=state.get("recommendations", []),
        preventive_measures=state.get("preventive_measures", []),
        future_outlook=state.get("future_outlook", ""),
        agent_breakdown=breakdown,
    )

    state["medical_insights"] = medical_insights
    state["final_report"] = report.model_dump()
    return state

# --- LangGraph Workflow Construction ---
def build_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("prediction_node", prediction_agent)
    workflow.add_node("risk_analysis_node", risk_analysis_agent)
    workflow.add_node("rag_retrieval_node", rag_retrieval_agent)
    workflow.add_node("recommendation_node", recommendation_agent)
    workflow.add_node("report_generation_node", report_generation_agent)

    workflow.set_entry_point("prediction_node")
    workflow.add_edge("prediction_node", "risk_analysis_node")
    workflow.add_edge("risk_analysis_node", "rag_retrieval_node")
    workflow.add_edge("rag_retrieval_node", "recommendation_node")
    workflow.add_edge("recommendation_node", "report_generation_node")
    workflow.add_edge("report_generation_node", END)

    return workflow.compile()

@lru_cache(maxsize=1)
def get_compiled_graph():
    return build_graph()

def run_agentic_workflow(patient_input: dict, feature_dict: dict) -> AgentState:
    graph = get_compiled_graph()
    initial_state: AgentState = {
        "patient_input": patient_input,
        "feature_dict": feature_dict,
        "errors": [],
    }
    return graph.invoke(initial_state)

if __name__ == "__main__":
    import pprint
    mock_input = {
        "age": 60, "sex": 1, "smoking": 1, "diabetes": 1, "chest_pain": 1,
        "hypertension": 1, "high_cholesterol": 1, "obesity": 0,
        "family_history": 1, "physically_inactive": 1,
    }
    mock_features = {
        "Age": 60, "Sex": 1, "Smoking": 1, "Diabetes": 1, "Chest_Pain": 1,
        "Hypertension": 1, "High_Cholesterol": 1, "Obesity": 0,
        "Family_History": 1, "Physically_Inactive": 1,
    }
    print("Testing agentic workflow...")

    result = run_agentic_workflow(mock_input, mock_features)
    
    print("\n--- Final Generated Report ---")

    pprint.pprint(result.get("final_report", {}))

