const mongoose = require("mongoose");

const agentRecommendationSchema = new mongoose.Schema(
  {
    predictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
    recommendations: [{ type: String }],
    preventive_measures: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentRecommendation", agentRecommendationSchema);
