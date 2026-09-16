import axios from 'axios'

// In dev, Vite proxies /api -> http://localhost:8000 (see vite.config.js)
const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await client.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total))
      }
    },
  })
  return res.data
}

export const getDocument = async (id) => {
  const res = await client.get(`/document/${id}`)
  return res.data
}

export const getHistory = async () => {
  const res = await client.get('/history')
  return res.data
}

export const askQuestion = async (documentId, question) => {
  const res = await client.post('/ask', { document_id: documentId, question })
  return res.data
}

export const getModelEvaluation = async () => {
  const res = await client.get('/model/evaluation')
  return res.data
}

export default client
