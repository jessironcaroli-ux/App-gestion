
import React, { useState } from 'react';

const AdminMasterView = ({ clients, onSelectClient, onAddClient, onDeleteClient }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ businessName: '', username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClient(form);
    setForm({ businessName: '', username: '', password: '' });
    setShowAdd(false);
  };

  return React.createElement('div', { className: 'space-y-8 animate-in fade-in duration-300' }, [
    React.createElement('div', { key: 'h', className: 'flex justify-between items-center' }, [
      React.createElement('h2', { className: 'text-2xl font-black text-slate-800' }, 'Gestión de Empresas'),
      React.createElement('button', { 
        onClick: () => setShowAdd(!showAdd),
        className: 'bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all' 
      }, showAdd ? 'Cerrar' : 'Nueva Empresa')
    ]),

    showAdd && React.createElement('form', { key: 'f', onSubmit: handleSubmit, className: 'bg-white p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end' }, [
      React.createElement('div', { key: 'i1' }, [
        React.createElement('label', { className: 'text-[10px] font-bold text-slate-400 mb-2 block' }, 'NOMBRE COMERCIAL'),
        React.createElement('input', { required: true, value: form.businessName, onChange: e => setForm({...form, businessName: e.target.value}), className: 'excel-input', placeholder: 'Nombre Pyme' })
      ]),
      React.createElement('div', { key: 'i2' }, [
        React.createElement('label', { className: 'text-[10px] font-bold text-slate-400 mb-2 block' }, 'USUARIO'),
        React.createElement('input', { required: true, value: form.username, onChange: e => setForm({...form, username: e.target.value}), className: 'excel-input', placeholder: 'user_login' })
      ]),
      React.createElement('div', { key: 'i3' }, [
        React.createElement('label', { className: 'text-[10px] font-bold text-slate-400 mb-2 block' }, 'CONTRASEÑA'),
        React.createElement('input', { required: true, value: form.password, onChange: e => setForm({...form, password: e.target.value}), className: 'excel-input', placeholder: '****' })
      ]),
      React.createElement('button', { key: 'b', type: 'submit', className: 'bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-600 transition-all' }, 'Guardar Empresa')
    ]),

    React.createElement('div', { key: 'grid', className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' }, 
      (clients || []).map(client => 
        React.createElement('div', { key: client.id, className: 'bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all' }, [
          React.createElement('h3', { key: 'name', className: 'text-lg font-bold text-slate-800 mb-1' }, client.businessName),
          React.createElement('p', { key: 'user', className: 'text-xs text-slate-400 font-bold uppercase mb-4' }, `Acceso: ${client.username} / ${client.password}`),
          React.createElement('div', { key: 'footer', className: 'flex justify-between items-end border-t pt-4' }, [
            React.createElement('div', { key: 'metrics' }, [
              React.createElement('p', { className: 'text-[10px] font-bold text-slate-400 uppercase' }, 'Ganancia Neta'),
              React.createElement('p', { className: `text-xl font-black ${(client.metrics?.netProfit || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}` }, 
                `$${(client.metrics?.netProfit || 0).toLocaleString()}`
              )
            ]),
            React.createElement('div', { key: 'acts', className: 'flex space-x-2' }, [
              React.createElement('button', { 
                key: 'btn-e',
                onClick: () => onSelectClient(client.id), 
                className: 'bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition-all' 
              }, 'Entrar'),
              React.createElement('button', { 
                key: 'btn-d',
                onClick: () => confirm('¿Eliminar empresa?') && onDeleteClient(client.id), 
                className: 'bg-rose-50 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all' 
              }, '🗑️')
            ])
          ])
        ])
      )
    )
  ]);
};

export default AdminMasterView;
