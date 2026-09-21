import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getProperties, createProperty } from "./controllers/propertiesController.js";
import {
  calculateMaxBid,
  calculateWoodValuation,
  getContractors
} from "./controllers/calculatorsController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Properties Routes
app.get("/api/properties", getProperties);
app.post("/api/properties", createProperty);

// Calculators & Contractors Routes
app.post("/api/calculate/max-bid", calculateMaxBid);
app.post("/api/calculate/wood-valuation", calculateWoodValuation);
app.get("/api/contractors", getContractors);

app.listen(PORT, () => {
  console.log(`🚀 Kalasin Real Estate Express API server running on port ${PORT}`);
});
