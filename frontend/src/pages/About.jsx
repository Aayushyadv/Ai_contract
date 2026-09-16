import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Cpu, Users, Mail, ScanSearch, Brain, Network, MessagesSquare } from 'lucide-react'

const TECH = [
  { icon: ScanSearch, label: 'NLP', desc: 'Extracts entities and clauses from raw contract text.' },
  { icon: Brain, label: 'Machine Learning', desc: 'A trained classifier scores clauses for risk.' },
  { icon: Network, label: 'Semantic Search', desc: 'Finds the most relevant passage for any question.' },
  { icon: MessagesSquare, label: 'RAG', desc: 'Answers questions using evidence from the document itself.' },
]

export default function About() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <section id="about" className="scroll-mt-24">
        <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles size={16} /> ABOUT CONTRACTAI
        </p>
        <h1 className="text-3xl font-display font-extrabold text-navy-900 dark:text-white mb-3">
          AI-powered contract analysis system
        </h1>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          ContractAI uses NLP, Named Entity Recognition, Machine Learning, Semantic Search and RAG
          to analyze contracts, identify clauses, detect potential risks, and answer questions using
          evidence pulled directly from the uploaded document. It does not provide legal advice and
          does not determine whether a document is legally valid or genuine — it surfaces structure
          and risk signals for a human to review.
        </p>
      </section>

      <section id="technology" className="scroll-mt-24 mt-14">
        <h2 className="text-xl font-display font-bold text-navy-900 dark:text-white mb-5">Technology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECH.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 p-5"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3">
                <Icon size={17} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="font-semibold text-navy-900 dark:text-white text-sm">{label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className="scroll-mt-24 mt-14">
        <h2 className="flex items-center gap-2 text-xl font-display font-bold text-navy-900 dark:text-white mb-3">
          <Users size={19} className="text-indigo-600 dark:text-indigo-400" /> Team
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Built as a student/internship project demonstrating an end-to-end NLP, ML and RAG
          pipeline behind a React interface. Update this section with your own name, role, and
          any teammates or mentors involved.
        </p>
      </section>

      <section id="contact" className="scroll-mt-24 mt-14 mb-10">
        <h2 className="flex items-center gap-2 text-xl font-display font-bold text-navy-900 dark:text-white mb-3">
          <Mail size={19} className="text-indigo-600 dark:text-indigo-400" /> Contact
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Questions or feedback about this project? Replace this with your own email or GitHub link,
          e.g. <span className="text-indigo-600 dark:text-indigo-400">hameed@sdbi.in</span>
        </p>
      </section>
    </div>
  )
}