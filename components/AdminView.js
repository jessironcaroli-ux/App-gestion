
import React, { useState } from 'react';

export default function AdminView({ clients, onAdd, onSelect }) {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  return React.createElement('div', { className: 'space-y-10' }, [
    React.createElement('h2', { className: 'text-3xl font-black text-slate-800' }, 'Administración de Cuentas'),
    
    React.createElement('div', { className: 'bg-white p-10 rounded-[2.5rem] border shadow-sm' }, [
        React.createElement('h3', { className: 'text-lg font-bold text-slate-800 mb-8 uppercase tracking-widest' }, '➕ Registrar Nueva Pyme'),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 items-end' }, [
            React.createElement('input', { value: name, onChange: e => setName(e.target.value), placeholder: 'Nombre Empresa', className: 'excel-input' }),
            React.createElement('input', { value: user, onChange: e => setUser(e.target.value), placeholder: 'Usuario', className: 'excel-input' }),
            React.createElement('input', { value: pass, onChange: e => setPass(e.target.value), placeholder: 'Clave', className: 'excel-input' }),
            React.createElement('button', { onClick: () => { if(name && user && pass) { onAdd({ name, user, pass }); setName(''); setUser(''); setPass(''); } }, className: 'bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 shadow-lg transition-all' }, 'Crear Cuenta')
        ])
    ]),

    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' }, clients.map(c => React.createElement('div', { key: c.id, className: 'bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group' }, [
        React.createElement('div', { className: 'text-3xl mb-4 group-hover:scale-110 transition-transform' }, '🏢'),
        React.createElement('h4', { className: 'text-xl font-black text-slate-800 mb-1' }, c.name),
        React.createElement('p', { className: 'text-xs text-slate-400 mb-8 font-bold' }, `User: ${c.user}`),
        React.createElement('button', { onClick: () => onSelect(c.id), className: 'w-full py-3 bg-slate-50 text-indigo-600 font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm' }, 'Entrar al Panel')
    ])))
  ]);
}
