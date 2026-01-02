
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export default function AIAdvisor({ metrics }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analiza estas finanzas: Ventas $${metrics.totalSales}, Utilidad $${metrics.netProfit}, Margen ${(metrics.margin * 100).toFixed(1)}%. Da 3 consejos estratégicos en español con Markdown.`;
    
    try {
        const response = await ai.models.generateContent({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt 
        });
        setReport(response.text);
    } catch (err) {
        console.error(err);
        setReport("Error al obtener el reporte de la IA.");
    }
    setLoading(false);
  };

  return React.createElement('div', { className: 'max-w-4xl mx-auto space-y-8 py-8' }, [
    React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border shadow-sm text-center' }, [
      React.createElement('div', { className: 'text-5xl mb-6' }, '🤖'),
      React.createElement('h3', { className: 'text-2xl font-black text-slate-800 mb-4 tracking-tight' }, 'Consultoría con IA'),
      React.createElement('button', { onClick: handleAsk, disabled: loading, className: `px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}` }, loading ? 'Procesando Datos...' : 'Generar Análisis Estratégico')
    ]),
    report && React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border border-indigo-100 shadow-2xl prose prose-slate max-w-none' }, [
        React.createElement('div', { className: 'text-slate-700 leading-relaxed font-medium', dangerouslySetInnerHTML: { __html: report.replace(/\*\*(.*?)\*\*/g, '<b class="text-indigo-600 font-black">$1</b>').replace(/\n/g, '<br/>') } })
    ])
  ]);
}
