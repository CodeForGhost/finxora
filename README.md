# Finxora Prototype

A React + Vite interface prototype for the proposed Trading Competition Platform. The project name is `prototype`.

## Run locally

```bash
cd prototype
npm install
npm run dev
```

Open the local URL shown by Vite. Use `npm run build` for a production build.

## Demo sign-in

The sign-in screen lets you choose a role. Use the email shown for that role and the shared demo password `demo1234`.

| Role | Demo email | Home dashboard |
| --- | --- | --- |
| Trader | `alex.morgan@example.com` | Personal rank, performance, rules, and competition progress |
| Broker | `broker@finxora.demo` | Competitions, participants, trading activity, and action queue |
| Admin | `admin@finxora.demo` | Cross-broker activity, platform health, risk, and support |

The session is saved in browser `localStorage`, and the sign-out button returns to the role selection screen. Role navigation is restricted in the interface. This is a demo flow, not production authentication or backend authorization.

## Feature breakdown

The source scope is a proposal for client review. The following are distinct feature areas, not confirmed release commitments.

| Area | Feature | What it covers |
| --- | --- | --- |
| Competition setup | Management | Create, edit, duplicate, publish, pause, resume, extend, cancel, and close competitions. |
| Competition setup | Formats | Demo, live, combined, daily, weekly, monthly, flash, regional, private, multi-stage, event-based. |
| Competition setup | Account rules | Balances, deposits, account type, leverage, participant limits. |
| Competition setup | Trading rules | Trade counts, trading days, lot size, open positions, loss and drawdown limits, trading hours, instruments, strategies. |
| Competition setup | Scoring and ranking | P&L %, absolute P&L, equity and balance growth, volume, trades, win rate, risk-adjusted and custom scores. |
| Competition setup | Prizes | Prize pool, winners, distribution, approval, verification, payout status. |
| Trader experience | Discovery | Public competition list, details, rules, dates, and prizes. |
| Trader experience | Registration | Trader profile, contact details, account selection and competition entry. |
| Trader experience | Verification | Email, phone, account, eligibility, optional KYC, duplicate detection. |
| Trader experience | Portal | Personal rank, score, P&L, equity, drawdown, trades, progress. |
| Trader experience | Charts | Equity, balance, P&L, drawdown, activity, rank history. |
| Trader experience | Leaderboard | Live ranking, search, filtering, movement, public/private views. |
| Trader experience | Notifications | Registration, event, rank, warning, result and prize messages across email, SMS, push and in-app. |
| Operations | MT5 integration | Account and trade information from MetaTrader 5. |
| Operations | Performance engine | Profit, ROI, growth, win/loss metrics, profit factor, drawdown, volume, frequency, trading days. |
| Operations | Rule validation | Detect breaches, warn, flag, suspend, disqualify, notify, review. |
| Operations | Fraud prevention | Duplicate accounts, unusual or coordinated activity, rule manipulation. |
| Operations | Participant management | Review, approve, suspend, disqualify, reinstate, export. |
| Intelligence | Trader profiles | Trading history, performance, instruments, acquisition source, activity. |
| Intelligence | Lead management | Stages from new through VIP or lost, with contact and conversion context. |
| Intelligence | Broker analytics | Participation, trades, volume, deposits, conversions, retention, acquisition funnel. |
| Platform | Roles and permissions | Super admin, broker admin, competition manager, sales manager, support manager, trader. |
| Platform | Audit logs | Sign-ins, competition and rule edits, participant decisions, prizes, account changes. |
| Platform | Security | Authentication, sessions, API access, validation and permission checks. |
| Platform | Results | Final ranking, violation review, winner verification and publication. |

## What works in this prototype

- Sign in as Trader, Broker, or Admin to see different navigation and role-specific home screens.
- Trader pages: discover and join sample competitions, view joined events, rules, results, notifications, and account details.
- Admin pages: monitor sample brokers and services, review risk cases, inspect users and audit events, resolve sample support tickets, and review configuration.
- Navigate separate broker, operations, and trader screens.
- Create competition drafts, duplicate competitions, and change competition status.
- Search and filter competitions, traders, and leaderboard entries.
- Change sample participant and violation statuses.
- Export the sample participant list as CSV.
- Preview prize payout status and notification preferences.
- Search the complete feature map.
- Persist local changes in browser `localStorage`.

All displayed trader, competition, analytics, notification, and audit data are illustrative. The prototype has no backend, authentication, live MetaTrader 5 connection, payment system, messaging service, or automated calculations. Those require confirmed business rules, broker integration details, and production infrastructure.

## Decisions still needed

The scope document leaves MVP versus later-phase priorities, required competition formats, ranking methods, reporting needs, and integration details unselected. These must be confirmed before production implementation.
