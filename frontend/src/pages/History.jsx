import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../api/api'

const levelStyle = (level) =>
  level === 'HIGH'
    ? { emoji: '🔴', color: 'text-risk-high' }
    : level === 'MEDIUM'
    ? { emoji: '🟡', color: 'text-risk-medium' }
    : { emoji: '🟢', color: 'text-risk-low' }

export default function History() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setDocs)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white mb-1">Analysis History</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Previously analyzed documents from this session.</p>

      {loading ? (
        <p className="text-slate-400 dark:text-slate-500">Loading…</p>
      ) : docs.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500">No documents analyzed yet.</p>
      ) : (
        <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Document</th>
                <th className="text-left px-5 py-3 font-medium">Risk</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => {
                const s = levelStyle(d.risk_summary?.level)
                return (
                  <tr key={d.id} className="border-t border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-navy-900 dark:text-white">{d.filename}</td>
                    <td className={`px-5 py-3 font-medium ${s.color}`}>
                      {s.emoji} {d.risk_summary?.overall_score}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {new Date(d.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => navigate('/results', { state: { documentId: d.id } })}
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}