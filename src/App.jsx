import { useEffect, useMemo, useState } from 'react'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'Dashboard', icon: '◈', label: 'Dashboard' },
  { id: 'Transactions', icon: '⇄', label: 'Transactions' },
  { id: 'Insights', icon: '◎', label: 'Insights' },
]

const PIE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316']

const PAGE_BG = 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
const CARD_CLASS = 'rounded-2xl border border-slate-200/30 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800/40 dark:bg-slate-900/85'

// ─── Skeleton / Loading ───────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-900">
      <Skeleton className="mb-3 h-4 w-28" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon = '📭', title = 'No data', subtitle = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-400 dark:text-slate-500">
      <span className="text-5xl">{icon}</span>
      <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{title}</p>
      {subtitle && <p className="text-sm">{subtitle}</p>}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, gradient, icon }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${gradient}`}
    >
      <div className="absolute -right-4 -top-4 text-7xl opacity-10 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <p className="text-sm font-medium text-white/80">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/70">{sub}</p>}
    </div>
  )
}

// ─── Chart Card ───────────────────────────────────────────────────────────────

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`${CARD_CLASS} ${className}`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
        {title}
      </h3>
      {children}
    </div>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
        ₹{Number(payload[0].value).toFixed(2)}
      </p>
    </div>
  )
}

// ─── App Layout ───────────────────────────────────────────────────────────────

function AppLayout() {
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { role, setRole, darkMode, setDarkMode } = useFinance()

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const handleNav = (id) => {
    setActiveSection(id)
    setSidebarOpen(false)
  }

  return (
    <div className={`min-h-screen font-sans text-slate-800 transition-colors duration-300 ${PAGE_BG} dark:text-slate-100`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
              ₹
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Finance Board</p>
              <p className="text-xs text-slate-400">v2.0</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
                {activeSection === id && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                )}
              </button>
            ))}
          </nav>

          {/* Role badge */}
          <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
              <div
                className={`h-2 w-2 rounded-full ${role === 'Admin' ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {role}
              </span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Topbar */}
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              >
                ☰
              </button>
              <div>
                <h2 className="text-base font-bold">{activeSection}</h2>
                <p className="hidden text-xs text-slate-400 sm:block">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Role switcher */}
              <div className="flex overflow-hidden rounded-xl border border-slate-200 text-xs font-semibold dark:border-slate-700">
                {['Admin', 'Viewer'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1.5 transition-colors duration-200 ${
                      role === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Dark mode */}
              <button
                onClick={() => setDarkMode((p) => !p)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="animate-fadeIn">
                {activeSection === 'Dashboard' && <DashboardSection />}
                {activeSection === 'Transactions' && <TransactionsSection />}
                {activeSection === 'Insights' && <InsightsSection />}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardSection() {
  const { metrics } = useFinance()

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Balance"
          value={`₹${metrics.totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          sub="Net across all transactions"
          gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
          icon="💰"
        />
        <StatCard
          label="Total Income"
          value={`₹${metrics.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          sub="All income sources"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          icon="📈"
        />
        <StatCard
          label="Total Expenses"
          value={`₹${metrics.expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          sub="All spending"
          gradient="bg-gradient-to-br from-rose-500 to-pink-600"
          icon="📉"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Balance Over Time" className="h-80">
          {metrics.balanceSeries.length === 0 ? (
            <EmptyState icon="📊" title="No data yet" subtitle="Add transactions to see your balance trend" />
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={metrics.balanceSeries}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#6366F1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Spending by Category" className="h-80">
          {metrics.categorySpending.length === 0 ? (
            <EmptyState icon="🥧" title="No expenses yet" subtitle="Add expense transactions to see the breakdown" />
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={metrics.categorySpending}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {metrics.categorySpending.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Amount']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: '#64748b' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

// ─── Transactions ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-900'

function TransactionsSection() {
  const { transactions, role, addTransaction, updateTransaction, deleteTransaction } = useFinance()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortKey, setSortKey] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [form, setForm] = useState({ date: '', amount: '', category: '', type: 'expense' })
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const canEdit = role === 'Admin'

  const filtered = useMemo(() => {
    let data = transactions.filter((t) => {
      const matchesSearch = [t.category, t.type, t.date, String(t.amount)]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesType = typeFilter === 'all' ? true : t.type === typeFilter
      return matchesSearch && matchesType
    })

    return [...data].sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1
      if (sortKey === 'amount') return (a.amount - b.amount) * dir
      if (sortKey === 'category') return a.category.localeCompare(b.category) * dir
      if (sortKey === 'type') return a.type.localeCompare(b.type) * dir
      return (new Date(a.date) - new Date(b.date)) * dir
    })
  }, [transactions, search, typeFilter, sortKey, sortOrder])

  const submitForm = async (e) => {
    e.preventDefault()
    if (!form.date || !form.amount || !form.category) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 300))
    if (editingId) {
      updateTransaction(editingId, form)
      setEditingId(null)
    } else {
      addTransaction(form)
    }
    setForm({ date: '', amount: '', category: '', type: 'expense' })
    setSubmitting(false)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({ date: item.date, amount: item.amount, category: item.category, type: item.type })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ date: '', amount: '', category: '', type: 'expense' })
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className={`${CARD_CLASS}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {editingId ? '✏️ Edit Transaction' : '➕ New Transaction'}
          </h3>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        <form onSubmit={submitForm} className="grid gap-3 md:grid-cols-5">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputCls}
            disabled={!canEdit}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={inputCls}
            disabled={!canEdit}
            min="0"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputCls}
            disabled={!canEdit}
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputCls}
            disabled={!canEdit}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            type="submit"
            disabled={!canEdit || submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-indigo-900"
          >
            {submitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : editingId ? (
              'Update'
            ) : (
              'Add'
            )}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className={`${CARD_CLASS} p-4`}>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={inputCls}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className={inputCls}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
            <option value="type">Sort by Type</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputCls}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`overflow-hidden ${CARD_CLASS} p-0 bg-white dark:bg-slate-900`}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="No transactions found"
            subtitle="Try adjusting your search or filters"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Type
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{item.date}</td>
                    <td className="px-5 py-3.5 font-semibold">
                      <span
                        className={
                          item.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                        }
                      >
                        {item.type === 'income' ? '+' : '-'}₹
                        {Number(item.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          item.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <button
                          onClick={() => startEdit(item)}
                          disabled={!canEdit}
                          className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 transition-all duration-150 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-900/30 dark:text-amber-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTransaction(item.id)}
                          disabled={!canEdit}
                          className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition-all duration-150 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-rose-900/30 dark:text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400 dark:border-slate-800">
            Showing {filtered.length} of {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Insights ─────────────────────────────────────────────────────────────────

function InsightCard({ icon, label, value, sub, accent }) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${accent}`}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  )
}

function InsightsSection() {
  const { metrics } = useFinance()

  const latestMonth = metrics.monthlyComparison[metrics.monthlyComparison.length - 1]
  const prevMonth = metrics.monthlyComparison[metrics.monthlyComparison.length - 2]

  const monthDelta = prevMonth
    ? latestMonth.income - latestMonth.expenses - (prevMonth.income - prevMonth.expenses)
    : latestMonth
      ? latestMonth.income - latestMonth.expenses
      : 0

  const savingsRate =
    metrics.income > 0 ? ((metrics.savings / metrics.income) * 100).toFixed(1) : '0.0'

  if (metrics.monthlyComparison.length === 0) {
    return (
      <EmptyState
        icon="💡"
        title="No insights yet"
        subtitle="Add some transactions to unlock financial insights"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InsightCard
          icon="🔥"
          label="Highest Spending Category"
          value={metrics.highestSpendingCategory.name}
          sub={`₹${metrics.highestSpendingCategory.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} spent`}
          accent="bg-rose-100 dark:bg-rose-900/30"
        />
        <InsightCard
          icon={monthDelta >= 0 ? '📈' : '📉'}
          label="Monthly Comparison"
          value={monthDelta >= 0 ? 'Improved' : 'Declined'}
          sub={`₹${Math.abs(monthDelta).toFixed(2)} vs previous month`}
          accent={
            monthDelta >= 0
              ? 'bg-emerald-100 dark:bg-emerald-900/30'
              : 'bg-rose-100 dark:bg-rose-900/30'
          }
        />
        <InsightCard
          icon="🏦"
          label="Savings Summary"
          value={`₹${metrics.savings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          sub={`${savingsRate}% savings rate`}
          accent="bg-indigo-100 dark:bg-indigo-900/30"
        />
      </div>

      {/* Monthly breakdown table */}
      <div className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Monthly Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Month
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Income
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Expenses
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Net
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {metrics.monthlyComparison.map((row) => {
                const net = row.income - row.expenses
                return (
                  <tr
                    key={row.month}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                      {row.month}
                    </td>
                    <td className="py-3 font-semibold text-emerald-600">
                      ₹{row.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 font-semibold text-rose-500">
                      ₹{row.expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 font-bold ${net >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                      {net >= 0 ? '+' : ''}₹
                      {net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function App() {
  return (
    <FinanceProvider>
      <AppLayout />
    </FinanceProvider>
  )
}

export default App
