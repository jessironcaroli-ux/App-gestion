import React, { useState, useMemo, useEffect } from 'react';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import SimulationPanel from './components/SimulationPanel.js';
import AdminMasterView from './components/AdminMasterView.js';
import Forms from './components/Forms.js';
import { getFinancialAdvice } from './services/geminiService.js';
import { UserRole, ExpenseType } from './types.js';

const STORAGE_KEY = 'finance_pro_v3_master';

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
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    } catch (e) {
      return DEFAULT_CLIENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientsData));
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
      setActiveTab
