import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../api/api'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ documents: 0, clauses: 0, risks: 0 })

  useEffect(() => {
    getHistory()
      .then((docs) => {
        const clauses = docs.reduce((sum, d) => sum + (d.risk_summary?.high + d.risk_summary?.medium + d.risk_summary?.low || 0), 0)
        const risks = docs.reduce((sum, d) => sum + (d.risk_summary?.high || 0), 0)
        setStats({ documents: docs.length, clauses, risks })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-14 px-6 text-center">
      <p className="text-sm font-semibold text-indigo-600 mb-3">AI CONTRACT ANALYZER</p>
      <h1 className="text-4xl font-display font-extrabold text-navy-900 dark:text-white leading-tight">
        Understand contracts.<br />Detect risks.<br />Ask questions.
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
        Upload a rental agreement, NDA, or employment contract and get structured clauses,
        extracted entities, ML-based risk scoring, and evidence-backed answers to your questions.
      </p>

      <button
        onClick={() => navigate('/analyze')}
        className="mt-8 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
      >
        Upload Contract
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-14">
        <StatCard label="Documents Analyzed" value={stats.documents} accent="#4338CA" />
        <StatCard label="Clauses Detected" value={stats.clauses} accent="#101A33" />
        <StatCard label="High Risk Findings" value={stats.risks} accent="#DC2626" />
      </div>
    </div>
  )
}