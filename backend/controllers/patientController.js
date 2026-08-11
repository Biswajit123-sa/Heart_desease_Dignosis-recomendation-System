// controllers/patientController.js
// Handles saving and retrieving patient health-assessment data.

const Patient = require("../models/Patient");

// POST /api/patients
const createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

// GET /api/patients
const getMyPatientRecords = async (req, res, next) => {
  try {
    const patients = await Patient.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/:id
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient record not found" });
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPatient, getMyPatientRecords, getPatientById };
