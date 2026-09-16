import { Bookmark } from 'lucide-react'

export default function EvidenceCard({ evidence }) {
  if (!evidence || evidence.length === 0) return null

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        <Bookmark size={13} /> Evidence
      </p>
      <div className="flex flex-col gap-2">
        {evidence.map((e, i) => (
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <p className="text-sm text-slate-700 italic leading-relaxed">"{e.text}"</p>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
              <span>Page {e.page}</span>
              <span>Similarity: {e.similarity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
