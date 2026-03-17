"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  X, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Filter,
  Search,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target
} from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface Analytics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  averageTransaction: number;
  topCategories: Array<{ category: string; amount: number; count: number }>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Business", "Other Income"],
  expense: ["Food", "Transport", "Housing", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
};

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newTransaction, setNewTransaction] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
  });

  // Fetch transactions and analytics
  const fetchData = async () => {
    try {
      const response = await fetch("/api/transactions?analytics=true");
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create transaction
  const createTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.category) return;

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount) || 0
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        setNewTransaction({
          type: "expense",
          amount: "",
          category: "",
          description: "",
          date: new Date().toISOString().split('T')[0],
          tags: [],
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        setShowModal(false);
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Mini chart components
  const MonthlyTrendChart = ({ data }: { data: Analytics['monthlyTrend'] }) => {
    const maxAmount = Math.max(...data.flatMap(d => [d.income, d.expenses]));
    
    return (
      <div className="relative h-32 flex items-end justify-between gap-2">
        {data.map((month, index) => (
          <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1">
              <div
                className="flex-1 bg-green-500 rounded-t"
                style={{ height: `${(month.income / maxAmount) * 100}%` }}
                title={`Income: $${month.income.toLocaleString()}`}
              />
              <div
                className="flex-1 bg-red-500 rounded-t"
                style={{ height: `${(month.expenses / maxAmount) * 100}%` }}
                title={`Expenses: $${month.expenses.toLocaleString()}`}
              />
            </div>
            <div className="text-xs text-gray-500 transform -rotate-45 origin-center">
              {month.month.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const CategoryPieChart = ({ data }: { data: Analytics['topCategories'] }) => {
    const total = data.reduce((sum, cat) => sum + cat.amount, 0);
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    
    return (
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full overflow-hidden flex">
          {data.map((category, index) => {
            const percentage = (category.amount / total) * 100;
            const rotation = data.slice(0, index).reduce((sum, cat) => sum + (cat.amount / total) * 360, 0);
            
            return (
              <div
                key={category.category}
                className={`${colors[index % colors.length]}`}
                style={{
                  width: `${percentage}%`,
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'left center',
                }}
              />
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold">${total.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url(/images/Incomeandexpensebg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Income & Expense Tracker
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your income and expenses with powerful analytics and real-time insights. Built with secure transaction APIs and smart financial calculations.
            </p>
          </motion.div>

          {/* Analytics Overview */}
          {analytics && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">+12.5%</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    ${analytics.totalIncome.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Income</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-xs text-red-600 font-medium">-8.3%</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    ${analytics.totalExpenses.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Expenses</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wallet className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className={`text-xs font-medium ${
                      analytics.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analytics.balance >= 0 ? '+' : ''}{((analytics.balance / analytics.totalIncome) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${
                    analytics.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(analytics.balance).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Net Balance</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">Avg</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    ${analytics.averageTransaction.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">Avg Transaction</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Charts */}
          {analytics && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Trend */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Monthly Trend</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <MonthlyTrendChart data={analytics.monthlyTrend} />
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-gray-600">Income</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-gray-600">Expenses</span>
                    </div>
                  </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Top Categories</h3>
                    <PieChart className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-6">
                    <CategoryPieChart data={analytics.topCategories} />
                    <div className="flex-1 space-y-2">
                      {analytics.topCategories.map((category, index) => (
                        <div key={category.category} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded bg-${['blue', 'green', 'yellow', 'purple', 'pink'][index % 5]}-500`}></div>
                            <span>{category.category}</span>
                          </div>
                          <span className="font-medium">${category.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as "all" | "income" | "expense")}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {Object.values(CATEGORIES).flat().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Add Transaction Button */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-500">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-semibold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setNewTransaction({
                              type: transaction.type,
                              amount: transaction.amount.toString(),
                              category: transaction.category,
                              description: transaction.description,
                              date: transaction.date,
                              tags: transaction.tags,
                            });
                            setShowModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Transaction Modal */}
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingTransaction(null);
                      setNewTransaction({
                        type: "expense",
                        amount: "",
                        category: "",
                        description: "",
                        date: new Date().toISOString().split('T')[0],
                        tags: [],
                      });
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction(prev => ({ 
                        ...prev, 
                        type: e.target.value as "income" | "expense",
                        category: "" // Reset category when type changes
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES[newTransaction.type].map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (editingTransaction) {
                          updateTransaction(editingTransaction.id, {
                            ...newTransaction,
                            amount: parseFloat(newTransaction.amount) || 0
                          });
                        } else {
                          createTransaction();
                        }
                      }}
                      disabled={!newTransaction.amount || !newTransaction.category}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {editingTransaction ? "Update" : "Add Transaction"}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Security Info */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">i</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Secure Transaction Processing</p>
                  <p className="text-blue-700">
                    All transactions are processed with server-side validation and security measures. 
                    Financial calculations are performed using smart algorithms to ensure accuracy and reliability.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
