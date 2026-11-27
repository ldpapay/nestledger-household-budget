// views.js — one renderer per section of the site. Each renderer takes
// the live state and returns nothing; it writes its HTML into #app and
// wires up the controls on that page. All figures come from store.js,
// so a transaction added on one page changes every other page.

import { household, categories, totalPlanned } from "./data.js";
import { state, saveState, totalIncome, totalSpent, spentIn, addTransaction, deleteTransaction } from "./store.js";
import { money, signedMoney, percent, clampPercent, escapeHtml, shortDate, daysLeftInMonth } from "./format.js";

const app = document.getElementById("app");

function statCard(label, figure, sub, accent) {
  return `<div class="stat-card"><div class="label">${label}</div>` +
    `<div class="figure${accent ? " accent" : ""}">${figure}</div>` +
    `<div class="sub">${sub}</div></div>`;
}

function budgetRow(budget) {
  const spent = spentIn(budget.category);
  const pct = clampPercent(spent, budget.planned);
  const over = spent > budget.planned;
  return `<div class="ledger-row"><span><strong>${budget.category}</strong><br>` +
    `<span class="muted">${money(spent)} of ${money(budget.planned)}</span></span>` +
    `<span class="num">${pct}%</span></div>` +
    `<div class="track${over ? " over" : ""}"><i style="width:${pct}%"></i></div>`;
}

function recentRows(count) {
  const recent = state.transactions.slice()
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
  return recent.map((t) =>
    `<div class="ledger-row"><span>${shortDate(t.date)} · ${escapeHtml(t.desc)}</span>` +
    `<span class="num">${signedMoney(t.amount, t.type)}</span></div>`).join("");
}

export function renderDashboard() {
  const income = totalIncome();
  const spent = totalSpent();
  const left = income - spent;
  const daysLeft = daysLeftInMonth("2026-11-27");
  const food = state.budgets.find((b) => b.category === "Food");
  const foodLeft = food ? food.planned - spentIn("Food") : 0;
  const fund = state.goals[0];
  const fundPct = clampPercent(fund.saved, fund.target);
  const billsTotal = household.billsDue.reduce((s, b) => s + b.amount, 0);

  app.innerHTML =
    `<p class="kicker">Dashboard · ${household.month}</p>` +
    `<h1>Good morning, Alvarez family</h1>` +
    `<p class="lead">November is on track. You have <strong>${money(left)}</strong> left ` +
    `after ${money(spent)} spent, with ${daysLeft} days to go. The emergency fund is ${fundPct}% full.</p>` +
    `<div class="stat-grid">` +
    statCard("Income", money(income), "Salary $4,850 + freelance $320") +
    statCard("Spent so far", money(spent), `${state.transactions.filter((t) => t.type === "expense").length} expenses in November`) +
    statCard("Left to spend", money(left), `${daysLeft} days left in November`, true) +
    statCard("Saved this month", "$650", "Emergency fund, auto-transfer on the 1st") +
    `</div>` +
    `<div class="notice"><strong>Tip:</strong> Food is ${money(foodLeft)} under budget with ` +
    `3 days left — nearly on plan. The ${money(left - 147)} left after the bills still due ` +
    `could go to the Lisbon trip. <a href="#/goals">See goals</a></div>` +
    `<div class="two-col"><div class="panel"><h2>Budget at a glance</h2>` +
    state.budgets.map(budgetRow).join("") +
    `<a class="btn" href="#/budget">Edit budgets</a></div>` +
    `<div><div class="panel"><h2>Recent activity</h2>${recentRows(6)}` +
    `<p><a href="#/transactions">All transactions</a></p></div>` +
    `<div class="panel"><h2>Top goal</h2><h3>${escapeHtml(fund.name)}</h3>` +
    `<p><span class="num">${money(fund.saved)} of ${money(fund.target)}</span>, ${fundPct}%</p>` +
    `<div class="track"><i style="width:${fundPct}%"></i></div>` +
    `<a class="btn secondary" href="#/goals">Add $50</a></div>` +
    `<div class="panel"><h2>Bills still due</h2>` +
    household.billsDue.map((b) =>
      `<div class="ledger-row"><span>${b.label}<br><span class="muted">Due ${b.due}</span></span>` +
      `<span class="num">${money(b.amount)}</span></div>`).join("") +
    `<div class="ledger-row total"><span>Total due</span><span class="num">${money(billsTotal)}</span></div>` +
    `<p class="muted">Both are covered by the money left to spend.</p></div>` +
    `</div></div>`;
}

export function renderTransactions() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const chosenCat = params.get("cat") || "All";
  const query = (params.get("q") || "").toLowerCase();
  const cats = ["All", ...categories];
  const list = state.transactions
    .filter((t) => (chosenCat === "All" || t.cat === chosenCat))
    .filter((t) => !query || t.desc.toLowerCase().includes(query))
    .slice().sort((a, b) => b.date.localeCompare(a.date));

  app.innerHTML =
    `<p class="kicker">Transactions · ${household.month}</p>` +
    `<h1>Transactions</h1>` +
    `<p class="lead">${state.transactions.length} transactions in November 2026. ` +
    `Add one below — it updates your dashboard and budgets instantly.</p>` +
    `<div class="toolbar">` +
    `<label>Category<br><select id="fcat">${cats.map((c) =>
      `<option${c === chosenCat ? " selected" : ""}>${c}</option>`).join("")}</select></label>` +
    `<label>Search<br><input id="fsearch" type="search" placeholder="e.g. groceries" value="${escapeHtml(params.get("q") || "")}"></label>` +
    `<button class="secondary" id="exportCsv" type="button">Download CSV</button>` +
    `<span>${list.length} shown · spent ${money(totalSpent())} · income ${money(totalIncome())}</span>` +
    `</div>` +
    `<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody>` +
    list.map((t) =>
      `<tr><td class="num">${t.date}</td><td>${escapeHtml(t.desc)}</td>` +
      `<td><span class="pill">${t.cat}</span></td>` +
      `<td class="num">${signedMoney(t.amount, t.type)}</td>` +
      `<td><button class="small secondary" data-del="${t.id}">Delete</button></td></tr>`).join("") +
    `</tbody></table>` +
    (list.length === 0 ? `<p class="muted">Nothing matches that search. Clear the search or pick another category.</p>` : "") +
    `<div class="panel"><h2>Add a transaction</h2>` +
    `<form id="addForm" class="form">` +
    `<div><label for="fdate">Date</label><input id="fdate" type="date" name="date" value="2026-11-27" required></div>` +
    `<div><label for="famount">Amount (USD)</label><input id="famount" type="number" name="amount" min="1" step="1" placeholder="45" required></div>` +
    `<div class="full"><label for="fdesc">Description</label><input id="fdesc" name="desc" placeholder="e.g. Weekly groceries, GreenMart" required></div>` +
    `<div><label for="fcat2">Category</label><select id="fcat2" name="cat">${categories.map((c) => `<option>${c}</option>`).join("")}</select></div>` +
    `<div><label for="ftype">Type</label><select id="ftype" name="type"><option value="expense">Expense</option><option value="income">Income</option></select></div>` +
    `<div class="full"><button type="submit">Add transaction</button> <span id="added"></span></div>` +
    `</form></div>`;

  document.getElementById("fcat").onchange = (e) => {
    location.hash = "#/transactions?cat=" + encodeURIComponent(e.target.value);
  };
  document.getElementById("fsearch").onchange = (e) => {
    const q = e.target.value.trim();
    location.hash = "#/transactions?cat=" + encodeURIComponent(chosenCat) + (q ? "&q=" + encodeURIComponent(q) : "");
  };
  document.getElementById("addForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    addTransaction({
      date: f.get("date"), desc: String(f.get("desc")).trim(),
      cat: f.get("cat"), type: f.get("type"), amount: Number(f.get("amount")),
    });
    document.getElementById("added").textContent = "Added. Totals updated.";
    setTimeout(() => { location.hash = "#/transactions"; location.reload(); }, 500);
  };
  document.getElementById("exportCsv").onclick = () => {
    const rows = [["date", "description", "category", "type", "amount"]]
      .concat(state.transactions.map((t) => [t.date, `"${t.desc.replace(/"/g, '""')}"`, t.cat, t.type, t.amount]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nestledger-november-2026.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  app.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = () => {
      if (window.confirm("Delete this transaction?")) {
        deleteTransaction(btn.dataset.del);
        location.reload();
      }
    };
  });
}

export function renderBudget() {
  const spent = totalSpent();
  app.innerHTML =
    `<p class="kicker">Budget · ${household.month}</p>` +
    `<h1>Budget, November 2026</h1>` +
    `<p class="lead">Total planned: ${money(totalPlanned)}. Total spent so far: ${money(spent)}. ` +
    `Change any budget below and the bars update right away.</p>` +
    state.budgets.map((b, i) => {
      const s = spentIn(b.category);
      const pct = clampPercent(s, b.planned);
      const remaining = b.planned - s;
      return `<div class="panel"><h3>${b.category} — ${money(s)} of ${money(b.planned)}</h3>` +
        `<p class="muted">${b.note}</p>` +
        `<div class="track${s > b.planned ? " over" : ""}"><i style="width:${pct}%"></i></div>` +
        `<p>${pct}% used. ${remaining >= 0 ? money(remaining) + " left." : money(-remaining) + " over budget — move money from Fun or Food."}</p>` +
        `<label for="budget${i}">Monthly budget for ${b.category} ($)</label>` +
        `<input id="budget${i}" type="number" data-budget="${i}" value="${b.planned}" min="0" step="10"> ` +
        `<button class="small" data-save="${i}">Save</button> <span id="saved${i}"></span></div>`;
    }).join("") +
    `<div class="panel"><h2>How to stay on track</h2>` +
    `<ol class="checklist"><li>Check this page every Sunday night.</li>` +
    `<li>Move money between categories instead of overspending one.</li>` +
    `<li>Anything left on the 30th goes to the emergency fund.</li>` +
    `<li>Food is the flexible one — a home-cooked week saves about $60.</li></ol>` +
    `<a class="btn" href="#/transactions">Review transactions</a></div>`;

  app.querySelectorAll("[data-save]").forEach((btn) => {
    btn.onclick = () => {
      const i = Number(btn.dataset.save);
      const value = Number(document.querySelector(`[data-budget="${i}"]`).value);
      if (value >= 0) {
        state.budgets[i].planned = value;
        saveState();
        document.getElementById("saved" + i).textContent = "Saved.";
        setTimeout(() => location.reload(), 500);
      }
    };
  });
}

export function renderGoals() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  app.innerHTML =
    `<p class="kicker">Savings goals · ${household.month}</p>` +
    `<h1>Savings goals</h1>` +
    `<p class="lead">${state.goals.length} goals, ${money(totalSaved)} saved toward ` +
    `${money(totalTarget)} in total. Add money to a goal and watch the bar move.</p>` +
    state.goals.map((g, i) => {
      const pct = clampPercent(g.saved, g.target);
      return `<div class="goal-card"><h3>${escapeHtml(g.name)}</h3>` +
        `<p><span class="num">${money(g.saved)} of ${money(g.target)}</span>, ${pct}% · ${escapeHtml(g.plan)}</p>` +
        `<div class="track"><i style="width:${pct}%"></i></div>` +
        `<div class="goal-actions"><button data-add50="${i}">Add $50</button>` +
        `<button class="secondary" data-add100="${i}">Add $100</button></div></div>`;
    }).join("") +
    `<div class="panel"><h2>New goal</h2>` +
    `<form id="goalForm" class="form">` +
    `<div><label for="gname">Goal name</label><input id="gname" name="name" placeholder="e.g. New bikes for the kids" required></div>` +
    `<div><label for="gtarget">Target ($)</label><input id="gtarget" type="number" name="target" min="50" placeholder="800" required></div>` +
    `<div class="full"><button>Add goal</button></div></form></div>`;

  const bump = (index, amount) => {
    state.goals[index].saved = Math.min(state.goals[index].target, state.goals[index].saved + amount);
    saveState();
    location.reload();
  };
  app.querySelectorAll("[data-add50]").forEach((b) => { b.onclick = () => bump(Number(b.dataset.add50), 50); });
  app.querySelectorAll("[data-add100]").forEach((b) => { b.onclick = () => bump(Number(b.dataset.add100), 100); });
  document.getElementById("goalForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    state.goals.push({ name: String(f.get("name")).trim(), target: Number(f.get("target")), saved: 0, plan: "Just started" });
    saveState();
    location.reload();
  };
}

export function renderReports() {
  const months = household.monthly;
  const max = Math.max(...months.map((m) => m.spent));
  const yearTotal = months.reduce((s, m) => s + m.spent, 0);
  const average = Math.round(yearTotal / months.length);
  const best = months.reduce((a, b) => (b.spent < a.spent ? b : a));
  const worst = months.reduce((a, b) => (b.spent > a.spent ? b : a));
  const housingShare = percent(spentIn("Housing"), totalSpent());
  const foodShare = percent(spentIn("Food"), totalSpent());

  app.innerHTML =
    `<p class="kicker">Reports · January to November 2026</p>` +
    `<h1>Reports</h1>` +
    `<p class="lead">Spending is steady: ${money(best.spent)} to ${money(worst.spent)} a month this year. ` +
    `November, at ${money(months[10].spent)}, is the second-lowest month so far.</p>` +
    `<div class="panel"><h2>Spending by month, 2026</h2>` +
    `<div class="chart">${months.map((m) =>
      `<div style="height:${Math.round((m.spent / max) * 100)}%" title="${m.month}: ${money(m.spent)}"></div>`).join("")}</div>` +
    `<div class="chart-labels">${months.map((m) => `<span>${m.month}</span>`).join("")}</div>` +
    `<p>November: <strong class="num">${money(months[10].spent)}</strong>. ` +
    `Average: <strong class="num">${money(average)}</strong>. ` +
    `Total January–November: <strong class="num">${money(yearTotal)}</strong>.</p>` +
    `<p class="muted">Lowest month: ${best.month} (${money(best.spent)}). Highest: ${worst.month} (${money(worst.spent)}).</p></div>` +
    `<div class="panel"><h2>Spending by category, November</h2>` +
    state.budgets.map((b) =>
      `<div class="ledger-row"><span>${b.category}</span><strong class="num">${money(spentIn(b.category))}</strong></div>`).join("") +
    `<div class="ledger-row total"><span>Total spent</span><strong class="num">${money(totalSpent())}</strong></div></div>` +
    `<div class="panel"><h2>Where the money goes</h2>` +
    `<p>Housing is ${housingShare}% of spending, Food ${foodShare}%. Fun is down from $312 in October ` +
    `to ${money(spentIn("Fun"))} — the cinema-and-cooking-at-home plan is working.</p>` +
    `<p>Income this month is ${money(totalIncome())}, so the family keeps ` +
    `${money(totalIncome() - totalSpent())} after spending, before the $650 emergency-fund transfer.</p>` +
    `<a class="btn" href="#/budget">Adjust budgets</a></div>`;
}
