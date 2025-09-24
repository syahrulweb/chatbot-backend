import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "⚠️ message harus berupa string" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([{ text: message }]);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "⚠️ Gagal dapet jawaban dari Gemini" });
  }
}
