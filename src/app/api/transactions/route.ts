import { NextRequest, NextResponse } from "next/server";

// Transaction types
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

// Categories
const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Business", "Other Income"],
  expense: ["Food", "Transport", "Housing", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
};

// In-memory storage (database-ready architecture)
const transactionsStore: Map<string, Transaction> = new Map();

// Seed some initial data
const seedData = [
  {
    id: "1",
    type: "income" as const,
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["monthly", "salary"],
  },
  {
    id: "2",
    type: "expense" as const,
    amount: 1200,
    category: "Housing",
    description: "Monthly rent",
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ["monthly", "rent"],
  },
  {
    id: "3",
    type: "expense" as const,
    amount: 350,
    category: "Food",
    description: "Groceries and dining",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["groceries"],
  },
  {
    id: "4",
    type: "income" as const,
    amount: 1500,
    category: "Freelance",
    description: "Web development project",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ["project", "freelance"],
  },
  {
    id: "5",
    type: "expense" as const,
    amount: 85,
    category: "Transport",
    description: "Gas and parking",
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["transport"],
  },
];

seedData.forEach(transaction => {
  transactionsStore.set(transaction.id, transaction);
});

// Security validation functions
const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && amount <= 10000000;
};

const validateCategory = (type: "income" | "expense", category: string): boolean => {
  return CATEGORIES[type].includes(category);
};

const sanitizeDescription = (description: string): string => {
  return description.trim().slice(0, 200);
};

const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  
  return dateObj instanceof Date && 
         !isNaN(dateObj.getTime()) && 
         dateObj >= oneYearAgo && 
         dateObj <= now;
};

// Calculate analytics
const calculateAnalytics = (transactions: Transaction[]): Analytics => {
  const income = transactions.filter(t => t.type === "income");
  const expenses = transactions.filter(t => t.type === "expense");
  
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const averageTransaction = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
    : 0;

  // Top categories by amount
  const categoryMap = new Map<string, { amount: number; count: number }>();
  transactions.forEach(t => {
    const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
    categoryMap.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Monthly trend (last 6 months)
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthlyMap.set(monthKey, { income: 0, expenses: 0 });
  }

  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const existing = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
    
    if (t.type === "income") {
      existing.income += t.amount;
    } else {
      existing.expenses += t.amount;
    }
    
    monthlyMap.set(monthKey, existing);
  });

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }));

  return {
    totalIncome,
    totalExpenses,
    balance,
    averageTransaction,
    topCategories,
    monthlyTrend,
  };
};

// GET all transactions with analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") as "income" | "expense" | null;
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const includeAnalytics = searchParams.get("analytics") === "true";

    let transactions = Array.from(transactionsStore.values());

    // Server-side filtering
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    if (category) {
      transactions = transactions.filter(t => t.category === category);
    }
    if (startDate && validateDate(startDate)) {
      transactions = transactions.filter(t => t.date >= startDate);
    }
    if (endDate && validateDate(endDate)) {
      transactions = transactions.filter(t => t.date <= endDate);
    }

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const response: any = {
      success: true,
      count: transactions.length,
      data: transactions,
      categories: CATEGORIES,
      timestamp: new Date().toISOString(),
    };

    if (includeAnalytics) {
      response.analytics = calculateAnalytics(transactions);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Transactions GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, category, description, date, tags = [] } = body;

    // Server-side validation
    if (!type || !["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Valid transaction type is required" },
        { status: 400 }
      );
    }

    if (!validateAmount(amount)) {
      return NextResponse.json(
        { error: "Amount must be a positive number less than 10,000,000" },
        { status: 400 }
      );
    }

    if (!validateCategory(type, category)) {
      return NextResponse.json(
        { error: `Invalid category for ${type} transaction` },
        { status: 400 }
      );
    }

    const sanitizedDescription = sanitizeDescription(description || "");
    const transactionDate = date || new Date().toISOString().split('T')[0];
    
    if (!validateDate(transactionDate)) {
      return NextResponse.json(
        { error: "Invalid date. Must be within the last year and not in the future" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      category,
      description: sanitizedDescription,
      date: transactionDate,
      createdAt: now,
      updatedAt: now,
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [], // Max 5 tags
    };

    transactionsStore.set(newTransaction.id, newTransaction);

    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: "Transaction created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Transactions POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// PUT update transaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const existingTransaction = transactionsStore.get(id);
    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Validate updates
    if (updates.amount !== undefined && !validateAmount(updates.amount)) {
      return NextResponse.json(
        { error: "Amount must be a positive number less than 10,000,000" },
        { status: 400 }
      );
    }

    if (updates.type && !["income", "expense"].includes(updates.type)) {
      return NextResponse.json(
        { error: "Valid transaction type is required" },
        { status: 400 }
      );
    }

    if (updates.category && updates.type && !validateCategory(updates.type, updates.category)) {
      return NextResponse.json(
        { error: `Invalid category for ${updates.type} transaction` },
        { status: 400 }
      );
    }

    if (updates.date && !validateDate(updates.date)) {
      return NextResponse.json(
        { error: "Invalid date. Must be within the last year and not in the future" },
        { status: 400 }
      );
    }

    const updatedTransaction: Transaction = {
      ...existingTransaction,
      ...updates,
      id: existingTransaction.id, // Prevent ID change
      createdAt: existingTransaction.createdAt, // Prevent creation date change
      updatedAt: new Date().toISOString(),
      amount: updates.amount ? Math.round(updates.amount * 100) / 100 : existingTransaction.amount,
      description: updates.description !== undefined 
        ? sanitizeDescription(updates.description) 
        : existingTransaction.description,
      tags: updates.tags ? updates.tags.slice(0, 5) : existingTransaction.tags,
    };

    transactionsStore.set(id, updatedTransaction);

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error("Transactions PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
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

    const existingTransaction = transactionsStore.get(id);
    if (!existingTransaction) {
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
    });
  } catch (error) {
    console.error("Transactions DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
