
import { GoogleGenAI } from "@google/genai";

/**
 * Servicio de consultoría financiera estratégica basado en Gemini.
 */
export const getFinancialAdvice = async (summary) => {
  try {
    // Inicialización del cliente de IA. 
    // La API_KEY se inyecta automáticamente desde el entorno.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Actúa como un Director Financiero (CFO) experto. Analiza estos datos:
      - Ventas Mensuales: $${(summary.totalSales || 0).toLocaleString()}
      - Utilidad Neta: $${(summary.netProfit || 0).toLocaleString()}
      - Margen de Rentabilidad: ${((summary.margin || 0) * 100).toFixed(1)}%
      
      Dame un diagnóstico profesional muy breve (3 puntos clave) sobre qué debería hacer esta empresa para mejorar su rentabilidad el próximo mes. 
      Usa Markdown para resaltar los puntos clave. Habla en español.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 } // Desactivamos razonamiento largo para mayor velocidad
      }
    });

    return response.text || "No se pudo generar el análisis. Verifica que la empresa tenga datos cargados.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Error de conexión con el analista IA. Por favor, intenta más tarde.";
  }
};
