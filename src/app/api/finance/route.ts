import { NextRequest, NextResponse } from "next/server";

// Transaction types
interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

interface Analytics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: Record<string, { amount: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; income: number; expense: number }>;
}

// In-memory storage (database-ready architecture)
const transactionsStore: Map<string, Transaction> = new Map();

// Seed initial data
const categories = ["Food", "Transport", "Entertainment", "Salary", "Freelance", "Utilities", "Shopping"];

// Generate sample transactions for the last 6 months
const today = new Date();
for (let i = 0; i < 25; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() - Math.floor(Math.random() * 180));

  const type: "income" | "expense" = Math.random() > 0.7 ? "income" : "expense";
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = type === "income"
    ? Math.floor(Math.random() * 5000) + 1000
    : Math.floor(Math.random() * 200) + 20;

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    amount,
    type,
    category,
    description: `${category} - ${type === "income" ? "Payment" : "Purchase"}`,
    date: date.toISOString().split("T")[0],
    createdAt: date.toISOString(),
  };

  transactionsStore.set(transaction.id, transaction);
}

// Calculate analytics on the server
function calculateAnalytics(): Analytics {
  const transactions = Array.from(transactionsStore.values());

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const categoryBreakdown: Record<string, { amount: number; percentage: number }> = {};
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    categoryBreakdown[cat] = {
      amount,
      percentage: totalExpenses > 0 ? parseFloat(((amount / totalExpenses) * 100).toFixed(1)) : 0,
    };
  });

  // Monthly trend
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });

  const monthlyTrend = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([month, data]) => ({
      month,
      income: parseFloat(data.income.toFixed(2)),
      expense: parseFloat(data.expense.toFixed(2)),
    }));

  return {
    totalIncome: parseFloat(totalIncome.toFixed(2)),
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    balance: parseFloat((totalIncome - totalExpenses).toFixed(2)),
    categoryBreakdown,
    monthlyTrend,
  };
}

// GET transactions and analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const includeAnalytics = searchParams.get("analytics") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let transactions = Array.from(transactionsStore.values());

    // Server-side filtering
    if (type) {
      transactions = transactions.filter((t) => t.type === type);
    }
    if (category) {
      transactions = transactions.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply limit
    transactions = transactions.slice(0, limit);

    const response: {
      success: boolean;
      count: number;
      data: Transaction[];
      analytics?: Analytics;
      timestamp: string;
    } = {
      success: true,
      count: transactions.length,
      data: transactions,
      timestamp: new Date().toISOString(),
    };

    if (includeAnalytics) {
      response.analytics = calculateAnalytics();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Finance GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST create transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, type, category, description, date } = body;

    // Server-side validation
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Valid positive amount is required" },
        { status: 400 }
      );
    }

    if (!type || !["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    if (!category || category.trim().length === 0) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (category.length > 50) {
      return NextResponse.json(
        { error: "Category must be less than 50 characters" },
        { status: 400 }
      );
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount.toFixed(2)),
      type,
      category: category.trim(),
      description: description?.trim() || "",
      date: date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    transactionsStore.set(newTransaction.id, newTransaction);

    return NextResponse.json({
      success: true,
      data: newTransaction,
      analytics: calculateAnalytics(),
      message: "Transaction created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Finance POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// DELETE transaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const existing = transactionsStore.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    transactionsStore.delete(id);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
      deletedId: id,
      analytics: calculateAnalytics(),
    });
  } catch (error) {
    console.error("Finance DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
