# ❤️ HeartCare AI — Heart Disease Diagnosis & Recommendation System

> An intelligent, full-stack clinical platform that combines Machine Learning, LangGraph Agentic AI, Retrieval-Augmented Generation (RAG), and a modern React UI to predict cardiovascular risk and deliver personalized health recommendations.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. ML Model Training](#1-ml-model-training)
  - [2. AI Service (FastAPI)](#2-ai-service-fastapi)
  - [3. Backend (Node.js)](#3-backend-nodejs)
  - [4. Frontend (React + Vite)](#4-frontend-react--vite)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Agentic AI Workflow](#-agentic-ai-workflow)
- [ML Model Details](#-ml-model-details)
- [RAG System](#-rag-system)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)

---

## 🔍 Overview

**HeartCare AI** is a full-stack healthcare application designed to assist medical professionals with early detection of cardiovascular disease risk. It accepts 10 key clinical parameters per patient, runs them through a multi-agent AI pipeline, and produces a comprehensive health report that includes:

- A **risk score** (0–100) and a risk label (**Low Risk / High Risk**)
- **Key risk factors** identified from the patient's profile
- AI-generated **medical insights**, **lifestyle recommendations**, and **preventive measures**
- A **future health outlook** based on the current risk trajectory
- A **full agent breakdown** showing the output of each AI agent in the workflow

This system is not intended to replace clinical judgment — it is a powerful pre-screening and decision-support tool.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│           Vite + React Router + TailwindCSS v4                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API calls
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js)                           │
│              Express.js + MongoDB (Mongoose) + JWT              │
│  Routes: Auth, Patients, Predictions, Chatbot, Agent Results    │
└──────────────┬──────────────────────────────────────────────────┘
               │ HTTP (Axios) — forwards prediction requests
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AI Service (Python FastAPI)                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              LangGraph Agentic Workflow                  │  │
│  │                                                          │  │
│  │  Agent 1: ML Prediction     (XGBoost/RF/LR)             │  │
│  │  Agent 2: Risk Analysis     (Groq LLM — GPT-OSS 120B)   │  │
│  │  Agent 3: RAG Retrieval     (SentenceTransformers + VS)  │  │
│  │  Agent 4: Recommendations   (Groq LLM — GPT-OSS 20B)    │  │
│  │  Agent 5: Report Generation (Google Gemini)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ML Model (Jupyter Notebooks)                   │
│         Training: LogisticRegression / RandomForest / XGBoost   │
│         Best model selected by AUC-ROC → saved as .joblib       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **Multi-Agent AI Pipeline** | LangGraph-orchestrated 5-agent workflow for end-to-end diagnosis |
| 🧠 **ML Risk Prediction** | XGBoost / Random Forest / Logistic Regression with AUC-based model selection |
| 📚 **RAG Medical Knowledge** | Retrieves relevant cardiovascular guidelines using semantic vector search |
| 💬 **AI Chatbot** | Groq-powered clinical assistant for cardiovascular Q&A |
| 👩‍⚕️ **Patient CRM** | Full CRUD for patient records with prediction history tracking |
| 🔐 **JWT Authentication** | Secure doctor/user login with bcrypt-hashed passwords |
| 📊 **Agent Breakdown View** | Per-agent result transparency — see what each AI agent contributed |
| 🐳 **Docker Support** | AI service comes with a Dockerfile and docker-compose configuration |

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| TailwindCSS v4 | Utility-first styling |
| Axios | HTTP client |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| Groq SDK | LLM chatbot integration |
| Multer | File upload handling |

### AI Service

| Technology | Purpose |
|---|---|
| FastAPI + Uvicorn | Python web framework |
| LangGraph | Multi-agent workflow orchestration |
| LangChain | LLM abstraction layer |
| Google Gemini | Final report generation |
| Groq (LLaMA / GPT-OSS) | Risk analysis & recommendations |
| XGBoost + scikit-learn | Heart disease ML model |
| SentenceTransformers | Semantic embeddings for RAG |
| Pydantic v2 | Data validation & schemas |
| Loguru | Structured logging |

---

## 📁 Project Structure

```
heart-disease-ai/
│
├── frontend/                   # React + Vite client application
│   ├── src/
│   │   ├── pages/              # LandingPage, Dashboard, Prediction, Chat, etc.
│   │   ├── components/         # Reusable UI components (Card, Navbar, etc.)
│   │   ├── services/           # Axios API service layer
│   │   └── assets/             # Images and static files
│   ├── index.html
│   └── vite.config.js
│
├── backend/                    # Node.js Express API
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # Auth & error middleware
│   ├── models/                 # Mongoose schemas (User, Patient, Prediction, etc.)
│   ├── routes/                 # Express route definitions
│   ├── services/               # External service integrations
│   ├── utils/                  # Utility helpers
│   └── server.js               # Entry point
│
├── ai-service/                 # Python FastAPI + AI pipeline
│   ├── app/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── agents.py           # LangGraph agent definitions & workflow
│   │   ├── ml.py               # ML model training, loading, inference
│   │   ├── rag.py              # RAG: vector store, embeddings, retrieval
│   │   └── config.py           # Settings, Pydantic schemas
│   ├── data/
│   │   ├── raw/                # heart_risk.csv training dataset
│   │   └── knowledge_base/     # Medical documents for RAG ingestion
│   ├── ml_models/trained/      # Saved .joblib model file
│   ├── scripts/                # Utility scripts (train, ingest RAG, etc.)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
│
└── ml-model/                   # Standalone Jupyter notebooks
    ├── train.ipynb             # Model experimentation & training
    └── predict.ipynb           # Model inference exploration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.11
- **MongoDB** (Atlas or local instance)
- **Groq API Key** — [console.groq.com](https://console.groq.com)
- **Google Gemini API Key** — [aistudio.google.com](https://aistudio.google.com)

---

### 1. ML Model Training

> Run this once to train and save the best ML model before starting the AI service.

```bash
cd ai-service

# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Train the model (selects best of LogReg / RandomForest / XGBoost by AUC)
python scripts/train_model.py

# (Optional) Ingest medical documents into the RAG vector store
python scripts/ingest_rag.py
```

The trained model will be saved to `ai-service/ml_models/trained/heart_disease_model.joblib`.

---

### 2. AI Service (FastAPI)

```bash
cd ai-service

# Activate virtual environment (if not already active)
.venv\Scripts\activate

# Configure environment variables (see Environment Variables section)
# Create .env and fill in your API keys

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The AI service will be available at `http://localhost:8000`.
Interactive API docs: `http://localhost:8000/docs`

**Or use Docker:**

```bash
cd ai-service
docker-compose up --build
```

---

### 3. Backend (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables (.env file)

# Start in development mode (with nodemon)
npm run dev

# Or in production
npm start
```

The backend API will be available at `http://localhost:5000`.

---

### 4. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/heart_disease_ai
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=gsk_...
AI_SERVICE_URL=http://localhost:8000
```

### `ai-service/.env`

```env
APP_PORT=8000
APP_ENV=development

# LLM Providers
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MODEL_RISK=openai/gpt-oss-120b
GROQ_MODEL_RECOMMENDATION=openai/gpt-oss-20b

# MongoDB (for persisting agent results)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/heart_disease_ai
MONGODB_DB_NAME=heart_disease_ai

# ML Model & RAG
ML_MODEL_PATH=./ml_models/trained/heart_disease_model.joblib
CHROMA_PERSIST_DIR=./data/knowledge_base/chroma_db
EMBEDDING_MODEL=all-MiniLM-L6-v2
RAG_TOP_K=4
```

---

## 📡 API Reference

### Backend REST API (`localhost:5000`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new doctor/user | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET` | `/api/patients` | List all patients | Yes |
| `POST` | `/api/patients` | Create a new patient | Yes |
| `GET` | `/api/patients/:id` | Get patient by ID | Yes |
| `POST` | `/api/predictions` | Run full AI prediction for patient | Yes |
| `GET` | `/api/predictions/:id` | Get a prediction result | Yes |
| `POST` | `/api/chat` | Send a message to the AI chatbot | Yes |
| `GET` | `/api/agent-prediction/:id` | Get Agent 1 (ML) breakdown | Yes |
| `GET` | `/api/agent-risk/:id` | Get Agent 2 (Risk Analysis) breakdown | Yes |
| `GET` | `/api/agent-rag/:id` | Get Agent 3 (RAG) breakdown | Yes |
| `GET` | `/api/agent-recommendation/:id` | Get Agent 4 (Recommendations) breakdown | Yes |

### AI Service REST API (`localhost:8000`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health status |
| `GET` | `/api/health` | Detailed health check |
| `POST` | `/api/predict` | Run the full agentic workflow and return `HealthReport` |

#### `POST /api/predict` — Request Body

```json
{
  "age": 55,
  "sex": 1,
  "smoking": 1,
  "diabetes": 0,
  "chest_pain": 1,
  "hypertension": 1,
  "high_cholesterol": 1,
  "obesity": 0,
  "family_history": 1,
  "physically_inactive": 1
}
```

> **Field encodings:** `sex` (0 = Female, 1 = Male), all binary fields (0 = No, 1 = Yes)

#### `POST /api/predict` — Response (`HealthReport`)

```json
{
  "patient_summary": "55-year-old male with significant cardiovascular risk factors...",
  "risk_score": 78,
  "risk_level": "High Risk",
  "key_risk_factors": ["Smoking", "Hypertension", "Family History", "High Cholesterol"],
  "medical_insights": "The combination of hypertension and smoking significantly elevates...",
  "recommendations": ["Quit smoking immediately", "Adopt a low-sodium diet"],
  "preventive_measures": ["Regular BP monitoring", "Annual lipid panel"],
  "future_outlook": "Without intervention, risk is expected to increase...",
  "agent_breakdown": {
    "prediction_agent": { "risk_label": "High Risk", "risk_score": 78 },
    "risk_analysis_agent": { "risk_summary": "...", "key_risk_factors": ["..."] },
    "rag_retrieval_agent": { "retrieved_context": ["..."] },
    "recommendation_agent": { "recommendations": ["..."] },
    "report_generation_agent": { "status": "completed" }
  },
  "disclaimer": "This report is generated by an AI system for informational purposes only..."
}
```

---

## 🤖 Agentic AI Workflow

The AI pipeline is orchestrated using **LangGraph** and runs as a directed graph of 5 sequential agents:

```
Patient Input
     │
     ▼
┌─────────────────────────────────────────┐
│  Agent 1: ML Prediction                 │
│  Loads the trained .joblib model and    │
│  runs inference on 10 clinical inputs   │
│  Output: risk_label, risk_score,        │
│          risk_probability               │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Agent 2: Risk Analysis                 │
│  LLM: Groq (GPT-OSS 120B)              │
│  Analyzes prediction + patient data     │
│  Output: key_risk_factors, risk_summary │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Agent 3: RAG Retrieval                 │
│  Embeds risk summary query and          │
│  retrieves top-K chunks from vector     │
│  store (Embedding: all-MiniLM-L6-v2)   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Agent 4: Recommendations               │
│  LLM: Groq (GPT-OSS 20B)               │
│  Uses risk analysis + RAG context       │
│  Output: recommendations,               │
│          preventive_measures            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Agent 5: Report Generation             │
│  LLM: Google Gemini                     │
│  Synthesizes all agent outputs into a   │
│  final structured HealthReport JSON     │
└─────────────────────────────────────────┘
```

Each agent's intermediate output is stored in MongoDB and accessible individually via the `/api/agent-*` backend routes, providing full transparency into the AI's reasoning.

---

## 📊 ML Model Details

The ML model is trained on a cardiovascular risk dataset (`heart_risk.csv`) using **10 binary/numeric features**:

| Feature | Type | Description |
|---|---|---|
| `Age` | Integer | Patient age in years |
| `Sex` | Binary | 0 = Female, 1 = Male |
| `Smoking` | Binary | Current smoker |
| `Diabetes` | Binary | Diagnosed diabetic |
| `Chest_Pain` | Binary | Presence of chest pain |
| `Hypertension` | Binary | High blood pressure |
| `High_Cholesterol` | Binary | Elevated LDL cholesterol |
| `Obesity` | Binary | BMI >= 30 |
| `Family_History` | Binary | Family history of heart disease |
| `Physically_Inactive` | Binary | Sedentary lifestyle |

**Training process:**

- Three candidate models are trained: `LogisticRegression`, `RandomForestClassifier` (300 estimators), `XGBClassifier` (300 estimators)
- The model with the highest **AUC-ROC** score on the held-out test set (20%) is automatically selected
- The winning model is serialized with `joblib` to `ml_models/trained/heart_disease_model.joblib`

---

## 📚 RAG System

The Retrieval-Augmented Generation system provides AI agents with evidence-based medical context:

1. **Ingestion**: Medical guidelines (`.md` / `.txt` files) in `data/knowledge_base/sources/` are chunked (500 words, 50-word overlap) and embedded using `all-MiniLM-L6-v2`
2. **Storage**: Embeddings are stored in a lightweight JSON-based vector store (`vector_store.json`)
3. **Retrieval**: At inference time, the patient's risk summary is embedded and top-K semantically similar chunks are retrieved using cosine similarity
4. **Augmentation**: Retrieved chunks are injected into the recommendation agent's prompt as grounded medical context

To rebuild the knowledge base with new documents:

```bash
cd ai-service
python scripts/ingest_rag.py
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## ⚠️ Disclaimer

> This system is developed for **educational and research purposes only**. The AI-generated predictions and health reports are **not a substitute for professional medical advice, diagnosis, or treatment**. Always consult a qualified healthcare professional for medical decisions. If you or a patient has a medical emergency, contact emergency services immediately.

---

<div align="center">
  <p>Built with ❤️ for better cardiovascular healthcare</p>
  <p>© 2026 Heart Disease AI System. All rights reserved.</p>
</div>
