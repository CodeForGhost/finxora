export const initialCompetitions = [
  { id: 'apex', name: 'Apex Trader Challenge', type: 'Live account', status: 'Active', participants: 1248, capacity: 2000, prize: 50000, dates: 'Oct 01 – Oct 31, 2026', region: 'Global', ranking: 'P&L %', color: 'mint', description: 'A month-long live account challenge for disciplined traders.' },
  { id: 'momentum', name: 'Momentum Masters', type: 'Demo', status: 'Registration Open', participants: 684, capacity: 1500, prize: 25000, dates: 'Oct 20 – Nov 20, 2026', region: 'Global', ranking: 'Equity growth', color: 'purple', description: 'Show your strategy in a risk-free demo environment.' },
  { id: 'flash', name: 'Friday Flash Sprint', type: 'Flash', status: 'Scheduled', participants: 192, capacity: 500, prize: 7500, dates: 'Oct 23, 2026', region: 'APAC', ranking: 'Absolute P&L', color: 'orange', description: 'One day. One leaderboard. Fast decisions.' },
  { id: 'elite', name: 'Elite FX Invitational', type: 'Private', status: 'Completed', participants: 320, capacity: 350, prize: 30000, dates: 'Sep 01 – Sep 30, 2026', region: 'EMEA', ranking: 'Risk-adjusted', color: 'blue', description: 'An invitation-only competition for experienced FX traders.' },
]

export const leaderboard = [
  { rank: 1, name: 'Alex Morgan', handle: '@alexm', country: '🇬🇧', account: 'MT5-48291', pnl: 38.42, equity: 138420, drawdown: 4.2, volume: 186.4, trades: 142, winRate: 72, days: 18, movement: 2, initials: 'AM', color: 'purple' },
  { rank: 2, name: 'Sarah Chen', handle: '@sarahc', country: '🇸🇬', account: 'MT5-32918', pnl: 34.76, equity: 134760, drawdown: 3.8, volume: 164.2, trades: 128, winRate: 69, days: 19, movement: -1, initials: 'SC', color: 'orange' },
  { rank: 3, name: 'Daniel Rivera', handle: '@danielr', country: '🇪🇸', account: 'MT5-71604', pnl: 31.15, equity: 131150, drawdown: 5.1, volume: 152.8, trades: 119, winRate: 66, days: 17, movement: 1, initials: 'DR', color: 'blue' },
  { rank: 4, name: 'Maya Patel', handle: '@mayap', country: '🇮🇳', account: 'MT5-20467', pnl: 28.63, equity: 128630, drawdown: 3.4, volume: 141.5, trades: 105, winRate: 71, days: 18, movement: -2, initials: 'MP', color: 'mint' },
  { rank: 5, name: 'Oliver Grant', handle: '@oliverg', country: '🇦🇺', account: 'MT5-58230', pnl: 26.91, equity: 126910, drawdown: 6.2, volume: 133.1, trades: 112, winRate: 64, days: 16, movement: 3, initials: 'OG', color: 'purple' },
  { rank: 6, name: 'Noah Williams', handle: '@noahw', country: '🇨🇦', account: 'MT5-92713', pnl: 24.38, equity: 124380, drawdown: 4.7, volume: 121.6, trades: 98, winRate: 67, days: 17, movement: -1, initials: 'NW', color: 'orange' },
  { rank: 7, name: 'Lina Haddad', handle: '@linah', country: '🇦🇪', account: 'MT5-61835', pnl: 22.74, equity: 122740, drawdown: 5.8, volume: 116.4, trades: 91, winRate: 63, days: 15, movement: 2, initials: 'LH', color: 'blue' },
]

export const initialParticipants = [
  { id: 1, name: 'Alex Morgan', email: 'alex.morgan@example.com', country: 'United Kingdom', account: 'MT5-48291', joined: 'Oct 01, 2026', status: 'Active', competition: 'Apex Trader Challenge', initials: 'AM', color: 'purple' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.chen@example.com', country: 'Singapore', account: 'MT5-32918', joined: 'Oct 02, 2026', status: 'Active', competition: 'Apex Trader Challenge', initials: 'SC', color: 'orange' },
  { id: 3, name: 'Daniel Rivera', email: 'daniel.r@example.com', country: 'Spain', account: 'MT5-71604', joined: 'Oct 02, 2026', status: 'Active', competition: 'Apex Trader Challenge', initials: 'DR', color: 'blue' },
  { id: 4, name: 'Maya Patel', email: 'maya.patel@example.com', country: 'India', account: 'MT5-20467', joined: 'Oct 03, 2026', status: 'Pending', competition: 'Momentum Masters', initials: 'MP', color: 'mint' },
  { id: 5, name: 'Oliver Grant', email: 'oliver.grant@example.com', country: 'Australia', account: 'MT5-58230', joined: 'Oct 04, 2026', status: 'Active', competition: 'Apex Trader Challenge', initials: 'OG', color: 'purple' },
  { id: 6, name: 'Lina Haddad', email: 'lina.h@example.com', country: 'UAE', account: 'MT5-61835', joined: 'Oct 05, 2026', status: 'Flagged', competition: 'Apex Trader Challenge', initials: 'LH', color: 'blue' },
]

export const initialViolations = [
  { id: 1, trader: 'Lina Haddad', account: 'MT5-61835', rule: 'Maximum daily loss', detail: 'Daily loss reached 5.4% (limit 5%)', severity: 'High', date: 'Oct 09, 10:42', status: 'Needs review' },
  { id: 2, trader: 'Noah Williams', account: 'MT5-92713', rule: 'Restricted instrument', detail: 'Trade placed on XAUUSD', severity: 'Medium', date: 'Oct 09, 09:18', status: 'Needs review' },
  { id: 3, trader: 'Maya Patel', account: 'MT5-20467', rule: 'Maximum lot size', detail: 'Opened 12.0 lots (limit 10.0)', severity: 'High', date: 'Oct 08, 16:27', status: 'Needs review' },
  { id: 4, trader: 'Oliver Grant', account: 'MT5-58230', rule: 'Trading hours', detail: 'Trade opened outside permitted window', severity: 'Low', date: 'Oct 07, 22:12', status: 'Resolved' },
]

export const featureGroups = [
  { group: 'Competition setup', items: [
    ['Competition management', 'Create, edit, duplicate, publish, pause, resume, extend, cancel, and close competitions.'],
    ['Contest templates', 'Start from Profit %, Volume, Winning Streak, Risk Management, or custom contest setups.'],
    ['Competition formats', 'Demo, live, combined, daily, weekly, monthly, flash, regional, private, multi-stage, and event-based.'],
    ['Entry fees and phases', 'Set free or paid entry, duration, maximum participants, and multi-phase progression.'],
    ['Account rules', 'Starting balance, deposits, account type, leverage, participant cap, and minimum balance.'],
    ['Trading rules', 'Trade counts, trading days, lot sizes, positions, drawdown, daily loss, risk, hours, strategies, and instruments.'],
    ['Scoring & ranking', 'P&L %, absolute P&L, equity and balance growth, volume, trade count, win rate, risk-adjusted and custom scoring.'],
    ['Prize management', 'Prize pools, winner counts, rank and category awards, approvals, and payout tracking.'],
  ]},
  { group: 'Trader experience', items: [
    ['Competition discovery', 'Browse public competitions and view details, rules, dates, and prizes.'],
    ['Registration & verification', 'Capture trader details, verify email, phone, account and eligibility, with KYC when required.'],
    ['Trading account linking', 'Connect MT4, MT5, or cTrader accounts and surface account connection status.'],
    ['Demo account issuance', 'Issue demo credentials after entry approval for demo contests.'],
    ['Trader portal', 'Personal rank, score, P&L, equity, balance, drawdown, trade metrics, and progress.'],
    ['Performance charts', 'Equity and balance curves, P&L history, drawdown, activity, and ranking history.'],
    ['Live leaderboard', 'Searchable and filterable rankings with movement, top performers, and public/private views.'],
    ['Notifications', 'Registration, event, ranking, warning, result, prize, and payout alerts across email, SMS, push, and in-app.'],
    ['Milestones & sharing', 'Track achievements and provide a shareable ranking snapshot.'],
    ['Appeals', 'Submit a challenge to a rule decision and follow the review outcome.'],
  ]},
  { group: 'Broker growth', items: [
    ['Tenant onboarding', 'Set up broker profile, platform mapping, service integrations, brand, staff, and internal test.'],
    ['Contest goal and budget', 'Choose an acquisition, volume, retention, event, or talent goal and estimate campaign cost.'],
    ['Review and publication', 'Submit a draft, review terms and prize budget, approve with a second role, then lock rules on publication.'],
    ['Registration and live operations', 'Watch capacity, incomplete entries, feed state, fair-play alerts, and audited interventions.'],
    ['Results and settlement', 'Track provisional/final ranks, appeal status, prize eligibility, gross fees, and follow-up drafts.'],
    ['White-label branding', 'Configure a broker domain, colors, messaging, landing page preview, and branded communications.'],
    ['Embeddable leaderboard', 'Offer a leaderboard snippet for a broker-owned website.'],
    ['Campaigns', 'Draft contest launch, reminder, winner, and re-engagement messages.'],
    ['Social sharing', 'Prepare shareable contest posts and winner content.'],
    ['IB and partner tracking', 'Create trackable links and see partner-attributed registrations and funded traders.'],
    ['Partner sub-contests', 'Create branded competition drafts for individual IB or partner networks.'],
    ['IB portal preview', 'Offer referral links, partner metrics, and a restricted draft sub-contest view.'],
    ['ROI reporting', 'Track deposits, trading volume, funded conversions, retention, and contest economics.'],
  ]},
  { group: 'Operations & intelligence', items: [
    ['MT5 integration', 'Account, position, trade, price, volume, profit, swap, and commission data from MetaTrader 5.'],
    ['Additional platform connectors', 'Plan MT4, cTrader, custom REST API, CRM sync, and webhooks.'],
    ['Performance engine', 'Profit, ROI, growth, win/loss rates, profit factor, drawdown, volume, frequency, and trading days.'],
    ['Automated rule validation', 'Detect breaches and warn, flag, suspend, disqualify, notify, or route for manual review.'],
    ['Fraud & abuse prevention', 'Detect duplicate accounts, unusual activity, coordinated behavior, and rule manipulation.'],
    ['Advanced fraud signals', 'Review copy-trading patterns, hedging abuse, latency arbitrage, and abnormal performance.'],
    ['Appeal review', 'Allow operations staff to uphold or reverse trader appeals.'],
    ['KYC approval', 'Review new competition entries and identity status before activation.'],
    ['Payout controls', 'Verify winners, hold payouts, and release approved demo awards.'],
    ['Participant management', 'Search, review, approve, suspend, disqualify, reinstate, and export participants.'],
    ['Trader intelligence', 'Profiles, competition history, trading preferences, risk patterns, and trader segments.'],
    ['Lead management', 'Contact details, acquisition source, deposits, activity, segments, and lead stages.'],
    ['Broker analytics', 'Competition metrics, acquisition funnel, deposits, first trades, conversion, and retention.'],
  ]},
  { group: 'Platform controls', items: [
    ['Role-based access', 'Super admin, broker admin, competition manager, sales manager, support manager, and trader permissions.'],
    ['Audit logs', 'Track sign-ins, edits, rule changes, participant decisions, prize changes, and system actions.'],
    ['Security', 'Authentication, sessions, API access, validation, permission enforcement, and secure data access.'],
    ['Localization', 'Support multiple languages, time zones, and regional eligibility rules.'],
    ['Results & winner verification', 'Finalize rankings, review eligibility and violations, approve winners, and publish results.'],
  ]},
]
