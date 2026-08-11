// routes/predictionRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  
  createPrediction,
  getMyPredictions,
  getPredictionById,
} = require("../controllers/predictionController");

const router = express.Router();

router.use(protect);

router.post("/", createPrediction);     // run a new heart risk prediction
router.get("/", getMyPredictions);      // get history
router.get("/:id", getPredictionById);
  // get one report

module.exports = router;
