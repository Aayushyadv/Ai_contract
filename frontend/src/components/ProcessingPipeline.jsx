import { Check, Circle, Loader2 } from 'lucide-react'

const STAGES = [
  'Document Uploaded',
  'Text Extraction',
  'Text Cleaning',
  'Clause Detection',
  'Risk Classification',
  'Semantic Search',
  'Ready',
]

export default function ProcessingPipeline({ currentStage }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-navy-900 mb-4">Processing Pipeline</h3>
      <div className="flex flex-col gap-1">
        {STAGES.map((stage, i) => {
          const done = i < currentStage
          const active = i === currentStage
          return (
            <div key={stage} className="flex items-center gap-3 py-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  done
                    ? 'bg-risk-low text-white'
                    : active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {done ? (
                  <Check size={14} />
                ) : active ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Circle size={8} fill="currentColor" />
                )}
              </span>
              <span
                className={`text-sm ${
                  done || active ? 'text-navy-900 font-medium' : 'text-slate-400'
                }`}
              >
                {stage}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
