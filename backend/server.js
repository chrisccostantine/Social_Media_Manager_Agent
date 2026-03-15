import cors from "cors";
import "dotenv/config";
import express from "express";
import { generateContent } from "./agent.js";

const app = express();
const requiredFields = ["brand", "product", "audience", "platform", "tone"];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Social Agent API running");
});

app.post("/generate-content", async (req, res) => {
  const { brand, product, audience, platform, tone } = req.body;

  if (!brand || !product || !audience || !platform || !tone) {
    return res.status(400).json({
      success: false,
      error: "brand, product, audience, platform and tone are required",
    });
  }
  try {
    const result = await generateContent(req.body);

  const missingFields = requiredFields.filter(
    (field) => !normalizedBody[field] || normalizedBody[field].length === 0,
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      missingFields,
      message: `Please provide: ${missingFields.join(", ")}`,
    });
  }

  try {
    const result = await generateContent(normalizedBody);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    const isMissingKey = String(error?.message || "").includes("OPENAI_API_KEY");

    return res.status(500).json({
      success: false,
      error: "AI generation failed",
      message: isMissingKey
        ? "OPENAI_API_KEY is not configured on the backend server."
        : "The AI service failed to generate content. Please try again.",
    });
  }
});

app.listen(5000, () => {
  console.log("AI Social Agent running on port 5000");
});
