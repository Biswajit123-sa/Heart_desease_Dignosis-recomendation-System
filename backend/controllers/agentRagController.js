const AgentRag = require("../models/AgentRag");

const getAgentRag = async (req, res, next) => {
  try {
    const data = await AgentRag.findOne({ predictionId: req.params.predictionId });
    if (!data) {
      return res.status(404).json({ message: "Agent RAG data not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAgentRag };
