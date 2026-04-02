import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const FinanceContext = createContext(null)

const STORAGE_KEY = 'finance_dashboard_transactions_v1'

const seedTransactions = [
  { id: 't1', date: '2026-03-01', amount: 3200, category: 'Salary', type: 'income' },
  { id: 't2', date: '2026-03-03', amount: 140, category: 'Groceries', type: 'expense' },
  { id: 't3', date: '2026-03-06', amount: 80, category: 'Transport', type: 'expense' },
  { id: 't4', date: '2026-03-10', amount: 420, category: 'Freelance', type: 'income' },
  { id: 't5', date: '2026-03-14', amount: 210, category: 'Utilities', type: 'expense' },
  { id: 't6', date: '2026-03-18', amount: 95, category: 'Dining', type: 'expense' },
  { id: 't7', date: '2026-03-22', amount: 160, category: 'Entertainment', type: 'expense' },
  { id: 't8', date: '2026-03-25', amount: 500, category: 'Bonus', type: 'income' },
]

const sortByDate = (data) => [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

const getRunningBalanceSeries = (transactions) => {
  let running = 0
  return sortByDate(transactions).map((item) => {
    running += item.type === 'income' ? Number(item.amount) : -Number(item.amount)
    return { date: item.date, balance: running }
  })
}

const getCategorySpending = (transactions) => {
  const totals = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const key = t.category || 'Other'
      acc[key] = (acc[key] || 0) + Number(t.amount)
      return acc
    }, {})

  return Object.entries(totals).map(([name, value]) => ({ name, value }))
}

const getMonthlyComparison = (transactions) => {
  const byMonth = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7)
    if (!acc[month]) acc[month] = { month, income: 0, expenses: 0 }
    if (t.type === 'income') acc[month].income += Number(t.amount)
    else acc[month].expenses += Number(t.amount)
    return acc
  }, {})

  return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month))
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seedTransactions
  })
  const [role, setRole] = useState('Admin')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const addTransaction = (payload) => {
    const newTx = { ...payload, id: crypto.randomUUID(), amount: Number(payload.amount) }
    setTransactions((prev) => [newTx, ...prev])
  }

  const updateTransaction = (id, updates) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, amount: Number(updates.amount) } : item,
      ),
    )
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
  }

  const metrics = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalBalance = income - expenses
    const balanceSeries = getRunningBalanceSeries(transactions)
    const categorySpending = getCategorySpending(transactions)
    const highestSpendingCategory =
      [...categorySpending].sort((a, b) => b.value - a.value)[0] || { name: 'N/A', value: 0 }

    return {
      income,
      expenses,
      totalBalance,
      balanceSeries,
      categorySpending,
      highestSpendingCategory,
      monthlyComparison: getMonthlyComparison(transactions),
      savings: totalBalance,
    }
  }, [transactions])

  const value = {
    transactions,
    role,
    darkMode,
    setRole,
    setDarkMode,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    metrics,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinance must be used within FinanceProvider')
  return context
}
