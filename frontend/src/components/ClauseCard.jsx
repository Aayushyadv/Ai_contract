import { useState } from 'react'

const dotColor = (label) =>
  label === 'HIGH' ? 'bg-risk-high' : label === 'MEDIUM' ? 'bg-risk-medium' : 'bg-risk-low'

export default function ClauseCard({ clauses }) {
  const [selected, setSelected] = useState(clauses?.[0] || null)

  if (!clauses || clauses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-navy-900 mb-2">Clauses</h3>
        <p className="text-sm text-slate-400">No clauses were detected in this document.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-navy-900 mb-4">Clause Explorer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto pr-1">
          {clauses.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelected(c)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                selected === c ? 'bg-indigo-50 text-navy-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor(c.risk_label)}`} />
              {c.category}
            </button>
          ))}
        </div>

        {selected && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h4 className="font-semibold text-navy-900 mb-3">{selected.category} Clause</h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">"{selected.text}"</p>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-medium text-navy-900">{selected.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Risk Score</p>
                <p className="font-medium text-navy-900">{selected.risk_score}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Source</p>
                <p className="font-medium text-navy-900">Page {selected.page}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
