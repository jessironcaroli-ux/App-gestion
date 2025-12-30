
import React, { useState, useMemo } from 'react';

export default function Simulation({ metrics }) {
  const [pAdj, setPAdj] = useState(0);
  const [qAdj, setQAdj] = useState(0);

  const res = useMemo(() => {
    const newSales = metrics.totalSales * (1 + pAdj / 100) * (1 + qAdj / 100);
    const newProfit = newSales - metrics.fixedExpenses - metrics.variableExpenses;
    return { newSales, newProfit, diff: newProfit - metrics.netProfit };
  }, [pAdj, qAdj, metrics]);

  return React.createElement('div', { className: 'max-w-4xl mx-auto space-y-8 py-8' }, [
    React.createElement('div', { className: 'bg-white p-12 rounded-[3.5rem] border shadow-sm text-center' }, [
      React.createElement('h3', { className: 'text-2xl font-black text-slate-800 mb-4 tracking-tight' }, '🧪 Simulador Estratégico "What-If"'),
      React.createElement('p', { className: 'text-slate-400 mb-12 font-medium' }, 'Ajusta precios y volumen para proyectar tu utilidad neta.'),
      
      React.createElement('div', { className: 'space-y-12 mb-12' }, [
        React.createElement('div', null, [
          React.createElement('div', { className: 'flex justify-between mb-2 text-xs font-black text-slate-500 uppercase' }, ['Cambio de Precios', `${pAdj}%`]),
          React.createElement('input', { type: 'range', min: -30, max: 100, value: pAdj, onChange: e => setPAdj(Number(e.target.value)) })
        ]),
        React.createElement('div', null, [
          React.createElement('div', { className: 'flex justify-between mb-2 text-xs font-black text-slate-500 uppercase' }, ['Cambio de Ventas', `${qAdj}%`]),
          React.createElement('input', { type: 'range', min: -50, max: 200, value: qAdj, onChange: e => setQAdj(Number(e.target.value)) })
        ])
      ]),

      React.createElement('div', { className: 'grid grid-cols-2 gap-8 pt-10 border-t border-slate-50' }, [
        React.createElement('div', null, [
          React.createElement('p', { className: 'text-[10px] font-black text-slate-400 uppercase mb-1' }, 'Utilidad Nueva'),
          React.createElement('p', { className: `text-3xl font-black ${res.newProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}` }, `$${Math.round(res.newProfit).toLocaleString()}`)
        ]),
        React.createElement('div', null, [
          React.createElement('p', { className: 'text-[10px] font-black text-slate-400 uppercase mb-1' }, 'Impacto en el Negocio'),
          React.createElement('p', { className: `text-3xl font-black ${res.diff >= 0 ? 'text-indigo-600' : 'text-rose-400'}` }, `${res.diff >= 0 ? '+' : ''}$${Math.round(res.diff).toLocaleString()}`)
        ])
      ])
    ])
  ]);
}
