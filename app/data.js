export const household = {
  name: "Alvarez family",
  month: "November 2026",
  income: [
    { label: "Salary, Maya Alvarez", amount: 4850 },
    { label: "Freelance design, Leo Alvarez", amount: 320 }
  ],
  budgets: [
    { cat: "Housing", budget: 1450, spent: 1450 },
    { cat: "Food", budget: 820, spent: 684 },
    { cat: "Transport", budget: 340, spent: 287 },
    { cat: "Utilities", budget: 310, spent: 268 },
    { cat: "Health", budget: 220, spent: 145 },
    { cat: "Fun", budget: 260, spent: 198 }
  ],
  goals: [
    { name: "Emergency fund", target: 6000, saved: 4350, note: "$650 / month until March 2027" },
    { name: "Summer trip to Lisbon", target: 2400, saved: 980, note: "$210 / month, flights in June" },
    { name: "New washing machine", target: 750, saved: 620, note: "Almost there, $130 to go" }
  ],
  monthly: [
    { m: "Jan", spent: 3120 }, { m: "Feb", spent: 2980 }, { m: "Mar", spent: 3410 },
    { m: "Apr", spent: 3050 }, { m: "May", spent: 3280 }, { m: "Jun", spent: 3560 },
    { m: "Jul", spent: 3390 }, { m: "Aug", spent: 3210 }, { m: "Sep", spent: 3080 },
    { m: "Oct", spent: 3240 }, { m: "Nov", spent: 3332 }
  ]
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
  { id: 19, date: "2026-11-25", desc: "Books + school supplies", cat: "Fun", type: "expense", amount: 78 }
];
export const money = n => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
