const prisma = require("../../lib/prisma");

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const where = { userId: req.user.id };
    if (req.query.status) where.status = req.query.status.toUpperCase();
    if (req.query.priority) where.priority = req.query.priority.toUpperCase();

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tasks/:id
// GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    if (error.code === "P2023") {
      return res.status(400).json({ message: "Invalid Task ID format" });
    }
    console.error("Get Task Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status?.toUpperCase(),
        priority: priority?.toUpperCase(),
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    // 1. Check if body is empty or missing
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }

    // 2. Check if task exists and belongs to the user
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ message: 'Task not found' });

    // 3. Build the update object
    const { title, description, status, priority, dueDate } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status.toUpperCase();
    if (priority !== undefined) data.priority = priority.toUpperCase();
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    // 4. Update the task
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
    });
    
    res.json(task);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ message: "Task not found" });

    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: "Task removed", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
