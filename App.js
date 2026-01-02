
import React, { useState, useEffect, useMemo } from 'react';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import AdminView from './components/AdminView.js';
import Forms from './components/Forms.js';
import Simulation from './components/Simulation.js';
import AIAdvisor from './components/AIAdvisor.js';
import { UserRole, ExpenseType } from './types.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState(null);
  
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('finance_pyme_pro_v3');
    return saved ? JSON.parse(saved) : {
      clients: {
        'demo-id': { id: 'demo-id', name: 'Empresa Demo S.A.', user: 'pyme', pass: '123', sales: [], expenses: [] }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('finance_pyme_pro_v3', JSON.stringify(data));
  }, [data]);

  const handleLogin = (u, p) => {
    if (u === 'admin' && p === 'admin') {
      setUser({ role: UserRole.ADMIN, name: 'Administrador Maestro' });
      setActiveTab('admin');
    } else {
      const client = Object.values(data.clients).find(c => c.user === u && c.pass === p);
      if (client) {
        setUser({ role: UserRole.CLIENT, name: client.name, clientId: client.id });
        setSelectedClientId(client.id);
        setActiveTab('dashboard');
      } else {
        alert('Credenciales inválidas. Admin: admin/admin | Demo: pyme/123');
      }
    }
  };

  const currentClient = selectedClientId ? data.clients[selectedClientId] : null;

  const metrics = useMemo(() => {
    if (!currentClient) return null;
    const totalSales = (currentClient.sales || []).reduce((acc, s) => acc + (s.price * s.qty), 0);
    const fixedExpenses = (currentClient.expenses || []).filter(e => e.type === ExpenseType.FIXED).reduce((acc, e) => acc + e.amount, 0);
    const variableExpenses = (currentClient.expenses || []).filter(e => e.type === ExpenseType.VARIABLE).reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalSales - fixedExpenses - variableExpenses;
    const margin = totalSales > 0 ? (netProfit / totalSales) : 0;
    
    return { totalSales, fixedExpenses, variableExpenses, netProfit, margin };
  }, [currentClient]);

  const addClient = (c) => {
    const id = 'c-' + Date.now();
    setData(prev => ({ ...prev, clients: { ...prev.clients, [id]: { ...c, id, sales: [], expenses: [] } } }));
  };

  const updateClientData = (type, item) => {
    if (!selectedClientId) return;
    setData(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [selectedClientId]: {
          ...prev.clients[selectedClientId],
          [type]: [...(prev.clients[selectedClientId][type] || []), { ...item, id: Date.now() }]
        }
      }
    }));
  };

  if (!user) return React.createElement(Login, { onLogin: handleLogin });

  return React.createElement('div', { className: 'min-h-screen flex flex-col bg-slate-50' }, [
    React.createElement('header', { key: 'h', className: 'bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-xl z-20' }, [
      React.createElement('div', { className: 'flex items-center gap-4' }, [
        React.createElement('div', { className: 'bg-indigo-600 p-2 rounded-lg font-black' }, 'FP'),
        React.createElement('div', null, [
          React.createElement('h1', { className: 'text-lg font-bold' }, 'FinancePro'),
          React.createElement('p', { className: 'text-[10px] text-slate-400 font-bold uppercase tracking-widest' }, user.role === UserRole.ADMIN ? 'Panel Maestro' : currentClient?.name)
        ])
      ]),
      React.createElement('button', { onClick: () => setUser(null), className: 'text-xs font-bold bg-slate-800 px-4 py-2 rounded-xl hover:bg-rose-600 transition-all' }, 'Salir')
    ]),

    React.createElement('div', { key: 'main-layout', className: 'flex flex-1 overflow-hidden' }, [
      React.createElement('aside', { key: 'sidebar', className: 'w-64 bg-white border-r p-6 space-y-2 hidden md:block' }, [
        user.role === UserRole.ADMIN && React.createElement('button', { onClick: () => { setActiveTab('admin'); setSelectedClientId(null); }, className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '🏢 Empresas'),
        selectedClientId && [
          React.createElement('button', { key: 't1', onClick: () => setActiveTab('dashboard'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '📊 Dashboard'),
          React.createElement('button', { key: 't2', onClick: () => setActiveTab('forms'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'forms' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '📝 Movimientos'),
          React.createElement('button', { key: 't3', onClick: () => setActiveTab('sim'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'sim' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '🧪 Simulador'),
          React.createElement('button', { key: 't4', onClick: () => setActiveTab('ai'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '🤖 Analista IA')
        ]
      ]),
      React.createElement('main', { key: 'content', className: 'flex-1 overflow-y-auto p-8' }, [
        activeTab === 'admin' && React.createElement(AdminView, { clients: Object.values(data.clients), onAdd: addClient, onSelect: (id) => { setSelectedClientId(id); setActiveTab('dashboard'); } }),
        activeTab === 'dashboard' && metrics && React.createElement(Dashboard, { metrics, name: currentClient.name }),
        activeTab === 'forms' && React.createElement(Forms, { sales: currentClient?.sales || [], expenses: currentClient?.expenses || [], onAdd: updateClientData }),
        activeTab === 'sim' && metrics && React.createElement(Simulation, { metrics }),
        activeTab === 'ai' && metrics && React.createElement(AIAdvisor, { metrics })
      ])
    ])
  ]);
}
