'use client'
import { useCallback, useState, useRef, useEffect } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Upload, FileText, CheckCircle, XCircle, Trash2, Eye, EyeOff, ArrowRight, Table2 } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [preview,   setPreview]   = useState<any>(null)
  const [uploads,   setUploads]   = useState<any[]>([])
  const [toast,     setToast]     = useState<any>(null)
  const [file,      setFile]      = useState<File|null>(null)
  const [showPrev,  setShowPrev]  = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadUploads = async () => {
    const r = await fetch('/api/uploads'); const d = await r.json()
    setUploads(d.data || [])
  }
  useEffect(() => { loadUploads() }, [])

  const parsePreview = (f: File) => {
    import('papaparse').then(({ default: Papa }) => {
      Papa.parse(f, { header:true, preview:8,
        complete: (res:any) => setPreview({ headers: res.meta.fields || [], rows: res.data, total: res.data.length })
      })
    })
  }

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) return setToast({ message:'Only CSV files supported', type:'error' })
    setFile(f); parsePreview(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }, [])

  const upload = async () => {
    if (!file) return
    setUploading(true); setProgress(10)
    const text = await file.text(); setProgress(30)
    const Papa = (await import('papaparse')).default
    const parsed = Papa.parse(text, { header:true, skipEmptyLines:true })
    setProgress(60)
    const r = await fetch('/api/uploads', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ filename:file.name, rows:parsed.data, headers:parsed.meta.fields })
    })
    setProgress(90)
    const d = await r.json(); setProgress(100)
    setTimeout(() => { setUploading(false); setProgress(0) }, 500)
    if (d.error) return setToast({ message:d.error, type:'error' })
    setToast({ message:`Uploaded ${parsed.data.length} rows!`, type:'success' })
    setFile(null); setPreview(null); loadUploads()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this upload and all its records?')) return
    await fetch('/api/uploads', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) })
    setToast({ message:'Upload deleted', type:'info' })
    loadUploads()
  }

  return (
    <PageWrapper title="Upload CSV" subtitle="Import datasets directly into Supabase">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'28px' }}>
        {/* Drop zone */}
        <div>
          <div
            className={`drop-zone${dragging?' drag-over':''}`}
            onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={32} color={dragging?'#9d00ff':'#334155'} style={{ margin:'0 auto 12px', display:'block', transition:'color 0.2s' }}/>
            <p style={{ color: dragging?'#9d00ff':'#64748b', fontWeight:600, marginBottom:'4px' }}>{dragging ? 'Drop it!' : 'Drag & drop CSV here'}</p>
            <p style={{ fontSize:'12px', color:'#334155' }}>or click to browse</p>
            {file && <p style={{ fontSize:'12px', color:'#00f5ff', marginTop:'10px', fontWeight:500 }}>📄 {file.name}</p>}
          </div>
          <input ref={fileRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>

          {file && (
            <div style={{ marginTop:'14px' }}>
              {uploading && (
                <div style={{ marginBottom:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#64748b', marginBottom:'6px' }}>
                    <span>Uploading…</span><span>{progress}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }}/></div>
                </div>
              )}
              <button onClick={upload} disabled={uploading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
                <Upload size={14}/>{uploading?'Uploading…':'Upload to Supabase'}
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          {preview ? (
            <div className="card" style={{ padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <span style={{ fontSize:'12px', fontWeight:600, color:'#9d00ff', display:'flex', alignItems:'center', gap:'6px' }}>
                  <Table2 size={13}/> Preview ({preview.total} rows)
                </span>
                <button onClick={() => setShowPrev(p=>!p)} className="btn-secondary" style={{ fontSize:'11px', padding:'4px 9px' }}>
                  {showPrev ? <><EyeOff size={11}/> Hide</> : <><Eye size={11}/> Show</>}
                </button>
              </div>
              {showPrev && (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
                    <thead>
                      <tr>{preview.headers.slice(0,6).map((h:string) => (
                        <th key={h} style={{ padding:'6px 8px', background:'rgba(157,0,255,0.08)', color:'#9d00ff', textAlign:'left', whiteSpace:'nowrap', borderBottom:'1px solid rgba(157,0,255,0.2)' }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {preview.rows.slice(0,5).map((row:any,i:number) => (
                        <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                          {preview.headers.slice(0,6).map((h:string) => (
                            <td key={h} style={{ padding:'6px 8px', color:'#64748b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100px' }}>{String(row[h]||'').slice(0,30)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'180px', borderStyle:'dashed' }}>
              <FileText size={32} color="#1e293b" style={{ marginBottom:'10px' }}/>
              <p style={{ color:'#334155', fontSize:'13px' }}>Select a CSV to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Past uploads */}
      <h3 style={{ fontSize:'13px', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px' }}>Upload History</h3>
      {uploads.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'32px', color:'#334155', fontSize:'13px' }}>No uploads yet</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {uploads.map((u: any) => (
            <div key={u.id} className="card" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:`${u.status==='success'?'rgba(0,255,148,0.1)':'rgba(239,68,68,0.1)'}`, border:`1px solid ${u.status==='success'?'rgba(0,255,148,0.25)':'rgba(239,68,68,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {u.status==='success' ? <CheckCircle size={16} color="#00ff94"/> : <XCircle size={16} color="#ef4444"/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:500, color:'#e2e8f0', fontSize:'13px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.filename}</div>
                <div style={{ fontSize:'11px', color:'#475569', marginTop:'2px' }}>{u.row_count} rows · {new Date(u.created_at||u.created_date).toLocaleString()}</div>
              </div>
              <Link href={`/records?upload_id=${u.id}`} className="btn-secondary" style={{ fontSize:'11px', padding:'5px 10px', textDecoration:'none' }}>
                <Eye size={11}/> View
              </Link>
              <button onClick={() => del(u.id)} className="btn-danger" style={{ fontSize:'11px', padding:'5px 9px' }}><Trash2 size={11}/></button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
