// server.js

// Entry point of the backend. Sets up Express, connects MongoDB, mounts routes.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const agentPredictionRoutes = require("./routes/agentPredictionRoutes");
const agentRiskAnalysisRoutes = require("./routes/agentRiskAnalysisRoutes");
const agentRagRoutes = require("./routes/agentRagRoutes");
const agentRecommendationRoutes = require("./routes/agentRecommendationRoutes");

const app = express();

// --- Core middleware ---
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "Heart Disease AI Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/chat", chatbotRoutes);

// Agent-specific routes
app.use("/api/agent-prediction", agentPredictionRoutes);
app.use("/api/agent-risk", agentRiskAnalysisRoutes);
app.use("/api/agent-rag", agentRagRoutes);
app.use("/api/agent-recommendation", agentRecommendationRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
