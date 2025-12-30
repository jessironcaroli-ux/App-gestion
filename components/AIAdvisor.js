
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export default function AIAdvisor({ metrics }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analiza estas finanzas Pyme: Ventas $${metrics.totalSales}, Utilidad $${metrics.netProfit}. Da 3 consejos estratégicos claros en español con Markdown.`;
    
    try {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        setReport(response.text);
    } catch (err) {
        setReport("Error al conectar con el analista virtual.");
    }
    setLoading(false);
  };

  return React.createElement('div', { className: 'max-w-4xl mx-auto space-y-8 py-8 animate-in zoom-in duration-500' }, [
    React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border shadow-sm text-center' }, [
      React.createElement('div', { className: 'text-5xl mb-6' }, '🤖'),
      React.createElement('h3', { className: 'text-2xl font-black text-slate-800 mb-4 tracking-tight' }, 'Consultoría Estratégica IA'),
      React.createElement('p', { className: 'text-slate-500 mb-10 max-w-sm mx-auto' }, 'Analiza tus finanzas con inteligencia artificial para encontrar eficiencias.'),
      React.createElement('button', { onClick: handleAsk, disabled: loading, className: `px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all ${loading ? 'opacity-50' : ''}` }, loading ? 'Analizando...' : 'Obtener Reporte IA')
    ]),
    report && React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border border-indigo-100 shadow-2xl prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium', dangerouslySetInnerHTML: { __html: report.replace(/\*\*(.*?)\*\*/g, '<b class="text-indigo-600 font-black">$1</b>') } })
  ]);
}
