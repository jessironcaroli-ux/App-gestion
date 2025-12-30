
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export default function Dashboard({ metrics, name }) {
  const chartData = [
    { name: 'Ventas', val: metrics.totalSales, color: '#6366f1' },
    { name: 'Costos', val: metrics.fixedExpenses + metrics.variableExpenses, color: '#f43f5e' },
    { name: 'Ganancia', val: metrics.netProfit, color: '#10b981' }
  ];

  return React.createElement('div', { className: 'space-y-8 animate-in fade-in duration-500' }, [
    React.createElement('h2', { className: 'text-2xl font-black text-slate-800' }, `Estado Financiero: ${name}`),
    
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-6' }, [
      { label: 'Utilidad Neta', val: `$${metrics.netProfit.toLocaleString()}`, color: metrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600' },
      { label: 'Margen Neto', val: `${(metrics.margin * 100).toFixed(1)}%`, color: 'text-indigo-600' },
      { label: 'Ventas Totales', val: `$${metrics.totalSales.toLocaleString()}`, color: 'text-slate-800' },
      { label: 'Gastos Totales', val: `$${(metrics.fixedExpenses + metrics.variableExpenses).toLocaleString()}`, color: 'text-rose-400' }
    ].map(kpi => React.createElement('div', { key: kpi.label, className: 'bg-white p-6 rounded-2xl border border-slate-200 shadow-sm' }, [
      React.createElement('p', { className: 'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1' }, kpi.label),
      React.createElement('p', { className: `text-xl font-black ${kpi.color}` }, kpi.val)
    ]))),

    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' }, [
      React.createElement('div', { className: 'bg-white p-8 rounded-[2rem] border shadow-sm h-[400px]' }, [
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' }, [
          React.createElement(BarChart, { data: chartData }, [
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', vertical: false, stroke: '#f1f5f9' }),
            React.createElement(XAxis, { dataKey: 'name', axisLine: false, tickLine: false, tick: { fontSize: 11, fontWeight: 700 } }),
            React.createElement(YAxis, { axisLine: false, tickLine: false }),
            React.createElement(Tooltip, { contentStyle: { borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }),
            React.createElement(Bar, { dataKey: 'val', radius: [8, 8, 0, 0], barSize: 60 }, chartData.map((e, i) => React.createElement(Cell, { key: i, fill: e.color })))
          ])
        ])
      ]),
      React.createElement('div', { className: 'bg-white p-8 rounded-[2rem] border shadow-sm h-[400px]' }, [
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' }, [
          React.createElement(PieChart, null, [
            React.createElement(Pie, { 
              data: [{ name: 'Gastos', val: metrics.fixedExpenses + metrics.variableExpenses }, { name: 'Utilidad', val: Math.max(0, metrics.netProfit) }], 
              dataKey: 'val', cx: '50%', cy: '50%', innerRadius: 70, outerRadius: 100, paddingAngle: 10 
            }, [
                React.createElement(Cell, { fill: '#f43f5e' }),
                React.createElement(Cell, { fill: '#10b981' })
            ]),
            React.createElement(Tooltip),
            React.createElement(Legend)
          ])
        ])
      ])
    ])
  ]);
}
