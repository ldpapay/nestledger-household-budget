import { household, seedTransactions, money } from "./data.js";
const KEY = "nestledger-nov2026-v1";
let txs = [];
try { txs = JSON.parse(localStorage.getItem(KEY)) || seedTransactions.slice(); } catch(e) { txs = seedTransactions.slice(); }
if (!txs.length) txs = seedTransactions.slice();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(txs)); } catch(e) {} };
const app = document.getElementById("app");
const income = () => txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
const spent = () => txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
const catSpent = c => txs.filter(t=>t.cat===c && t.type==="expense").reduce((s,t)=>s+t.amount,0);
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function nav(){ document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active", "#/"+a.dataset.nav === location.hash.replace("#/","#/") || (a.dataset.nav==="dashboard" && (location.hash===""||location.hash==="#/")))); }
function dashboard(){
  const inc = income(), sp = spent(), left = inc-sp;
  const rows = household.budgets.map(b=>{ const s=catSpent(b.cat); const p=Math.min(100, Math.round(s/b.budget*100)); return `<div class="row"><span><strong>${b.cat}</strong><br><span class="muted">${money(s)} of ${money(b.budget)}</span></span><span class="num">${p}%</span></div><div class="bar ${s>b.budget?"over":""}"><i style="width:${p}%"></i></div>`; }).join("");
  const recent = txs.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6).map(t=>`<div class="row"><span>${t.date}, ${esc(t.desc)}</span><span class="num ${t.type==="income"?"green":"red"}">${t.type==="income"?"+":"-"}${money(t.amount)}</span></div>`).join("");
  app.innerHTML = `<h1>Good morning, Alvarez family</h1><p class="lead">November is on track. You have <strong>${money(left)}</strong> left after ${money(sp)} spent, and the emergency fund is 72% full.</p>
  <div class="cards">
    <div class="card"><div class="label">Income</div><div class="big num">${money(inc)}</div><div class="sub">Salary $4,850 + freelance $320</div></div>
    <div class="card"><div class="label">Spent so far</div><div class="big num">${money(sp)}</div><div class="sub">${txs.filter(t=>t.type==="expense").length} expenses in November</div></div>
    <div class="card"><div class="label">Left to spend</div><div class="big num accent">${money(left)}</div><div class="sub">Safe to spend: ${money(Math.round(left/6))} / day</div></div>
    <div class="card"><div class="label">Saved this month</div><div class="big num">$650</div><div class="sub">Emergency fund, auto-transfer on the 1st</div></div>
  </div>
  <div class="notice"><strong>Tip:</strong> Food is $136 under budget. Moving $100 to the Lisbon trip would finish it a month early. <a href="#/goals">See goals</a></div>
  <div class="grid2"><div class="panel"><h2>Budget at a glance</h2>${rows}<a class="btn" href="#/budget">Edit budgets</a></div>
  <div><div class="panel"><h2>Recent activity</h2>${recent}<a href="#/transactions">All transactions</a></div>
  <div class="panel"><h2>Top goal</h2><h3>Emergency fund</h3><p><span class="num">$4,350 of $6,000</span>, 72%</p><div class="bar"><i style="width:72%"></i></div><a class="btn secondary" href="#/goals">Add $50</a></div></div></div>`;
}
function transactions(){
  const cats = ["All","Housing","Food","Transport","Utilities","Health","Fun","Income"];
  const q = new URLSearchParams(location.hash.split("?")[1]||"").get("cat") || "All";
  const list = txs.filter(t=>q==="All"||t.cat===q).slice().sort((a,b)=>b.date.localeCompare(a.date));
  app.innerHTML = `<h1>Transactions</h1><p class="lead">${txs.length} transactions in November 2026. Add one below, it updates your dashboard and budgets instantly.</p>
  <div class="toolbar"><label style="margin:0">Filter: <select id="fcat">${cats.map(c=>`<option ${c===q?"selected":""}>${c}</option>`).join("")}</select></label><span>${list.length} shown, spent ${money(spent())}, income ${money(income())}</span></div>
  <div class="panel"><h2>Add a transaction</h2><form id="addf" class="form">
    <div><label>Date</label><input type="date" name="date" value="2026-11-27" required></div>
    <div><label>Amount (USD)</label><input type="number" name="amount" min="1" step="1" placeholder="45" required></div>
    <div class="full"><label>Description</label><input name="desc" placeholder="e.g. Weekly groceries, GreenMart" required></div>
    <div><label>Category</label><select name="cat"><option>Food</option><option>Housing</option><option>Transport</option><option>Utilities</option><option>Health</option><option>Fun</option><option>Income</option></select></div>
    <div><label>Type</label><select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></div>
    <div class="full"><button type="submit">Add transaction</button> <span id="added"></span></div>
  </form></div>
  <table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody>
  ${list.map(t=>`<tr><td class="num">${t.date}</td><td>${esc(t.desc)}</td><td><span class="pill ${t.cat.toLowerCase()}">${t.cat}</span></td><td class="num ${t.type==="income"?"green":"red"}">${t.type==="income"?"+":"-"}${money(t.amount)}</td><td><button class="small secondary" data-del="${t.id}">Delete</button></td></tr>`).join("")}
  </tbody></table>`;
  document.getElementById("fcat").onchange = e => location.hash = "#/transactions?cat=" + encodeURIComponent(e.target.value);
  document.getElementById("addf").onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); const nt = { id: Date.now(), date: f.get("date"), desc: f.get("desc"), cat: f.get("cat"), type: f.get("type"), amount: Number(f.get("amount")) }; txs.push(nt); save(); document.getElementById("added").textContent = "Added. Totals updated."; setTimeout(route, 600); };
  app.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ if(confirm("Delete this transaction?")){ txs = txs.filter(t=>t.id!=Number(b.dataset.del)); save(); route(); } });
}
function budget(){
  app.innerHTML = `<h1>Budget, November 2026</h1><p class="lead">Total budget $3,400. Total spent ${money(spent())} (excluding rent timing). Tap a budget to change it, the bars update right away.</p>
  ${household.budgets.map((b,i)=>{ const s=catSpent(b.cat); const p=Math.min(100, Math.round(s/b.budget*100)); return `<div class="panel"><h3 class="split"><span>${b.cat}, ${money(s)} / ${money(b.budget)}</span><span class="num">${p}%</span></h3><div class="bar ${s>b.budget?"over":""}"><i style="width:${p}%"></i></div><p>${money(b.budget-s)} left. ${s>b.budget?"Over budget, move money from Fun or Food.":"On track."}</p><label>Monthly budget for ${b.cat}</label><input type="number" data-budget="${i}" value="${b.budget}" min="0" step="10"> <button class="small" data-save="${i}">Save</button> <span id="saved${i}"></span></div>`; }).join("")}
  <div class="panel"><h2>How to stay on track</h2><ol><li>Check this page every Sunday.</li><li>Move money between categories instead of overspending.</li><li>Anything left on the 30th goes to the emergency fund automatically.</li></ol><a class="btn" href="#/transactions">Review transactions</a></div>`;
  app.querySelectorAll("[data-save]").forEach(btn=>btn.onclick=()=>{ const i=Number(btn.dataset.save); const v=Number(document.querySelector(`[data-budget="${i}"]`).value); if(v>=0){ household.budgets[i].budget=v; document.getElementById("saved"+i).textContent="Saved."; setTimeout(route,500); } });
}
function goals(){
  app.innerHTML = `<h1>Savings goals</h1><p class="lead">Three goals, $5,950 saved in total. Add money to a goal and watch the bar move.</p>
  ${household.goals.map((g,i)=>{ const p=Math.round(g.saved/g.target*100); return `<div class="goal"><h3>${g.name}</h3><p><span class="num">${money(g.saved)} of ${money(g.target)}</span>, ${p}%, ${g.note}</p><div class="bar"><i style="width:${p}%"></i></div><button data-goal="${i}">Add $50</button> <button class="secondary" data-goal100="${i}">Add $100</button></div>`; }).join("")}
  <div class="panel"><h2>New goal</h2><form id="gf" class="form"><div><label>Goal name</label><input name="name" placeholder="e.g. New bikes for the kids" required></div><div><label>Target ($)</label><input type="number" name="target" min="50" placeholder="800" required></div><div class="full"><button>Add goal</button></div></form></div>`;
  app.querySelectorAll("[data-goal]").forEach(b=>b.onclick=()=>{ household.goals[Number(b.dataset.goal)].saved+=50; route(); });
  app.querySelectorAll("[data-goal100]").forEach(b=>b.onclick=()=>{ household.goals[Number(b.dataset.goal100)].saved+=100; route(); });
  document.getElementById("gf").onsubmit = e => { e.preventDefault(); const f=new FormData(e.target); household.goals.push({name:f.get("name"), target:Number(f.get("target")), saved:0, note:"Just started"}); route(); };
}
function reports(){
  const max = Math.max(...household.monthly.map(m=>m.spent));
  app.innerHTML = `<h1>Reports</h1><p class="lead">Spending is steady: $2,980–$3,560 a month this year. November is the second-lowest month so far.</p>
  <div class="panel"><h2>Spending by month, 2026</h2><div class="meter">${household.monthly.map(m=>`<div style="height:${Math.round(m.spent/max*100)}%"></div>`).join("")}</div><div style="display:flex;justify-content:space-between;font-size:12px">${household.monthly.map(m=>`<span>${m.m}</span>`).join("")}</div><p>November: <strong class="num">${money(3332)}</strong>. Average: <strong class="num">${money(3235)}</strong>.</p></div>
  <div class="panel"><h2>Spending by category, November</h2>${household.budgets.map(b=>{ const s=catSpent(b.cat); return `<div class="row"><span>${b.cat}</span><strong class="num">${money(s)}</strong></div>`; }).join("")}<div class="row"><span><strong>Total</strong></span><strong class="num">${money(spent())}</strong></div></div>
  <div class="panel"><h2>Where the money goes</h2><p>Housing is 43% of spending, Food 21%, Transport 9%. Fun is down from $312 in October to $198, the cinema-and-cooking-at-home plan is working.</p><a class="btn" href="#/budget">Adjust budgets</a></div>`;
}
function route(){ nav(); const h = location.hash.split("?")[0]; if(h==="#/transactions") transactions(); else if(h==="#/budget") budget(); else if(h==="#/goals") goals(); else if(h==="#/reports") reports(); else dashboard(); window.scrollTo(0,0); }
window.addEventListener("hashchange", route); route();
