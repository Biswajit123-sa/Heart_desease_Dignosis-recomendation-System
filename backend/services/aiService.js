// services/aiService.js
// Calls the Python FastAPI AI service (ML + LangGraph agents + RAG + Gemini)
// and returns its prediction/report to whoever called this function.

const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const getHeartRiskPrediction = async (patientData) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/predict`, {
      age: patientData.age,
      sex: patientData.sex,
      smoking: patientData.smoking,
      diabetes: patientData.diabetes,
      chest_pain: patientData.chest_pain,
      hypertension: patientData.hypertension,
      high_cholesterol: patientData.high_cholesterol,
      obesity: patientData.obesity,
      family_history: patientData.family_history,
      physically_inactive: patientData.physically_inactive,
    });

    return response.data; // this is the HealthReport JSON from FastAPI
  } catch (error) {
    const detail = error.response?.data?.detail || error.message;
    throw new Error(`AI service request failed: ${detail}`);
  }
};

module.exports = { getHeartRiskPrediction };
