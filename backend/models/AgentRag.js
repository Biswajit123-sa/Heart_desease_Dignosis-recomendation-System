const mongoose = require("mongoose");

const agentRagSchema = new mongoose.Schema(
  {
    predictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
    retrieved_context: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentRag", agentRagSchema);
