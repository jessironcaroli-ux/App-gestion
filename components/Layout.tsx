
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'expenses', label: 'Gastos', icon: '💸' },
    { id: 'sales', label: 'Ingresos/Ventas', icon: '📈' },
    { id: 'simulation', label: 'Simulador Estratégico', icon: '🧪' },
    { id: 'ai-advisor', label: 'Asesor IA', icon: '🤖' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            FinancePro
          </h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">Business Intelligence</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-500">Versión para PYMES v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center space-x-4">
             <span className="text-sm font-medium text-slate-500 px-3 py-1 bg-slate-100 rounded-full">Empresa Demo S.A.</span>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
