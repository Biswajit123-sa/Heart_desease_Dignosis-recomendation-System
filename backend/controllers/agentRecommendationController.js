const AgentRecommendation = require("../models/AgentRecommendation");

const getAgentRecommendation = async (req, res, next) => {
  try {
    const data = await AgentRecommendation.findOne({ predictionId: req.params.predictionId });
    if (!data) {
      return res.status(404).json({ message: "Agent Recommendation data not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAgentRecommendation };
