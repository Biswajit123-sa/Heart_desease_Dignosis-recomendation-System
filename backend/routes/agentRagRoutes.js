const express = require("express");
const router = express.Router();
const { getAgentRag } = require("../controllers/agentRagController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:predictionId", protect, getAgentRag);

module.exports = router;
