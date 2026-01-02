
import React, { useState, useMemo, useEffect } from 'react';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import SimulationPanel from './components/SimulationPanel.js';
import AdminMasterView from './components/AdminMasterView.js';
import Forms from './components/Forms.js';
import { getFinancialAdvice } from './services/geminiService.js';
import { UserRole, ExpenseType } from './types.js';

const DEFAULT_CLIENTS = {
  'pyme-demo': { 
    id: 'pyme-demo',
    businessName: 'Empresa Demo S.A.', 
    username: 'pyme1',
    password: '123',
    expenses: [], 
    sales: [], 
    investments: [] 
  }
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [clientsData, setClientsData] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_pro_v4_data');
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    } catch (e) {
      return DEFAULT_CLIENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('finance_pro_v4_data', JSON.stringify(clientsData));
  }, [clientsData]);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setCurrentUser({ role: UserRole.ADMIN, username: 'Administrador' });
      setActiveTab('master');
      return;
    }

    const client = Object.values(clientsData).find(c => c.username === username && c.password === password);
    if (client) {
      setCurrentUser({ role: UserRole.CLIENT, username: client.username, clientId: client.id });
      setSelectedClientId(client.id);
      setActiveTab('dashboard');
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const calculateMetrics = (clientId) => {
    const data = clientsData[clientId];
    if (!data) return null;

    const totalSales = (data.sales || []).reduce((acc, s) => acc + (s.price * s.qty), 0);
    const fixedExpenses = (data.expenses || []).filter(e => e.type === ExpenseType.FIXED).reduce((acc, e) => acc + e.amount, 0);
    const variableExpenses = (data.expenses || []).filter(e => e.type === ExpenseType.VARIABLE).reduce((acc, e) => acc + e.amount, 0);
    
    const netProfit = totalSales - fixedExpenses - variableExpenses;
    const margin = totalSales > 0 ? netProfit / totalSales : 0;

    return { totalSales, fixedExpenses, variableExpenses, netProfit, margin };
  };

  const currentMetrics = useMemo(() => {
    return selectedClientId ? calculateMetrics(selectedClientId) : null;
  }, [selectedClientId, clientsData]);

  const handleAddData = (type, item) => {
    setClientsData(prev => ({
      ...prev,
      [selectedClientId]: {
        ...prev[selectedClientId],
        [type]: [...(prev[selectedClientId][type] || []), { ...item, id: Date.now() }]
      }
    }));
  };

  const handleGetAIAdvice = async () => {
    if (!currentMetrics) return;
    setIsGenerating(true);
    const advice = await getFinancialAdvice(currentMetrics);
    setAiReport(advice);
    setIsGenerating(false);
  };

  if (!currentUser) return React.createElement(Login, { onLogin: handleLogin });

  return React.createElement('div', { className: 'flex flex-col h-screen bg-slate-50' }, [
    React.createElement('header', { key: 'h', className: 'bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg' }, [
      React.createElement('div', { className: 'flex items-center space-x-4' }, [
        React.createElement('span', { className: 'text-2xl font-black bg-indigo-600 px-3 py-1 rounded-xl' }, 'F'),
        React.createElement('h1', { className: 'text-xl font-bold' }, `FinancePro - ${selectedClientId ? clientsData[selectedClientId].businessName : 'Admin'}`)
      ]),
      React.createElement('button', { onClick: () => { setCurrentUser(null); setSelectedClientId(null); }, className: 'text-sm font-bold bg-slate-800 px-4 py-2 rounded-xl hover:bg-rose-600' }, 'Cerrar Sesión')
    ]),

    React.createElement('div', { key: 'b', className: 'flex flex-1 overflow-hidden' }, [
      React.createElement('aside', { key: 's', className: 'w-64 bg-white border-r p-6 space-y-2' }, [
        currentUser.role === UserRole.ADMIN && React.createElement('button', { onClick: () => { setActiveTab('master'); setSelectedClientId(null); }, className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'master' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '🏢 Empresas'),
        selectedClientId && [
          React.createElement('button', { key: 't1', onClick: () => setActiveTab('dashboard'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '📊 Dashboard'),
          React.createElement('button', { key: 't2', onClick: () => setActiveTab('forms'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'forms' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '📝 Datos'),
          React.createElement('button', { key: 't3', onClick: () => setActiveTab('simulation'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '🧪 Simulador'),
          React.createElement('button', { key: 't4', onClick: () => setActiveTab('ai'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-500'}` }, '🤖 Analista IA')
        ]
      ]),

      React.createElement('main', { key: 'm', className: 'flex-1 overflow-y-auto p-8' }, [
        activeTab === 'master' && React.createElement(AdminMasterView, { 
          clients: Object.values(clientsData).map(c => ({ ...c, metrics: calculateMetrics(c.id) })),
          onSelectClient: (id) => { setSelectedClientId(id); setActiveTab('dashboard'); }
        }),
        activeTab === 'dashboard' && React.createElement(Dashboard, { metrics: currentMetrics, name: clientsData[selectedClientId]?.businessName }),
        activeTab === 'forms' && React.createElement(Forms, { 
          sales: clientsData[selectedClientId]?.sales || [], 
          expenses: clientsData[selectedClientId]?.expenses || [], 
          onAdd: handleAddData 
        }),
        activeTab === 'simulation' && React.createElement(SimulationPanel, { metrics: currentMetrics }),
        activeTab === 'ai' && React.createElement('div', { className: 'space-y-6 text-center' }, [
          React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border shadow-sm' }, [
            React.createElement('div', { className: 'text-6xl mb-4' }, '🤖'),
            React.createElement('h3', { className: 'text-2xl font-black mb-4' }, 'Consultoría con IA'),
            React.createElement('button', { onClick: handleGetAIAdvice, disabled: isGenerating, className: 'px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all' }, isGenerating ? 'Analizando...' : 'Generar Reporte')
          ]),
          aiReport && React.createElement('div', { className: 'bg-white p-10 rounded-[2rem] border shadow-sm text-left whitespace-pre-wrap' }, aiReport)
        ])
      ])
    ])
  ]);
};

export default App;
