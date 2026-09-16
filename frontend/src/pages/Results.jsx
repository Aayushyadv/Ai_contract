import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDocument } from '../api/api'
import StatCard from '../components/StatCard'
import EntityCard from '../components/EntityCard'
import ClauseCard from '../components/ClauseCard'
import RiskSummary from '../components/RiskSummary'
import RiskCard from '../components/RiskCard'
import ChatBox from '../components/ChatBox'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const documentId = location.state?.documentId
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!documentId) return
    getDocument(documentId)
      .then(setDoc)
      .catch(() => setError('Could not load this document. It may have expired (server restarted).'))
  }, [documentId])

  if (!documentId) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400">No document selected yet.</p>
        <button
          onClick={() => navigate('/analyze')}
          className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500"
        >
          Upload a Contract
        </button>
      </div>
    )
  }

  if (error) {
    return <p className="max-w-xl mx-auto py-20 text-center text-risk-high">{error}</p>
  }

  if (!doc) {
    return <p className="max-w-xl mx-auto py-20 text-center text-slate-400 dark:text-slate-500">Loading analysis…</p>
  }

  const totalEntities =
    Object.keys(doc.entities.parties || {}).length +
    (doc.entities.money_mentions?.length || 0) +
    (doc.entities.dates?.length || 0)

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <h2 className="text-xl font-display font-bold text-navy-900 dark:text-white mb-4">{doc.filename}</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard label="Risk Score" value={doc.risk_summary.overall_score} accent="#D97706" />
        <StatCard label="Clauses" value={doc.clauses.length} accent="#101A33" />
        <StatCard label="Entities" value={totalEntities} accent="#4338CA" />
        <StatCard label="Pages" value={doc.num_pages} accent="#16A34A" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskSummary summary={doc.risk_summary} />
        <RiskCard clauses={doc.clauses} />
      </div>

      <div className="mt-6">
        <ClauseCard clauses={doc.clauses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <EntityCard entities={doc.entities} />
        <ChatBox documentId={documentId} />
      </div>
    </div>
  )
}