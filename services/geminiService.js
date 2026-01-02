
import { GoogleGenAI } from "@google/genai";

/**
 * Servicio de consultoría financiera basado en IA.
 */
export const getFinancialAdvice = async (summary) => {
  try {
    // Inicialización de la IA usando la clave de entorno
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Actúa como un Consultor Financiero Senior y CFO para una PYME. 
      Analiza los siguientes indicadores mensuales:
      - Ingresos Totales: $${summary.totalSales.toLocaleString()}
      - Ganancia Neta: $${summary.netProfit.toLocaleString()}
      - Margen de Utilidad: ${(summary.margin * 100).toFixed(1)}%
      - Gastos Operativos (Fijos + Variables): $${(summary.fixedExpenses + summary.variableExpenses).toLocaleString()}

      Proporciona 3 consejos estratégicos de máximo 2 frases cada uno. 
      Sé directo, profesional y enfócate en mejorar la rentabilidad.
      Usa Markdown para resaltar puntos clave.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No se pudo generar el análisis en este momento.";
  } catch (error) {
    console.error("Error en GeminiService:", error);
    return "El consultor IA no está disponible temporalmente. Revisa tu conexión o configuración.";
  }
};
