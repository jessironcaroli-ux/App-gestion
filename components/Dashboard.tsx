
import React from 'react';
import { FinancialSummary } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

interface DashboardProps {
  summary: FinancialSummary;
  compareSummary?: FinancialSummary; // Optional second summary for comparison
  clientMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, compareSummary, clientMode = false }) => {
  const chartData = [
    { name: 'Ingresos', value: summary.totalRevenue, compare: compareSummary?.totalRevenue, fill: '#3b82f6' },
    { name: 'C. Var.', value: summary.totalVariableCosts, compare: compareSummary?.totalVariableCosts, fill: '#fbbf24' },
    { name: 'C. Fijos', value: summary.totalFixedCosts, compare: compareSummary?.totalFixedCosts, fill: '#ef4444' },
    { name: 'Ganancia', value: summary.netProfit, compare: compareSummary?.netProfit, fill: '#10b981' },
  ];

  const pieData = [
    { name: 'C. Variables', value: summary.totalVariableCosts },
    { name: 'C. Fijos', value: summary.totalFixedCosts },
    { name: 'Ganancia', value: Math.max(0, summary.netProfit) },
  ];

  const COLORS = ['#fbbf24', '#ef4444', '#10b981'];

  const renderComparisonIndicator = (current: number, previous: number) => {
    if (previous === 0) return null;
    const diff = ((current - previous) / previous) * 100;
    const color = diff >= 0 ? 'text-emerald-500' : 'text-rose-500';
    return (
      <span className={`text-xs font-bold ml-2 ${color}`}>
        {diff >= 0 ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <p className="text-xs font-bold text-slate-400 uppercase">Ganancia Neta</p>
          <div className="flex items-baseline">
            <h3 className={`text-2xl font-bold mt-1 ${summary.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${summary.netProfit.toLocaleString()}
            </h3>
            {compareSummary && renderComparisonIndicator(summary.netProfit, compareSummary.netProfit)}
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">💰</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <p className="text-xs font-bold text-slate-400 uppercase">Ingresos Totales</p>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-blue-600 mt-1">${summary.totalRevenue.toLocaleString()}</h3>
            {compareSummary && renderComparisonIndicator(summary.totalRevenue, compareSummary.totalRevenue)}
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">📈</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Contribución Marginal</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{(summary.marginalContributionPercentage * 100).toFixed(1)}%</h3>
          <p className="text-[10px] text-slate-400 mt-1">Rentabilidad por unidad</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Punto de Equilibrio</p>
          <h3 className="text-2xl font-bold text-slate-600 mt-1">${summary.breakEvenPoint.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Meta mínima de ventas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-bold text-slate-800">Desempeño Financiero</h4>
            {compareSummary && <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold uppercase">Comparativo Activo</span>}
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}} 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconType="circle" />
                <Bar name="Periodo Actual" dataKey="value" radius={[6, 6, 0, 0]} barSize={compareSummary ? 30 : 50}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
                {compareSummary && (
                  <Bar name="Periodo Anterior" dataKey="compare" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={30} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart / Assets */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
          <h4 className="text-lg font-bold text-slate-800 mb-6 text-center">Estructura de Costos</h4>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm text-slate-500">Total Activos</span>
               <span className="font-bold text-indigo-600">${summary.totalAssetsValue.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-slate-500">Rend. Inversiones</span>
               <span className={`font-bold ${summary.totalInvestmentYields >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                 ${summary.totalInvestmentYields.toLocaleString()}
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
