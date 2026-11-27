// data.js — the Alvarez family's November 2026 figures, kept apart from
// the code that shows them, so a figure can be checked in one place.
//
// Income: Maya's salary lands on the 1st, Leo's freelance on the 7th.
// Budgets: what the family agreed to spend per category this month.
// Goals: the three things they are saving for, with a monthly plan.
// Monthly: what the family actually spent in each month of 2026.
// Bills: the fixed payments still due before the month ends.

export const household = {
  name: "Alvarez family",
  month: "November 2026",
  members: 4,
  income: [
    { label: "Salary — Maya Alvarez", amount: 4850, day: "1 Nov" },
    { label: "Freelance design — Leo Alvarez", amount: 320, day: "7 Nov" },
  ],
  budgets: [
    { category: "Housing", planned: 1450, note: "Rent, Maple Street apartment" },
    { category: "Food", planned: 820, note: "Groceries, market and takeaway" },
    { category: "Transport", planned: 340, note: "Bus passes, fuel and train" },
    { category: "Utilities", planned: 310, note: "Electricity, water, internet, phone" },
    { category: "Health", planned: 220, note: "Pharmacy and dentist" },
    { category: "Fun", planned: 260, note: "Cinema, gifts and books" },
  ],
  goals: [
    { name: "Emergency fund", target: 6000, saved: 4350, plan: "$650 a month until March 2027" },
    { name: "Summer trip to Lisbon", target: 2400, saved: 980, plan: "$210 a month, flights in June" },
    { name: "New washing machine", target: 750, saved: 620, plan: "Almost there — $130 to go" },
  ],
  monthly: [
    { month: "Jan", spent: 3120 }, { month: "Feb", spent: 2980 },
    { month: "Mar", spent: 3410 }, { month: "Apr", spent: 3050 },
    { month: "May", spent: 3280 }, { month: "Jun", spent: 3560 },
    { month: "Jul", spent: 3390 }, { month: "Aug", spent: 3210 },
    { month: "Sep", spent: 3080 }, { month: "Oct", spent: 3240 },
    { month: "Nov", spent: 3141 },
  ],
  billsDue: [
    { label: "Water bill — second half", amount: 51, due: "28 Nov" },
    { label: "Bus passes — December", amount: 96, due: "30 Nov" },
  ],
};

export const seedTransactions = [
  { id: 1, date: "2026-11-01", desc: "Rent, Maple Street apartment", cat: "Housing", type: "expense", amount: 1450 },
  { id: 2, date: "2026-11-01", desc: "Salary, Maya Alvarez", cat: "Income", type: "income", amount: 4850 },
  { id: 3, date: "2026-11-03", desc: "Weekly groceries, GreenMart", cat: "Food", type: "expense", amount: 186 },
  { id: 4, date: "2026-11-04", desc: "Electricity bill", cat: "Utilities", type: "expense", amount: 128 },
  { id: 5, date: "2026-11-06", desc: "Bus passes, family", cat: "Transport", type: "expense", amount: 96 },
  { id: 6, date: "2026-11-07", desc: "Freelance design, Leo Alvarez", cat: "Income", type: "income", amount: 320 },
  { id: 7, date: "2026-11-08", desc: "Groceries, GreenMart", cat: "Food", type: "expense", amount: 142 },
  { id: 8, date: "2026-11-10", desc: "Internet + phone", cat: "Utilities", type: "expense", amount: 89 },
  { id: 9, date: "2026-11-11", desc: "Pharmacy, Sofia", cat: "Health", type: "expense", amount: 64 },
  { id: 10, date: "2026-11-12", desc: "Fuel, family car", cat: "Transport", type: "expense", amount: 58 },
  { id: 11, date: "2026-11-14", desc: "Cinema night, family of 4", cat: "Fun", type: "expense", amount: 72 },
  { id: 12, date: "2026-11-15", desc: "Groceries, farmers market", cat: "Food", type: "expense", amount: 98 },
  { id: 13, date: "2026-11-17", desc: "Water bill", cat: "Utilities", type: "expense", amount: 51 },
  { id: 14, date: "2026-11-19", desc: "Dentist check, Leo", cat: "Health", type: "expense", amount: 81 },
  { id: 15, date: "2026-11-20", desc: "Groceries, GreenMart", cat: "Food", type: "expense", amount: 164 },
  { id: 16, date: "2026-11-21", desc: "Train tickets, weekend visit", cat: "Transport", type: "expense", amount: 133 },
  { id: 17, date: "2026-11-22", desc: "Birthday gift, Grandma Rosa", cat: "Fun", type: "expense", amount: 48 },
  { id: 18, date: "2026-11-24", desc: "Takeaway dinner, Friday", cat: "Food", type: "expense", amount: 94 },
  { id: 19, date: "2026-11-25", desc: "Books + school supplies", cat: "Fun", type: "expense", amount: 78 },
  { id: 20, date: "2026-11-26", desc: "Groceries, GreenMart", cat: "Food", type: "expense", amount: 87 },
  { id: 21, date: "2026-11-27", desc: "School lunch money, Sofia", cat: "Food", type: "expense", amount: 22 },
];

export const categories = ["Housing", "Food", "Transport", "Utilities", "Health", "Fun", "Income"];

export const totalPlanned = household.budgets.reduce((sum, b) => sum + b.planned, 0);
