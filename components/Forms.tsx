
import React, { useState } from 'react';
import { Expense, ExpenseType, ProductSale, Investment, InvestmentType, InvestmentYield } from '../types';

interface ExpenseFormProps {
  expenses: Expense[];
  onAdd: (expense: Expense) => void;
  onRemove: (id: string) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenses, onAdd, onRemove }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<ExpenseType>(ExpenseType.FIXED);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    onAdd({
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      type,
      category: 'General',
      date
    });
    setDescription('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Entrada de Gastos (Estilo Hoja de Cálculo)</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fecha</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-rose-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Descripción / Concepto</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej: Alquiler Local" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-rose-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Monto y Tipo</label>
            <div className="flex space-x-2">
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="flex-1 p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-rose-500" />
              <select value={type} onChange={e => setType(e.target.value as ExpenseType)} className="p-3 bg-slate-50 rounded-xl border-none font-bold text-slate-500">
                <option value={ExpenseType.FIXED}>Fijo</option>
                <option value={ExpenseType.VARIABLE}>Variable</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-rose-600 transition-all shadow-lg active:scale-95">Añadir Fila</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase">
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Concepto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-right">Monto ($)</th>
              <th className="px-6 py-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">No hay registros este mes</td></tr>
            ) : (
              expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{exp.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{exp.description}</span>
                      <span className={`text-[9px] font-black uppercase tracking-tighter ${exp.type === ExpenseType.FIXED ? 'text-slate-400' : 'text-amber-500'}`}>
                        {exp.type === ExpenseType.FIXED ? 'Gasto Fijo' : 'Gasto Variable'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{exp.category}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">${exp.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => onRemove(exp.id)} className="text-rose-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SalesForm: React.FC<{ sales: ProductSale[], onAdd: (s: ProductSale) => void, onRemove: (id: string) => void }> = ({ sales, onAdd, onRemove }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !qty) return;
    onAdd({ 
      id: crypto.randomUUID(), 
      name, 
      price: parseFloat(price), 
      quantity: parseInt(qty), 
      variableCostPerUnit: parseFloat(cost) || 0, 
      date 
    });
    setName(''); setPrice(''); setQty(''); setCost('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Registro de Ventas e Ingresos</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fecha</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Producto / Servicio</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Consultoría" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Precio x Un.</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cant. y Costo Var.</label>
            <div className="flex space-x-2">
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Cant" className="w-16 p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-emerald-500" />
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Costo U." className="flex-1 p-3 bg-slate-50 rounded-xl border-none outline-none font-medium focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 text-white font-black py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg active:scale-95">Guardar Venta</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Detalle</th>
              <th className="px-6 py-4 text-center">Cant.</th>
              <th className="px-6 py-4 text-right">Subtotal</th>
              <th className="px-6 py-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.map(sale => (
              <tr key={sale.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-slate-500">{sale.date}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{sale.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Precio Unit: ${sale.price}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-600">{sale.quantity}</td>
                <td className="px-6 py-4 text-right font-black text-emerald-600">${(sale.price * sale.quantity).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onRemove(sale.id)} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const InvestmentForm: React.FC<{ investments: Investment[], onAdd: (i: Investment) => void, onAddYield: (id: string, y: InvestmentYield) => void, onRemove: (id: string) => void }> = ({ investments, onAdd, onAddYield, onRemove }) => {
    const [name, setName] = useState('');
    const [val, setVal] = useState('');
    const [type, setType] = useState<InvestmentType>(InvestmentType.MACHINERY);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !val) return;
        onAdd({ 
          id: crypto.randomUUID(), 
          name, 
          initialValue: parseFloat(val), 
          type, 
          purchaseDate: new Date().toISOString(), 
          yields: [] 
        });
        setName(''); setVal('');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="text-lg font-black text-slate-800 mb-6">Módulo de Activos e Inversiones</h4>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre del Activo</label>
                      <input type="text" placeholder="Ej: Maquinaria CNC" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Valor de Adquisición</label>
                      <input type="number" placeholder="Valor $" value={val} onChange={e => setVal(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
                      <select value={type} onChange={e => setType(e.target.value as InvestmentType)} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-slate-500">
                        <option value={InvestmentType.MACHINERY}>Maquinaria</option>
                        <option value={InvestmentType.VEHICLE}>Vehículo</option>
                        <option value={InvestmentType.STOCK}>Acciones/Bolsa</option>
                        <option value={InvestmentType.REAL_ESTATE}>Inmueble</option>
                      </select>
                    </div>
                    <button className="bg-indigo-600 text-white font-black py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Registrar Activo</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map(inv => (
                    <div key={inv.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">💎</div>
                            <button onClick={() => onRemove(inv.id)} className="text-rose-300 hover:text-rose-500 text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Vender/Quitar</button>
                        </div>
                        <h5 className="font-black text-slate-800 text-lg">{inv.name}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{inv.type}</p>
                        <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Valor Inicial</p>
                                <p className="text-xl font-black text-slate-900">${inv.initialValue.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Rendimientos</p>
                                <p className="text-xl font-black text-emerald-600">${inv.yields.reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
