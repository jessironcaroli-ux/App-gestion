
import React, { useState } from 'react';
import { ExpenseType } from '../types.js';

export default function Forms({ sales, expenses, onAdd }) {
  const [sDesc, setSDesc] = useState('');
  const [sPrice, setSPrice] = useState('');
  const [sQty, setSQty] = useState('');

  const [eDesc, setEDesc] = useState('');
  const [eAmt, setEAmt] = useState('');
  const [eType, setEType] = useState(ExpenseType.FIXED);

  return React.createElement('div', { className: 'space-y-12' }, [
    React.createElement('div', { className: 'bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm' }, [
        React.createElement('h3', { className: 'text-xl font-black text-slate-800 mb-8' }, '📈 Ingresos por Ventas'),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-8' }, [
            React.createElement('input', { value: sDesc, onChange: e => setSDesc(e.target.value), placeholder: 'Producto', className: 'excel-input' }),
            React.createElement('input', { type: 'number', value: sPrice, onChange: e => setSPrice(e.target.value), placeholder: 'Precio', className: 'excel-input' }),
            React.createElement('input', { type: 'number', value: sQty, onChange: e => setSQty(e.target.value), placeholder: 'Cant.', className: 'excel-input' }),
            React.createElement('button', { onClick: () => { if(sDesc && sPrice && sQty) { onAdd('sales', { desc: sDesc, price: Number(sPrice), qty: Number(sQty) }); setSDesc(''); setSPrice(''); setSQty(''); } }, className: 'bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all' }, 'Añadir')
        ]),
        React.createElement('table', { className: 'w-full text-left' }, [
            React.createElement('thead', { className: 'text-[10px] text-slate-400 font-black uppercase border-b' }, React.createElement('tr', null, [
                React.createElement('th', { className: 'pb-4' }, 'Concepto'),
                React.createElement('th', { className: 'pb-4 text-right' }, 'Total')
            ])),
            React.createElement('tbody', null, sales.map(s => React.createElement('tr', { key: s.id, className: 'border-b border-slate-50' }, [
                React.createElement('td', { className: 'py-3 font-bold text-slate-700' }, s.desc),
                React.createElement('td', { className: 'py-3 text-right font-black text-indigo-600' }, `$${(s.price * s.qty).toLocaleString()}`)
            ])))
        ])
    ]),

    React.createElement('div', { className: 'bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm' }, [
        React.createElement('h3', { className: 'text-xl font-black text-slate-800 mb-8' }, '💸 Gastos de Operación'),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-4' }, [
            React.createElement('input', { value: eDesc, onChange: e => setEDesc(e.target.value), placeholder: 'Descripción', className: 'excel-input' }),
            React.createElement('input', { type: 'number', value: eAmt, onChange: e => setEAmt(e.target.value), placeholder: 'Monto $', className: 'excel-input' }),
            React.createElement('select', { value: eType, onChange: e => setEType(e.target.value), className: 'excel-input' }, [
                React.createElement('option', { value: ExpenseType.FIXED }, 'Gasto Fijo'),
                React.createElement('option', { value: ExpenseType.VARIABLE }, 'Gasto Variable')
            ]),
            React.createElement('button', { onClick: () => { if(eDesc && eAmt) { onAdd('expenses', { desc: eDesc, amount: Number(eAmt), type: eType }); setEDesc(''); setEAmt(''); } }, className: 'bg-slate-900 text-white font-bold py-3 rounded-xl' }, 'Guardar')
        ])
    ])
  ]);
}
