import { useRef, useState } from 'react'
import { FileUp, Loader2 } from 'lucide-react'

export default function UploadBox({ onFileSelected, uploading, progress }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files) => {
    if (files && files[0]) onFileSelected(files[0])
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`rounded-2xl border-2 border-dashed transition-colors px-10 py-14 text-center bg-white dark:bg-navy-800 ${
        dragging ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-white/20'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Uploading & processing… {progress}%</p>
          <div className="w-64 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
            <FileUp className="text-indigo-600" size={26} />
          </div>
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Upload your contract</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Drag & drop your file here, or</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
          >
            Choose File
          </button>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 tracking-wide">PDF · DOCX · TXT</p>
        </>
      )}
    </div>
  )
}