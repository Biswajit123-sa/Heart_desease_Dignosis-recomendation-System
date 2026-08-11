const AgentPrediction = require("../models/AgentPrediction");

const getAgentPrediction = async (req, res, next) => {
  try {
    const data = await AgentPrediction.findOne({ predictionId: req.params.predictionId });
    if (!data) {
      return res.status(404).json({ message: "Agent Prediction data not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAgentPrediction };
