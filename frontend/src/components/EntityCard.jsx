import { Users, Wallet, CalendarDays, Timer } from 'lucide-react'

function Row({ icon: Icon, label, value, page }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Icon size={15} className="text-indigo-600" />
        {label}
      </div>
      <div className="text-sm font-medium text-navy-900">
        {value} {page && <span className="text-xs text-slate-400 ml-1">(p.{page})</span>}
      </div>
    </div>
  )
}

export default function EntityCard({ entities }) {
  if (!entities) return null
  const { parties, rent, deposit, dates, notice_periods } = entities

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-navy-900 mb-4">Extracted Information</h3>

      {parties && Object.keys(parties).length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Parties</p>
          {Object.entries(parties).map(([role, info]) => (
            <Row key={role} icon={Users} label={role} value={info.name} page={info.page} />
          ))}
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Financial Information</p>
        <Row icon={Wallet} label="Rent" value={rent?.value} page={rent?.page} />
        <Row icon={Wallet} label="Security Deposit" value={deposit?.value} page={deposit?.page} />
      </div>

      {dates?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Dates</p>
          {dates.slice(0, 4).map((d, i) => (
            <Row key={i} icon={CalendarDays} label={`Date ${i + 1}`} value={d.value} page={d.page} />
          ))}
        </div>
      )}

      {notice_periods?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Notice</p>
          {notice_periods.slice(0, 2).map((n, i) => (
            <Row key={i} icon={Timer} label="Notice Period" value={n.value} page={n.page} />
          ))}
        </div>
      )}

      {Object.keys(parties || {}).length === 0 && !rent && !deposit && !dates?.length && (
        <p className="text-sm text-slate-400">No structured entities detected in this document.</p>
      )}
    </div>
  )
}
