
import React, { useState } from 'react';
import { FinancialSummary, ClientData, AppConfig } from '../types';

interface ClientSummary {
  id: string;
  name: string;
  username: string;
  password: string;
  metrics: FinancialSummary;
}

interface AdminMasterViewProps {
  clients: ClientSummary[];
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  onSelectClient: (id: string) => void;
  onAddClient: (client: Partial<ClientData>) => void;
  onUpdateClient: (id: string, client: Partial<ClientData>) => void;
  onDeleteClient: (id: string) => void;
}

const AdminMasterView: React.FC<AdminMasterViewProps> = ({ 
  clients, 
  config,
  onUpdateConfig,
  onSelectClient, 
  onAddClient, 
  onUpdateClient, 
  onDeleteClient 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientSummary | null>(null);
  const [sharingClient, setSharingClient] = useState<ClientSummary | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    username: '',
    password: ''
  });

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({ businessName: '', username: '', password: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: ClientSummary) => {
    setEditingClient(client);
    setFormData({ 
      businessName: client.name, 
      username: client.username, 
      password: client.password 
    });
    setIsModalOpen(true);
  };

  const handleOpenShare = (client: ClientSummary) => {
    setSharingClient(client);
    setIsShareModalOpen(true);
    setCopied(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      onUpdateClient(editingClient.id, formData);
    } else {
      onAddClient(formData);
    }
    setIsModalOpen(false);
  };

  const getShareData = (client: ClientSummary) => {
    // Usamos la URL configurada por el administrador, o la actual si está vacía
    const baseUrl = config.publicUrl || window.location.origin;
    const message = `Hola ${client.name}! 👋\nAquí tienes tus credenciales para FinancePro:\n\n🌐 Acceso: ${baseUrl}\n👤 Usuario: ${client.username}\n🔑 Clave: ${client.password}\n\n¡Ya puedes empezar a cargar tus datos!`;
    return { baseUrl, message };
  };

  const copyToClipboard = async () => {
    if (!sharingClient) return;
    const { message } = getShareData(sharingClient);
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Copia manualmente este texto:\n\n" + message);
    }
  };

  const shareWhatsApp = () => {
    if (!sharingClient) return;
    const { message } = getShareData(sharingClient);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Configuración de URL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Configuración del Servidor</h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 mb-1">URL Pública de la App (Ej: https://tu-sitio.com)</label>
            <input 
              type="text" 
              value={config.publicUrl} 
              onChange={(e) => onUpdateConfig({ ...config, publicUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Deja vacío para usar URL automática"
            />
          </div>
          <p className="text-[10px] text-slate-400 max-w-[200px]">Esta URL se usará para generar los enlaces que envíes a tus clientes.</p>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Empresas</p>
            <h3 className="text-2xl font-bold">{clients.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Promedio Rentabilidad</p>
            <h3 className="text-2xl font-bold text-emerald-600">
              {(clients.reduce((acc, c) => acc + c.metrics.profitMargin, 0) / (clients.length || 1) * 100).toFixed(1)}%
            </h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">En Pérdida</p>
            <h3 className="text-2xl font-bold text-rose-600">
              {clients.filter(c => c.metrics.netProfit < 0).length}
            </h3>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-indigo-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center space-x-2"
        >
          <span>➕</span> <span>Nueva Empresa</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">
                <th className="px-6 py-5">Empresa</th>
                <th className="px-6 py-5">Acceso (User/Pass)</th>
                <th className="px-6 py-5">Ganancia Neta</th>
                <th className="px-6 py-5">Margen</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-6 py-5">
                    <button onClick={() => onSelectClient(client.id)} className="font-bold text-slate-800 hover:text-indigo-600 transition-colors text-left">
                      {client.name}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-mono text-slate-500">{client.username} / {client.password}</p>
                  </td>
                  <td className={`px-6 py-5 font-bold ${client.metrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${client.metrics.netProfit.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm">{(client.metrics.profitMargin * 100).toFixed(1)}%</td>
                  <td className="px-6 py-5 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenShare(client)} 
                      className="px-3 py-2 hover:bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                    >
                      📤 Compartir
                    </button>
                    <button onClick={() => handleOpenEdit(client)} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">✏️ Editar</button>
                    <button onClick={() => { if(confirm('¿Eliminar esta empresa?')) onDeleteClient(client.id) }} className="p-2 hover:bg-rose-50 text-rose-400 rounded-lg text-xs font-bold">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white">
              <h3 className="text-2xl font-bold">{editingClient ? 'Editar Empresa' : 'Registrar Empresa'}</h3>
              <p className="text-indigo-100 text-sm mt-1">Configura el acceso para tu cliente</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre Comercial</label>
                <input required type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Panadería Los Pinos" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Usuario</label>
                  <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="pyme_user" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Contraseña</label>
                  <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123456" />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">Guardar</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Compartir */}
      {isShareModalOpen && sharingClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 text-center border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Compartir Acceso</h3>
              <p className="text-slate-500 text-sm mt-1">Envía las credenciales a <b>{sharingClient.name}</b></p>
            </div>
            
            <div className="p-8 space-y-8 text-center">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getShareData(sharingClient).baseUrl)}`} 
                    alt="QR Code" 
                    className="w-32 h-32"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escanea para abrir en el móvil</p>
              </div>

              {/* Message Preview */}
              <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 relative group">
                <p className="text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed">
                  {getShareData(sharingClient).message}
                </p>
                <button 
                  onClick={copyToClipboard}
                  className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'}`}
                >
                  {copied ? '✅ Copiado' : '📋 Copiar Texto'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center space-x-2 bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg"
                >
                  <span>📱</span> <span>WhatsApp</span>
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(false)}
                  className="bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMasterView;
