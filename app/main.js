// main.js — the router. It reads the hash, marks the matching nav link
// active, and hands the page to the right renderer in views.js.
// Routes: #/ dashboard, #/transactions, #/budget, #/goals, #/reports.
// A query string after a route (for example ?cat=Food) is for that
// page's filters; the route itself is the part before the "?".

import { renderDashboard, renderTransactions, renderBudget, renderGoals, renderReports } from "./views.js";

function markActiveNav(route) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const wanted = link.dataset.nav === "dashboard" ? "" : link.dataset.nav;
    link.classList.toggle("active", wanted === route);
  });
}

function route() {
  const hash = location.hash.split("?")[0];
  const routeName = hash === "#/transactions" ? "transactions"
    : hash === "#/budget" ? "budget"
    : hash === "#/goals" ? "goals"
    : hash === "#/reports" ? "reports"
    : "dashboard";
  markActiveNav(routeName);
  if (routeName === "transactions") renderTransactions();
  else if (routeName === "budget") renderBudget();
  else if (routeName === "goals") renderGoals();
  else if (routeName === "reports") renderReports();
  else renderDashboard();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
