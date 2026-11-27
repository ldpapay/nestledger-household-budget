// store.js — the family's working copy of the ledger. The seed data in
// data.js never changes; this module loads the transactions, budgets and
// goals the household actually edits, keeps them in the browser's local
// storage, and hands every view the same up-to-date numbers.
//
// If storage is empty or unreadable, the seed is used. Every change a
// view makes goes through saveState(), so a refresh never loses it.

import { household, seedTransactions } from "./data.js";

const STORAGE_KEY = "nestledger-nov2026-v3";

function freshState() {
  return {
    transactions: seedTransactions.map((t) => ({ ...t })),
    budgets: household.budgets.map((b) => ({ ...b })),
    goals: household.goals.map((g) => ({ ...g })),
  };
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return freshState();
    return {
      transactions: parsed.transactions,
      budgets: Array.isArray(parsed.budgets) ? parsed.budgets : freshState().budgets,
      goals: Array.isArray(parsed.goals) ? parsed.goals : freshState().goals,
    };
  } catch (err) {
    return freshState();
  }
}

export const state = readState();

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // A private window can refuse storage; the page still works
    // for this visit, it just will not remember the change.
  }
}

export function resetState() {
  const fresh = freshState();
  state.transactions = fresh.transactions;
  state.budgets = fresh.budgets;
  state.goals = fresh.goals;
  saveState();
}

// Totals, computed from the live transaction list so every page agrees.
export function totalIncome() {
  return state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalSpent() {
  return state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function spentIn(category) {
  return state.transactions
    .filter((t) => t.cat === category && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function addTransaction(entry) {
  const next = { ...entry, id: Date.now() };
  state.transactions.push(next);
  saveState();
  return next;
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== Number(id));
  saveState();
}
