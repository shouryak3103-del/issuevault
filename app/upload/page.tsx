'use client'
import { useCallback, useState, useRef, useEffect } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2, Eye } from 'lucide-react'

export default function UploadPage() {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<any>(null)
  const [uploads, setUploads] = useState<any[]>([])
  const [toast, setToast] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadUploads = async () => {
    const r = await fetch('/api/uploads')
    const d = await r.json()
    setUploads(d.data || [])
  }

  useEffect(() => { loadUploads() }, [])

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n').filter(Boolean)
    if (lines.length < 2) return null
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const rows = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']))
    })
    return { headers, rows }
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) return setToast({ message: 'Please upload a CSV file', type: 'error' })
    setSelectedFile(file)
    const text = await file.text()
    const parsed = parseCSV(text)
    if (!parsed) return setToast({ message: 'Invalid CSV format', type: 'error' })
    setPreview({ ...parsed, filename: file.name })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const upload = async () => {
    if (!preview || !selectedFile) return
    setUploading(true); setProgress(10)
    try {
      // Simulate progress
      const interval = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 200)
      const r = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: preview.filename, rows: preview.rows })
      })
      clearInterval(interval); setProgress(100)
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      setToast({ message: `✓ Uploaded ${d.data.row_count} records from ${preview.filename}`, type: 'success' })
      setPreview(null); setSelectedFile(null)
      setTimeout(() => { setProgress(0); setUploading(false) }, 500)
      loadUploads()
    } catch(e: any) {
      setToast({ message: e.message, type: 'error' })
      setUploading(false); setProgress(0)
    }
  }

  const statusIcon = (s: string) => s === 'complete' ? <CheckCircle size={14} className="text-neon-green" /> : s === 'failed' ? <XCircle size={14} className="text-red-400" /> : <Clock size={14} className="text-neon-yellow" />

  return (
    <PageWrapper title="Upload CSV" subtitle="Import data records from CSV files">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-2 gap-6">
        {/* Upload zone */}
        <div>
          <div
            className={`drop-zone ${dragging ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background:'rgba(157,0,255,0.1)', border:'1px solid rgba(157,0,255,0.3)'}}>
                <Upload size={28} className="text-neon-purple" />
              </div>
              <div>
                <p className="text-slate-200 font-medium">Drop your CSV here</p>
                <p className="text-slate-500 text-sm mt-1">or click to browse files</p>
              </div>
              <p className="text-xs text-slate-600">Supports .csv files · Any size</p>
            </div>
          </div>

          {preview && (
            <div className="card mt-4 animate-in">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-neon-cyan" />
                <span className="font-medium text-slate-200">{preview.filename}</span>
                <span className="badge badge-feature ml-auto">{preview.rows.length} rows</span>
              </div>
              <div className="text-xs text-slate-500 mb-3">Columns: {preview.headers.join(', ')}</div>
              <div className="overflow-x-auto mb-4 max-h-48">
                <table className="table-dark text-xs">
                  <thead>
                    <tr>{preview.headers.slice(0,6).map((h: string) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0,5).map((row: any, i: number) => (
                      <tr key={i}>{preview.headers.slice(0,6).map((h: string) => <td key={h} className="max-w-[80px] truncate">{row[h]}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {uploading && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Uploading...</span><span>{progress}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => { setPreview(null); setSelectedFile(null) }} className="btn-secondary flex-1" disabled={uploading}>Cancel</button>
                <button onClick={upload} className="btn-primary flex-1" disabled={uploading}>
                  {uploading ? 'Uploading...' : `Upload ${preview.rows.length} Records`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload history */}
        <div className="card">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <FileText size={14} className="text-neon-cyan" />
            Upload History
          </h3>
          {uploads.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Upload size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No uploads yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {uploads.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5 card-hover">
                  {statusIcon(u.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{u.filename}</p>
                    <p className="text-xs text-slate-500">{u.row_count} rows · {new Date(u.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`badge ${u.status === 'complete' ? 'badge-resolved' : u.status === 'failed' ? 'badge-rejected' : 'badge-in_progress'}`}>{u.status}</span>
                  <a href={`/records?upload_id=${u.id}`} className="text-slate-500 hover:text-neon-cyan transition-colors ml-1"><Eye size={13} /></a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSV format guide */}
      <div className="card mt-6">
        <h3 className="font-semibold text-slate-300 mb-3 text-sm uppercase tracking-wider">CSV Format Guide</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400 mb-2">Any columns work. Example:</p>
            <pre className="text-xs text-neon-green bg-black/30 p-3 rounded-lg overflow-x-auto">{`id,name,email,status
1,John Doe,john@co.com,active
2,Jane Smith,jane@co.com,inactive`}</pre>
          </div>
          <div>
            <p className="text-slate-400 mb-2">Issues format:</p>
            <pre className="text-xs text-neon-cyan bg-black/30 p-3 rounded-lg overflow-x-auto">{`title,type,severity,status
Login bug,bug,high,open
Dark mode,feature,low,open`}</pre>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-xs">✓ Headers in first row</p>
            <p className="text-slate-400 text-xs">✓ Comma separated values</p>
            <p className="text-slate-400 text-xs">✓ UTF-8 encoding</p>
            <p className="text-slate-400 text-xs">✓ Any number of columns</p>
            <p className="text-slate-400 text-xs">✓ Optional quotes around values</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
