const mongoose = require("mongoose");

const agentPredictionSchema = new mongoose.Schema(
  {
    predictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
    risk_score: { type: Number, required: true },
    risk_label: { type: String, required: true },
    risk_probability: { type: Number },
    model_version: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentPrediction", agentPredictionSchema);
