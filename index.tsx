import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// --- Constantes y Configuración ---
const STORAGE_KEY = 'finance_pro_v7_data';
const UserRole = { ADMIN: 'ADMIN', CLIENT: 'CLIENT' };

const INITIAL_DATA = [
  { 
    id: 'demo-1', 
    name: 'Empresa Constructora S.A.', 
    user: 'pyme1', 
    pass: '123',
    sales: [{ id: 1, desc: 'Obra Civil A1', price: 15000, qty: 1 }],
    expenses: [{ id: 1, desc: 'Materiales', amount: 8000, type: 'VARIABLE' }, { id: 2, desc: 'Sueldos', amount: 3000, type: 'FIXED' }]
  }
];

// --- Componentes UI Reutilizables ---
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 ${className}`}>
    {children}
  </div>
);

const KPI = ({ label, value, color = "text-slate-900", sub }: any) => (
  <Card>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-2 font-medium">{sub}</p>}
  </Card>
);

// --- Aplicación Principal ---
function App() {
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingId, setViewingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  // Cliente activo (ya sea por login directo o por vista de admin)
  const activeClient = useMemo(() => {
    const id = viewingId || (user?.role === UserRole.CLIENT ? user.id : null);
    return clients.find(c => c.id === id);
  }, [clients, user, viewingId]);

  const metrics = useMemo(() => {
    if (!activeClient) return null;
    const totalSales = activeClient.sales.reduce((acc: number, s: any) => acc + (s.price * s.qty), 0);
    const fixedExpenses = activeClient.expenses.filter((e: any) => e.type === 'FIXED').reduce((acc: number, e: any) => acc + e.amount, 0);
    const variableExpenses = activeClient.expenses.filter((e: any) => e.type === 'VARIABLE').reduce((acc: number, e: any) => acc + e.amount, 0);
    const netProfit = totalSales - fixedExpenses - variableExpenses;
    const margin = totalSales > 0 ? (netProfit / totalSales) : 0;
    return { totalSales, fixedExpenses, variableExpenses, netProfit, margin, totalExpenses: fixedExpenses + variableExpenses };
  }, [activeClient]);

  // Handlers
  const handleLogin = (u: string, p: string) => {
    if (u === 'admin' && p === 'admin') {
      setUser({ role: UserRole.ADMIN, name: 'Administrador Maestro' });
    } else {
      const found = clients.find(c => c.user === u && c.pass === p);
      if (found) {
        setUser({ role: UserRole.CLIENT, name: found.name, id: found.id });
      } else {
        alert("Credenciales incorrectas. (Admin: admin/admin)");
      }
    }
  };

  const addData = (type: 'sales' | 'expenses', item: any) => {
    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return { ...c, [type]: [...c[type], { ...item, id: Date.now() }] };
      }
      return c;
    }));
  };

  const removeData = (type: 'sales' | 'expenses', id: number) => {
    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return { ...c, [type]: c[type].filter((i: any) => i.id !== id) };
      }
      return c;
    }));
  };

  // --- Vistas Internas ---

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <Card className="max-w-md w-full text-center p-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-8 shadow-xl">F</div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">FinancePro</h1>
          <p className="text-slate-400 text-sm mb-10 font-medium tracking-tight">Acceso Inteligente para Empresas</p>
          <form className="space-y-4" onSubmit={(e: any) => {
            e.preventDefault();
            handleLogin(e.target.u.value, e.target.p.value);
          }}>
            <input name="u" placeholder="Usuario" className="excel-input bg-slate-50" required />
            <input name="p" type="password" placeholder="Contraseña" className="excel-input bg-slate-50" required />
            <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all mt-4">Entrar al Sistema</button>
          </form>
          <p className="mt-8 text-[9px] text-slate-300 font-bold uppercase tracking-widest">Master BI Platform v7.0</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 shadow-2xl z-20">
        <div className="mb-12">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center">
            <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm mr-3">F</span>
            FinancePro
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SaaS Multi-Empresa</p>
        </div>

        <nav className="flex-1 space-y-2">
          {user.role === UserRole.ADMIN && !viewingId ? (
            <button className="w-full text-left p-4 rounded-2xl bg-indigo-600 font-bold flex items-center space-x-3">
              <span>🏢</span> <span>Empresas Clientes</span>
            </button>
          ) : (
            <>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'carga', label: 'Carga de Datos', icon: '📝' },
                { id: 'simulacion', label: 'Simulador Pro', icon: '🧪' },
                { id: 'ia', label: 'Asesor IA', icon: '🤖' }
              ].map(t => (
                <button 
                  key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-full text-left p-4 rounded-2xl font-bold transition-all flex items-center space-x-3 ${activeTab === t.id ? 'bg-indigo-600 shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800 space-y-4">
          <div className="px-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Usuario Activo</p>
            <p className="text-xs font-bold text-slate-300 truncate">{user.name}</p>
          </div>
          {viewingId && (
            <button onClick={() => setViewingId(null)} className="w-full p-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-amber-700 transition-all">
              Volver al Panel Maestro
            </button>
          )}
          <button onClick={() => {setUser(null); setViewingId(null);}} className="w-full p-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12 scroll-smooth">
        {user.role === UserRole.ADMIN && !viewingId ? (
          <div className="max-w-6xl mx-auto space-y-12 fade-in">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Panel Maestro</h2>
                <p className="text-slate-500 font-medium">Control total de la cartera de pymes.</p>
              </div>
              <button onClick={() => {
                const n = prompt("Nombre de la nueva pyme:");
                if(n) setClients([...clients, { id: Date.now().toString(), name: n, user: n.toLowerCase().replace(/ /g,''), pass: '123', sales: [], expenses: [] }]);
              }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
                Nueva Empresa
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clients.map(c => {
                const rev = c.sales.reduce((acc: any, s: any) => acc + (s.price * s.qty), 0);
                const exp = c.expenses.reduce((acc: any, e: any) => acc + e.amount, 0);
                return (
                  <Card key={c.id} className="hover:shadow-xl transition-all group border-slate-200">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-black mb-6">{c.name[0]}</div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{c.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">User: {c.user}</p>
                    <div className="flex justify-between items-end border-t pt-6 mb-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Utilidad Actual</p>
                        <p className={`text-xl font-black ${rev - exp >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>${(rev - exp).toLocaleString()}</p>
                      </div>
                      <button onClick={() => setViewingId(c.id)} className="bg-slate-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all">Abrir BI</button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8 fade-in">
            {activeTab === 'dashboard' && <DashboardView metrics={metrics} name={activeClient?.name} />}
            {activeTab === 'carga' && <DataEntryView client={activeClient} onAdd={addData} onRemove={removeData} />}
            {activeTab === 'simulacion' && <SimulationView metrics={metrics} />}
            {activeTab === 'ia' && <AIAdvisorView metrics={metrics} />}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Componentes de Vista de Negocio ---

function DashboardView({ metrics, name }: any) {
  const chartData = [
    { name: 'Ingresos', val: metrics.totalSales, color: '#6366f1' },
    { name: 'Gastos', val: metrics.totalExpenses, color: '#f43f5e' },
    { name: 'Utilidad', val: Math.max(0, metrics.netProfit), color: '#10b981' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-1">Centro de Inteligencia</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{name}</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI label="Ingresos Totales" value={`$${metrics.totalSales.toLocaleString()}`} color="text-indigo-600" />
        <KPI label="Gastos Totales" value={`$${metrics.totalExpenses.toLocaleString()}`} color="text-rose-500" />
        <KPI label="Utilidad Neta" value={`$${metrics.netProfit.toLocaleString()}`} color={metrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
        <KPI label="Margen Neto" value={`${(metrics.margin * 100).toFixed(1)}%`} color="text-slate-800" sub="Rendimiento del negocio" />
      </div>

      <Card className="h-[450px]">
        <h4 className="text-sm font-black text-slate-400 uppercase mb-8 tracking-widest">Estructura Financiera del Mes</h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="val" radius={[12, 12, 0, 0]} barSize={60}>
              {chartData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function DataEntryView({ client, onAdd, onRemove }: any) {
  return (
    <div className="space-y-12">
      <Card>
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center">
          <span className="mr-3 p-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm">📈</span> Carga de Ventas
        </h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" onSubmit={(e: any) => {
          e.preventDefault();
          onAdd('sales', { desc: e.target.d.value, price: Number(e.target.p.value), qty: Number(e.target.q.value) });
          e.target.reset();
        }}>
          <input name="d" placeholder="Concepto / Servicio" className="excel-input" required />
          <input name="p" type="number" placeholder="Precio Unitario" className="excel-input" required />
          <input name="q" type="number" placeholder="Cantidad" className="excel-input" required />
          <button className="bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-slate-900 transition-all">Añadir Venta</button>
        </form>
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase">
              <tr>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Precio</th>
                <th className="px-6 py-4 text-center">Cant.</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {client.sales.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-700">{s.desc}</td>
                  <td className="px-6 py-4 text-right text-slate-500">${s.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-black text-slate-400">{s.qty}</td>
                  <td className="px-6 py-4 text-right font-black text-emerald-600">${(s.price * s.qty).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center"><button onClick={() => onRemove('sales', s.id)} className="text-rose-400 hover:text-rose-600">Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center">
          <span className="mr-3 p-2 bg-rose-50 text-rose-600 rounded-lg text-sm">💸</span> Control de Gastos
        </h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" onSubmit={(e: any) => {
          e.preventDefault();
          onAdd('expenses', { desc: e.target.d.value, amount: Number(e.target.a.value), type: e.target.t.value });
          e.target.reset();
        }}>
          <input name="d" placeholder="Concepto del Gasto" className="excel-input" required />
          <input name="a" type="number" placeholder="Monto Total" className="excel-input" required />
          <select name="t" className="excel-input">
            <option value="FIXED">Gasto Fijo</option>
            <option value="VARIABLE">Gasto Variable</option>
          </select>
          <button className="bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-rose-600 transition-all">Registrar Gasto</button>
        </form>
      </Card>
    </div>
  );
}

function SimulationView({ metrics }: any) {
  const [pAdj, setPAdj] = useState(0);
  const [qAdj, setQAdj] = useState(0);

  const res = useMemo(() => {
    const newSales = metrics.totalSales * (1 + pAdj / 100) * (1 + qAdj / 100);
    const newProfit = newSales - metrics.totalExpenses;
    return { newProfit, diff: newProfit - metrics.netProfit };
  }, [pAdj, qAdj, metrics]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Simulador Estratégico Pro</h2>
        <p className="text-slate-500 font-medium">Calcula el impacto de cambios en precio y volumen.</p>
      </div>

      <Card className="p-16">
        <div className="space-y-16 mb-16">
          <div>
            <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              <span>Optimización de Precios</span>
              <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{pAdj > 0 ? '+' : ''}{pAdj}%</span>
            </div>
            <input type="range" min="-30" max="100" value={pAdj} onChange={e => setPAdj(Number(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              <span>Crecimiento de Volumen</span>
              <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{qAdj > 0 ? '+' : ''}{qAdj}%</span>
            </div>
            <input type="range" min="-50" max="200" value={qAdj} onChange={e => setQAdj(Number(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-16 border-t border-slate-50 text-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Utilidad Proyectada</p>
            <p className={`text-5xl font-black ${res.newProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>${Math.round(res.newProfit).toLocaleString()}</p>
          </div>
          <div className="border-l border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Incremento Mensual</p>
            <p className={`text-5xl font-black ${res.diff >= 0 ? 'text-indigo-600' : 'text-rose-400'}`}>
              {res.diff >= 0 ? '+' : ''}${Math.round(res.diff).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AIAdvisorView({ metrics }: any) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const prompt = `Actúa como un Director Financiero experto. Analiza: Ventas $${metrics.totalSales}, Gastos $${metrics.totalExpenses}, Utilidad $${metrics.netProfit}. Proporciona 3 estrategias clave en español con formato Markdown y emojis profesionales.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setReport(response.text || "No se pudo generar el análisis.");
    } catch (e) {
      setReport("Error de conexión con el Asesor IA.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl mb-6 shadow-2xl">🤖</div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">CFO Virtual con IA</h2>
        <p className="text-slate-500 font-medium">Análisis estratégico instantáneo basado en tus números.</p>
        <button onClick={askGemini} disabled={loading} className="mt-8 px-12 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-indigo-600 hover:scale-105 transition-all disabled:opacity-50">
          {loading ? 'Analizando Métricas...' : 'Solicitar Auditoría Estratégica'}
        </button>
      </div>

      {report && (
        <Card className="p-16 border-indigo-100 shadow-2xl bg-gradient-to-br from-white to-indigo-50/30">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap" 
               dangerouslySetInnerHTML={{ __html: report.replace(/\*\*(.*?)\*\*/g, '<b class="text-indigo-600">$1</b>') }} />
        </Card>
      )}
    </div>
  );
}

// --- Inicio de la Aplicación ---
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}