// controllers/predictionController.js
// Orchestrates: save patient data -> call AI service -> save + return the report.

const Patient = require("../models/Patient");
const Prediction = require("../models/Prediction");
const { getHeartRiskPrediction } = require("../services/aiService");

// POST /api/predictions
// Body: patient health fields (age, sex, smoking, etc.)
const createPrediction = async (req, res, next) => {
  try {
    // 1. Save the patient's submitted health data
    const patient = await Patient.create({
      user: req.user._id,
      ...req.body,
    });

    // 2. Send it to the Python AI service (ML + Agentic AI + RAG + Gemini)
    const report = await getHeartRiskPrediction(req.body);

    // 3. Save the AI-generated report linked to this patient
    const prediction = await Prediction.create({
      user: req.user._id,
      patient: patient._id,
      risk_score: report.risk_score,
      risk_level: report.risk_level,
      key_risk_factors: report.key_risk_factors,
      medical_insights: report.medical_insights,
      recommendations: report.recommendations,
      preventive_measures: report.preventive_measures,
      future_outlook: report.future_outlook,
      agent_breakdown: report.agent_breakdown,
      disclaimer: report.disclaimer,
    });

    // Create 4 distinct documents for the individual agents
    const AgentPrediction = require("../models/AgentPrediction");
    const AgentRiskAnalysis = require("../models/AgentRiskAnalysis");
    const AgentRag = require("../models/AgentRag");
    const AgentRecommendation = require("../models/AgentRecommendation");

    if (report.agent_breakdown) {
      await AgentPrediction.create({
        predictionId: prediction._id,
        risk_score: report.agent_breakdown.prediction_agent?.risk_score || 0,
        risk_label: report.agent_breakdown.prediction_agent?.risk_label || "Unknown",
        risk_probability: report.agent_breakdown.prediction_agent?.risk_probability || 0,
        model_version: report.agent_breakdown.prediction_agent?.model_version || "v1",
      });

      await AgentRiskAnalysis.create({
        predictionId: prediction._id,
        key_risk_factors: report.agent_breakdown.risk_analysis_agent?.key_risk_factors || [],
        risk_level: report.agent_breakdown.risk_analysis_agent?.risk_level || "Unknown",
        risk_summary: report.agent_breakdown.risk_analysis_agent?.risk_summary || "",
        future_outlook: report.agent_breakdown.risk_analysis_agent?.future_outlook || "",
      });

      await AgentRag.create({
        predictionId: prediction._id,
        retrieved_context: report.agent_breakdown.rag_retrieval_agent?.retrieved_context || [],
      });

      await AgentRecommendation.create({
        predictionId: prediction._id,
        recommendations: report.agent_breakdown.recommendation_agent?.recommendations || [],
        preventive_measures: report.agent_breakdown.recommendation_agent?.preventive_measures || [],
      });
    }

    // 4. Return the full report to the frontend
    res.status(201).json(prediction);
  } catch (error) {
    next(error);
  }
};

// GET /api/predictions
const getMyPredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
      .populate("patient")
      .sort({ createdAt: -1 });
    res.json(predictions);
  } catch (error) {
    next(error);
  }
};

// GET /api/predictions/:id
const getPredictionById = async (req, res, next) => {
  try {
    const prediction = await Prediction.findById(req.params.id).populate("patient");
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    res.json(prediction);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPrediction, getMyPredictions, getPredictionById };
