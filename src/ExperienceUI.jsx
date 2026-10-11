import React, { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function useLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial }
  })
  const update = next => setValue(previous => {
    const result = typeof next === 'function' ? next(previous) : next
    try { localStorage.setItem(key, JSON.stringify(result)) } catch {}
    return result
  })
  return [value, update]
}

export function Header({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-action">{action}</div>}</div>
}

export function Panel({ eyebrow, title, children, action, className = '' }) {
  return <section className={`panel exp-panel ${className}`}><div className="panel-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action}</div>{children}</section>
}

export function Action({ children, onClick, variant = 'primary', disabled = false, type = 'button', icon: Icon = ArrowRight }) {
  return <button type={type} className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{children}{Icon && <Icon size={15}/>}</button>
}

export function Pill({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Stat({ label, value, detail, icon: Icon }) {
  return <div className="metric-card exp-stat"><div className="metric-top"><span>{label}</span><span className="metric-icon">{Icon && <Icon size={18}/>}</span></div><strong>{value}</strong><small>{detail}</small></div>
}

export function EmptyState({ title, text }) {
  return <div className="exp-empty"><CheckCircle2 size={24}/><strong>{title}</strong><p>{text}</p></div>
}

export function Toast({ text }) {
  return text ? <div className="exp-inline-toast"><CheckCircle2 size={16}/>{text}</div> : null
}

export const money = value => '$' + Number(value || 0).toLocaleString('en-US')

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}
