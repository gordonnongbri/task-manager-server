import prisma from '../utils/prisma.js';

const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export async function getTasks(req, res, next) {
  try {
    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;

    const where = { userId: req.user.id };
    if (status && VALID_STATUSES.includes(status)) where.status = status;
    if (priority && VALID_PRIORITIES.includes(priority)) where.priority = priority;

    const orderBy = {};
    const sortableFields = ['createdAt', 'updatedAt', 'dueDate', 'title'];
    orderBy[sortableFields.includes(sort) ? sort : 'createdAt'] = order === 'asc' ? 'asc' : 'desc';

    const tasks = await prisma.task.findMany({ where, orderBy });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) return res.status(404).json({ error: 'Task not found.' });
    if (task.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' });

    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: 'title is required.' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}.` });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}.` });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id
      }
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!existing) return res.status(404).json({ error: 'Task not found.' });
    if (existing.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' });

    const { title, description, status, priority, dueDate } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}.` });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}.` });
    }

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({ where: { id: req.params.id }, data });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!existing) return res.status(404).json({ error: 'Task not found.' });
    if (existing.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' });

    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
}
