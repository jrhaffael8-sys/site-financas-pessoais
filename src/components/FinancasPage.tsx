"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Plus, TrendingUp, TrendingDown, Wallet, PieChart, Calendar, DollarSign, Edit2, Trash2, Moon, Sun, Target, Bell, TrendingUpIcon, BarChart3, LogOut } from "lucide-react"
import { LineChart, Line, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area } from "recharts"
import Image from "next/image"
import { useRouter } from "next/navigation"

type TransactionType = "receita" | "despesa"
type Category = "alimentacao" | "transporte" | "moradia" | "saude" | "lazer" | "educacao" | "outros" | "salario" | "freelance" | "investimentos"

interface Transaction {
  id: string
  tipo: TransactionType
  valor: number
  categoria: Category
  descricao: string
  data: string
}

interface Budget {
  categoria: Category
  limite: number
  gasto: number
}

interface SavingsGoal {
  id: string
  nome: string
  valorAlvo: number
  valorAtual: number
  prazo: string
}

interface PaymentReminder {
  id: string
  descricao: string
  valor: number
  dataVencimento: string
  recorrente: boolean
}

const CATEGORIAS_DESPESA: { value: Category; label: string; color: string }[] = [
  { value: "alimentacao", label: "Alimentação", color: "#FF6384" },
  { value: "transporte", label: "Transporte", color: "#36A2EB" },
  { value: "moradia", label: "Moradia", color: "#FFCE56" },
  { value: "saude", label: "Saúde", color: "#4BC0C0" },
  { value: "lazer", label: "Lazer", color: "#9966FF" },
  { value: "educacao", label: "Educação", color: "#FF9F40" },
  { value: "outros", label: "Outros", color: "#C9CBCF" },
]

const CATEGORIAS_RECEITA: { value: Category; label: string; color: string }[] = [
  { value: "salario", label: "Salário", color: "#4CAF50" },
  { value: "freelance", label: "Freelance", color: "#8BC34A" },
  { value: "investimentos", label: "Investimentos", color: "#CDDC39" },
  { value: "outros", label: "Outros", color: "#C9CBCF" },
]

export default function FinancasPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "orcamento" | "metas" | "lembretes" | "relatorios">("dashboard")
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", tipo: "receita", valor: 5000, categoria: "salario", descricao: "Salário Mensal", data: "2024-01-05" },
    { id: "2", tipo: "despesa", valor: 1200, categoria: "moradia", descricao: "Aluguel", data: "2024-01-10" },
    { id: "3", tipo: "despesa", valor: 350, categoria: "alimentacao", descricao: "Supermercado", data: "2024-01-12" },
    { id: "4", tipo: "despesa", valor: 150, categoria: "transporte", descricao: "Combustível", data: "2024-01-15" },
    { id: "5", tipo: "receita", valor: 800, categoria: "freelance", descricao: "Projeto Web", data: "2024-01-20" },
  ])

  const [budgets, setBudgets] = useState<Budget[]>([
    { categoria: "alimentacao", limite: 800, gasto: 350 },
    { categoria: "transporte", limite: 400, gasto: 150 },
    { categoria: "moradia", limite: 1500, gasto: 1200 },
  ])

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: "1", nome: "Viagem de Férias", valorAlvo: 5000, valorAtual: 1200, prazo: "2024-12-31" },
    { id: "2", nome: "Reserva de Emergência", valorAlvo: 10000, valorAtual: 3500, prazo: "2024-06-30" },
  ])

  const [paymentReminders, setPaymentReminders] = useState<PaymentReminder[]>([
    { id: "1", descricao: "Aluguel", valor: 1200, dataVencimento: "2024-02-10", recorrente: true },
    { id: "2", descricao: "Cartão de Crédito", valor: 850, dataVencimento: "2024-02-15", recorrente: true },
    { id: "3", descricao: "Internet", valor: 120, dataVencimento: "2024-02-05", recorrente: true },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tipo: "despesa" as TransactionType,
    valor: "",
    categoria: "alimentacao" as Category,
    descricao: "",
    data: "",
  })

  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [budgetFormData, setBudgetFormData] = useState({
    categoria: "alimentacao" as Category,
    limite: "",
  })

  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [goalFormData, setGoalFormData] = useState({
    nome: "",
    valorAlvo: "",
    valorAtual: "",
    prazo: "",
  })

  const [showReminderForm, setShowReminderForm] = useState(false)
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null)
  const [reminderFormData, setReminderFormData] = useState({
    descricao: "",
    valor: "",
    dataVencimento: "",
    recorrente: false,
  })

  useEffect(() => {
    setMounted(true)
    setFormData(prev => ({
      ...prev,
      data: new Date().toISOString().split("T")[0]
    }))
    
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  const totalReceitas = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0)

  const totalDespesas = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0)

  const saldo = totalReceitas - totalDespesas

  useEffect(() => {
    const updatedBudgets = budgets.map(budget => {
      const gasto = transactions
        .filter(t => t.tipo === "despesa" && t.categoria === budget.categoria)
        .reduce((acc, t) => acc + t.valor, 0)
      return { ...budget, gasto }
    })
    setBudgets(updatedBudgets)
  }, [transactions])

  const despesasPorCategoria = CATEGORIAS_DESPESA.map((cat) => ({
    name: cat.label,
    value: transactions
      .filter((t) => t.tipo === "despesa" && t.categoria === cat.value)
      .reduce((acc, t) => acc + t.valor, 0),
    color: cat.color,
  })).filter((item) => item.value > 0)

  const receitasPorCategoria = CATEGORIAS_RECEITA.map((cat) => ({
    name: cat.label,
    value: transactions
      .filter((t) => t.tipo === "receita" && t.categoria === cat.value)
      .reduce((acc, t) => acc + t.valor, 0),
    color: cat.color,
  })).filter((item) => item.value > 0)

  const patrimonioData = [
    { mes: "Set", valor: 2500 },
    { mes: "Out", valor: 3200 },
    { mes: "Nov", valor: 3800 },
    { mes: "Dez", valor: 4500 },
    { mes: "Jan", valor: saldo },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      setTransactions(transactions.map((t) =>
        t.id === editingId
          ? { ...t, ...formData, valor: parseFloat(formData.valor) }
          : t
      ))
      setEditingId(null)
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        categoria: formData.categoria,
        descricao: formData.descricao,
        data: formData.data,
      }
      setTransactions([...transactions, newTransaction])
    }

    setFormData({
      tipo: "despesa",
      valor: "",
      categoria: "alimentacao",
      descricao: "",
      data: new Date().toISOString().split("T")[0],
    })
    setShowForm(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      tipo: transaction.tipo,
      valor: transaction.valor.toString(),
      categoria: transaction.categoria,
      descricao: transaction.descricao,
      data: transaction.data,
    })
    setEditingId(transaction.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const gasto = transactions
      .filter(t => t.tipo === "despesa" && t.categoria === budgetFormData.categoria)
      .reduce((acc, t) => acc + t.valor, 0)
    
    const existingBudget = budgets.find(b => b.categoria === budgetFormData.categoria)
    if (existingBudget) {
      setBudgets(budgets.map(b => 
        b.categoria === budgetFormData.categoria 
          ? { ...b, limite: parseFloat(budgetFormData.limite) }
          : b
      ))
    } else {
      setBudgets([...budgets, {
        categoria: budgetFormData.categoria,
        limite: parseFloat(budgetFormData.limite),
        gasto
      }])
    }
    
    setBudgetFormData({ categoria: "alimentacao", limite: "" })
    setShowBudgetForm(false)
  }

  const handleDeleteBudget = (categoria: Category) => {
    setBudgets(budgets.filter(b => b.categoria !== categoria))
  }

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingGoalId) {
      setSavingsGoals(savingsGoals.map(g =>
        g.id === editingGoalId
          ? { 
              ...g, 
              nome: goalFormData.nome,
              valorAlvo: parseFloat(goalFormData.valorAlvo),
              valorAtual: parseFloat(goalFormData.valorAtual),
              prazo: goalFormData.prazo
            }
          : g
      ))
      setEditingGoalId(null)
    } else {
      const newGoal: SavingsGoal = {
        id: Date.now().toString(),
        nome: goalFormData.nome,
        valorAlvo: parseFloat(goalFormData.valorAlvo),
        valorAtual: parseFloat(goalFormData.valorAtual),
        prazo: goalFormData.prazo,
      }
      setSavingsGoals([...savingsGoals, newGoal])
    }
    
    setGoalFormData({ nome: "", valorAlvo: "", valorAtual: "", prazo: "" })
    setShowGoalForm(false)
  }

  const handleEditGoal = (goal: SavingsGoal) => {
    setGoalFormData({
      nome: goal.nome,
      valorAlvo: goal.valorAlvo.toString(),
      valorAtual: goal.valorAtual.toString(),
      prazo: goal.prazo,
    })
    setEditingGoalId(goal.id)
    setShowGoalForm(true)
  }

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id))
  }

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingReminderId) {
      setPaymentReminders(paymentReminders.map(r =>
        r.id === editingReminderId
          ? {
              ...r,
              descricao: reminderFormData.descricao,
              valor: parseFloat(reminderFormData.valor),
              dataVencimento: reminderFormData.dataVencimento,
              recorrente: reminderFormData.recorrente
            }
          : r
      ))
      setEditingReminderId(null)
    } else {
      const newReminder: PaymentReminder = {
        id: Date.now().toString(),
        descricao: reminderFormData.descricao,
        valor: parseFloat(reminderFormData.valor),
        dataVencimento: reminderFormData.dataVencimento,
        recorrente: reminderFormData.recorrente,
      }
      setPaymentReminders([...paymentReminders, newReminder])
    }
    
    setReminderFormData({ descricao: "", valor: "", dataVencimento: "", recorrente: false })
    setShowReminderForm(false)
  }

  const handleEditReminder = (reminder: PaymentReminder) => {
    setReminderFormData({
      descricao: reminder.descricao,
      valor: reminder.valor.toString(),
      dataVencimento: reminder.dataVencimento,
      recorrente: reminder.recorrente,
    })
    setEditingReminderId(reminder.id)
    setShowReminderForm(true)
  }

  const handleDeleteReminder = (id: string) => {
    setPaymentReminders(paymentReminders.filter(r => r.id !== id))
  }

  const getCategoriaLabel = (categoria: Category, tipo: TransactionType) => {
    const categorias = tipo === "despesa" ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA
    return categorias.find((c) => c.value === categoria)?.label || categoria
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString("pt-BR")
  }

  const getAnalyseTrends = () => {
    const suggestions = []
    
    const alimentacaoGasto = transactions
      .filter(t => t.tipo === "despesa" && t.categoria === "alimentacao")
      .reduce((acc, t) => acc + t.valor, 0)
    
    if (alimentacaoGasto > 500) {
      suggestions.push({
        categoria: "Alimentação",
        mensagem: "Seus gastos com alimentação estão elevados. Considere cozinhar mais em casa.",
        economia: alimentacaoGasto * 0.2
      })
    }

    const lazerGasto = transactions
      .filter(t => t.tipo === "despesa" && t.categoria === "lazer")
      .reduce((acc, t) => acc + t.valor, 0)
    
    if (lazerGasto > 300) {
      suggestions.push({
        categoria: "Lazer",
        mensagem: "Você pode economizar buscando opções de lazer gratuitas ou mais baratas.",
        economia: lazerGasto * 0.3
      })
    }

    return suggestions
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-2 shadow-lg">
                <Image 
                  src="/icon.svg" 
                  alt="Logo Controle Financeiro" 
                  width={48} 
                  height={48}
                  className="w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Controle Financeiro
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Olá, {user?.nome}! 👋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                title={darkMode ? "Modo Claro" : "Modo Escuro"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
              <button
                onClick={() => {
                  setShowForm(!showForm)
                  setEditingId(null)
                  setFormData({
                    tipo: "despesa",
                    valor: "",
                    categoria: "alimentacao",
                    descricao: "",
                    data: new Date().toISOString().split("T")[0],
                  })
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Nova Transação
              </button>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-300"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "orcamento", label: "Orçamento", icon: Wallet },
              { id: "metas", label: "Metas", icon: Target },
              { id: "lembretes", label: "Lembretes", icon: Bell },
              { id: "relatorios", label: "Relatórios", icon: TrendingUpIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Receitas</span>
                </div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Despesas</span>
                </div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Saldo</span>
                </div>
                <p className={`text-3xl font-bold ${saldo >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de Despesas */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Despesas por Categoria
                </h3>
                {despesasPorCategoria.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={despesasPorCategoria}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {despesasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-20">Nenhuma despesa registrada</p>
                )}
              </div>

              {/* Gráfico de Receitas */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  Receitas por Categoria
                </h3>
                {receitasPorCategoria.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={receitasPorCategoria}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#82ca9d"
                        dataKey="value"
                      >
                        {receitasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-20">Nenhuma receita registrada</p>
                )}
              </div>
            </div>

            {/* Evolução Patrimonial */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                Evolução Patrimonial
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={patrimonioData}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Area type="monotone" dataKey="valor" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Transações Recentes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Transações Recentes
              </h3>
              <div className="space-y-3">
                {transactions.slice(-5).reverse().map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.tipo === "receita" 
                          ? "bg-green-100 dark:bg-green-900/30" 
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        {transaction.tipo === "receita" ? (
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{transaction.descricao}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {getCategoriaLabel(transaction.categoria, transaction.tipo)} • {formatDate(transaction.data)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`text-lg font-bold ${
                        transaction.tipo === "receita" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {transaction.tipo === "receita" ? "+" : "-"} R$ {transaction.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Orçamento Tab */}
        {activeTab === "orcamento" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gerenciar Orçamento</h2>
              <button
                onClick={() => setShowBudgetForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Orçamento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const percentage = (budget.gasto / budget.limite) * 100
                const categoria = CATEGORIAS_DESPESA.find(c => c.value === budget.categoria)
                
                return (
                  <div key={budget.categoria} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{categoria?.label}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          R$ {budget.gasto.toFixed(2)} / R$ {budget.limite.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteBudget(budget.categoria)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <p className={`text-sm font-medium ${
                      percentage > 90 ? "text-red-600" : percentage > 70 ? "text-yellow-600" : "text-green-600"
                    }`}>
                      {percentage.toFixed(1)}% utilizado
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Budget Form Modal */}
            {showBudgetForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Adicionar Orçamento</h3>
                  <form onSubmit={handleBudgetSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Categoria
                      </label>
                      <select
                        value={budgetFormData.categoria}
                        onChange={(e) => setBudgetFormData({ ...budgetFormData, categoria: e.target.value as Category })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      >
                        {CATEGORIAS_DESPESA.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Limite (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={budgetFormData.limite}
                        onChange={(e) => setBudgetFormData({ ...budgetFormData, limite: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowBudgetForm(false)}
                        className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metas Tab */}
        {activeTab === "metas" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Metas de Economia</h2>
              <button
                onClick={() => {
                  setShowGoalForm(true)
                  setEditingGoalId(null)
                  setGoalFormData({ nome: "", valorAlvo: "", valorAtual: "", prazo: "" })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Meta
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savingsGoals.map((goal) => {
                const percentage = (goal.valorAtual / goal.valorAlvo) * 100
                
                return (
                  <div key={goal.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{goal.nome}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Prazo: {formatDate(goal.prazo)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          R$ {goal.valorAtual.toFixed(2)} / R$ {goal.valorAlvo.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {percentage.toFixed(1)}% concluído
                      </p>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Faltam: R$ {(goal.valorAlvo - goal.valorAtual).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Goal Form Modal */}
            {showGoalForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                    {editingGoalId ? "Editar Meta" : "Nova Meta"}
                  </h3>
                  <form onSubmit={handleGoalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nome da Meta
                      </label>
                      <input
                        type="text"
                        value={goalFormData.nome}
                        onChange={(e) => setGoalFormData({ ...goalFormData, nome: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Valor Alvo (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={goalFormData.valorAlvo}
                        onChange={(e) => setGoalFormData({ ...goalFormData, valorAlvo: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Valor Atual (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={goalFormData.valorAtual}
                        onChange={(e) => setGoalFormData({ ...goalFormData, valorAtual: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Prazo
                      </label>
                      <input
                        type="date"
                        value={goalFormData.prazo}
                        onChange={(e) => setGoalFormData({ ...goalFormData, prazo: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowGoalForm(false)
                          setEditingGoalId(null)
                        }}
                        className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        {editingGoalId ? "Atualizar" : "Criar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lembretes Tab */}
        {activeTab === "lembretes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lembretes de Pagamento</h2>
              <button
                onClick={() => {
                  setShowReminderForm(true)
                  setEditingReminderId(null)
                  setReminderFormData({ descricao: "", valor: "", dataVencimento: "", recorrente: false })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Lembrete
              </button>
            </div>

            <div className="space-y-4">
              {paymentReminders.map((reminder) => {
                const isOverdue = new Date(reminder.dataVencimento) < new Date()
                
                return (
                  <div key={reminder.id} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-l-4 ${
                    isOverdue ? "border-red-500" : "border-blue-500"
                  } border-slate-200 dark:border-slate-700`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{reminder.descricao}</h3>
                          {reminder.recorrente && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                              Recorrente
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                          R$ {reminder.valor.toFixed(2)}
                        </p>
                        <p className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-slate-600 dark:text-slate-400"}`}>
                          Vencimento: {formatDate(reminder.dataVencimento)}
                          {isOverdue && " - ATRASADO"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditReminder(reminder)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Reminder Form Modal */}
            {showReminderForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                    {editingReminderId ? "Editar Lembrete" : "Novo Lembrete"}
                  </h3>
                  <form onSubmit={handleReminderSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={reminderFormData.descricao}
                        onChange={(e) => setReminderFormData({ ...reminderFormData, descricao: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={reminderFormData.valor}
                        onChange={(e) => setReminderFormData({ ...reminderFormData, valor: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Data de Vencimento
                      </label>
                      <input
                        type="date"
                        value={reminderFormData.dataVencimento}
                        onChange={(e) => setReminderFormData({ ...reminderFormData, dataVencimento: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="recorrente"
                        checked={reminderFormData.recorrente}
                        onChange={(e) => setReminderFormData({ ...reminderFormData, recorrente: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="recorrente" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Pagamento recorrente
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReminderForm(false)
                          setEditingReminderId(null)
                        }}
                        className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        {editingReminderId ? "Atualizar" : "Criar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Relatórios Tab */}
        {activeTab === "relatorios" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Relatórios e Análises</h2>

            {/* Análise de Tendências */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                Sugestões de Economia
              </h3>
              {getAnalyseTrends().length > 0 ? (
                <div className="space-y-4">
                  {getAnalyseTrends().map((suggestion, index) => (
                    <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{suggestion.categoria}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{suggestion.mensagem}</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Economia potencial: R$ {suggestion.economia.toFixed(2)}/mês
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">Seus gastos estão equilibrados! Continue assim.</p>
              )}
            </div>

            {/* Comparativo Mensal */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Comparativo de Receitas vs Despesas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: "Receitas", valor: totalReceitas },
                  { name: "Despesas", valor: totalDespesas },
                  { name: "Saldo", valor: saldo },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="valor" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Resumo Financeiro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total de Receitas</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {totalReceitas.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total de Despesas</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    R$ {totalDespesas.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Saldo Atual</p>
                  <p className={`text-2xl font-bold ${saldo >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                    R$ {saldo.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Taxa de Economia</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {totalReceitas > 0 ? ((saldo / totalReceitas) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                {editingId ? "Editar Transação" : "Nova Transação"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tipo: "receita", categoria: "salario" })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.tipo === "receita"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tipo: "despesa", categoria: "alimentacao" })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.tipo === "despesa"
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      Despesa
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as Category })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                    required
                  >
                    {(formData.tipo === "despesa" ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA).map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    {editingId ? "Atualizar" : "Adicionar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
