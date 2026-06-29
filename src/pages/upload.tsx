import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Upload, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react'

export default function UploadPage() {
  const [drag, setDrag] = useState(false)
  const [file, setFile] = useState<File|null>(null)
  const [done, setDone] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) { setFile(f); setTimeout(()=>setDone(true),1200) }
  }
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setTimeout(()=>setDone(true),1200) }
  }

  return (
    <PageWrapper title="Upload CSV" subtitle="Import issues from a CSV file">
      {done ? (
        <div style={{ padding:40, borderRadius:16, background:'rgba(0,255,148,0.05)', border:'1px solid rgba(0,255,148,0.2)', textAlign:'center' }}>
          <CheckCircle size={48} color="#00ff94" style={{ marginBottom:16 }}/>
          <h3 style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:8 }}>Upload complete!</h3>
          <p style={{ color:'#64748b', marginBottom:24 }}>{file?.name} — issues imported successfully</p>
          <button onClick={()=>{setFile(null);setDone(false)}} style={{ padding:'10px 24px', borderRadius:10, background:'rgba(0,255,148,0.15)', color:'#00ff94', border:'1px solid rgba(0,255,148,0.3)', cursor:'pointer', fontWeight:600 }}>Upload another</button>
        </div>
      ) : (
        <>
          <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={handleDrop}
            style={{ padding:56, borderRadius:16, border:`2px dashed ${drag?'#9d00ff':'rgba(255,255,255,0.12)'}`, background:drag?'rgba(157,0,255,0.05)':'rgba(255,255,255,0.02)', textAlign:'center', transition:'all 0.2s', marginBottom:24 }}>
            <Upload size={40} color={drag?'#9d00ff':'#334155'} style={{ marginBottom:16 }}/>
            <h3 style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:8 }}>Drop your CSV here</h3>
            <p style={{ color:'#475569', marginBottom:20 }}>or click to browse your files</p>
            <label style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', cursor:'pointer', fontWeight:600, fontSize:13 }}>
              <FileText size={15}/>Choose CSV
              <input type="file" accept=".csv" onChange={handleFile} style={{ display:'none' }}/>
            </label>
          </div>
          <div style={{ padding:16, borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <h4 style={{ fontSize:13, fontWeight:600, color:'#94a3b8', marginBottom:12 }}>Expected columns</h4>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['title','description','severity','status','issue_type','assignee','reporter'].map(col => (
                <span key={col} style={{ padding:'3px 10px', borderRadius:6, background:'rgba(157,0,255,0.1)', color:'#9d00ff', border:'1px solid rgba(157,0,255,0.2)', fontSize:12, fontFamily:'monospace' }}>{col}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  )
}
