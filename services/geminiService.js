
import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (summary, expenses, sales, investments = []) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Actúa como consultor financiero. Analiza estos datos: Ganancia Neta $${summary.netProfit}, Ingresos $${summary.totalRevenue}. Da 3 consejos cortos.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text;
  } catch (error) {
    return "Error al conectar con el consultor IA.";
  }
};
