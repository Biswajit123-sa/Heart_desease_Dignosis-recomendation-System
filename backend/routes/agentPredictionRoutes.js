const express = require("express");
const router = express.Router();
const { getAgentPrediction } = require("../controllers/agentPredictionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:predictionId", protect, getAgentPrediction);

module.exports = router;
