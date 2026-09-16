import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import ProcessingPipeline from '../components/ProcessingPipeline'
import { uploadDocument } from '../api/api'

export default function Analyze() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    setError('')
    setUploading(true)
    setStage(0)

    const stageTimer = setInterval(() => {
      setStage((s) => (s < 5 ? s + 1 : s))
    }, 500)

    try {
      const data = await uploadDocument(file, setProgress)
      clearInterval(stageTimer)
      setStage(6)
      setTimeout(() => navigate('/results', { state: { documentId: data.document_id } }), 400)
    } catch (err) {
      clearInterval(stageTimer)
      setUploading(false)
      setError(err?.response?.data?.detail || 'Upload failed. Is the backend running on port 8000?')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white mb-1">Analyze Contract</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Upload a rental agreement, NDA, employment contract, or service agreement.</p>

      <UploadBox onFileSelected={handleFile} uploading={uploading} progress={progress} />

      {error && (
        <p className="text-sm text-risk-high mt-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
      )}

      {uploading && (
        <div className="mt-6">
          <ProcessingPipeline currentStage={stage} />
        </div>
      )}
    </div>
  )
}