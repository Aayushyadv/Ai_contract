import { useState } from 'react'
import { Bot, Loader2 } from 'lucide-react'
import { askQuestion } from '../api/api'
import EvidenceCard from './EvidenceCard'

const SUGGESTIONS = [
  'What is the notice period?',
  'What is the security deposit?',
  'How can this agreement be terminated?',
]

export default function ChatBox({ documentId }) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAsk = async (q) => {
    const text = (q ?? question).trim()
    if (!text || !documentId) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await askQuestion(documentId, text)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong answering that question.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="flex items-center gap-2 font-semibold text-navy-900 mb-4">
        <Bot size={18} className="text-indigo-600" /> Ask your contract
      </h3>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="e.g. What is the notice period?"
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !documentId}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          Ask
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setQuestion(s); handleAsk(s) }}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {!documentId && (
        <p className="text-sm text-slate-400 mt-4">Upload and analyze a document first to ask questions about it.</p>
      )}

      {error && <p className="text-sm text-risk-high mt-4">{error}</p>}

      {result && (
        <div className="mt-5 bg-indigo-50/60 rounded-xl p-5">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1.5">Answer</p>
          <p className="text-navy-900 leading-relaxed">{result.answer}</p>
          <EvidenceCard evidence={result.evidence} />
        </div>
      )}
    </div>
  )
}
