const express = require("express");
const router = express.Router();
const { getAgentRecommendation } = require("../controllers/agentRecommendationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:predictionId", protect, getAgentRecommendation);

module.exports = router;
