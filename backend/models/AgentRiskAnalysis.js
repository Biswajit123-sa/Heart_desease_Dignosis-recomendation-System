const mongoose = require("mongoose");

const agentRiskAnalysisSchema = new mongoose.Schema(
  {
    predictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
    key_risk_factors: [{ type: mongoose.Schema.Types.Mixed }],
    risk_level: { type: String },
    risk_summary: { type: String },
    future_outlook: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentRiskAnalysis", agentRiskAnalysisSchema);
