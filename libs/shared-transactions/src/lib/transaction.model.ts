export interface Transaction {
  id: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}