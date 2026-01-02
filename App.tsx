
import React, { useState, useMemo, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SimulationPanel from './components/SimulationPanel';
import Login from './components/Login';
import AdminMasterView from './components/AdminMasterView';
import { ExpenseForm, SalesForm, InvestmentForm } from './components/Forms';
import { Expense, ProductSale, FinancialSummary, ExpenseType, UserRole, ClientData, Investment, InvestmentYield, AppConfig } from './types';
import { getFinancialAdvice } from './services/geminiService';

const DEFAULT_CLIENTS: Record<string, ClientData> = {
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{role: UserRole, username: string, clientId?: string} | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem('finance_pro_config');
      return saved ? JSON.parse(saved) : { publicUrl: window.location.origin };
    } catch {
      return { publicUrl: window.location.origin };
    }
  });

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compStartDate, setCompStartDate] = useState('');
  const [compEndDate, setCompEndDate] = useState('');

  const [clientsData, setClientsData] = useState<Record<string, ClientData>>(() => {
    try {
      const saved = localStorage.getItem('finance_pro_data_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Datos corruptos detectados, cargando valores por defecto.");
    }
    return DEFAULT_CLIENTS;
  });

  useEffect(() => {
    localStorage.setItem('finance_pro_data_v4', JSON.stringify(clientsData));
  }, [clientsData]);

  useEffect(() => {
    localStorage.setItem('finance_pro_config', JSON.stringify(config));
  }, [config]);

  const handleLogin = (role: UserRole, username: string, clientId?: string) => {
    setCurrentUser({ role, username, clientId });
    if (role === UserRole.CLIENT && clientId) {
      setSelectedClientId(clientId);
      setActiveTab('dashboard');
    } else {
      setActiveTab('master');
      setSelectedClientId(null);
    }
  };

  const calculateMetrics = (clientId: string, start?: string, end?: string): FinancialSummary => {
    const data = clientsData[clientId];
    const defaultMetrics = { totalRevenue:0, totalFixedCosts:0, totalVariableCosts:0, netProfit:0, marginalContribution:0, marginalContributionPercentage:0, breakEvenPoint:0, profitMargin:0, totalAssetsValue:0, totalInvestmentYields:0 };
    
    if (!data) return defaultMetrics;
    
    const filterByDate = (item: { date: string }) => {
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
    const marginalContributionPercentage = totalRevenue > 0 ? marginalContribution / totalRevenue : 0;
    const breakEvenPoint = marginalContributionPercentage > 0 ? totalFixedCosts / marginalContributionPercentage : 0;
    const profitMargin = totalRevenue > 0 ? netProfit / totalRevenue : 0;
    
    const totalAssetsValue = (data.investments || []).reduce((acc, inv) => acc + inv.initialValue, 0);
    const totalInvestmentYields = (data.investments || []).reduce((acc, inv) => 
      acc + (inv.yields || []).filter(filterByDate).reduce((yAcc, y) => yAcc + y.amount, 0), 0);

    return { totalRevenue, totalFixedCosts, totalVariableCosts, netProfit, marginalContribution, marginalContributionPercentage, breakEvenPoint, profitMargin, totalAssetsValue, totalInvestmentYields };
  };

  const currentMetrics = useMemo(() => {
    if (!selectedClientId) return null;
    return calculateMetrics(selectedClientId, startDate, endDate);
  }, [selectedClientId, clientsData, startDate, endDate]);

  const comparisonMetrics = useMemo(() => {
    if (!selectedClientId || !compareEnabled || !compStartDate || !compEndDate) return undefined;
    return calculateMetrics(selectedClientId, compStartDate, compEndDate);
  }, [selectedClientId, clientsData, compareEnabled, compStartDate, compEndDate]);

  const updateClientData = (newExpenses?: Expense[], newSales?: ProductSale[], newInvestments?: Investment[]) => {
    if (!selectedClientId) return;
    setClientsData(prev => ({
      ...prev,
      [selectedClientId]: {
        ...prev[selectedClientId],
        expenses: newExpenses || prev[selectedClientId].expenses || [],
        sales: newSales || prev[selectedClientId].sales || [],
        investments: newInvestments || prev[selectedClientId].investments || []
      }
    }));
  };

  const handleAddClient = (client: Partial<ClientData>) => {
    const id = `client-${Date.now()}`;
    setClientsData(prev => ({
      ...prev,
      [id]: {
        id,
        businessName: client.businessName || 'Nueva Empresa',
        username: client.username || 'user',
        password: client.password || '123',
        expenses: [],
        sales: [],
        investments: []
      }
    }));
  };

  const handleUpdateClient = (id: string, updated: Partial<ClientData>) => {
    setClientsData(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updated }
    }));
  };

  const handleDeleteClient = (id: string) => {
    const newData = { ...clientsData };
    delete newData[id];
    setClientsData(newData);
  };

  const handleAddYield = (invId: string, yieldData: InvestmentYield) => {
    if (!selectedClientId) return;
    const updatedInvs = (clientsData[selectedClientId].investments || []).map(inv => 
      inv.id === invId ? { ...inv, yields: [...(inv.yields || []), yieldData] } : inv
    );
    updateClientData(undefined, undefined, updatedInvs);
  };

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGetAIAdvice = async () => {
    if (!selectedClientId || !currentMetrics) return;
    setIsGenerating(true);
    const advice = await getFinancialAdvice(
      currentMetrics, 
      clientsData[selectedClientId].expenses || [], 
      clientsData[selectedClientId].sales || [],
      clientsData[selectedClientId].investments || []
    );
    setAiReport(advice);
    setIsGenerating(false);
  };

  if (!currentUser) return <Login onLogin={handleLogin} clients={clientsData} />;
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isClient = currentUser.role === UserRole.CLIENT;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
        <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shrink-0 shadow-lg z-20">
            <div className="flex items-center space-x-4">
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-blue-400 to-indigo-600 px-3 py-1 rounded-xl shadow-inner shadow-black/20 text-white">FP</span>
                <h1 className="text-xl font-bold">FinancePro <span className="text-slate-400 font-medium ml-2 border-l border-slate-700 pl-4">{isAdmin && !selectedClientId ? 'Gestión Maestra' : clientsData[selectedClientId!]?.businessName}</span></h1>
            </div>
            <div className="flex items-center space-x-6">
                <button onClick={() => setCurrentUser(null)} className="text-sm font-bold bg-slate-800 px-4 py-2 rounded-xl hover:bg-rose-600/20 hover:text-rose-400 transition-all text-white">Salir</button>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 space-y-2 hidden md:flex flex-col shrink-0">
                {isAdmin && (
                    <button onClick={() => { setActiveTab('master'); setSelectedClientId(null); }} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'master' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <span className="text-lg">🏢</span> <span className="font-bold">Empresas</span>
                    </button>
                )}
                {selectedClientId && (
                    <>
                        <div className="pt-6 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestión</div>
                        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}><span>📊</span> <span className="font-bold">Resumen</span></button>
                        <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'sales' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}><span>📈</span> <span className="font-bold">Ingresos</span></button>
                        <button onClick={() => setActiveTab('expenses')} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'expenses' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}><span>💸</span> <span className="font-bold">Egresos</span></button>
                        <button onClick={() => setActiveTab('investments')} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'investments' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}><span>💎</span> <span className="font-bold">Activos</span></button>
                        
                        <div className="pt-6 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Consultoría</div>
                        <button onClick={() => setActiveTab('simulation')} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}><span>🧪</span> <span className="font-bold">Escenarios</span></button>
                        <button onClick={() => setActiveTab('ai-advisor')} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${activeTab === 'ai-advisor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}><span>🤖</span> <span className="font-bold">Analista IA</span></button>
                    </>
                )}
            </aside>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                {selectedClientId && (
                    <div className="mb-6 p-4 md:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Desde</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-50 border-none rounded-xl text-xs md:text-sm font-bold p-2 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Hasta</label>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-50 border-none rounded-xl text-xs md:text-sm font-bold p-2 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="flex flex-col items-center justify-end h-full pt-4">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input type="checkbox" checked={compareEnabled} onChange={e => setCompareEnabled(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-[10px] md:text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Comparar periodos</span>
                                    </label>
                                </div>
                            </div>

                            {compareEnabled && (
                                <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <div className="text-indigo-600 font-bold text-[10px] uppercase pr-2 border-r border-indigo-200 px-2">Referencia</div>
                                    <input type="date" value={compStartDate} onChange={e => setCompStartDate(e.target.value)} className="bg-white border-none rounded-xl text-[10px] md:text-sm font-bold p-1 md:p-2" />
                                    <input type="date" value={compEndDate} onChange={e => setCompEndDate(e.target.value)} className="bg-white border-none rounded-xl text-[10px] md:text-sm font-bold p-1 md:p-2" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'master' && isAdmin && (
                    <AdminMasterView 
                        config={config}
                        onUpdateConfig={setConfig}
                        clients={Object.keys(clientsData).map(id => ({ 
                            id, 
                            name: clientsData[id].businessName, 
                            username: clientsData[id].username,
                            password: clientsData[id].password,
                            metrics: calculateMetrics(id, startDate, endDate) 
                        }))} 
                        onSelectClient={(id) => { setSelectedClientId(id); setActiveTab('dashboard'); }} 
                        onAddClient={handleAddClient}
                        onUpdateClient={handleUpdateClient}
                        onDeleteClient={handleDeleteClient}
                    />
                )}

                {selectedClientId && (
                    <div className="max-w-6xl mx-auto pb-20">
                        {activeTab === 'dashboard' && currentMetrics && <Dashboard summary={currentMetrics} compareSummary={comparisonMetrics} clientMode={isClient} />}
                        {activeTab === 'expenses' && <ExpenseForm expenses={clientsData[selectedClientId].expenses || []} onAdd={exp => updateClientData([...(clientsData[selectedClientId].expenses || []), exp], undefined)} onRemove={id => updateClientData((clientsData[selectedClientId].expenses || []).filter(e => e.id !== id), undefined)} />}
                        {activeTab === 'sales' && <SalesForm sales={clientsData[selectedClientId].sales || []} onAdd={sale => updateClientData(undefined, [...(clientsData[selectedClientId].sales || []), sale])} onRemove={id => updateClientData(undefined, (clientsData[selectedClientId].sales || []).filter(s => s.id !== id))} />}
                        {activeTab === 'investments' && (
                            <InvestmentForm 
                                investments={clientsData[selectedClientId].investments || []} 
                                onAdd={inv => updateClientData(undefined, undefined, [...(clientsData[selectedClientId].investments || []), inv])}
                                onAddYield={handleAddYield}
                                onRemove={id => updateClientData(undefined, undefined, (clientsData[selectedClientId].investments || []).filter(i => i.id !== id))}
                            />
                        )}
                        {activeTab === 'simulation' && currentMetrics && <SimulationPanel summary={currentMetrics} sales={clientsData[selectedClientId].sales || []} />}
                        {activeTab === 'ai-advisor' && (
                            <div className="space-y-6">
                                <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-200 text-center">
                                    <div className="text-4xl md:text-6xl mb-6">🤖</div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight">Analista de Negocios IA</h3>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Gemini analizará tu rentabilidad, estructura de costos y portafolio para darte consejos estratégicos.</p>
                                    <button onClick={handleGetAIAdvice} disabled={isGenerating} className={`px-12 py-5 rounded-3xl font-black text-white shadow-2xl transition-all ${isGenerating ? 'bg-slate-400' : 'bg-gradient-to-br from-indigo-600 to-blue-700 hover:scale-105 active:scale-95'}`}>{isGenerating ? 'Analizando...' : 'Generar Reporte Estratégico'}</button>
                                </div>
                                {aiReport && (
                                    <div className="bg-white p-6 md:p-12 rounded-[2rem] shadow-sm border border-slate-200 prose prose-slate max-w-none">
                                        <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                                            {aiReport}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};

export default App;
