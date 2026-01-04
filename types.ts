
export enum ExpenseType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export enum InvestmentType {
  MACHINERY = 'MACHINERY',
  VEHICLE = 'VEHICLE',
  STOCK = 'STOCK',
  BOND = 'BOND',
  REAL_ESTATE = 'REAL_ESTATE'
}

export interface InvestmentYield {
  id: string;
  date: string;
  amount: number;
  percentage?: number;
  comment: string;
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  initialValue: number;
  purchaseDate: string;
  yields: InvestmentYield[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  clientId?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  type: ExpenseType;
  category: string;
  date: string;
}

export interface ProductSale {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variableCostPerUnit: number;
  date: string;
}

export interface ClientData {
  id: string;
  businessName: string;
  username: string;
  password: string;
  expenses: Expense[];
  sales: ProductSale[];
  investments: Investment[];
}

export interface AppConfig {
  publicUrl: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalFixedCosts: number;
  totalVariableCosts: number;
  netProfit: number;
  marginalContribution: number;
  marginalContributionPercentage: number;
  breakEvenPoint: number;
  profitMargin: number;
  totalAssetsValue: number;
  totalInvestmentYields: number;
}
