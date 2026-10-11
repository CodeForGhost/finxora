import React, { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowLeft, ArrowRight, Award, Bell, CalendarDays, Check, CheckCircle2, Clock3, CreditCard, Flag, Gift, Globe2, Link2, LockKeyhole, Search, Shield, ShieldAlert, Target, TrendingUp, Trophy, Users, Wallet, X } from 'lucide-react'
import { Action, Header, money, Panel, Pill, Stat, Toast, useLocal } from './ExperienceUI.jsx'
import { leaderboard } from './data.js'

export const flowSeed = {
  source: 'Direct',
  profile: { name: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '+44 20 0000 0000', country: 'United Kingdom', registered: true, otpVerified: true },
  selectedContest: 'momentum',
  kyc: { status: 'Not started', updatedAt: null },
  account: { platform: 'MetaTrader 5', id: '', type: '', linked: false, funded: false, balance: 0 },
  entry: { status: 'Not joined', termsAcceptedAt: null, payment: 'Not required', confirmedAt: null },
  contest: { phase: 'Registration open', baseline: null, trades: 0, equity: 100000, score: 0, fairPlay: 'Clear', penalty: 0, warnings: [], lastSync: null, frozenAt: null, closePolicy: 'Mark to market', cashFlowPolicy: 'Lock deposits and withdrawals' },
  results: { status: 'Not available', provisionalRank: null, finalRank: null, appealEndsAt: null, appealHours: 48, appealWindowClosed: false, reviewComplete: false },
  prize: { status: 'Not determined', type: 'Account credit', paidAt: null, checks: { accountGood: false, countryAllowed: false, noDuplicate: false, noChargeback: false } },
  followUp: 'Not queued',
}

export const VERIFIED_TRADER_EMAIL = 'verified.trader@finxora.demo'
export const createVerifiedTraderFlow = () => {
  const at=new Date().toISOString()
  return {
    ...flowSeed,
    source:'Verified demo account',
    profile:{name:'Taylor Reed',email:VERIFIED_TRADER_EMAIL,phone:'+44 20 5555 0101',country:'United Kingdom',registered:true,otpVerified:true},
    selectedContest:'apex',
    kyc:{status:'Approved',updatedAt:at},
    account:{platform:'MetaTrader 5',id:'MT5-VERIFIED-1001',type:'Live account',linked:true,funded:true,balance:100000},
    entry:{status:'Active',termsAcceptedAt:at,payment:'Not required',confirmedAt:at},
    contest:{...flowSeed.contest,phase:'Active',baseline:{balance:100000,equity:100000,at},lastSync:at},
    prize:{...flowSeed.prize,checks:{accountGood:true,countryAllowed:true,noDuplicate:true,noChargeback:true}},
  }
}

export const kycPolicy = contest => contest?.kycPolicy && contest.kycPolicy !== 'Default by contest type' ? contest.kycPolicy : entryFee(contest) > 0 ? 'Before payment' : contest?.type === 'Live account' ? 'Before joining' : 'Before payout'
export const needsKycToJoin = contest => ['At registration','Before payment','Before joining'].includes(kycPolicy(contest))
export const entryFee = contest => contest?.entryFee == null ? (contest?.type === 'Flash' ? 25 : 0) : Number(contest.entryFee)
export const contestAccountMode = contest => contest?.type === 'Live account' ? 'Live account' : 'Demo'
export const canStartTrading = flow => flow.entry.status==='Active'&&flow.contest.phase==='Active'&&Boolean(flow.contest.baseline)&&flow.account.linked&&flow.contest.fairPlay!=='Disqualified'
export const tradingBlockReason = flow => {
  if(flow.contest.fairPlay==='Disqualified') return 'Trading is unavailable because this entry was disqualified.'
  if(flow.contest.phase==='Paused') return 'Trading is paused by the broker. Wait for the contest to resume.'
  if(flow.contest.phase==='Closed'||flow.contest.phase==='Final') return 'Trading has closed. Review your results.'
  if(!flow.account.linked) return 'Link or issue a trading account first.'
  if(flow.entry.status==='Pending approval') return 'Your entry is waiting for admin approval.'
  if(flow.entry.status==='Not joined') return 'Complete the entry checklist first.'
  if(!flow.contest.baseline||flow.contest.phase!=='Active') return 'The contest has not started. An admin must capture the starting balance and equity.'
  return 'Trading is unavailable for this entry.'
}
export const processDemoTrade = (flow, { instrument, lots, outcome }) => {
  if(!canStartTrading(flow)) return { error: tradingBlockReason(flow) }
  if(!['EURUSD','GBPUSD','USDJPY'].includes(instrument)) return { error: 'Choose an allowed instrument.' }
  const size=Number(lots)
  if(!Number.isFinite(size)||size<0.01||size>10) return { error: 'Trade size must be between 0.01 and 10 lots.' }
  if(!['Gain','Loss'].includes(outcome)) return { error: 'Choose a demo outcome.' }
  const change=(outcome==='Gain'?420:-260)*size
  const equity=Number(flow.contest.equity)+change
  const baseline=Number(flow.contest.baseline.equity)
  const drawdown=Math.max(0,(baseline-equity)/baseline*100)
  const breached=drawdown>=10
  const at=stamp()
  const trade={instrument,lots:size,outcome,change,at}
  const warning=breached?`Maximum drawdown breached · ${dateText(at)}`:null
  return { next:{...flow,
    account:{...flow.account,balance:equity},
    entry:breached?{...flow.entry,status:'Disqualified'}:flow.entry,
    contest:{...flow.contest,equity,trades:flow.contest.trades+1,score:(equity-baseline)/baseline*100-flow.contest.penalty,lastSync:at,fairPlay:breached?'Disqualified':flow.contest.fairPlay,warnings:warning?[...(flow.contest.warnings||[]),warning]:flow.contest.warnings,history:[trade,...(flow.contest.history||[])]},
  }, trade }
}
export const selectTraderContest = (flow, contest) => {
  if (!contest || flow.selectedContest === contest.id) return flow
  if (flow.entry.status !== 'Not joined') return null
  const keepAccount = flow.account.type === contestAccountMode(contest)
  return {
    ...flow,
    selectedContest: contest.id,
    account: keepAccount ? flow.account : { ...flow.account, id: '', type: '', linked: false, funded: false, balance: 0 },
    entry: { ...flowSeed.entry },
    contest: { ...flowSeed.contest },
    results: { ...flowSeed.results },
    prize: { ...flowSeed.prize, checks: { ...flowSeed.prize.checks } },
    followUp: 'Not queued',
  }
}
const dateText = value => value ? new Date(value).toLocaleString('en-US',{ dateStyle:'medium', timeStyle:'short' }) : 'Not yet'
const stamp = () => new Date().toISOString()

export function PublicContestLanding({ competitions, onRegister, onSignIn }) {
  const [selected,setSelected] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('contest') || 'momentum' } catch { return 'momentum' }
  })
  const [source,setSource] = useState('Direct')
  const visible = competitions.filter(c=>!['Draft','Cancelled'].includes(c.status)&&c.type!=='Private')
  const current=visible.find(c=>c.id===selected)||visible[0]
  useEffect(()=>{
    try {
      const params=new URLSearchParams(window.location.search)
      const captured=params.get('ref') ? `IB: ${params.get('ref')}` : params.get('utm_campaign') ? `Campaign: ${params.get('utm_campaign')}` : params.get('utm_source') ? `Source: ${params.get('utm_source')}` : 'Direct'
      setSource(captured)
      localStorage.setItem('fx-attribution',JSON.stringify(captured))
    } catch {}
  },[])
  return <div className="public-shell"><header className="public-nav"><div className="public-logo"><Activity size={24}/> finxora<span>.</span></div><nav><a href="#contests">Contests</a><a href="#rules">Rules</a><a href="#leaderboard">Leaderboard</a></nav><button onClick={onSignIn}>Sign in <ArrowRight size={15}/></button></header>
    <div className="public-content"><section className="public-hero"><div><span className="public-kicker"><i/> OPEN TO TRADERS WORLDWIDE</span><h1>Find your edge.<br/><em>Climb the board.</em></h1><p>Explore trading contests, prizes, rules, and live standings before you create an account.</p><div className="public-actions"><Action onClick={()=>onRegister(current?.id)} icon={ArrowRight}>Register to compete</Action><a href="#contests">Explore contests</a></div><div className="public-source"><Link2 size={14}/> Attribution source: <strong>{source}</strong></div></div><div className="public-hero-card"><span className="eyebrow">FEATURED CONTEST</span><Trophy size={56}/><strong>{current?.name}</strong><p>{current?.description}</p><div><span>Prize pool</span><b>{money(current?.prize)}</b></div><div><span>Participants</span><b>{current?.participants?.toLocaleString()}</b></div><Pill tone={current?.status==='Registration Open'?'green':'amber'}>{current?.status}</Pill></div></section>
    <section id="contests" className="public-section"><div className="public-section-heading"><span className="eyebrow">THE LOBBY</span><h2>Discover competitions</h2><p>Compare account modes, timing, prizes, and entry terms.</p></div><div className="public-contest-grid">{visible.map(c=><button key={c.id} className={`public-contest ${current?.id===c.id?'active':''}`} onClick={()=>setSelected(c.id)}><div><Trophy size={20}/><Pill tone={c.status==='Registration Open'?'green':'neutral'}>{c.status}</Pill></div><h3>{c.name}</h3><p>{c.description}</p><span>{c.type} · {c.dates}</span><strong>{money(c.prize)} prize pool</strong></button>)}</div></section>
    <section className="public-detail"><div id="rules"><span className="eyebrow">CONTEST RULES</span><h2>{current?.name}</h2><div className="public-rule-grid"><div><Shield size={18}/><span>Max drawdown</span><strong>10%</strong></div><div><Activity size={18}/><span>Daily loss</span><strong>5%</strong></div><div><Clock3 size={18}/><span>Trading days</span><strong>10 minimum</strong></div><div><Wallet size={18}/><span>Entry</span><strong>{entryFee(current)?money(entryFee(current)):'Free'}</strong></div></div><p>Scores use {current?.ranking}. Full terms, eligibility, and account requirements are shown before entry confirmation.</p><Action onClick={()=>onRegister(current?.id)}>Register for this contest</Action></div><div className="public-prizes"><span className="eyebrow">REWARDS</span><h2>Prize breakdown</h2><div><span>1st place</span><strong>{money((current?.prize||0)*.5)}</strong></div><div><span>2nd place</span><strong>{money((current?.prize||0)*.3)}</strong></div><div><span>3rd place</span><strong>{money((current?.prize||0)*.2)}</strong></div><small>Final awards require eligibility and fair-play review.</small></div></section>
    <section id="leaderboard" className="public-section"><div className="public-section-heading"><span className="eyebrow">PUBLIC STANDINGS</span><h2>Leaderboard preview</h2><p>Ranks are live during trading and provisional after a contest closes.</p></div><div className="public-board">{leaderboard.slice(0,5).map(t=><div key={t.rank}><span>#{t.rank}</span><strong>{t.name}</strong><small>{t.country}</small><b>+{t.pnl.toFixed(2)}%</b></div>)}</div></section>
    <footer className="public-footer"><span>Finxora competition prototype · Simulated data</span><button onClick={onSignIn}>Existing trader? Sign in</button></footer></div></div>
}

export function PublicRegistration({ contest, onBack, onComplete }) {
  const [step,setStep] = useState(1)
  const [form,setForm] = useState({name:'Alex Morgan',email:'alex.morgan@example.com',phone:'+44 20 0000 0000',country:'United Kingdom',experience:'Intermediate',password:'',terms:false,otp:''})
  const [error,setError] = useState('')
  const update=(key,value)=>{setForm({...form,[key]:value});setError('')}
  const submitProfile=e=>{e.preventDefault();if(!form.terms){setError('Accept the account terms to continue.');return}setStep(2)}
  const verify=e=>{e.preventDefault();if(form.otp!=='123456'){setError('Use demo code 123456.');return}onComplete({name:form.name.trim(),email:form.email.trim(),phone:form.phone.trim(),country:form.country.trim(),experience:form.experience})}
  return <div className="public-register-shell"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to contest</button><div className="public-register-card"><div className="public-register-side"><span className="eyebrow">CONTEST SIGN-UP</span><h1>Create your trader profile</h1><p>Join the Finxora demo and continue toward {contest?.name||'a trading contest'}.</p><div className="public-register-steps"><div className={step===1?'active':''}><span>1</span> Account details</div><div className={step===2?'active':''}><span>2</span> Verify contact</div><div><span>3</span> Account & eligibility</div></div><div className="notice"><Link2 size={17}/> Your campaign or partner source was captured before registration.</div></div><div className="public-register-form">{step===1?<form className="exp-form" onSubmit={submitProfile}><div className="exp-form-grid"><label>Full name<input required value={form.name} onChange={e=>update('name',e.target.value)}/></label><label>Email<input required type="email" value={form.email} onChange={e=>update('email',e.target.value)}/></label><label>Phone<input required value={form.phone} onChange={e=>update('phone',e.target.value)}/></label><label>Country<input required value={form.country} onChange={e=>update('country',e.target.value)}/></label><label>Trading experience<select value={form.experience} onChange={e=>update('experience',e.target.value)}><option>New trader</option><option>Intermediate</option><option>Experienced</option></select></label></div><label>Password<input required type="password" minLength={8} value={form.password} onChange={e=>update('password',e.target.value)} placeholder="At least 8 characters"/></label><label className="exp-check"><input type="checkbox" checked={form.terms} onChange={e=>update('terms',e.target.checked)}/><span>I accept the general account terms and privacy policy.</span></label>{error&&<p className="exp-validation">{error}</p>}<Action type="submit">Create demo profile</Action></form>:<form className="exp-form" onSubmit={verify}><span className="eyebrow">CONTACT VERIFICATION</span><h2>Enter your demo code</h2><p>A production service would send an OTP to {form.email}. For this prototype, use <strong>123456</strong>.</p><label>One-time code<input required inputMode="numeric" value={form.otp} onChange={e=>update('otp',e.target.value)} placeholder="123456"/></label>{error&&<p className="exp-validation">{error}</p>}<Action type="submit" icon={CheckCircle2}>Verify and continue</Action></form>}</div></div></div>
}

function PhasePill({ value }) {
  const tone=['Approved','Confirmed','Active','Final','Eligible','Paid','Clear'].includes(value)?'green':['Pending','Registration open','Provisional','Appeal window','On hold'].includes(value)?'amber':['Disqualified','Rejected','Expired'].includes(value)?'red':'neutral'
  return <Pill tone={tone}>{value}</Pill>
}

export function TraderContestLobby({ competitions, onNavigate }) {
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  const [status,setStatus] = useState('All')
  const [mode,setMode] = useState('All')
  const [query,setQuery] = useState('')
  const [selected,setSelected] = useState(flow.selectedContest)
  const publicContests=competitions.filter(c=>!['Draft','Cancelled'].includes(c.status)&&c.type!=='Private')
  const shown=publicContests.filter(c=>{
    const statusMatch=status==='All'||(status==='Open'&&c.status==='Registration Open')||(status==='Upcoming'&&c.status==='Scheduled')||(status==='Live'&&c.status==='Active')||(status==='Past'&&c.status==='Completed')
    const modeMatch=mode==='All'||(mode==='Flash'&&(c.type==='Flash'||c.format==='Flash'))||(mode!=='Flash'&&contestAccountMode(c)===mode)
    return statusMatch&&modeMatch&&`${c.name} ${c.description} ${c.region}`.toLowerCase().includes(query.trim().toLowerCase())
  })
  const current=shown.find(c=>c.id===selected)||shown[0]
  const hasOtherEntry=Boolean(current&&flow.entry.status!=='Not joined'&&flow.selectedContest!==current.id)
  const open=current?.status==='Registration Open'&&current.participants<current.capacity
  const continueToEntry=()=>{
    if(!current||!open||hasOtherEntry)return
    const next=selectTraderContest(flow,current)
    if(next!==flow){try{localStorage.setItem('fx-trader-flow',JSON.stringify(next))}catch{}}
    onNavigate('trader-journey')
  }
  return <><Header eyebrow="TRADER LOBBY" title="Find a contest" description="Compare available challenges, then continue to account and entry checks." action={<PhasePill value={`${publicContests.filter(c=>c.status==='Registration Open').length} open`}/>}/>
    <div className="lobby-controls"><label className="lobby-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search contests or regions" aria-label="Search contests"/></label><div className="exp-filters">{['All','Open','Upcoming','Live','Past'].map(x=><button key={x} className={status===x?'active':''} onClick={()=>setStatus(x)}>{x}</button>)}</div><div className="exp-filters">{['All','Demo','Live account','Flash'].map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}>{x}</button>)}</div></div>
    <div className="lobby-layout"><div className="lobby-cards">{shown.length?shown.map(c=><button key={c.id} className={`lobby-card ${current?.id===c.id?'selected':''}`} onClick={()=>setSelected(c.id)}><span><Trophy size={18}/><PhasePill value={c.status}/></span><strong>{c.name}</strong><small>{c.type==='Flash'?'Flash · Demo':c.type}{c.format==='Flash'?' · Flash':''} · {c.region} · {c.dates}</small><p>{c.description}</p><span className="lobby-card-foot"><b>{money(c.prize)} prizes</b><em>{c.participants.toLocaleString()} / {c.capacity.toLocaleString()} traders</em></span></button>):<div className="notice">No contests match these filters.</div>}</div>
    <Panel eyebrow="CONTEST DETAILS" title={current?.name||'Select a contest'}><div className="info-rows"><div><span>Status</span><strong>{current?.status||'—'}</strong></div><div><span>Account mode</span><strong>{current?contestAccountMode(current):'—'}</strong></div><div><span>Format</span><strong>{current?.format||current?.duration||(current?.type==='Flash'?'Flash':'Standard')}</strong></div><div><span>Prize pool</span><strong>{money(current?.prize||0)}</strong></div><div><span>Entry fee</span><strong>{current?(entryFee(current)?money(entryFee(current)):'Free'):'—'}</strong></div><div><span>Ranking</span><strong>{current?.ranking||'—'}</strong></div><div><span>KYC timing</span><strong>{current?kycPolicy(current):'—'}</strong></div><div><span>Availability</span><strong>{current?`${current.participants.toLocaleString()} / ${current.capacity.toLocaleString()}`:'—'}</strong></div></div><p className="muted">Entry requires account checks, eligibility, contest terms, and payment when a fee applies.</p>{hasOtherEntry&&<div className="notice"><LockKeyhole size={17}/> Your {flow.entry.status.toLowerCase()} entry is in another contest. This demo tracks one contest journey at a time.</div>}<div className="flow-actions"><Action disabled={!open||hasOtherEntry} onClick={continueToEntry}>{current?.id===flow.selectedContest&&flow.entry.status!=='Not joined'?'View my journey':'Continue to entry'}</Action>{current?.status==='Scheduled'&&<span className="muted">Registration has not opened.</span>}{current?.status==='Active'&&<span className="muted">Registration has closed.</span>}</div></Panel></div>
  </>
}

export function TraderJourney({ competitions, onNavigate, onJoin }) {
  const [flow,setFlow] = useLocal('fx-trader-flow',flowSeed)
  const [platform,setPlatform] = useState(flow.account.platform)
  const [accountId,setAccountId] = useState(flow.account.id)
  const [terms,setTerms] = useState(false)
  const [message,setMessage] = useState('')
  const contest=competitions.find(c=>c.id===flow.selectedContest)||competitions.find(c=>c.status==='Registration Open')||competitions[0]
  const policy=kycPolicy(contest)
  const isDemo=contestAccountMode(contest)==='Demo'
  const isLive=contest?.type==='Live account'
  const fee=entryFee(contest)
  const setKycStatus=status=>setFlow({...flow,kyc:{status,updatedAt:stamp()}})
  const linkAccount=e=>{e.preventDefault();const nextId=isDemo?`${platform==='cTrader'?'CTR':'MT'}-DEMO-2048`:accountId.trim();if(!nextId){setMessage('Enter a trading account ID first.');return}const account={platform,id:nextId,type:isDemo?'Demo':'Live account',linked:true,funded:isDemo,balance:isDemo?100000:0};setFlow({...flow,account});try{localStorage.setItem('fx-trader-account',JSON.stringify({platform,account:nextId,status:'Demo connected'}))}catch{}setMessage(isDemo?'Demo account issued with a $100,000 starting balance.':'Live account linked. Fund it before joining.')}
  const fund=()=>{setFlow({...flow,account:{...flow.account,funded:true,balance:1000}});setMessage('Demo deposit recorded through the broker funding step.')}
  const pay=()=>{if(policy==='Before payment'&&flow.kyc.status!=='Approved'){setMessage('KYC approval is required before checkout.');return}setFlow({...flow,entry:{...flow.entry,payment:'Confirmed'}});setMessage('Demo checkout confirmation received.')}
  const checks=[
    ['Contact verified',flow.profile.registered&&flow.profile.otpVerified],
    ['Registration is open',contest?.status==='Registration Open'&&flow.contest.phase==='Registration open'],
    ['Capacity available',contest?.participants<contest?.capacity],
    ['Country eligible',contest?.region==='Global'||(contest?.region==='EMEA'&&['United Kingdom','Spain','UAE'].includes(flow.profile.country||'United Kingdom'))||(contest?.region==='APAC'&&['Singapore','India','Australia'].includes(flow.profile.country))||(contest?.region==='Americas'&&['United States','Canada'].includes(flow.profile.country))],
    ['Identity requirement met',!needsKycToJoin(contest)||flow.kyc.status==='Approved'],
    ['Correct trading account linked',flow.account.linked&&flow.account.type===(isDemo?'Demo':'Live account')],
    ['Live account funded',!isLive||flow.account.funded],
    ['Entry fee confirmed',!fee||flow.entry.payment==='Confirmed'],
  ]
  const canJoin=checks.every(([,pass])=>pass)&&terms&&flow.entry.status==='Not joined'
  const join=()=>{if(!canJoin)return;const manual=contest?.approvalMode==='Manual';setFlow({...flow,entry:{status:manual?'Pending approval':'Confirmed',termsAcceptedAt:stamp(),payment:fee?'Confirmed':'Not required',confirmedAt:manual?null:stamp()}});onJoin?.(contest.id);setMessage(manual?'Entry submitted for administrator approval.':'Entry confirmed. A confirmation notification is ready in the demo inbox.')}
  const stages=[
    ['Discover','Public contest page, prizes, rules, referral source',true],
    ['Register','Profile, account terms, and OTP',flow.profile.registered&&flow.profile.otpVerified],
    ['Verify identity',`${policy} · ${flow.kyc.status}`,flow.kyc.status==='Approved'||policy==='Before payout'],
    ['Trading account',isLive?'Live account and minimum funding':'Demo credentials and starting balance',flow.account.linked&&(!isLive||flow.account.funded)],
    ['Browse lobby','Compare formats, fees, and eligibility',true],
    ['Join','Eligibility, contest terms, payment, and confirmation',flow.entry.status!=='Not joined'],
    ['Baseline snapshot','Starting balance and equity recorded',Boolean(flow.contest.baseline)],
    ['Trading + fair play','Live scoring and continuous validation',flow.contest.phase!=='Registration open'],
    ['Close + review','Trading frozen and full fair-play pass',Boolean(flow.contest.frozenAt)],
    ['Results + appeals','Provisional rank, appeal window, final rank',flow.results.status==='Final'],
    ['Prize eligibility','KYC and violation checks before release',['Eligible','Approved','Paid'].includes(flow.prize.status)],
    ['Payout + follow-up','Payout record, results, CRM, and campaigns',flow.prize.status==='Paid'&&flow.followUp!=='Not queued'],
  ]
  return <><Header eyebrow="TRADER JOURNEY" title="Your competition path" description="From a public contest page to verified entry, trading, reviewed results, and prize delivery." action={<PhasePill value={flow.entry.status}/>}/>
    <div className="flow-hero"><div><span className="eyebrow">SELECTED CONTEST</span><h2>{contest?.name}</h2><p>{contest?.type} · {contest?.dates} · {money(contest?.prize)} prize pool</p><div><PhasePill value={flow.contest.phase}/><span>Identity policy: {policy}</span></div></div><Trophy size={83}/></div>
    <div className="flow-trading-cta"><div><strong>{canStartTrading(flow)?'Your trading session is ready':'Trading starts after your entry and baseline are ready'}</strong><span>{canStartTrading(flow)?`Use your ${flow.account.platform} account or try the local demo trading screen.`:tradingBlockReason(flow)}</span></div><Action disabled={!canStartTrading(flow)} onClick={()=>onNavigate('trader-trade')} icon={TrendingUp}>Start trading</Action></div>
    <div className="flow-status-row"><div><span>User</span><PhasePill value={flow.profile.otpVerified?'Verified':'Registered'}/></div><div><span>KYC</span><PhasePill value={flow.kyc.status}/></div><div><span>Trading account</span><PhasePill value={flow.account.linked?(flow.account.funded?'Funded':'Linked'):'Not linked'}/></div><div><span>Entry</span><PhasePill value={flow.entry.status}/></div><div><span>Prize</span><PhasePill value={flow.prize.status}/></div></div>
    <Panel eyebrow="STAGE MAP" title="How your contest moves forward"><div className="flow-stage-grid">{stages.map(([title,detail,done],index)=><div key={title} className={done?'done':''}><span>{done?<Check size={15}/>:String(index).padStart(2,'0')}</span><strong>{title}</strong><small>{detail}</small></div>)}</div></Panel>
    <div className="exp-two-col"><Panel eyebrow="01 · IDENTITY" title="Tiered verification"><p className="muted">{isLive?'Live contests require approved KYC before joining.':fee?'Paid entry requires KYC before the demo checkout.':'Demo contests can defer full KYC until a prize is payable.'}</p><div className="info-rows"><div><span>Policy for this contest</span><strong>{policy}</strong></div><div><span>Your status</span><strong>{flow.kyc.status}</strong></div><div><span>Last update</span><strong>{dateText(flow.kyc.updatedAt)}</strong></div></div><div className="flow-actions"><Action disabled={flow.kyc.status==='Approved'||flow.kyc.status==='Pending'} onClick={()=>setKycStatus('Pending')} icon={Shield}>Submit demo documents</Action>{flow.kyc.status==='Pending'&&<Pill tone="amber">Awaiting admin review</Pill>}</div><p className="muted">ID, address, and screening are represented by status only. No document is uploaded here.</p></Panel>
    <Panel eyebrow="02 · TRADING ACCOUNT" title={isDemo?'Issue demo credentials':'Link and fund a live account'}><form className="exp-form" onSubmit={linkAccount}><div className="exp-form-grid"><label>Platform<select value={platform} onChange={e=>setPlatform(e.target.value)}><option>MetaTrader 4</option><option>MetaTrader 5</option><option>cTrader</option></select></label>{!isDemo&&<label>Live account ID<input required value={accountId} onChange={e=>setAccountId(e.target.value)} placeholder="e.g. MT5-78201"/></label>}</div><Action type="submit" icon={Link2}>{isDemo?'Issue demo account':'Link live account'}</Action></form>{flow.account.linked&&<div className="flow-account-summary"><CheckCircle2 size={17}/><span>{flow.account.platform} · {flow.account.id} · {money(flow.account.balance)} balance</span></div>}{isLive&&flow.account.linked&&!flow.account.funded&&<div className="flow-fund"><span>Minimum funding: $500. Use the broker deposit flow before entry.</span><Action variant="secondary" onClick={fund} icon={Wallet}>Simulate deposit</Action></div>}</Panel></div>
    <Panel eyebrow="03 · LOBBY" title="Selected contest"><div className="info-rows"><div><span>Contest</span><strong>{contest?.name}</strong></div><div><span>Account mode</span><strong>{contestAccountMode(contest)}</strong></div><div><span>Entry fee</span><strong>{fee?money(fee):'Free'}</strong></div><div><span>Availability</span><strong>{contest?.status}</strong></div></div><Action variant="secondary" onClick={()=>onNavigate('trader-discover')} icon={Search}>Browse contest lobby</Action></Panel>
    <div className="exp-two-col"><Panel eyebrow="04 · JOIN" title="Entry checklist"><div className="flow-checks">{checks.map(([label,pass])=><div key={label}><span className={pass?'pass':'fail'}>{pass?<Check size={14}/>:<X size={14}/>}</span><span>{label}</span></div>)}</div><label className="flow-terms"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} disabled={flow.entry.status!=='Not joined'}/><span>I have read and accept the contest rules and T&C. Acceptance is timestamped.</span></label>{fee>0&&flow.entry.payment!=='Confirmed'&&<div className="flow-fund"><span>Entry fee: {money(fee)}. No real payment is taken.</span><Action variant="secondary" disabled={policy==='Before payment'&&flow.kyc.status!=='Approved'} onClick={pay} icon={CreditCard}>Simulate checkout</Action></div>}<Action disabled={!canJoin} onClick={join} icon={CheckCircle2}>Confirm contest entry</Action>{flow.entry.confirmedAt&&<div className="flow-confirmation"><CheckCircle2 size={17}/> Confirmed {dateText(flow.entry.confirmedAt)}</div>}</Panel>
    <Panel eyebrow="05 · TRADING" title="Live monitoring"><div className="flow-live-stats"><div><span>Baseline</span><strong>{flow.contest.baseline?money(flow.contest.baseline.balance):'Awaiting start'}</strong></div><div><span>Trades</span><strong>{flow.contest.trades}</strong></div><div><span>Score</span><strong>{flow.contest.score.toFixed(2)}%</strong></div><div><span>Fair play</span><strong>{flow.contest.fairPlay}</strong></div></div><p className="muted">The baseline is captured when an admin starts the contest. Trade events are validated continuously; warnings or penalties appear here.</p>{flow.contest.warnings.length>0&&<div className="flow-alerts">{flow.contest.warnings.map((item,index)=><div key={index}><ShieldAlert size={16}/>{item}</div>)}</div>}{flow.contest.phase==='Active'&&<button className="text-link" onClick={()=>onNavigate('trader-appeals')}>Review a decision or appeal <ArrowRight size={15}/></button>}</Panel></div>
    <div className="exp-two-col"><Panel eyebrow="06 · RESULTS" title="Provisional to final"><div className="flow-result-timeline"><div><span>Provisional</span><strong>{flow.results.provisionalRank?`Rank #${flow.results.provisionalRank}`:'Awaiting close'}</strong></div><div><span>Appeal window</span><strong>{flow.results.appealEndsAt?`Until ${dateText(flow.results.appealEndsAt)}`:'Not open'}</strong></div><div><span>Final</span><strong>{flow.results.finalRank?`Rank #${flow.results.finalRank}`:'Not published'}</strong></div></div><div className="notice"><Flag size={18}/> Rankings remain provisional until appeals and the final fair-play review are resolved.</div></Panel><Panel eyebrow="07 · PRIZE & FOLLOW-UP" title="After the contest"><div className="info-rows"><div><span>Prize eligibility</span><strong>{flow.prize.status}</strong></div><div><span>Payout</span><strong>{flow.prize.status==='Paid'?'Recorded':'On hold until eligible'}</strong></div><div><span>Follow-up</span><strong>{flow.followUp}</strong></div></div><p className="muted">Full KYC, no unresolved cases, account standing, country rules, duplicate checks, and chargeback status are reviewed before payout.</p><Action variant="secondary" onClick={()=>onNavigate('trader-prizes')} icon={Gift}>View results & prizes</Action></Panel></div>
    <Toast text={message}/><div className="notice"><Shield size={18}/> This is a local workflow simulation. Real trades, identity checks, entry payments, emails, and payouts require backend integrations.</div>
  </>
}

export function TraderTrading({ onNavigate }) {
  const [flow,setFlow] = useLocal('fx-trader-flow',flowSeed)
  const [instrument,setInstrument] = useState('EURUSD')
  const [lots,setLots] = useState('1')
  const [outcome,setOutcome] = useState('Gain')
  const [message,setMessage] = useState('')
  const ready=canStartTrading(flow)
  const submit=event=>{
    event.preventDefault()
    const result=processDemoTrade(flow,{instrument,lots,outcome})
    if(result.error){setMessage(result.error);return}
    setFlow(result.next)
    setMessage(result.next.contest.fairPlay==='Disqualified'?'Drawdown limit reached. This entry is disqualified.':`Demo trade recorded: ${result.trade.change>=0?'+':''}${money(result.trade.change)}.`)
  }
  return <><Header eyebrow="TRADER WORKSPACE" title="Trading session" description="Place sample trades for your active contest and see the score and fair-play status update." action={<PhasePill value={flow.contest.phase}/>}/>
    <div className="flow-trading-cta"><div><strong>{ready?'Contest trading is open':'Trading is unavailable'}</strong><span>{ready?`${flow.account.platform} · ${flow.account.id} · baseline ${money(flow.contest.baseline.equity)}`:tradingBlockReason(flow)}</span></div><Action variant="secondary" onClick={()=>onNavigate('trader-journey')} icon={ArrowLeft}>My journey</Action></div>
    <div className="exp-two-col"><Panel eyebrow="DEMO TRADE TICKET" title="Simulate a trade"><p className="muted">These sample outcomes update local contest scores. This does not place an order on MT4, MT5, or cTrader.</p><form className="exp-form" onSubmit={submit}><div className="exp-form-grid"><label>Instrument<select value={instrument} onChange={e=>setInstrument(e.target.value)} disabled={!ready}><option>EURUSD</option><option>GBPUSD</option><option>USDJPY</option></select></label><label>Lot size<input type="number" min="0.01" max="10" step="0.01" value={lots} onChange={e=>setLots(e.target.value)} disabled={!ready} required/></label></div><label>Demo outcome<select value={outcome} onChange={e=>setOutcome(e.target.value)} disabled={!ready}><option>Gain</option><option>Loss</option></select></label><Action type="submit" disabled={!ready} icon={TrendingUp}>Place demo trade</Action></form><Toast text={message}/></Panel><Panel eyebrow="LIVE CONTEST STATE" title="Score and limits"><div className="flow-live-stats"><div><span>Trades</span><strong>{flow.contest.trades}</strong></div><div><span>Equity</span><strong>{money(flow.contest.equity)}</strong></div><div><span>Score</span><strong>{flow.contest.score.toFixed(2)}%</strong></div><div><span>Fair play</span><strong>{flow.contest.fairPlay}</strong></div></div><p className="muted">Maximum drawdown is 10% of starting equity in this demo. A breach disqualifies the entry immediately.</p><Action variant="secondary" onClick={()=>onNavigate('trader')} icon={Activity}>View performance</Action></Panel></div>
    <Panel eyebrow="RECENT ACTIVITY" title="Sample trades">{(flow.contest.history||[]).length?<div className="exp-list">{flow.contest.history.map((trade,index)=><div key={`${trade.at}-${index}`}><span><strong>{trade.instrument} · {trade.lots} lots</strong><small>{trade.outcome} · {dateText(trade.at)}</small></span><strong>{trade.change>=0?'+':''}{money(trade.change)}</strong></div>)}</div>:<p className="muted">No demo trades have been placed for this contest.</p>}</Panel>
  </>
}

export function TraderLivePerformance({ onNavigate }) {
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  const active=flow.contest.phase==='Active'
  const started=Boolean(flow.contest.baseline)
  return <><Header eyebrow="TRADING PERFORMANCE" title="Your live performance" description="Trade on your connected platform while scores and fair-play checks update here." action={<Action disabled={!canStartTrading(flow)} onClick={()=>onNavigate('trader-trade')} icon={TrendingUp}>Start trading</Action>}/>
    {!started?<Panel eyebrow="AWAITING CONTEST START" title="Your baseline has not been captured"><p className="muted">Your entry must be confirmed. When the admin starts the contest, the system snapshots starting balance and equity before any score is calculated.</p><Action onClick={()=>onNavigate('trader-journey')}>Review your journey</Action></Panel>:<><div className="metrics-grid"><Stat label="Current score" value={`${flow.contest.score.toFixed(2)}%`} detail="Against the baseline" icon={TrendingUp}/><Stat label="Current equity" value={money(flow.contest.equity)} detail={`Baseline ${money(flow.contest.baseline.equity)}`} icon={Wallet}/><Stat label="Trades processed" value={flow.contest.trades} detail={`Last sync ${dateText(flow.contest.lastSync)}`} icon={Activity}/><Stat label="Fair-play status" value={flow.contest.fairPlay} detail={`${flow.contest.warnings.length} recorded alerts`} icon={Shield}/></div><div className="exp-two-col"><Panel eyebrow="LIVE ACCOUNT" title="Scoring basis"><div className="info-rows"><div><span>Starting balance</span><strong>{money(flow.contest.baseline.balance)}</strong></div><div><span>Starting equity</span><strong>{money(flow.contest.baseline.equity)}</strong></div><div><span>Current equity</span><strong>{money(flow.contest.equity)}</strong></div><div><span>Point penalty</span><strong>{flow.contest.penalty} points</strong></div><div><span>Trading state</span><strong>{active?'Open':'Frozen'}</strong></div></div></Panel><Panel eyebrow="FAIR PLAY" title="Continuous monitoring"><p className="muted">Trades are checked for drawdown, lot size, instruments, trading windows, holding time, and suspicious patterns while the contest is active.</p>{flow.contest.warnings.length?<div className="flow-alerts">{flow.contest.warnings.map((item,index)=><div key={index}><ShieldAlert size={16}/>{item}</div>)}</div>:<div className="notice success"><CheckCircle2 size={18}/> No warnings have been recorded for this demo entry.</div>}<Action variant="secondary" onClick={()=>onNavigate('trader-appeals')} icon={Flag}>Open appeals</Action></Panel></div></>}
  </>
}

export function TraderResults({ onNavigate }) {
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  const hasProvisional=flow.results.status==='Provisional'
  const final=flow.results.status==='Final'
  return <><Header eyebrow="RESULTS & AWARDS" title="Results and prizes" description="Understand when rankings are provisional, when appeals close, and whether an award can be paid." action={<PhasePill value={flow.results.status}/>}/>
    <div className="flow-hero"><div><span className="eyebrow">CURRENT RESULT</span><h2>{final?flow.results.finalRank?`Final rank #${flow.results.finalRank}`:'Disqualified':hasProvisional?flow.results.provisionalRank?`Provisional rank #${flow.results.provisionalRank}`:'Under review':'Awaiting contest close'}</h2><p>{final?'The final ranking was published after review.':hasProvisional?'This result may change during the appeal and fair-play review window.':'No ranking becomes final while trading is open.'}</p><div><PhasePill value={flow.prize.status}/><span>Prize status</span></div></div><Award size={75}/></div>
    <div className="exp-two-col"><Panel eyebrow="RANKING PROCESS" title="From provisional to final"><div className="flow-result-timeline"><div><span>Trading frozen</span><strong>{dateText(flow.contest.frozenAt)}</strong></div><div><span>Provisional rank</span><strong>{flow.results.provisionalRank?`#${flow.results.provisionalRank}`:'Not available'}</strong></div><div><span>Appeal window</span><strong>{flow.results.appealEndsAt?flow.results.appealWindowClosed?'Closed':`Until ${dateText(flow.results.appealEndsAt)}`:'Not opened'}</strong></div><div><span>Final review</span><strong>{flow.results.reviewComplete?'Complete':'Pending'}</strong></div><div><span>Final rank</span><strong>{flow.results.finalRank?`#${flow.results.finalRank}`:'Not published'}</strong></div></div>{hasProvisional&&<Action variant="secondary" onClick={()=>onNavigate('trader-appeals')} icon={Flag}>Review appeal options</Action>}</Panel><Panel eyebrow="PAYOUT ELIGIBILITY" title="Checks before money moves"><div className="flow-checks">{[['Full KYC approved',flow.kyc.status==='Approved'],['Final ranking published',final],['No disqualification',flow.contest.fairPlay!=='Disqualified'],['Prize approved',['Eligible','Paid'].includes(flow.prize.status)]].map(([label,pass])=><div key={label}><span className={pass?'pass':'fail'}>{pass?<Check size={14}/>:<X size={14}/>}</span><span>{label}</span></div>)}</div><div className="info-rows"><div><span>Prize status</span><strong>{flow.prize.status}</strong></div><div><span>Prize type</span><strong>{flow.prize.type||"Account credit"}</strong></div><div><span>Payout record</span><strong>{dateText(flow.prize.paidAt)}</strong></div><div><span>Post-contest follow-up</span><strong>{flow.followUp}</strong></div></div><div className="notice"><LockKeyhole size={18}/> If a check fails, the award stays on hold and the trader receives a reason.</div></Panel></div>
  </>
}

export function TraderIdentity() {
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  return <><Header eyebrow="TRADER ACCOUNT" title="Profile and account" description="Your registration, verification, and trading account connection."/><div className="exp-two-col"><Panel eyebrow="PERSONAL PROFILE" title={flow.profile.name}><div className="info-rows"><div><span>Email</span><strong>{flow.profile.email}</strong></div><div><span>Phone</span><strong>{flow.profile.phone}</strong></div><div><span>Country</span><strong>{flow.profile.country||'Not set'}</strong></div><div><span>Contact status</span><strong>{flow.profile.otpVerified?'Verified':'Pending'}</strong></div><div><span>Attribution source</span><strong>{flow.source}</strong></div></div></Panel><Panel eyebrow="TRADING ACCOUNT" title={flow.account.linked?flow.account.platform:'Not connected'}><div className="info-rows"><div><span>Account ID</span><strong>{flow.account.id||'Not linked'}</strong></div><div><span>Mode</span><strong>{flow.account.type||'Not selected'}</strong></div><div><span>Balance</span><strong>{money(flow.account.balance)}</strong></div><div><span>Funding</span><strong>{flow.account.funded?'Funded':'Not funded'}</strong></div><div><span>KYC</span><strong>{flow.kyc.status}</strong></div></div><p className="muted">Use My journey to link or issue a trading account and continue eligibility checks.</p></Panel></div></>
}

export function TraderFairPlay({ onNavigate }) {
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  return <><Header eyebrow="FAIR PLAY" title="Rules and eligibility" description="Monitor rule usage continuously while you trade." action={<PhasePill value={flow.contest.fairPlay}/>}/><div className="exp-two-col"><Panel eyebrow="RISK LIMITS" title="Contest rules"><div className="info-rows"><div><span>Maximum drawdown</span><strong>10% of starting equity</strong></div><div><span>Maximum daily loss</span><strong>5%</strong></div><div><span>Maximum lot size</span><strong>10 lots</strong></div><div><span>Minimum trading days</span><strong>10</strong></div><div><span>Allowed instruments</span><strong>EURUSD, GBPUSD, USDJPY</strong></div><div><span>Trading window</span><strong>00:00–23:59 UTC</strong></div></div><p className="muted">Admin configuration determines the final rule set for each contest.</p></Panel><Panel eyebrow="ONGOING VALIDATION" title="Account checks"><div className="flow-live-stats"><div><span>Trades processed</span><strong>{flow.contest.trades}</strong></div><div><span>Point penalties</span><strong>{flow.contest.penalty}</strong></div><div><span>Warning count</span><strong>{flow.contest.warnings.length}</strong></div><div><span>Entry status</span><strong>{flow.entry.status}</strong></div></div>{flow.contest.warnings.length?<div className="flow-alerts">{flow.contest.warnings.map((item,index)=><div key={index}><ShieldAlert size={16}/>{item}</div>)}</div>:<div className="notice success"><CheckCircle2 size={18}/> No alerts have been recorded for this demo entry.</div>}<Action variant="secondary" onClick={()=>onNavigate('trader-appeals')} icon={Flag}>Open appeal center</Action></Panel></div></>
}

export function AdminContestLifecycle({ competitions, onCompetitionUpdate, title='Contest lifecycle' }) {
  const [flow,setFlow] = useLocal('fx-trader-flow',flowSeed)
  const [appeals] = useLocal('fx-appeals',[])
  const [message,setMessage] = useState('')
  const contest=competitions.find(c=>c.id===flow.selectedContest)||competitions[0]
  const unresolved=appeals.some(a=>a.trader===flow.profile.name&&a.status==='Needs review')
  const update=next=>setFlow({...flow,...next})
  const reviewKyc=status=>{update({kyc:{status,updatedAt:stamp()}});setMessage(`KYC marked ${status.toLowerCase()}`)}
  const approveEntry=()=>{if(needsKycToJoin(contest)&&flow.kyc.status!=='Approved')return;update({entry:{...flow.entry,status:'Confirmed',confirmedAt:stamp()}});setMessage('Manual entry approval recorded')}
  const start=()=>{if(flow.entry.status!=='Confirmed'||(needsKycToJoin(contest)&&flow.kyc.status!=='Approved'))return;const baseline={balance:flow.account.balance||100000,equity:flow.account.balance||100000,at:stamp()};update({entry:{...flow.entry,status:'Active'},contest:{...flow.contest,phase:'Active',baseline,equity:baseline.equity,lastSync:stamp()}});onCompetitionUpdate?.(contest.id,{status:'Active'});setMessage('Contest started and baseline snapshot captured')}
  const trade=()=>{if(flow.contest.phase!=='Active'||flow.contest.fairPlay==='Disqualified')return;const nextTrades=flow.contest.trades+1;const gain=420;const equity=flow.contest.equity+gain;const baseline=flow.contest.baseline?.equity||100000;update({contest:{...flow.contest,trades:nextTrades,equity,score:((equity-baseline)/baseline*100)-flow.contest.penalty,lastSync:stamp()}});setMessage('Simulated trade processed and checked against rules')}
  const warn=type=>{if(flow.contest.phase!=='Active'||flow.contest.fairPlay==='Disqualified')return;const warning=`${type} · ${dateText(stamp())}`;const penalty=type==='Point penalty'?flow.contest.penalty+2:flow.contest.penalty;update({contest:{...flow.contest,warnings:[...flow.contest.warnings,warning],fairPlay:type==='Disqualified'?'Disqualified':type==='Point penalty'?'Penalized':'Warning',penalty,score:flow.contest.score-(penalty-flow.contest.penalty)},entry:type==='Disqualified'?{...flow.entry,status:'Disqualified'}:flow.entry});setMessage(`${type} recorded and visible to the trader`)}
  const close=()=>{const appealHours=Number(flow.results.appealHours||48);const appealEndsAt=new Date(Date.now()+appealHours*60*60*1000).toISOString();update({entry:{...flow.entry,status:flow.entry.status==='Disqualified'?'Disqualified':'Completed'},contest:{...flow.contest,phase:'Closed',frozenAt:stamp()},results:{status:'Provisional',provisionalRank:flow.contest.fairPlay==='Disqualified'?null:1,finalRank:null,appealEndsAt,appealHours,appealWindowClosed:false,reviewComplete:false}});onCompetitionUpdate?.(contest.id,{status:'Completed'});setMessage(`Trading frozen; provisional result and ${appealHours}-hour appeal window opened`)}
  const review=()=>{update({results:{...flow.results,reviewComplete:true}});setMessage('Final fair-play review recorded')}
  const closeAppeals=()=>{update({results:{...flow.results,appealWindowClosed:true}});setMessage('Demo appeal window closed')}
  const finalise=()=>{if(flow.results.status!=='Provisional'||!flow.results.reviewComplete||!flow.results.appealWindowClosed||unresolved)return;update({contest:{...flow.contest,phase:'Final'},results:{...flow.results,status:'Final',finalRank:flow.contest.fairPlay==='Disqualified'?null:flow.results.provisionalRank}});setMessage('Final ranking published after review')}
  const prizeChecks=flow.prize.checks||flowSeed.prize.checks
  const eligible=flow.results.status==='Final'&&Boolean(flow.results.finalRank)&&flow.kyc.status==='Approved'&&!unresolved&&flow.contest.fairPlay!=='Disqualified'&&Object.values(prizeChecks).every(Boolean)
  const setPrizeCheck=(key,value)=>update({prize:{...flow.prize,checks:{...prizeChecks,[key]:value}}})
  const holdPrize=()=>{update({prize:{...flow.prize,status:'On hold'}});setMessage('Prize held pending eligibility checks')}
  const markEligible=()=>{if(!eligible)return;update({prize:{...flow.prize,status:'Eligible'}});setMessage('Prize eligibility approved')}
  const pay=()=>{if(!eligible||flow.prize.status!=='Eligible')return;update({prize:{...flow.prize,status:'Paid',paidAt:stamp()}});setMessage('Demo payout recorded; no funds transferred')}
  const follow=()=>{update({followUp:'Queued for CRM and email'});setMessage('Post-contest follow-up queued in the demo')}
  return <><Header eyebrow="CONTEST OPERATIONS" title={title} description="Operate start, monitoring, close, review, results, and payout gates." action={<Pill tone="amber">Local simulation</Pill>}/><div className="flow-hero"><div><span className="eyebrow">CURRENT CONTEST</span><h2>{contest?.name}</h2><p>Trader: {flow.profile.name} · Entry: {flow.entry.status} · Fair play: {flow.contest.fairPlay}</p><div><PhasePill value={flow.contest.phase}/><span>Selected from the trader lobby</span></div></div><Shield size={80}/></div>
    {flow.entry.status==='Pending approval'&&<div className="flow-manual-approval"><span><Clock3 size={18}/> Entry is waiting for manual approval.</span><Action disabled={needsKycToJoin(contest)&&flow.kyc.status!=='Approved'} onClick={approveEntry} icon={CheckCircle2}>Approve entry</Action></div>}
    <div className="exp-two-col"><Panel eyebrow="IDENTITY & ENTRY" title="Approve before the start"><div className="info-rows"><div><span>Contact</span><strong>{flow.profile.otpVerified?'Verified':'Not verified'}</strong></div><div><span>KYC status</span><strong>{flow.kyc.status}</strong></div><div><span>Policy</span><strong>{kycPolicy(contest)}</strong></div><div><span>Entry</span><strong>{flow.entry.status}</strong></div></div><div className="flow-actions"><Action variant="secondary" onClick={()=>reviewKyc('Approved')} icon={CheckCircle2}>Approve demo KYC</Action><Action variant="secondary" onClick={()=>reviewKyc('Needs more info')} icon={Flag}>Request info</Action><Action variant="secondary" onClick={()=>reviewKyc('Rejected')} icon={X}>Reject</Action><Action variant="secondary" onClick={()=>reviewKyc('Expired')} icon={Clock3}>Mark expired</Action></div></Panel><Panel eyebrow="START" title="Baseline snapshot"><p className="muted">A start event records balance and equity before any score is calculated. Deposit and withdrawal handling must be configured for live contests.</p><label className="flow-policy">Live deposits and withdrawals<select value={flow.contest.cashFlowPolicy||"Lock deposits and withdrawals"} onChange={e=>update({contest:{...flow.contest,cashFlowPolicy:e.target.value}})} disabled={Boolean(flow.contest.baseline)}><option>Lock deposits and withdrawals</option><option>Adjust score for cash flows</option></select></label><div className="info-rows"><div><span>Starting balance</span><strong>{flow.contest.baseline?money(flow.contest.baseline.balance):'Not captured'}</strong></div><div><span>Starting equity</span><strong>{flow.contest.baseline?money(flow.contest.baseline.equity):'Not captured'}</strong></div><div><span>Captured at</span><strong>{dateText(flow.contest.baseline?.at)}</strong></div></div><Action disabled={flow.entry.status!=='Confirmed'||flow.contest.phase!=='Registration open'||(needsKycToJoin(contest)&&flow.kyc.status!=='Approved')} onClick={start} icon={Activity}>Start and snapshot</Action></Panel></div>
    <div className="exp-two-col"><Panel eyebrow="LIVE PHASE" title="Trading + fair play"><div className="flow-live-stats"><div><span>Trades</span><strong>{flow.contest.trades}</strong></div><div><span>Equity</span><strong>{money(flow.contest.equity)}</strong></div><div><span>Score</span><strong>{flow.contest.score.toFixed(2)}%</strong></div><div><span>Validation</span><strong>{flow.contest.fairPlay}</strong></div></div><div className="flow-actions"><Action disabled={flow.contest.phase!=='Active'||flow.contest.fairPlay==='Disqualified'} onClick={trade} icon={TrendingUp}>Process demo trade</Action><Action variant="secondary" disabled={flow.contest.phase!=='Active'||flow.contest.fairPlay==='Disqualified'} onClick={()=>warn('Warning')} icon={Bell}>Warn</Action><Action variant="secondary" disabled={flow.contest.phase!=='Active'||flow.contest.fairPlay==='Disqualified'} onClick={()=>warn('Point penalty')} icon={Target}>Penalize</Action><Action variant="secondary" disabled={flow.contest.phase!=='Active'||flow.contest.fairPlay==='Disqualified'} onClick={()=>warn('Disqualified')} icon={ShieldAlert}>Disqualify</Action></div><p className="muted">Every simulated trade is scored; warnings, penalties, and disqualification stay visible throughout trading.</p></Panel><Panel eyebrow="CLOSE" title="Freeze and score"><label className="flow-policy">Open positions at close<select value={flow.contest.closePolicy} onChange={e=>update({contest:{...flow.contest,closePolicy:e.target.value}})} disabled={flow.contest.frozenAt}><option>Mark to market</option><option>Force close</option></select></label><label className="flow-policy">Appeal window<select value={flow.results.appealHours||48} onChange={e=>update({results:{...flow.results,appealHours:Number(e.target.value)}})} disabled={Boolean(flow.contest.frozenAt)}><option value="24">24 hours</option><option value="48">48 hours</option><option value="72">72 hours</option></select></label><div className="info-rows"><div><span>Frozen at</span><strong>{dateText(flow.contest.frozenAt)}</strong></div><div><span>Close policy</span><strong>{flow.contest.closePolicy}</strong></div><div><span>Provisional rank</span><strong>{flow.results.provisionalRank?`#${flow.results.provisionalRank}`:'Not published'}</strong></div></div><Action disabled={flow.contest.phase!=='Active'} onClick={close} icon={LockKeyhole}>Close contest</Action></Panel></div>
    <div className="exp-two-col"><Panel eyebrow="RESULTS REVIEW" title="Provisional → appeal → final"><div className="info-rows"><div><span>Result status</span><strong>{flow.results.status}</strong></div><div><span>Appeal window</span><strong>{flow.results.appealEndsAt?dateText(flow.results.appealEndsAt):'Not open'}</strong></div><div><span>Unresolved trader appeal</span><strong>{unresolved?'Yes':'No'}</strong></div><div><span>Full fair-play review</span><strong>{flow.results.reviewComplete?'Complete':'Pending'}</strong></div></div><div className="flow-actions"><Action variant="secondary" disabled={flow.results.status!=='Provisional'} onClick={review} icon={Shield}>Complete review</Action><Action variant="secondary" disabled={flow.results.status!=='Provisional'||flow.results.appealWindowClosed} onClick={closeAppeals} icon={Clock3}>Close demo appeal window</Action><Action disabled={flow.results.status!=='Provisional'||!flow.results.reviewComplete||!flow.results.appealWindowClosed||unresolved} onClick={finalise} icon={Award}>Publish final rank</Action></div></Panel><Panel eyebrow="PRIZE ELIGIBILITY" title="Hold before payout"><div className="flow-checks"><div><span className={flow.kyc.status==='Approved'?'pass':'fail'}>{flow.kyc.status==='Approved'?<Check size={14}/>:<X size={14}/>}</span><span>Full KYC approved and current</span></div><div><span className={!unresolved?'pass':'fail'}>{!unresolved?<Check size={14}/>:<X size={14}/>}</span><span>No unresolved appeals</span></div><div><span className={flow.contest.fairPlay!=='Disqualified'?'pass':'fail'}>{flow.contest.fairPlay!=='Disqualified'?<Check size={14}/>:<X size={14}/>}</span><span>No disqualification</span></div><div><span className={flow.results.status==='Final'?'pass':'fail'}>{flow.results.status==='Final'?<Check size={14}/>:<X size={14}/>}</span><span>Final ranking approved</span></div></div><label className="flow-policy">Prize type<select value={flow.prize.type||"Account credit"} onChange={e=>update({prize:{...flow.prize,type:e.target.value}})} disabled={flow.prize.status==="Paid"}><option>Account credit</option><option>Cash transfer</option><option>Wallet balance</option><option>Trading bonus</option><option>Crypto</option></select></label><div className="flow-prize-checks">{[['accountGood','Account in good standing'],['countryAllowed','Country allowed'],['noDuplicate','No duplicate or linked account'],['noChargeback','No entry-fee chargeback']].map(([key,label])=><label key={key}><input type="checkbox" checked={Boolean(prizeChecks[key])} onChange={e=>setPrizeCheck(key,e.target.checked)}/>{label}</label>)}</div><div className="flow-actions"><Action variant="secondary" disabled={flow.results.status!=='Final'||flow.prize.status==='Paid'} onClick={holdPrize} icon={LockKeyhole}>Hold prize</Action><Action disabled={!eligible||!['Not determined','On hold'].includes(flow.prize.status)} onClick={markEligible} icon={CheckCircle2}>Mark eligible</Action><Action variant="secondary" disabled={flow.prize.status!=='Eligible'||!eligible} onClick={pay} icon={CreditCard}>Record demo payout</Action></div></Panel></div>
    <Panel eyebrow="POST-CONTEST" title="Results and follow-up"><div className="info-rows"><div><span>Final rank</span><strong>{flow.results.finalRank?`#${flow.results.finalRank}`:'Not final'}</strong></div><div><span>Prize status</span><strong>{flow.prize.status}</strong></div><div><span>Payout recorded</span><strong>{dateText(flow.prize.paidAt)}</strong></div><div><span>CRM / email follow-up</span><strong>{flow.followUp}</strong></div></div><Action variant="secondary" disabled={flow.results.status!=='Final'||flow.followUp!=='Not queued'} onClick={follow} icon={Bell}>Queue follow-up</Action></Panel><Toast text={message}/><div className="notice"><Shield size={18}/> This workflow simulates operational events; no trading platform, KYC provider, payment gateway, or CRM is connected.</div>
  </>
}
