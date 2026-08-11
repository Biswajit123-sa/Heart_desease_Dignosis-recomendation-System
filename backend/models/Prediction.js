// models/Prediction.js
// Stores the AI-generated result for a given patient submission.

const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },

    risk_score: { type: Number, required: true },        // 0-100
    risk_level: { type: String, required: true },         // Low / Moderate / High / Very High
    key_risk_factors: [{ type: String }],
    medical_insights: { type: String },
    recommendations: [{ type: String }],
    preventive_measures: [{ type: String }],
    future_outlook: { type: String },
    agent_breakdown: { type: mongoose.Schema.Types.Mixed },
    disclaimer: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
