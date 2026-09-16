const badge = {
  HIGH: { emoji: '🔴', text: 'text-risk-high', bg: 'bg-red-50' },
  MEDIUM: { emoji: '🟡', text: 'text-risk-medium', bg: 'bg-amber-50' },
  LOW: { emoji: '🟢', text: 'text-risk-low', bg: 'bg-emerald-50' },
}

export default function RiskCard({ clauses }) {
  const top = [...(clauses || [])].sort((a, b) => b.risk_score - a.risk_score).slice(0, 8)

  if (top.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 p-6">
        <h3 className="font-semibold text-navy-900 dark:text-white mb-2">Clause Risk Breakdown</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">No scored clauses yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 p-6">
      <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Clause Risk Breakdown</h3>
      <div className="flex flex-col gap-2">
        {top.map((c, i) => {
          const b = badge[c.risk_label]
          return (
            <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg ${b.bg}`}>
              <div>
                <p className={`text-xs font-bold ${b.text}`}>{b.emoji} {c.risk_label} RISK</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white mt-0.5">{c.category}</p>
              </div>
              <p className={`text-sm font-bold ${b.text}`}>{c.risk_score}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}