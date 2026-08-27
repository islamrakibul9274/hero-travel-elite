import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface GeneratePlanParams {
  destination: string;
  durationDays: number;
  travelStyle: string;
  budgetLevel: string;
  partyType: string;
  interests?: string[];
}

export async function generateAITripItinerary(params: GeneratePlanParams) {
  const prompt = `You are a world-class luxury travel architect for Hero Travel.
Create a personalized, sophisticated, high-editorial day-by-day travel itinerary for:
- Destination: ${params.destination}
- Duration: ${params.durationDays} Days
- Travel Style: ${params.travelStyle} (e.g. Luxury, Adventure, Culture, Culinary, Relaxation)
- Budget Level: ${params.budgetLevel} (e.g. Boutique, Premium Luxury, Ultra VIP)
- Party Type: ${params.partyType} (e.g. Solo Explorer, Romantic Couple, Family, Friends Group)
${params.interests?.length ? `- Specific Interests: ${params.interests.join(", ")}` : ""}

Respond STRICTLY in valid JSON format matching this schema:
{
  "destination": "${params.destination}",
  "durationDays": ${params.durationDays},
  "tagline": "A punchy evocative subtitle for the journey",
  "overview": "2-3 sentences of inspiring editorial summary",
  "highlightBadges": ["badge 1", "badge 2", "badge 3", "badge 4"],
  "estimatedCost": {
    "total": "$X,XXX - $Y,YYY",
    "breakdown": "Brief breakdown of hotel, dining, and activities"
  },
  "packingEssentials": ["item 1", "item 2", "item 3", "item 4", "item 5"],
  "insiderSecret": "A VIP insider tip that standard tourists never know about",
  "itinerary": [
    {
      "day": 1,
      "theme": "Day title/theme",
      "morning": "Morning activity and exploration details",
      "afternoon": "Afternoon curated experience",
      "evening": "Sunset/evening atmosphere",
      "dining": "Recommended top-tier restaurant or local specialty",
      "insiderTip": "A specific local tip for this day"
    }
  ]
}
Ensure exactly ${params.durationDays} days in the itinerary array. Output ONLY valid JSON.`;

  const availableModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b", "groq/compound"];

  for (const model of availableModels) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are the head travel curator at Hero Travel. You output structured JSON itineraries with impeccable taste, precision, and practical authenticity.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      return JSON.parse(responseText);
    } catch (err: any) {
      console.warn(`Groq model ${model} failed, trying next fallback:`, err?.message);
    }
  }

  throw new Error("Unable to generate itinerary with AI at this time.");
}
