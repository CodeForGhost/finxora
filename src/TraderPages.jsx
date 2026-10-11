import React, { useState } from 'react'
import { ArrowRight, Award, Bell, CalendarDays, Check, CheckCircle2, Copy, Flag, Gift, Globe2, Link2, LockKeyhole, Medal, Search, Shield, Sparkles, Target, TrendingUp, Trophy, Users, Wallet, X } from 'lucide-react'
import { Action, copyText, EmptyState, Header, money, Panel, Pill, Stat, Toast, useLocal } from './ExperienceUI.jsx'
import { flowSeed } from './Lifecycle.jsx'

export const appealSeed = [
  { id: 'APL-102', trader: 'Noah Williams', competition: 'Apex Trader Challenge', decision: 'Restricted instrument warning', reason: 'The symbol was included in the published allowed list when the trade opened.', status: 'Needs review', submitted: 'Oct 09, 2026' },
]

const feeFor = competition => competition.entryFee == null ? (competition.type === 'Flash' ? 25 : 0) : Number(competition.entryFee)

export function TraderDiscovery({ competitions, joined, setJoined, notify }) {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: 'Alex Morgan', email: 'alex.morgan@example.com', country: 'United Kingdom', account: 'MT5-48291', agree: false })
  const [filter, setFilter] = useState('All')
  const [registrations, setRegistrations] = useLocal('fx-trader-registrations', [])
  const available = competitions.filter(c => !['Draft','Cancelled'].includes(c.status) && c.type !== 'Private' && (filter === 'All' || c.type === filter))
  const register = event => {
    event.preventDefault()
    if (!selected || joined.includes(selected.id)) return
    setJoined([...joined, selected.id])
    setRegistrations([...registrations, { id: `REG-${Date.now()}`, competition: selected.name, name: form.name.trim(), email: form.email.trim(), country: form.country.trim(), account: form.account.trim(), entryFee: feeFor(selected), status: 'Pending KYC' }])
    notify('Entry submitted for verification')
    setSelected(null)
    setForm({ ...form, agree: false })
  }
  return <>
    <Header eyebrow="COMPETITION DISCOVERY" title="Find your next challenge" description="Explore contest formats, entry terms, prize pools, and registration requirements."/>
    <div className="exp-filters">{['All','Demo','Live account','Combined','Flash'].map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item}</button>)}</div>
    <div className="competition-cards">{available.map(c=><article className="competition-card trader-discovery" key={c.id}>
      <div className="competition-card-top"><div className={`competition-symbol large ${c.color}`}><Trophy size={25}/></div><Pill tone={c.status==='Registration Open'?'green':'neutral'}>{c.status}</Pill></div>
      <h3>{c.name}</h3><p>{c.description}</p>
      <div className="exp-card-tags"><span>{c.type}</span><span>{feeFor(c) ? `${money(feeFor(c))} entry` : 'Free entry'}</span><span>{c.ranking}</span></div>
      <div className="competition-meta"><span><CalendarDays size={15}/>{c.dates}</span><span><Globe2 size={15}/>{c.region}</span></div>
      <div className="capacity"><div><span>Registered traders</span><strong>{c.participants.toLocaleString()} / {c.capacity.toLocaleString()}</strong></div><div className="progress"><i style={{width:`${Math.min(100,c.participants/c.capacity*100)}%`}}/></div></div>
      {joined.includes(c.id) && c.type === 'Demo' && <div className="exp-demo-account"><LockKeyhole size={15}/> Demo account issued: <strong>MT5-DEMO-2048</strong></div>}
      <div className="competition-card-footer"><span>Prize pool <strong>{money(c.prize)}</strong></span><Action variant={joined.includes(c.id)?'secondary':'primary'} disabled={joined.includes(c.id)||c.status!=='Registration Open'} onClick={()=>setSelected(c)}>{joined.includes(c.id)?'Joined':c.status==='Registration Open'?'View & join':'Opens soon'}</Action></div>
    </article>)}</div>
    <div className="notice"><Shield size={18}/> Registration, KYC, paid entry, and account issuance are simulated in this prototype.</div>
    {selected && <div className="modal-overlay" onMouseDown={event=>{if(event.target===event.currentTarget)setSelected(null)}}><div className="modal exp-modal" role="dialog" aria-modal="true" aria-labelledby="join-title">
      <div className="modal-head"><div><span className="eyebrow">COMPETITION ENTRY</span><h2 id="join-title">Join {selected.name}</h2><p>{selected.type} · {feeFor(selected)?`${money(feeFor(selected))} entry`:'Free entry'} · {money(selected.prize)} prize pool</p></div><button onClick={()=>setSelected(null)} aria-label="Close"><X size={20}/></button></div>
      <div className="exp-modal-summary"><div><strong>Scoring</strong><span>{selected.ranking}</span></div><div><strong>Key rules</strong><span>10% max drawdown · 5% daily loss · Minimum 10 trading days</span></div><div><strong>Verification</strong><span>Email, account and identity review before approval</span></div></div>
      <form onSubmit={register} className="exp-form"><div className="exp-form-grid"><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Country<input required value={form.country} onChange={e=>setForm({...form,country:e.target.value})}/></label><label>Trading account<input required value={form.account} onChange={e=>setForm({...form,account:e.target.value})}/></label></div><label className="exp-check"><input type="checkbox" checked={form.agree} onChange={e=>setForm({...form,agree:e.target.checked})} required/><span>I agree to the competition rules and verification process.</span></label><div className="exp-modal-actions"><Action variant="secondary" icon={null} onClick={()=>setSelected(null)}>Cancel</Action><Action type="submit">Submit entry</Action></div></form>
    </div></div>}
  </>
}

export function TraderEngagement() {
  const [message,setMessage] = useState('')
  const share = async () => {
    const copied = await copyText('Finxora Apex Trader Challenge — Alex Morgan is currently ranked #1 with +38.42% return.')
    setMessage(copied?'Share text copied to clipboard':'Sharing is unavailable in this browser')
  }
  return <div className="exp-two-col exp-engagement"><Panel eyebrow="MILESTONES" title="Your achievements"><div className="exp-achievements"><div><span><Award size={20}/></span><strong>Top 10</strong><small>Reached the top 10 traders</small><Pill tone="green">Unlocked</Pill></div><div><span><TrendingUp size={20}/></span><strong>30% return</strong><small>Crossed the 30% growth mark</small><Pill tone="green">Unlocked</Pill></div><div><span><Target size={20}/></span><strong>20 trading days</strong><small>2 days until qualification</small><Pill tone="amber">In progress</Pill></div></div></Panel><Panel eyebrow="SHARE YOUR PROGRESS" title="Competition snapshot"><div className="exp-share"><span className="eyebrow">APEX TRADER CHALLENGE</span><strong>#1 <small>of 1,248 traders</small></strong><p>+38.42% return · 18 trading days · 72% win rate</p><Action variant="secondary" icon={Copy} onClick={share}>Copy share text</Action></div><Toast text={message}/></Panel></div>
}

export function TraderAppeals() {
  const [appeals,setAppeals] = useLocal('fx-appeals', appealSeed)
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  const [reason,setReason] = useState('')
  const mine = appeals.filter(a=>a.trader===flow.profile.name)
  const canAppeal=flow.contest.warnings.length>0&&(flow.contest.phase==='Active'||(flow.results.status==='Provisional'&&!flow.results.appealWindowClosed&&Date.now()<new Date(flow.results.appealEndsAt).getTime()))
  const submit = event => {
    event.preventDefault()
    setAppeals([...appeals,{ id:`APL-${Date.now()}`, trader:flow.profile.name, competition:flow.selectedContest, decision:flow.contest.warnings.at(-1)?.split(' · ')[0]||'Sample rule warning', reason:reason.trim(), status:'Needs review', submitted:new Date().toLocaleDateString('en-US') }])
    setReason('')
  }
  return <><Header eyebrow="FAIR PLAY" title="Appeals" description="Ask the operations team to review a competition rule decision."/><div className="exp-two-col"><Panel eyebrow="YOUR CASES" title="Appeal history">{mine.length?mine.map(a=><div className="exp-case" key={a.id}><div><strong>{a.decision}</strong><small>{a.competition} · {a.id}</small></div><Pill tone={a.status==='Needs review'?'amber':a.status==='Reversed'?'green':'neutral'}>{a.status}</Pill><p>{a.reason}</p></div>):<EmptyState title="No appeals submitted" text="Your account currently has no open disqualification. An appeal becomes available after a warning or penalty during trading, or during the provisional result window."/>}</Panel><Panel eyebrow="REQUEST A REVIEW" title="Appeal a decision"><p className="muted">{canAppeal ? "Decision: "+flow.contest.warnings.at(-1)?.split(' · ')[0]+". Explain why it should be reviewed." : "No appealable decision is open for this entry."}</p><form className="exp-form" onSubmit={submit}><label>Reason for appeal<textarea required minLength={15} rows={5} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Describe the trade, timing, and any supporting context..."/></label><Action type="submit" disabled={!canAppeal} icon={Flag}>Submit appeal</Action></form><div className="notice"><Shield size={18}/> Submitting an appeal does not change eligibility until an admin reviews it.</div></Panel></div></>
}

export function TraderAccountConnection() {
  const [saved,setSaved] = useLocal('fx-trader-account',{platform:'MetaTrader 5',account:'MT5-48291',status:'Demo connected'})
  const [platform,setPlatform] = useState(saved.platform)
  const [account,setAccount] = useState(saved.account)
  const [message,setMessage] = useState('')
  const connect=e=>{e.preventDefault();setSaved({platform,account:account.trim(),status:'Demo connected'});setMessage('Trading account linked in the prototype')}
  return <Panel eyebrow="TRADING PLATFORM" title="Link an account"><div className="exp-two-col"><form className="exp-form" onSubmit={connect}><label>Platform<select value={platform} onChange={e=>setPlatform(e.target.value)}><option>MetaTrader 4</option><option>MetaTrader 5</option><option>cTrader</option></select></label><label>Trading account ID<input required value={account} onChange={e=>setAccount(e.target.value)} placeholder="Enter account ID"/></label><Action type="submit" icon={Link2}>Link demo account</Action><Toast text={message}/></form><div className="exp-account-state"><span className="eyebrow">CURRENT CONNECTION</span><strong>{saved.platform}</strong><p>{saved.account}</p><Pill tone="green">{saved.status}</Pill><small>Balance and trade sync are sample values until a broker connector is configured.</small></div></div></Panel>
}

export function TraderPrizeExperience({ paid }) {
  return <><Header eyebrow="RESULTS & REWARDS" title="Results & prizes" description="Follow your standing, winner verification, and award status."/><div className="trader-hero"><div><span className="eyebrow">CURRENT PROVISIONAL RANK</span><h2>#1 <span>in Apex Trader Challenge</span></h2><p>The competition is active. Final results depend on rule and eligibility review.</p></div><div className="trader-hero-graphic"><Award size={110}/></div></div><div className="exp-two-col"><Panel eyebrow="PRIZE STRUCTURE" title="Rank-based awards"><div className="info-rows"><div><span>1st place</span><strong>$25,000</strong></div><div><span>2nd place</span><strong>$15,000</strong></div><div><span>3rd place</span><strong>$10,000</strong></div></div></Panel><Panel eyebrow="YOUR STATUS" title="Verification and payout"><div className="exp-step-list"><div><span>01</span><strong>Entry verified</strong><small>Sample account and eligibility checks complete.</small></div><div><span>02</span><strong>Final result review</strong><small>Rules and trading history checked after the contest.</small></div><div><span>03</span><strong>Prize release</strong><small>{paid?'Demo payout marked paid by the admin.':'Payout stays on hold until admin approval.'}</small></div></div><div className="notice"><Wallet size={18}/><span>Demo payout status: <strong>{paid?'Paid':'On hold'}</strong>. No money moves in this prototype.</span></div></Panel></div></>
}

export function TraderMyCompetitions({ competitions, joined, onNavigate }) {
  const [registrations] = useLocal('fx-trader-registrations',[])
  const [flow] = useLocal('fx-trader-flow',flowSeed)
  const mine=competitions.filter(c=>c.id===flow.selectedContest&&flow.entry.status!=='Not joined')
  return <><Header eyebrow="YOUR COMPETITIONS" title="My competitions" description="See your entries, verification status, and current challenge." action={<Action onClick={()=>onNavigate('trader-discover')} icon={Search}>Find competitions</Action>}/><div className="competition-cards">{mine.map(c=>{const entry=registrations.find(r=>r.competition===c.name&&r.email===flow.profile.email);const status=flow.selectedContest===c.id&&flow.entry.status!=='Not joined'?flow.entry.status:entry?.status||(c.id==='apex'?'Approved':'Pending KYC');return <div className="competition-card trader-discovery" key={c.id}><div className="competition-card-top"><div className={`competition-symbol large ${c.color}`}><Trophy size={25}/></div><Pill tone={c.status==='Active'?'green':'neutral'}>{c.status}</Pill></div><h3>{c.name}</h3><p>{c.description}</p><div className="info-rows"><div><span>Your entry</span><strong>{status}</strong></div><div><span>Account mode</span><strong>{c.type}</strong></div><div><span>Ranking method</span><strong>{c.ranking}</strong></div><div><span>Prize pool</span><strong>{money(c.prize)}</strong></div></div>{c.type==='Demo'&&status==='Confirmed'&&<div className="exp-demo-account"><LockKeyhole size={15}/> Demo credentials: <strong>{flow.account.id||'MT5-DEMO-2048'}</strong></div>}<div className="competition-card-footer"><span>{c.dates}</span><button className="text-link" onClick={()=>onNavigate('trader-journey')}>View journey <ArrowRight size={15}/></button></div></div>})}</div></>
}
