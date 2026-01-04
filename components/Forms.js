import React, { useState } from 'react';
import { ExpenseType } from '../types.js';

export default function Forms({ sales, expenses, onAdd }) {
  const [sDesc, setSDesc] = useState('');
  const [sPrice, setSPrice] = useState('');
  const [sQty, setSQty] = useState('');

  const [eDesc, setEDesc] = useState('');
  const [eAmt, setEAmt] = useState('');
  const [eType, setEType] = useState(ExpenseType.FIXED);

  const handleAddSale = () => {
    if(sDesc && sPrice && sQty) {
      onAdd('sales', { desc: sDesc, price: Number(sPrice), qty: Number(sQty), id: Date.now() });
      setSDesc(''); setSPrice(''); setSQty('');
    }
  };

  const handleAddExpense = () => {
    if(eDesc && eAmt) {
      onAdd('expenses', { desc: eDesc, amount: Number(eAmt), type: eType, id: Date.now() });
      setEDesc(''); setEAmt('');
    }
  };

  return React.createElement('div', { className: 'space-y-12' }, [
    // Sección de Ingresos (Excel Style)
    React.createElement('div', { key: 's-sec', className: 'bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm' }, [
        React.createElement('div', { className: 'flex justify-between items-center mb-8' }, [
          React.createElement('h3', { className: 'text-xl font-black text-slate-800' }, '📈 Registro de Ventas'),
          React.createElement('span', { className: 'text-[10px] bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full' }, 'MODO CARGA RÁPIDA')
        ]),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-3 mb-8' }, [
            React.createElement('input', { value: sDesc, onChange: e => setSDesc(e.target.value), placeholder: 'Producto / Cliente', className: 'excel-input' }),
            React.createElement('input', { type: 'number', value: sPrice, onChange: e => setSPrice(e.target.value), placeholder: 'Precio Unitario', className: 'excel-input' }),
            React.createElement('input', { type: 'number', value: sQty, onChange: e => setSQty(e.target.value), placeholder: 'Cantidad', className: 'excel-input' }),
            React.createElement('button', { onClick: handleAddSale, className: 'bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200' }, '+ Añadir Fila')
        ]),
        React.createElement('div', { className: 'overflow-hidden rounded-xl border border-slate-100' }, 
            React.createElement('table', { className: 'w-full text-left border-collapse' }, [
                React.createElement('thead', { className: 'bg-slate-50 text-[10px] text-slate-400 font-black uppercase' }, 
                  React.createElement('tr', null, [
                    React.createElement('th', { className: 'px-6 py-4' }, 'Descripción'),
                    React.createElement('th', { className: 'px-6 py-4 text-right' }, 'Precio'),
                    React.createElement('th', { className: 'px-6 py-4 text-center' }, 'Cant.'),
                    React.createElement('th', { className: 'px-6 py-4 text-right' }, 'Total')
                  ])
                ),
                React.createElement('tbody', { className: 'divide-y divide-slate-50' }, 
                    (sales || []).length === 0 ? 
                    React.createElement('tr', null, React.createElement('td', { colSpan: 4, className: 'py-10 text-center text-slate-300 italic' }, 'No hay ventas registradas')) :
                    (sales || []).map(s => React.createElement('tr', { key: s.id, className: 'hover:bg-slate-50' }, [
                        React.createElement('td', { className: 'px-6 py-3 font-bold text-slate-700' }, s.desc),
                        React.createElement('td', { className: 'px-6 py-3 text-right text-slate-500' }, `$${(s.price || 0).toLocaleString()}`),
                        React.createElement('td', { className: 'px-6 py-3 text-center font-bold text-slate-600' }, s.qty),
                        React.createElement('td', { className: 'px-6 py-3 text-right font-black text-emerald-600' }, `$${((s.price || 0) * (s.qty || 0)).toLocaleString()}`)
                    ]))
                )
            ])
        )
    ]),

    // Sección de Gastos (Excel Style)
    React.createElement('div', { key: 'e-sec', className: 'bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm' }, [
        React.createElement('div', { className: 'flex justify-between items-center mb-8' }, [
          React.createElement('h3', { className: 'text-xl font-black text-slate-800' }, '💸 Registro de Gastos'),
          React.createElement('span', { className: 'text-[10px] bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full' }, 'LIBRO DE EGRESOS')
        ]),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-3 mb-4' }, [
            React.createElement('input', { value: eDesc, onChange: e => setEDesc(e.target.value), placeholder: 'Descripción del Gasto', className: 'excel-input' }),
            React.createElement('input', { type: 'number', value: eAmt, onChange: e => setEAmt(e.target.value), placeholder: 'Monto Total', className: 'excel-input' }),
            React.createElement('select', { value: eType, onChange: e => setEType(e.target.value), className: 'excel-input' }, [
                React.createElement('option', { value: ExpenseType.FIXED }, 'Gasto Fijo (Alquiler, Sueldos)'),
                React.createElement('option', { value: ExpenseType.VARIABLE }, 'Gasto Variable (Materia prima, Luz)')
            ]),
            React.createElement('button', { onClick: handleAddExpense, className: 'bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-all' }, 'Guardar Registro')
        ])
    ])
  ]);
}