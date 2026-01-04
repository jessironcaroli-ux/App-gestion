
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export default function Dashboard({ metrics, name }) {
  if (!metrics) {
    return React.createElement('div', { className: 'p-12 text-center' }, [
      React.createElement('h3', { className: 'text-xl font-bold text-slate-400' }, 'Esperando datos financieros...')
    ]);
  }

  // Datos seguros para los gráficos
  const chartData = [
    { name: 'Ingresos', val: metrics.totalSales || 0, color: '#6366f1' },
    { name: 'Costos', val: (metrics.fixedExpenses || 0) + (metrics.variableExpenses || 0), color: '#f43f5e' },
    { name: 'Utilidad', val: Math.max(0, metrics.netProfit || 0), color: '#10b981' }
  ];

  const pieData = [
    { name: 'Gastos', value: (metrics.fixedExpenses || 0) + (metrics.variableExpenses || 0) },
    { name: 'Utilidad', value: Math.max(0.1, metrics.netProfit || 0) }
  ];

  return React.createElement('div', { className: 'space-y-8 animate-in fade-in duration-500' }, [
    React.createElement('div', { key: 'header', className: 'flex justify-between items-end' }, [
        React.createElement('div', null, [
          React.createElement('p', { className: 'text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1' }, 'Dashboard Operativo'),
          React.createElement('h2', { className: 'text-3xl font-black text-slate-800' }, name || 'Mi Empresa')
        ]),
        React.createElement('div', { className: 'text-right' }, [
          React.createElement('p', { className: 'text-slate-400 font-bold text-[10px] uppercase' }, 'Estado de Salud'),
          React.createElement('span', { className: `text-xs font-black px-3 py-1 rounded-full ${(metrics.netProfit || 0) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}` }, 
            (metrics.netProfit || 0) >= 0 ? 'RENTABLE' : 'CRÍTICO'
          )
        ])
    ]),
    
    React.createElement('div', { key: 'kpis', className: 'grid grid-cols-1 md:grid-cols-4 gap-6' }, [
      { label: 'Utilidad Neta', val: `$${(metrics.netProfit || 0).toLocaleString()}`, color: 'text-emerald-600' },
      { label: 'Margen Neto', val: `${((metrics.margin || 0) * 100).toFixed(1)}%`, color: 'text-indigo-600' },
      { label: 'Ingresos', val: `$${(metrics.totalSales || 0).toLocaleString()}`, color: 'text-slate-800' },
      { label: 'Gastos Totales', val: `$${((metrics.fixedExpenses || 0) + (metrics.variableExpenses || 0)).toLocaleString()}`, color: 'text-rose-500' }
    ].map(kpi => React.createElement('div', { key: kpi.label, className: 'bg-white p-6 rounded-3xl border border-slate-200 shadow-sm' }, [
      React.createElement('p', { className: 'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1' }, kpi.label),
      React.createElement('p', { className: `text-2xl font-black ${kpi.color}` }, kpi.val)
    ]))),

    React.createElement('div', { key: 'charts', className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' }, [
      React.createElement('div', { key: 'bar-cont', className: 'bg-white p-8 rounded-[2.5rem] border shadow-sm h-[400px]' }, [
        React.createElement('h4', { className: 'text-sm font-black text-slate-400 uppercase mb-6' }, 'Rendimiento General'),
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' }, 
          React.createElement(BarChart, { data: chartData }, [
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', vertical: false, stroke: '#f1f5f9' }),
            React.createElement(XAxis, { dataKey: 'name', axisLine: false, tickLine: false, tick: { fontSize: 10, fontWeight: 700 } }),
            React.createElement(YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 10 } }),
            React.createElement(Tooltip, { contentStyle: { borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }),
            React.createElement(Bar, { dataKey: 'val', radius: [8, 8, 0, 0], barSize: 50 }, 
              chartData.map((entry, index) => React.createElement(Cell, { key: `cell-${index}`, fill: entry.color }))
            )
          ])
        )
      ]),
      React.createElement('div', { key: 'pie-cont', className: 'bg-white p-8 rounded-[2.5rem] border shadow-sm h-[400px]' }, [
        React.createElement('h4', { className: 'text-sm font-black text-slate-400 uppercase mb-6' }, 'Distribución de Fondos'),
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' }, 
          React.createElement(PieChart, null, [
            React.createElement(Pie, { 
              data: pieData, dataKey: 'value', cx: '50%', cy: '50%', innerRadius: 70, outerRadius: 100, paddingAngle: 5
            }, [
                React.createElement(Cell, { key: 'c1', fill: '#f43f5e' }),
                React.createElement(Cell, { key: 'c2', fill: '#10b981' })
            ]),
            React.createElement(Tooltip, null),
            React.createElement(Legend, null)
          ])
        )
      ])
    ])
  ]);
}
