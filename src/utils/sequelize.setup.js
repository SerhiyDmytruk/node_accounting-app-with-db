import { User } from '../models/User.model.js';
import { Expense } from '../models/Expense.model.js';

User.sync({ force: true });
Expense.sync({ force: true });
