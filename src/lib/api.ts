// Types
export interface Expense {
  id: string;
  member: string;
  category: string;
  cost: number;
  date: string;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
}

// Helper delay function to simulate network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe localStorage access wrapper since we are in Next.js (SSR)
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

// Initialize localStorage databases if they don't exist
const initDB = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("expenses")) {
    localStorage.setItem("expenses", JSON.stringify([]));
  }
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
};

// Expenses API
export async function getExpenses(): Promise<Expense[]> {
  await delay(600); // Simulate network latency
  initDB();
  const data = getLocalStorageItem("expenses");
  return data ? JSON.parse(data) : [];
}

export async function addExpense(expenseData: Omit<Expense, "id" | "date">): Promise<Expense> {
  await delay(800); // Simulate network latency
  initDB();
  const expenses = await getExpenses();
  
  const newExpense: Expense = {
    ...expenseData,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
  };

  expenses.push(newExpense);
  setLocalStorageItem("expenses", JSON.stringify(expenses));
  return newExpense;
}

export async function deleteExpense(id: string): Promise<void> {
  await delay(600); // Simulate network latency
  initDB();
  const expenses = await getExpenses();
  const updated = expenses.filter((exp) => exp.id !== id);
  setLocalStorageItem("expenses", JSON.stringify(updated));
}

export async function clearExpenses(): Promise<void> {
  await delay(700); // Simulate network latency
  initDB();
  setLocalStorageItem("expenses", JSON.stringify([]));
}
