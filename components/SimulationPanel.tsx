
import React, { useState, useMemo } from 'react';
import { FinancialSummary, ProductSale } from '../types';

interface SimulationPanelProps {
  summary: FinancialSummary;
  sales: ProductSale[];
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ summary, sales }) => {
  const [priceChange, setPriceChange] = useState<number>(0); // Percentage
  const [quantityChange, setQuantityChange] = useState<number>(0); // Percentage

  const simulation = useMemo(() => {
    const avgPrice = sales.length > 0 
      ? sales.reduce((acc, s) => acc + s.price, 0) / sales.length 
      : 0;
    const avgQty = sales.reduce((acc, s) => acc + s.quantity, 0);
    const avgVC = sales.length > 0 
      ? sales.reduce((acc, s) => acc + s.variableCostPerUnit, 0) / sales.length 
      : 0;

    const newPrice = avgPrice * (1 + priceChange / 100);
    const newQuantity = avgQty * (1 + quantityChange / 100);
    
    const newRevenue = newPrice * newQuantity;
    const newVariableCosts = avgVC * newQuantity;
    const newProfit = newRevenue - newVariableCosts - summary.totalFixedCosts;
    const profitChange = newProfit - summary.netProfit;

    return {
      newRevenue,
      newProfit,
      profitChange,
      isPositive: profitChange > 0
    };
  }, [priceChange, quantityChange, sales, summary]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Simulation Controls */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-xl font-bold text-slate-800 mb-6">Escenario "What-if"</h4>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-600">Cambio en Precio (%)</label>
              <span className={`text-sm font-bold ${priceChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {priceChange > 0 ? '+' : ''}{priceChange}%
              </span>
            </div>
            <input 
              type="range" min="-50" max="100" step="1"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-slate-400 mt-2">¿Cómo afectaría subir o bajar tus precios?</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-600">Cambio en Volumen/Ventas (%)</label>
              <span className={`text-sm font-bold ${quantityChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {quantityChange > 0 ? '+' : ''}{quantityChange}%
              </span>
            </div>
            <input 
              type="range" min="-50" max="200" step="1"
              value={quantityChange}
              onChange={(e) => setQuantityChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-xs text-slate-400 mt-2">¿Cuánto cambiaría la demanda si modificas el precio?</p>
          </div>
        </div>

        <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Teoría de Elasticidad</h5>
            <p className="text-sm text-slate-600 leading-relaxed">
                Por lo general, un aumento de precio del 10% suele venir acompañado de una caída en ventas. Si tus ventas caen menos del 10% tras subir el precio, tu rentabilidad neta suele aumentar.
            </p>
        </div>
      </div>

      {/* Simulation Results */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col justify-center">
            <h4 className="text-lg font-bold text-slate-800 mb-2 text-center">Impacto Proyectado</h4>
            <p className="text-slate-400 text-sm text-center mb-8">Nueva Ganancia Neta Estimada</p>
            
            <div className="text-center">
                <span className={`text-5xl font-extrabold ${simulation.newProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${Math.round(simulation.newProfit).toLocaleString()}
                </span>
                <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${simulation.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {simulation.isPositive ? '↑ Ganancia' : '↓ Pérdida'} de ${Math.abs(Math.round(simulation.profitChange)).toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-semibold mb-1">Nuevos Ingresos</p>
                    <p className="text-lg font-bold text-slate-800">${Math.round(simulation.newRevenue).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-semibold mb-1">Margen Neto Proyectado</p>
                    <p className="text-lg font-bold text-slate-800">
                        {simulation.newRevenue > 0 ? ((simulation.newProfit / simulation.newRevenue) * 100).toFixed(1) : 0}%
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
