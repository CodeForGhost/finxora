# Finxora Prototype

A React + Vite interface prototype for the proposed Trading Competition Platform. The project name is `prototype`.

## Run locally

```bash
cd prototype
npm install
npm run dev
```

Open the local URL shown by Vite. Use `npm run build` for a production build.

## Trader journey

The first screen is a public contest page. Visitors can review prizes, rules, and a leaderboard before registering. Partner and campaign query parameters (`ref`, `utm_campaign`, `utm_source`) are captured before sign-up; for example, `/?ref=ALPHA&contest=momentum`.

1. Register a demo profile, accept account terms, and enter the displayed OTP (`123456`). Existing users can sign in instead.
2. In **My journey**, check the contest's KYC policy. The default is before payout for free demo contests, before joining for live contests, and before payment for paid entries. Brokers can choose a different policy in the contest builder.
3. Issue a demo account or link a live MT4, MT5, or cTrader account. Live accounts need a simulated deposit.
4. Use **Contest lobby** to search and filter open, upcoming, active, and past contests; select a card to compare its entry requirements. Continue to **My journey** for contact, country, capacity, KYC, account, funding, fee, and contest terms checks. Manual approval, when configured, creates a pending entry. The local demo tracks one contest entry at a time, so browsing another contest never resets an existing entry.
5. In **Admin → Contest lifecycle**, start the contest to capture a balance and equity baseline. The trader's **Start trading** button then becomes available in **My journey** and **Performance**. The **Trade** screen places sample trades that update local equity, score, and drawdown; it does not send orders to MT4, MT5, or cTrader. Admins can also simulate fair-play warnings, penalties, or disqualification. Close the contest to freeze scores and publish a provisional rank.
6. Submit a trader appeal while the decision is appealable. Resolve it in **Admin → Appeals**, complete the final review, close the demo appeal window, and publish a final rank.
7. Approve full KYC and all prize eligibility checks in **Admin → Payout controls** before recording a demo payout. The same screen can hold a prize or queue post-contest follow-up.

The flow state is saved in browser `localStorage`. The trading, KYC, payment, notification, payout, and CRM events are simulations; no real money or personal documents move through the prototype.

## Demo sign-in

The sign-in screen lets you choose a role. Use the email shown for that role and the shared demo password `demo1234`.

| Role | Demo email | Home dashboard |
| --- | --- | --- |
| Trader | `alex.morgan@example.com` | Personal rank, performance, rules, and competition progress |
| Verified trader | `verified.trader@finxora.demo` | Approved KYC, funded MT5 account, active Apex entry, and trading ready |
| Broker | `broker@finxora.demo` | Contest business, branding, campaigns, partners, and ROI |
| Admin | `admin@finxora.demo` | Rules, scoring, registration, fraud, appeals, payouts, and infrastructure |

The session is saved in browser `localStorage`, and the sign-out button returns to the public contest page. Role navigation is restricted in the interface. This is a demo flow, not production authentication or backend authorization.

For the verified trader, choose **Trader** on the sign-in page, click **Use verified account**, and sign in with `demo1234`. The account has contact verification, approved KYC, a funded `MT5-VERIFIED-1001` live account, and an active Apex entry. Its **Start trading** button is ready immediately. Prize payout still requires a final ranking and eligibility review.

## Broker workspace

The broker dashboard now has two loops:

1. **Broker onboarding:** set the tenant profile and plan, choose trading platform and account mapping, track KYC/payment/CRM/email/webhook setup, review branding, add staff roles, and run an internal demo readiness check. No server credentials are entered or stored.
2. **Contest lifecycle:** choose a business goal and audience, create a draft with schedule, rules, scoring, prize tiers, KYC timing, and terms, then use **Contest workflow** for legal review, maker-checker approval, publication, promotion, registration monitoring, live operations, results, follow-up, and ROI. Published rules are locked in the workflow. Pause, resume, extend, and cancel require an audit reason.

The broker sidebar also has **Registrations**, **Live operations**, **Results & finance**, and an **IB portal preview**. These screens read shared demo contest and trader state. Fair-play decisions, final ranking, and payout approval remain admin actions. Staff permissions, tenant isolation, integrations, messaging, and financial settlement are interface simulations; production enforcement requires backend services and provider connections.

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
- Trader pages: start from public discovery, register with a demo OTP, issue or link an account, pass a join checklist, monitor trading and fair play, appeal decisions, and follow provisional and final results through prize status.
- Broker pages: work through tenant onboarding; use goal-based contest templates and an editable draft; check budget and legal readiness; submit, approve, and publish with role gates; inspect registrations, live operations, results, finance, IB links, and ROI; and clone a campaign draft.
- Admin pages: configure sample trading rules and scoring, review KYC and pending entries, capture a start baseline, simulate continuous fair-play decisions, freeze and review results, resolve appeals, check prize eligibility, and record a demo payout.
- Cross-role demo flow: the trader journey appears in Admin Contest lifecycle, Registration & KYC, and Payout controls; trader appeals appear in Admin Appeals, and reviewed payout status appears in Trader Results & Prizes.
- Navigate separate broker, operations, and trader screens.
- Create competition drafts, duplicate competitions, and change competition status.
- Search and filter competitions, traders, and leaderboard entries.
- Change sample participant and violation statuses.
- Export the sample participant list as CSV.
- Preview prize payout status and notification preferences.
- Search the complete feature map.
- Persist local changes in browser `localStorage`.

All displayed trader, competition, analytics, notification, and audit data are illustrative. The prototype has no backend, authentication, live MetaTrader 5 connection, payment system, messaging service, or automated calculations. Those require confirmed business rules, broker integration details, and production infrastructure.

The FYNXT, Swiset, and FxCore feature comparison supplied during planning informed these additional interface concepts. Provider integrations, automated approval, KYC/OTP, paid entry, fraud detection, payouts, localization, and live leaderboards remain simulated or planned until connected to production services.

## Decisions still needed

The scope document leaves MVP versus later-phase priorities, required competition formats, ranking methods, reporting needs, and integration details unselected. These must be confirmed before production implementation.
