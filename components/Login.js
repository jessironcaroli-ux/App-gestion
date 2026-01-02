
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');

  return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-slate-900 p-6' }, [
    React.createElement('div', { className: 'max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-2xl' }, [
      React.createElement('div', { className: 'w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-6' }, 'F'),
      React.createElement('h2', { className: 'text-2xl font-black text-slate-800 mb-8' }, 'FinancePro'),
      React.createElement('form', { onSubmit: (e) => { e.preventDefault(); onLogin(u, p); }, className: 'space-y-4' }, [
        React.createElement('input', { value: u, onChange: e => setU(e.target.value), placeholder: 'Usuario', className: 'w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold' }),
        React.createElement('input', { type: 'password', value: p, onChange: e => setP(e.target.value), placeholder: 'Contraseña', className: 'w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold' }),
        React.createElement('button', { className: 'w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-indigo-600 transition-all shadow-lg mt-4' }, 'Entrar al Sistema')
      ]),
      React.createElement('p', { className: 'mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest' }, 'Gestión Financiera de Alto Nivel')
    ])
  ]);
}
