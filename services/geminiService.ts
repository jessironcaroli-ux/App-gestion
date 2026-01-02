
import { GoogleGenAI } from "@google/genai";
import { FinancialSummary, Expense, ProductSale, Investment } from "../types";

export const getFinancialAdvice = async (
  summary: FinancialSummary,
  expenses: Expense[],
  sales: ProductSale[],
  investments: Investment[] = []
): Promise<string> => {
  try {
    // Inicialización siguiendo las guías de seguridad: usa process.env.API_KEY directamente.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Actúa como un Director Financiero (CFO) y Consultor Estratégico experto en PYMES. 
      Analiza los siguientes resultados financieros de este mes:

      RESUMEN OPERATIVO:
      - Ingresos Totales: $${summary.totalRevenue.toLocaleString()}
      - Ganancia Neta: $${summary.netProfit.toLocaleString()}
      - Margen de Contribución: ${(summary.marginalContributionPercentage * 100).toFixed(1)}%
      - Punto de Equilibrio: $${summary.breakEvenPoint.toLocaleString()}
      - Margen de Ganancia: ${(summary.profitMargin * 100).toFixed(1)}%

      ESTRUCTURA DE COSTOS:
      - Costos Fijos: $${summary.totalFixedCosts.toLocaleString()}
      - Costos Variables: $${summary.totalVariableCosts.toLocaleString()}

      PORTAFOLIO DE ACTIVOS:
      - Valor de Activos/Maquinaria: $${summary.totalAssetsValue.toLocaleString()}
      - Rendimiento de Inversiones: $${summary.totalInvestmentYields.toLocaleString()}

      TAREAS DE ANÁLISIS:
      1. Diagnóstico de Salud: ¿Es el negocio rentable? ¿El punto de equilibrio es alcanzable?
      2. Eficiencia: ¿Los costos fijos son demasiado altos respecto a los ingresos?
      3. Recomendación de Escenarios: Si el cliente sube precios un 5%, ¿cómo impacta la ganancia?
      4. Inversiones: ¿Conviene vender activos o reinvertir la ganancia en el negocio principal?

      Proporciona consejos accionables, cortos y profesionales. Usa Markdown para el formato (negritas, listas).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 } // Respuesta rápida y directa
      }
    });

    return response.text || "La IA no pudo procesar el análisis en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al conectar con el consultor IA. Por favor, intenta de nuevo.";
  }
};
