
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(u, p);
  };

  return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-slate-900 p-6' }, [
    React.createElement('div', { key: 'card', className: 'max-w-md w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in duration-300' }, [
      React.createElement('div', { key: 'logo', className: 'w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-6' }, 'F'),
      React.createElement('h2', { key: 'title', className: 'text-2xl font-black text-slate-800 mb-2' }, 'FinancePro'),
      React.createElement('p', { key: 'subtitle', className: 'text-slate-400 text-sm mb-8 font-medium' }, 'Ingresa tus credenciales de acceso'),
      React.createElement('form', { key: 'form', onSubmit: handleSubmit, className: 'space-y-4' }, [
        React.createElement('input', { key: 'user', value: u, onChange: e => setU(e.target.value), placeholder: 'Usuario', className: 'w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold' }),
        React.createElement('input', { key: 'pass', type: 'password', value: p, onChange: e => setP(e.target.value), placeholder: 'Contraseña', className: 'w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold' }),
        React.createElement('button', { key: 'btn', className: 'w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-indigo-600 transition-all shadow-lg mt-4 active:scale-95' }, 'Entrar al Sistema')
      ]),
      React.createElement('div', { key: 'info', className: 'mt-10 pt-6 border-t border-slate-50' }, [
        React.createElement('p', { className: 'text-[9px] text-slate-400 font-bold uppercase tracking-widest' }, 'Business Intelligence para Pymes')
      ])
    ])
  ]);
}
