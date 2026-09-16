import { useState } from 'react'
import { ChevronDown, LifeBuoy } from 'lucide-react'

const STEPS = [
  'Upload your contract',
  'Wait for analysis',
  'Review clauses and entities',
  'Check risk analysis',
  'Ask questions',
]

const FAQS = [
  {
    q: 'What file types are supported?',
    a: 'PDF, DOCX, and TXT files. Scanned PDFs with no selectable text (image-only scans) won\u2019t extract text correctly yet.',
  },
  {
    q: 'How is the risk score calculated?',
    a: 'Each detected clause is scored by a trained text classifier for how one-sided or risky its wording is, on a 0\u20131 scale. The overall document score is the average across all clauses, shown out of 100.',
  },
  {
    q: 'Can ContractAI prove a contract is genuine?',
    a: 'No. It can flag unusual patterns like missing fields or contradictory dates as a signal, but it cannot verify authenticity or legal validity. Always have a legal professional review important documents.',
  },
  {
    q: 'How does RAG answer questions?',
    a: 'Your question is compared against every sentence in the document using semantic similarity. The closest matching sentence is returned as the answer, along with its page number and similarity score as evidence.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 dark:border-white/10 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-navy-900 dark:text-white">{q}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 dark:text-slate-500 shrink-0 ml-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pb-4 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function Help() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
        <LifeBuoy size={16} /> HELP CENTER
      </p>
      <h1 className="text-2xl font-display font-bold text-navy-900 dark:text-white mb-8">
        How to use ContractAI
      </h1>

      <ol className="flex flex-col gap-3 mb-14">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3"
          >
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-navy-900 dark:text-white">{step}</span>
          </li>
        ))}
      </ol>

      <h2 className="text-lg font-display font-bold text-navy-900 dark:text-white mb-2">
        Frequently Asked Questions
      </h2>
      <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl px-5">
        {FAQS.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </div>
    </div>
  )
}