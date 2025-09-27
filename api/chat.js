import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://syahrulweb.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight OPTIONS
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "⚠️ Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "⚠️ message harus berupa string" });
    }

    // Ambil API Key dari env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Pakai model Gemini Flash (gratisan)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate konten (cukup pake string, ga perlu array)
    const result = await model.generateContent(message);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ reply: "⚠️ Gagal dapet jawaban dari Gemini" });
  }
}
