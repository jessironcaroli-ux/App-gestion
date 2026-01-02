
import React from 'react';

const AdminMasterView = ({ clients, onSelectClient }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Panel de Control Maestro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-800 mb-1">{client.businessName}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mb-4">User: {client.username}</p>
            <div className="flex justify-between items-end border-t pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Ganancia Neta</p>
                <p className={`text-xl font-black ${client.metrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${client.metrics.netProfit.toLocaleString()}
                </p>
              </div>
              <button onClick={() => onSelectClient(client.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200">Gestionar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminMasterView;
