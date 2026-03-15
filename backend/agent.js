import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(data) {
  const prompt = `
You are a professional social media marketing expert.

Brand: ${data.brand}
Product: ${data.product}
Audience: ${data.audience}
Platform: ${data.platform}
Tone: ${data.tone}

Generate:

1 Instagram caption
10 hashtags
1 short ad copy
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
