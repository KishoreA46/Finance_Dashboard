import { subMonths, startOfMonth, endOfMonth, addDays, format } from 'date-fns';

const categories = [
  { name: 'Food', type: 'expense' },
  { name: 'Rent', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Transport', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Healthcare', type: 'expense' },
  { name: 'Utilities', type: 'expense' }
];

const generateMockData = () => {
  const transactions = [];
  let id = 1;

  for (let i = 0; i < 6; i++) {
    const monthDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(monthDate);
    
    transactions.push({
      id: id++,
      date: format(addDays(monthStart, 0), 'yyyy-MM-dd'),
      amount: 5000,
      category: 'Salary',
      type: 'income',
      description: 'Monthly Salary'
    });

    transactions.push({
      id: id++,
      date: format(addDays(monthStart, 1), 'yyyy-MM-dd'),
      amount: 1200,
      category: 'Rent',
      type: 'expense',
      description: 'Apartment Rent'
    });

    transactions.push({
      id: id++,
      date: format(addDays(monthStart, 5), 'yyyy-MM-dd'),
      amount: 150 + Math.floor(Math.random() * 100),
      category: 'Utilities',
      type: 'expense',
      description: 'Electricity & Water'
    });

    if (Math.random() > 0.6) {
      transactions.push({
        id: id++,
        date: format(addDays(monthStart, 12 + Math.floor(Math.random() * 5)), 'yyyy-MM-dd'),
        amount: 800 + Math.floor(Math.random() * 1500),
        category: 'Healthcare',
        type: 'expense',
        description: 'Unexpected Medical Bill / Repair'
      });
    }

    if (Math.random() > 0.3) {
      transactions.push({
        id: id++,
        date: format(addDays(monthStart, 20 + Math.floor(Math.random() * 5)), 'yyyy-MM-dd'),
        amount: 1500 + Math.floor(Math.random() * 3500),
        category: 'Freelance',
        type: 'income',
        description: 'Large Client Project'
      });
    }

    for (let j = 0; j < 5; j++) {
      transactions.push({
        id: id++,
        date: format(addDays(monthStart, 2 + j * 6), 'yyyy-MM-dd'),
        amount: 30 + Math.floor(Math.random() * 300),
        category: 'Food',
        type: 'expense',
        description: `Grocery / Dining Out ${j + 1}`
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const initialTransactions = generateMockData();
