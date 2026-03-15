import "dotenv/config";
import OpenAI from "openai";

let client;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
}

const SYSTEM_PROMPT = `You are a senior social media manager AI agent for businesses and creators.

Your job is to return a complete social media execution package with strategy + content + workflow.
Always respond with valid JSON only (no markdown, no extra text).

Return this exact schema:
{
  "strategySummary": "string",
  "profileOptimization": ["string", "string"],
  "contentPillars": ["string", "string", "string", "string"],
  "weeklyCalendar": [
    {
      "day": "Monday",
      "platform": "Instagram",
      "postType": "Reel/Carousel/Story/Short/Post",
      "hook": "string",
      "caption": "string",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
      "cta": "string",
      "bestTime": "string"
    }
  ],
  "storyIdeas": ["string", "string", "string", "string", "string"],
  "shortAdCopy": "string",
  "communityPlan": ["string", "string", "string"],
  "automationRecommendations": ["string", "string", "string"],
  "metricsToTrack": ["string", "string", "string", "string", "string"]
}

Rules:
- Provide 7 weeklyCalendar items (Monday to Sunday).
- Tailor platform mix and ideas to the input business.
- Captions should be practical and ready to post.
- Keep each line concise and actionable.`;

function buildUserPrompt(data) {
  return `Build the social media manager output for:
Brand: ${data.brand}
Business Type / Product: ${data.product}
Audience: ${data.audience}
Primary Platforms: ${data.platform}
Brand Tone: ${data.tone}
Business Goal: ${data.goal || "Grow brand awareness and conversions"}
Posting Frequency Preference: ${data.frequency || "Daily"}
Special Notes: ${data.notes || "None"}`;
}

function safeJsonParse(content) {
  try {
    return JSON.parse(content);
  } catch {
    return {
      raw: content,
    };
  }
}

export async function generateContent(data) {
  const response = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(data) },
    ],
    max_output_tokens: 1800,
  });

  const content = response.output_text?.trim() || "{}";
  return safeJsonParse(content);
}
