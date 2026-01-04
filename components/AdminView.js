
import React, { useState } from 'react';

export default function AdminView({ clients, onAdd, onSelect }) {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if(name && user && pass) {
      onAdd({ name, user, pass });
      setName(''); setUser(''); setPass('');
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Panel Maestro</h2>
          <p className="text-slate-500 font-medium">Gestiona el acceso de tus empresas clientes.</p>
        </div>
      </header>
      
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center">
          <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3 text-indigo-600">+</span>
          Nueva Pyme / Cliente
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 ml-1">NOMBRE COMERCIAL</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Tech Solutions" className="excel-input" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 ml-1">USUARIO DE ACCESO</label>
            <input required value={user} onChange={e => setUser(e.target.value)} placeholder="user_tech" className="excel-input" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 ml-1">CONTRASEÑA</label>
            <input required type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="****" className="excel-input" />
          </div>
          <button type="submit" className="bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
            Dar de Alta
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map(c => (
          <div key={c.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {c.name.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Utilidad Proyectada</p>
                <p className={`text-lg font-black ${c.metrics.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ${c.metrics.netProfit.toLocaleString()}
                </p>
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-1">{c.name}</h4>
            <p className="text-xs text-slate-400 mb-8 font-bold uppercase tracking-widest">User: {c.user}</p>
            
            <button 
                onClick={() => onSelect(c.id)} 
                className="mt-auto w-full py-4 bg-slate-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group-hover:shadow-md"
            >
                Abrir Dashboard
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
