const { Op } = require('sequelize');

const {
  models: { Expense, User },
} = require('../models/models');

function handleControllerError(res, action, error) {
  // eslint-disable-next-line no-console
  console.error(`Smth bad with: ${action}`, error);
  res.sendStatus(500);
}

async function getAllExpenses(req, res) {
  try {
    const { userId, categories, from, to } = req.query;

    const where = {};

    if (userId) {
      where.userId = Number(userId);
    }

    if (categories) {
      where.category = categories;
    }

    if (from || to) {
      where.spentAt = {};

      if (from) {
        where.spentAt[Op.gte] = new Date(from);
      }

      if (to) {
        where.spentAt[Op.lte] = new Date(to);
      }
    }

    const expenses = await Expense.findAll({
      where,
      order: [['id', 'ASC']],
    });

    res.send(expenses);
  } catch (error) {
    handleControllerError(res, 'getAllExpenses', error);
  }
}

async function getExpenseById(req, res) {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(Number(id));

    if (!expense) {
      return res.sendStatus(404);
    }

    res.status(200).send(expense);
  } catch (error) {
    handleControllerError(res, 'getExpenseById', error);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(Number(id));

    if (!expense) {
      return res.status(404).json({ error: 'Not found' });
    }

    await expense.destroy();

    return res.sendStatus(204);
  } catch (error) {
    handleControllerError(res, 'remove', error);
  }
}

async function create(req, res) {
  try {
    const { userId, spentAt, title, amount, category, note } = req.body;

    if (userId === undefined || !spentAt || !title || amount === undefined) {
      return res.status(400).json({ error: 'Bad Request' });
    }

    const user = await User.findByPk(Number(userId));

    if (!user) {
      return res.sendStatus(400);
    }

    const expense = await Expense.create({
      userId,
      spentAt,
      title,
      amount,
      category,
      note,
    });

    res.status(201).send(expense);
  } catch (error) {
    handleControllerError(res, 'create', error);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const expens = await Expense.findByPk(Number(id));

    if (!expens) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Bad Request' });
    }

    expens.title = title;
    await expens.save();

    return res.status(200).send(expens);
  } catch (error) {
    handleControllerError(res, 'update', error);
  }
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  remove,
  create,
  update,
};
