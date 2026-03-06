import { NextRequest, NextResponse } from "next/server";

// Task types
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
}

// In-memory storage (database-ready architecture)
const tasksStore: Map<string, Task> = new Map();

// Seed some initial data
tasksStore.set("1", {
  id: "1",
  title: "Design System Implementation",
  description: "Create reusable components and design tokens",
  status: "in-progress",
  priority: "high",
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ["design", "frontend"],
});

tasksStore.set("2", {
  id: "2",
  title: "API Documentation",
  description: "Document all API endpoints with examples",
  status: "todo",
  priority: "medium",
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 86400000).toISOString(),
  tags: ["docs", "api"],
});

tasksStore.set("3", {
  id: "3",
  title: "Database Migration",
  description: "Migrate from in-memory to PostgreSQL",
  status: "done",
  priority: "high",
  createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  updatedAt: new Date(Date.now() - 86400000).toISOString(),
  tags: ["database", "backend"],
});

// GET all tasks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    let tasks = Array.from(tasksStore.values());

    // Server-side filtering
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (priority) {
      tasks = tasks.filter((task) => task.priority === priority);
    }

    // Sort by updatedAt descending
    tasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      count: tasks.length,
      data: tasks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Tasks GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, status = "todo", priority = "medium", dueDate, tags = [] } = body;

    // Server-side validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title must be less than 200 characters" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      status,
      priority,
      createdAt: now,
      updatedAt: now,
      dueDate,
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [], // Max 5 tags
    };

    tasksStore.set(newTask.id, newTask);

    return NextResponse.json({
      success: true,
      data: newTask,
      message: "Task created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Tasks POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PUT update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = tasksStore.get(id);
    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Server-side validation for updates
    if (updates.title !== undefined) {
      if (updates.title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      if (updates.title.length > 200) {
        return NextResponse.json(
          { error: "Title must be less than 200 characters" },
          { status: 400 }
        );
      }
    }

    const validStatuses = ["todo", "in-progress", "done"];
    if (updates.status && !validStatuses.includes(updates.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const validPriorities = ["low", "medium", "high"];
    if (updates.priority && !validPriorities.includes(updates.priority)) {
      return NextResponse.json(
        { error: "Invalid priority" },
        { status: 400 }
      );
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      id: existingTask.id, // Prevent ID change
      createdAt: existingTask.createdAt, // Prevent creation date change
      updatedAt: new Date().toISOString(),
      tags: updates.tags ? updates.tags.slice(0, 5) : existingTask.tags,
    };

    tasksStore.set(id, updatedTask);

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Tasks PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = tasksStore.get(id);
    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    tasksStore.delete(id);

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Tasks DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
