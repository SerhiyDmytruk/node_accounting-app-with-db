'use strict';

const { User } = require('./User.model');
const { Expense } = require('./Expense.model');

module.exports = {
  models: {
    User,
    Expense,
  },
};

User.hasMany(Expense, { foreignKey: 'userId', constraints: false });
Expense.belongsTo(User, { foreignKey: 'userId', constraints: false });
