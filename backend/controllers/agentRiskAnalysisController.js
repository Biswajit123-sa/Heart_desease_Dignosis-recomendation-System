const AgentRiskAnalysis = require("../models/AgentRiskAnalysis");

const getAgentRiskAnalysis = async (req, res, next) => {
  try {
    const data = await AgentRiskAnalysis.findOne({ predictionId: req.params.predictionId });
    if (!data) {
      return res.status(404).json({ message: "Agent Risk Analysis data not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAgentRiskAnalysis };
