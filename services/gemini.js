
import { GoogleGenAI } from "@google/genai";

export async function getAdvice(metrics) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Como CFO, analiza: Ventas $${metrics.totalSales}, Utilidad $${metrics.netProfit}. Da 3 consejos estratégicos en español con Markdown.`;
  
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text;
  } catch (err) {
    return "No se pudo conectar con la IA en este momento.";
  }
}
