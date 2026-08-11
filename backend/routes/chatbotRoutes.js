const express = require("express");
const router = express.Router();
const { postChat } = require("../controllers/chatbotController");
const { protect } = require("../middleware/authMiddleware");

// Route requires Bearer Token via protect middleware
router.post("/", protect, postChat);

module.exports = router;
