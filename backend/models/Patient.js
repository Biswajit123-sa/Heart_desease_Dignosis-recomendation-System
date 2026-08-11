// models/Patient.js
// Stores the health data a patient submits for risk assessment.
// Field names match what the AI service (FastAPI) expects.

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    age: { type: Number, required: true },
    sex: { type: Number, enum: [0, 1], required: true },          // 0 = Female, 1 = Male
    smoking: { type: Number, enum: [0, 1], required: true },
    diabetes: { type: Number, enum: [0, 1], required: true },
    chest_pain: { type: Number, enum: [0, 1], required: true },
    hypertension: { type: Number, enum: [0, 1], required: true },
    high_cholesterol: { type: Number, enum: [0, 1], required: true },
    obesity: { type: Number, enum: [0, 1], required: true },
    family_history: { type: Number, enum: [0, 1], required: true },
    physically_inactive: { type: Number, enum: [0, 1], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
