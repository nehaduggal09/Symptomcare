// Vercel Serverless Function
// Calls Google Gemini API to analyze symptom text and return a
// structured suggestion: specialist, possible condition, emergency flag.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { symptomText } = req.body || {};

  // ---- Validation ----
  if (!symptomText || typeof symptomText !== "string" || !symptomText.trim()) {
    return res.status(400).json({ error: "Please describe your symptoms before submitting." });
  }
  if (symptomText.length > 1000) {
    return res.status(400).json({ error: "Please shorten your description (max 1000 characters)." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable");
    return res.status(500).json({ error: "Server is not configured correctly. Please try again later." });
  }

  const systemInstruction = `You are a careful healthcare guidance assistant called SymptomCare.
You will receive a description of symptoms in Hindi or English (or a mix).
Respond in the SAME language style the user used (Hindi or English), inside the JSON string values.

Respond with ONLY valid JSON, no markdown, no code fences, no extra text before or after.
The JSON object must have exactly these fields:
{
  "specialist": string,          // e.g. "Cardiologist", "General Physician"
  "possibleCondition": string,   // a brief, non-definitive possible condition
  "isEmergency": boolean,        // true only if symptoms suggest a genuine medical emergency (e.g. chest pain, severe difficulty breathing, major bleeding, signs of stroke, loss of consciousness)
  "emergencyMessage": string,    // if isEmergency is true, a short urgent message telling the user to seek immediate care; if false, an empty string ""
  "disclaimer": string           // always: "This is not a medical diagnosis. Please consult a qualified doctor."
}

Never provide a definitive diagnosis. Always err on the side of caution for emergencies. Do not include any text outside the JSON object.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: symptomText }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      return res.status(500).json({ error: "Something went wrong analyzing your symptoms. Please try again." });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("Unexpected Gemini response shape:", JSON.stringify(data));
      return res.status(500).json({ error: "Something went wrong analyzing your symptoms. Please try again." });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", rawText);
      return res.status(500).json({ error: "Something went wrong analyzing your symptoms. Please try again." });
    }

    // Ensure the shape is always safe for the frontend, even if the model omits a field
    const safeResult = {
      specialist: parsed.specialist || "General Physician",
      possibleCondition: parsed.possibleCondition || "Unable to determine — please consult a doctor.",
      isEmergency: Boolean(parsed.isEmergency),
      emergencyMessage: parsed.emergencyMessage || "",
      disclaimer: parsed.disclaimer || "This is not a medical diagnosis. Please consult a qualified doctor.",
    };

    return res.status(200).json(safeResult);
  } catch (err) {
    console.error("analyze-symptoms handler error:", err);
    return res.status(500).json({ error: "Something went wrong analyzing your symptoms. Please try again." });
  }
}
