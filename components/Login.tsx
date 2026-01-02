
import React, { useState } from 'react';
import { UserRole, ClientData } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, username: string, clientId?: string) => void;
  clients: Record<string, ClientData>;
}

const Login: React.FC<LoginProps> = ({ onLogin, clients }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin check
    if (username === 'admin' && password === 'admin') {
      onLogin(UserRole.ADMIN, 'Admin');
      return;
    }

    // Client check
    // Fix: Explicitly cast Object.values to ClientData[] to avoid 'unknown' type errors on line 26
    const matchedClient = (Object.values(clients) as ClientData[]).find(
      (c: ClientData) => c.username === username && c.password === password
    );

    if (matchedClient) {
      // Fix: Ensure properties are accessed on a typed object to resolve errors on line 30
      onLogin(UserRole.CLIENT, matchedClient.username, matchedClient.id);
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="text-4xl font-black tracking-tighter">FP</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">FinancePro</h1>
          <p className="text-blue-100/70 text-sm mt-2 font-medium">Panel de Control Estratégico</p>
        </div>
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && <div className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100 flex items-center"><span className="mr-2">⚠️</span> {error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuario</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                placeholder="Ingresa tu usuario"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] mt-4">
            Iniciar Sesión
          </button>
        </form>
        <div className="p-6 bg-slate-50/50 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Consultoría Financiera Profesional</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
