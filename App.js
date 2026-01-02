
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

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compStartDate, setCompStartDate] = useState('');
  const [compEndDate, setCompEndDate] = useState('');

  const [clientsData, setClientsData] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_pro_data_v4');
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    } catch (e) {
      return DEFAULT_CLIENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('finance_pro_data_v4', JSON.stringify(clientsData));
  }, [clientsData]);

  const handleLogin = (role, username, clientId) => {
    setCurrentUser({ role, username, clientId });
    if (role === UserRole.CLIENT && clientId) {
      setSelectedClientId(clientId);
      setActiveTab('dashboard');
    } else {
      setActiveTab('master');
      setSelectedClientId(null);
    }
  };

  const calculateMetrics = (clientId, start, end) => {
    const data = clientsData[clientId];
    if (!data) return { totalRevenue:0, totalFixedCosts:0, totalVariableCosts:0, netProfit:0, marginalContribution:0, marginalContributionPercentage:0, breakEvenPoint:0, profitMargin:0, totalAssetsValue:0, totalInvestmentYields:0 };
    
    const filterByDate = (item) => {
      if (!start || !end) return true;
      return item.date >= start && item.date <= end;
    };

    const filteredExpenses = (data.expenses || []).filter(filterByDate);
    const filteredSales = (data.sales || []).filter(filterByDate);
    
    const totalRevenue = filteredSales.reduce((acc, s) => acc + (s.price * s.quantity), 0);
    const totalFixedCosts = filteredExpenses.filter(e => e.type === ExpenseType.FIXED).reduce((acc, e) => acc + e.amount, 0);
    const productVariableCosts = filteredSales.reduce((acc, s) => acc + (s.variableCostPerUnit * s.quantity), 0);
    const genericVariableCosts = filteredExpenses.filter(e => e.type === ExpenseType.VARIABLE).reduce((acc, e) => acc + e.amount, 0);
    const totalVariableCosts = productVariableCosts + genericVariableCosts;
    const marginalContribution = totalRevenue - totalVariableCosts;
    const netProfit = marginalContribution - totalFixedCosts;
    const profitMargin = totalRevenue > 0 ? netProfit / totalRevenue : 0;
    
    return { 
      totalRevenue, 
      totalFixedCosts, 
      totalVariableCosts, 
      netProfit, 
      profitMargin,
      marginalContributionPercentage: totalRevenue > 0 ? marginalContribution / totalRevenue : 0,
      breakEvenPoint: (totalRevenue > 0 && (marginalContribution / totalRevenue) > 0) ? totalFixedCosts / (marginalContribution / totalRevenue) : 0,
      totalAssetsValue: (data.investments || []).reduce((acc, inv) => acc + inv.initialValue, 0),
      totalInvestmentYields: (data.investments || []).reduce((acc, inv) => 
        acc + (inv.yields || []).filter(filterByDate).reduce((yAcc, y) => yAcc + y.amount, 0), 0)
    };
  };

  const currentMetrics = useMemo(() => {
    if (!selectedClientId) return null;
    return calculateMetrics(selectedClientId, startDate, endDate);
  }, [selectedClientId, clientsData, startDate, endDate]);

  const comparisonMetrics = useMemo(() => {
    if (!selectedClientId || !compareEnabled || !compStartDate || !compEndDate) return null;
    return calculateMetrics(selectedClientId, compStartDate, compEndDate);
  }, [selectedClientId, clientsData, compareEnabled, compStartDate, compEndDate]);

  const updateClientData = (type, items) => {
    if (!selectedClientId) return;
    setClientsData(prev => ({
      ...prev,
      [selectedClientId]: {
        ...prev[selectedClientId],
        [type]: items
      }
    }));
  };

  const [aiReport, setAiReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGetAIAdvice = async () => {
    if (!selectedClientId || !currentMetrics) return;
    setIsGenerating(true);
    const advice = await getFinancialAdvice(
      currentMetrics, 
      clientsData[selectedClientId].expenses || [], 
      clientsData[selectedClientId].sales || []
    );
    setAiReport(advice);
    setIsGenerating(false);
  };

  if (!currentUser) return React.createElement(Login, { onLogin: handleLogin, clients: clientsData });

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return React.createElement('div', { className: 'flex flex-col h-screen bg-slate-50' }, [
    React.createElement('header', { key: 'header', className: 'bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg z-20' }, [
      React.createElement('div', { className: 'flex items-center space-x-4' }, [
        React.createElement('span', { className: 'text-2xl font-black bg-indigo-600 px-3 py-1 rounded-xl' }, 'FP'),
        React.createElement('h1', { className: 'text-xl font-bold' }, [
          'FinancePro ',
          React.createElement('span', { className: 'text-slate-400 font-medium ml-2 border-l border-slate-700 pl-4' }, 
            isAdmin && !selectedClientId ? 'Gestión Maestra' : clientsData[selectedClientId]?.businessName
          )
        ])
      ]),
      React.createElement('button', { onClick: () => setCurrentUser(null), className: 'text-sm font-bold bg-slate-800 px-4 py-2 rounded-xl hover:bg-rose-600 transition-all' }, 'Salir')
    ]),

    React.createElement('div', { key: 'body', className: 'flex flex-1 overflow-hidden' }, [
      React.createElement('aside', { key: 'sidebar', className: 'w-64 bg-white border-r p-6 space-y-2 hidden md:flex flex-col' }, [
        isAdmin && React.createElement('button', { onClick: () => { setActiveTab('master'); setSelectedClientId(null); }, className: `w-full text-left p-3 rounded-2xl font-bold transition-all ${activeTab === 'master' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '🏢 Empresas'),
        selectedClientId && [
          React.createElement('button', { key: 't1', onClick: () => setActiveTab('dashboard'), className: `w-full text-left p-3 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '📊 Resumen'),
          React.createElement('button', { key: 't2', onClick: () => setActiveTab('forms'), className: `w-full text-left p-3 rounded-2xl font-bold transition-all ${activeTab === 'forms' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '📝 Movimientos'),
          React.createElement('button', { key: 't3', onClick: () => setActiveTab('simulation'), className: `w-full text-left p-3 rounded-2xl font-bold transition-all ${activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '🧪 Escenarios'),
          React.createElement('button', { key: 't4', onClick: () => setActiveTab('ai-advisor'), className: `w-full text-left p-3 rounded-2xl font-bold transition-all ${activeTab === 'ai-advisor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}` }, '🤖 Analista IA')
        ]
      ]),

      React.createElement('main', { key: 'main', className: 'flex-1 overflow-y-auto p-8' }, [
        activeTab === 'master' && isAdmin && React.createElement(AdminMasterView, { 
          clients: Object.keys(clientsData).map(id => ({ id, name: clientsData[id].businessName, username: clientsData[id].username, password: clientsData[id].password, metrics: calculateMetrics(id) })),
          onSelectClient: (id) => { setSelectedClientId(id); setActiveTab('dashboard'); }
        }),
        
        selectedClientId && [
          React.createElement('div', { key: 'filters', className: 'mb-6 p-6 bg-white rounded-3xl border shadow-sm flex flex-wrap gap-4 items-end' }, [
            React.createElement('div', null, [
              React.createElement('label', { className: 'block text-[10px] font-black text-slate-400 uppercase mb-1' }, 'Desde'),
              React.createElement('input', { type: 'date', value: startDate, onChange: e => setStartDate(e.target.value), className: 'bg-slate-50 p-2 rounded-xl text-sm font-bold border-none' })
            ]),
            React.createElement('div', null, [
              React.createElement('label', { className: 'block text-[10px] font-black text-slate-400 uppercase mb-1' }, 'Hasta'),
              React.createElement('input', { type: 'date', value: endDate, onChange: e => setEndDate(e.target.value), className: 'bg-slate-50 p-2 rounded-xl text-sm font-bold border-none' })
            ])
          ]),

          activeTab === 'dashboard' && currentMetrics && React.createElement(Dashboard, { metrics: currentMetrics, name: clientsData[selectedClientId].businessName }),
          activeTab === 'forms' && React.createElement(Forms, { 
            sales: clientsData[selectedClientId].sales || [], 
            expenses: clientsData[selectedClientId].expenses || [],
            onAdd: (type, item) => updateClientData(type, [...(clientsData[selectedClientId][type] || []), { ...item, id: Date.now() }])
          }),
          activeTab === 'simulation' && currentMetrics && React.createElement(SimulationPanel, { summary: currentMetrics, sales: clientsData[selectedClientId].sales || [] }),
          activeTab === 'ai-advisor' && React.createElement('div', { className: 'space-y-6 text-center' }, [
            React.createElement('div', { className: 'bg-white p-12 rounded-[3rem] border shadow-sm' }, [
              React.createElement('div', { className: 'text-6xl mb-4' }, '🤖'),
              React.createElement('h3', { className: 'text-2xl font-black mb-4' }, 'Consultoría con IA'),
              React.createElement('button', { onClick: handleGetAIAdvice, disabled: isGenerating, className: 'px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all' }, isGenerating ? 'Analizando...' : 'Generar Reporte')
            ]),
            aiReport && React.createElement('div', { className: 'bg-white p-10 rounded-[2rem] border shadow-sm text-left whitespace-pre-wrap' }, aiReport)
          ])
        ]
      ])
    ])
  ]);
};

export default App;
