import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { HindsightClient } from "@vectorize-io/hindsight-client";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

const {
  PORT = 3000,
  GROQ_API_KEY,
  GROQ_MODEL = "llama-3.3-70b-versatile",
  HINDSIGHT_BASE_URL = "https://api.hindsight.vectorize.io",
  HINDSIGHT_API_KEY,
  HINDSIGHT_BANK_ID = "memorydesk-support"
} = process.env;

const groq = GROQ_API_KEY
  ? new OpenAI({ apiKey: GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" })
  : null;

const hindsight = HINDSIGHT_API_KEY
  ? new HindsightClient({ baseUrl: HINDSIGHT_BASE_URL, apiKey: HINDSIGHT_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(groq),
    hindsightConfigured: Boolean(hindsight),
    bankId: HINDSIGHT_BANK_ID
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { customerId, message } = req.body ?? {};
    if (!customerId || !message?.trim()) {
      return res.status(400).json({ error: "customerId and message are required." });
    }
    if (!groq || !hindsight) {
      return res.status(503).json({
        error: "Add GROQ_API_KEY and HINDSIGHT_API_KEY to your .env file, then restart the server."
      });
    }

    const bankId = `${HINDSIGHT_BANK_ID}-${String(customerId).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;

    // Retrieve this customer's prior context from Hindsight.
    let memories = [];
    try {
      const recalled = await hindsight.recall(bankId, message);
      memories = (recalled?.results ?? []).map((item) => item.text).filter(Boolean);
    } catch (memoryError) {
      console.error("Hindsight recall error:", memoryError);
    }

    const systemPrompt = `You are MemoryDesk, a helpful and empathetic customer-support agent.
Use the customer's recalled history when relevant. Never invent order status, refunds, or actions.
If information is missing, ask a clear follow-up question. Be concise and professional.
Customer ID: ${customerId}
Relevant remembered context:
${memories.length ? memories.map((m) => `- ${m}`).join("\n") : "- No previous memories found."}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const answer = completion.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Store the latest interaction so future conversations can recall it.
    await hindsight.retain(
      bankId,
      `Customer ${customerId} said: ${message}\nMemoryDesk support agent replied: ${answer}`
    );

    res.json({ answer, memoriesUsed: memories, customerId });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "The support agent encountered an error. Check the server terminal." });
  }
});

app.post("/api/recall", async (req, res) => {
  try {
    const { customerId, query } = req.body ?? {};
    if (!customerId || !query?.trim()) {
      return res.status(400).json({ error: "customerId and query are required." });
    }
    if (!hindsight) return res.status(503).json({ error: "Hindsight is not configured." });

    const bankId = `${HINDSIGHT_BANK_ID}-${String(customerId).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;
    const result = await hindsight.recall(bankId, query);
    res.json({ memories: (result?.results ?? []).map((item) => item.text).filter(Boolean) });
  } catch (error) {
    console.error("Recall error:", error);
    res.status(500).json({ error: "Could not retrieve memories." });
  }
});

app.listen(PORT, () => {
  console.log(`MemoryDesk running at http://localhost:${PORT}`);
});
