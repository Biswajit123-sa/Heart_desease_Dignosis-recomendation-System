// routes/patientRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createPatient,
  getMyPatientRecords,
  getPatientById,
} = require("../controllers/patientController");

const router = express.Router();

router.use(protect); // every route below requires a logged-in user

router.post("/", createPatient);
router.get("/", getMyPatientRecords);
router.get("/:id", getPatientById);

module.exports = router;
