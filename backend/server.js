import cors from "cors";
import "dotenv/config";
import express from "express";
import { generateContent } from "./agent.js";

const app = express();

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

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI generation failed",
    });
  }
});

app.listen(5000, () => {
  console.log("AI Social Agent running on port 5000");
});
