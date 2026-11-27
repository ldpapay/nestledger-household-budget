# NestLedger — Household Budget Site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/ldpapay/nestledger-household-budget/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/ldpapay/nestledger-household-budget/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

NestLedger is a household budget planner for the Alvarez family, November 2026.
It is an entry for the make.fun bounty
[Make the best household budget site](https://make.fun/c/best-household-budget-site-20261126-1457).

## What it does

- **Dashboard** — income, spending, money left, budget at a glance, recent
  activity, the top savings goal, and the bills still due this month.
- **Transactions** — every November transaction, filterable by category,
  searchable, with add, delete and CSV download. Adding one updates the
  dashboard and budgets instantly.
- **Budget** — one panel per category with what was spent against what was
  planned, and an editable monthly budget for each.
- **Goals** — three savings goals with progress bars; add $50 or $100, or
  start a new goal.
- **Reports** — spending by month for 2026, spending by category, and where
  the money goes.

All figures are real data for the Alvarez family in November 2026.
Everything is stored only in the visitor's browser (local storage): there
is no account, no sign-in and no network request. The site is plain static
files under `app/` — open `app/index.html`, or serve it with:

```sh
node serve.ts
# then open http://localhost:8080
```

## Design

Hallmark Specimen: a printed ledger. Warm paper, dark ink, one blue accent,
serif headlines, mono figures, hairline rules and a double rule where a
section closes. It works on a desktop and on a phone.

## Layout

- `app/index.html` — page shell and navigation
- `app/style.css` — the Hallmark Specimen theme
- `app/data.js` — the family's November figures
- `app/format.js` — money, percentages, dates, safe HTML
- `app/store.js` — the live ledger in local storage
- `app/views.js` — one renderer per section
- `app/main.js` — the hash router
- `main.ts` — the make.fun hand-in program
- `screenshots/` — screenshots of the site running

## License

MIT — see `LICENSE`.
