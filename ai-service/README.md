# Heart Disease AI Diagnosis System

AI-powered heart disease risk prediction system combining a trained ML model,
a LangGraph-based agentic workflow, a RAG knowledge base, and Google Gemini
for generative explanations and recommendations.

## Folder Structure

```
heart-disease-ai-system/
├── app/
│   ├── main.py                 # FastAPI app entrypoint
│   ├── config.py               # Settings (env vars, paths, model names)
│   │
│   ├── agents/                 # LangGraph agentic workflow (the 5 agents)
│   │   ├── state.py                  # Shared graph state schema
│   │   ├── prediction_agent.py       # Agent 1: ML model prediction
│   │   ├── risk_analysis_agent.py    # Agent 2: Identifies key risk factors
│   │   ├── rag_retrieval_agent.py    # Agent 3: Retrieves medical knowledge
│   │   ├── recommendation_agent.py   # Agent 4: Personalized recommendations
│   │   ├── report_generation_agent.py# Agent 5: Final report via Gemini
│   │   └── graph.py                  # Wires agents into the LangGraph workflow
│   │
│   ├── api/
│   │   ├── routes.py            # REST endpoints (/predict, /report, etc.)
│   │   └── deps.py              # Shared FastAPI dependencies
│   │
│   ├── core/
│   │   ├── logging.py            # Logging setup (loguru)
│   │   └── exceptions.py         # Custom exception classes
│   │
│   ├── ml/
│   │   ├── preprocess.py         # Feature engineering / cleaning
│   │   ├── train.py              # Model training script
│   │   ├── predict.py            # Load model + run inference
│   │   └── evaluate.py           # Metrics, confusion matrix, etc.
│   │
│   ├── rag/
│   │   ├── embeddings.py         # Embedding model wrapper
│   │   ├── vector_store.py       # ChromaDB client wrapper
│   │   ├── ingest.py             # Loads docs into the vector store
│   │   └── retriever.py          # Similarity search interface
│   │
│   ├── schemas/                  # Pydantic request/response models
│   │   ├── patient.py             # Patient input schema
│   │   ├── prediction.py          # ML prediction output schema
│   │   └── report.py              # Final report schema
│   │
│   ├── services/
│   │   ├── gemini_service.py     # Gemini API wrapper
│   │   └── database_service.py   # MongoDB read/write operations
│   │
│   └── utils/
│       └── helpers.py
│
├── data/
│   ├── raw/                      # Your uploaded dataset goes here
│   ├── processed/                # Cleaned/feature-engineered data
│   └── knowledge_base/           # Source docs + persisted ChromaDB store
│
├── ml_models/
│   ├── trained/                  # Saved .joblib model files
│   └── notebooks/                # EDA / experimentation notebooks
│
├── scripts/
│   ├── train_model.py            # CLI: train and save the ML model
│   └── seed_knowledge_base.py    # CLI: ingest docs into ChromaDB
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── requirements.txt
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Workflow (matches the architecture diagram)

1. **Frontend / client** sends patient health data to `POST /api/predict`.
2. **Prediction Agent** runs the trained ML model on the input.
3. **Risk Analysis Agent** interprets the prediction and extracts key risk factors.
4. **RAG Retrieval Agent** queries ChromaDB for relevant medical guidance.
5. **Recommendation Agent** drafts personalized lifestyle/preventive recommendations.
6. **Report Generation Agent** calls Gemini to produce the final structured,
   human-readable health report.
7. Result is persisted to MongoDB and returned to the client.

## Getting Started

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in GEMINI_API_KEY, MONGODB_URI, etc.

# Place your dataset at data/raw/<your_file>.csv, then:
python scripts/train_model.py

# Seed the RAG knowledge base:
python scripts/seed_knowledge_base.py

# Run the API:
uvicorn app.main:app --reload --port 8000
```

## Running Local Open Source LLMs (Ollama)
You can run this project completely locally and offline using Ollama:
1. Install [Ollama](https://ollama.com/) and run it on your machine.
2. Pull your local model of choice:
   ```bash
   ollama pull llama3
   # or
   ollama pull gemma:2b
   ```
3. Update the LLM configuration in your `ai-service/.env` file:
   ```ini
   LLM_PROVIDER=ollama
   OLLAMA_HOST=http://localhost:11434
   OLLAMA_MODEL=llama3  # or gemma:2b
   ```
4. Restart your FastAPI service. It will now automatically route all generative agent queries to your local model!

## Agentic AI Features
This project implements advanced Agentic AI behaviors:
* **Tool Calling**: Agents encapsulate database lookups and ML prediction tasks as executable tools (`ml_prediction_tool`, `rag_retrieval_tool`) rather than hardcoding them.
* **Corrective Retrieval Loop (Self-RAG)**: The RAG Agent evaluates the quality of retrieved contexts and dynamically reformulates search queries if search results are poor.
* **Safety Reflection & Self-Correction**: The Recommendation Agent runs a reflection check on the generated recommendations to filter out forbidden medication names or unsafe exercise regimens (e.g. recommending high-intensity training to high-risk chest pain patients), triggering an LLM self-correction loop when issues are detected.
* **Prognosis Self-Correction**: The Risk Agent monitors output size and quality, executing refinement loops if generation fails validation criteria.
