
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
      const saved = localStorage.getItem('finance_pro_fix_v1');
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    } catch (e) {
      return DEFAULT_CLIENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('finance_pro_fix_v1', JSON.stringify(clientsData));
  }, [clientsData]);

  const calculateMetrics = (clientId) => {
    const data = clientsData[clientId];
    if (!data) return { totalSales: 0, fixedExpenses: 0, variableExpenses: 0, netProfit: 0, margin: 0 };
    
    const totalSales = (data.sales || []).reduce((acc, s) => acc + ((s.price || 0) * (s.qty || 0)), 0);
    const fixedExpenses = (data.expenses || []).filter(e => e.type === ExpenseType.FIXED).reduce((acc, e) => acc + (e.amount || 0), 0);
    const variableExpenses = (data.expenses || []).filter(e => e.type === ExpenseType.VARIABLE).reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = totalSales - fixedExpenses - variableExpenses;
    const margin = totalSales > 0 ? netProfit / totalSales : 0;
    
    return { totalSales, fixedExpenses, variableExpenses, netProfit, margin };
  };

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setCurrentUser({ role: UserRole.ADMIN, username: 'Administrador' });
      setActiveTab('master');
      setSelectedClientId(null);
      return;
    }

    const client = Object.values(clientsData).find(c => c.username === username && c.password === password);
    if (client) {
      setCurrentUser({ role: UserRole.CLIENT, username: client.username, clientId: client.id });
      setSelectedClientId(client.id);
      setActiveTab('dashboard');
    } else {
      alert("Credenciales incorrectas. Usá admin/admin o pyme1/123");
    }
  };

  const currentMetrics = useMemo(() => {
    if (!selectedClientId || !clientsData[selectedClientId]) return null;
    return calculateMetrics(selectedClientId);
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

  const handleAddClient = (newClient) => {
    const id = `client-${Date.now()}`;
    setClientsData(prev => ({
      ...prev,
      [id]: { ...newClient, id, expenses: [], sales: [], investments: [] }
    }));
  };

  const handleDeleteClient = (id) => {
    const newData = { ...clientsData };
    delete newData[id];
    setClientsData(newData);
    if (selectedClientId === id) setSelectedClientId(null);
  };

  if (!currentUser) return React.createElement(Login, { onLogin: handleLogin });

  const currentClient = clientsData[selectedClientId];

  return React.createElement('div', { className: 'flex flex-col h-screen bg-slate-50' }, [
    React.createElement('header', { key: 'h', className: 'bg-slate-900 text-white px-8 py-4 flex justify-between items-center shrink-0 z-30 shadow-2xl' }, [
      React.createElement('div', { className: 'flex items-center space-x-4' }, [
        React.createElement('span', { className: 'text-2xl font-black bg-indigo-600 px-3 py-1 rounded-xl' }, 'F'),
        React.createElement('h1', { className: 'text-xl font-bold' }, selectedClientId ? currentClient?.businessName : 'Panel Maestro')
      ]),
      React.createElement('button', { onClick: () => { setCurrentUser(null); setSelectedClientId(null); }, className: 'text-sm font-bold bg-slate-800 px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors' }, 'Cerrar Sesión')
    ]),

    React.createElement('div', { key: 'body', className: 'flex flex-1 overflow-hidden' }, [
      React.createElement('aside', { key: 'sidebar', className: 'w-64 bg-white border-r p-6 space-y-2 shrink-0 z-20' }, [
        currentUser.role === UserRole.ADMIN && React.createElement('button', { onClick: () => { setActiveTab('master'); setSelectedClientId(null); }, className: `w-full text-left p-3 rounded-xl font-bold transition-all ${activeTab === 'master' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '🏢 Empresas'),
        selectedClientId && [
          React.createElement('button', { key: 't1', onClick: () => setActiveTab('dashboard'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '📊 Dashboard'),
          React.createElement('button', { key: 't2', onClick: () => setActiveTab('forms'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'forms' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '📝 Cargar Datos'),
          React.createElement('button', { key: 't3', onClick: () => setActiveTab('simulation'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '🧪 Simulador'),
          React.createElement('button', { key: 't4', onClick: () => setActiveTab('ai'), className: `w-full text-left p-3 rounded-xl font-bold ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '🤖 Analista IA')
        ]
      ]),

      React.createElement('main', { key: 'main', className: 'flex-1 overflow-y-auto p-8 bg-slate-50' }, [
        activeTab === 'master' && React.createElement(AdminMasterView, { 
          clients: Object.values(clientsData).map(c => ({ ...c, metrics: calculateMetrics(c.id) })),
          onSelectClient: (id) => { setSelectedClientId(id); setActiveTab('dashboard'); },
          onAddClient: handleAddClient,
          onDeleteClient: handleDeleteClient
        }),
        selectedClientId && activeTab === 'dashboard' && React.createElement(Dashboard, { metrics: currentMetrics, name: currentClient?.businessName }),
        selectedClientId && activeTab === 'forms' && React.createElement(Forms, { sales: currentClient?.sales || [], expenses: currentClient?.expenses || [], onAdd: handleAddData }),
        selectedClientId && activeTab === 'simulation' && React.createElement(SimulationPanel, { metrics: currentMetrics }),
        selectedClientId && activeTab === 'ai' && React.createElement('div', { className: 'max-w-4xl mx-auto space-y-6 text-center' }, [
          React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border shadow-sm' }, [
            React.createElement('div', { className: 'text-6xl mb-4' }, '🤖'),
            React.createElement('h3', { className: 'text-2xl font-black mb-4' }, 'Consultoría Gemini IA'),
            React.createElement('button', { 
              onClick: async () => {
                setIsGenerating(true);
                const advice = await getFinancialAdvice(currentMetrics);
                setAiReport(advice);
                setIsGenerating(false);
              }, 
              disabled: isGenerating,
              className: 'px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl' 
            }, isGenerating ? 'Analizando...' : 'Generar Reporte'),
            aiReport && React.createElement('div', { className: 'mt-8 bg-slate-50 p-8 rounded-2xl text-left whitespace-pre-wrap leading-relaxed' }, aiReport)
          ])
        ])
      ])
    ])
  ]);
};

export default App;
