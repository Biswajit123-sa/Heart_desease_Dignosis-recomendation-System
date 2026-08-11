const express = require("express");
const router = express.Router();
const { getAgentRiskAnalysis } = require("../controllers/agentRiskAnalysisController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:predictionId", protect, getAgentRiskAnalysis);

module.exports = router;
