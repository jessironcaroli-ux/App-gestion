
import { GoogleGenAI } from "@google/genai";

export async function getAdvice(metrics) {
  if (!metrics || metrics.totalSales === 0) {
    return "Carga datos de ventas para que pueda realizar un análisis.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Actúa como un Director Financiero (CFO) experto en PYMES. 
    Analiza las siguientes métricas del mes actual:
    - Ingresos Totales: $${metrics.totalSales.toLocaleString()}
    - Utilidad Neta: $${metrics.netProfit.toLocaleString()}
    - Margen de Ganancia: ${(metrics.margin * 100).toFixed(1)}%

    Proporciona 3 consejos estratégicos de alto impacto para mejorar la rentabilidad. 
    Usa un tono profesional pero directo. Usa Markdown con negritas. 
    Responde en Español.
  `;
  
  try {
    const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "En este momento no puedo procesar el análisis. Por favor, revisa tu conexión.";
  }
}
