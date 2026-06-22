'use client'
import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export default function Toast({ message, type, onClose }: { message: string; type: 'success'|'error'|'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  const icons = { success: CheckCircle, error: XCircle, info: Info }
  const Icon = icons[type]
  return (
    <div className={`toast toast-${type}`}>
      <Icon size={16}/><span>{message}</span>
      <button onClick={onClose} style={{marginLeft:'8px',opacity:0.6}}><X size={14}/></button>
    </div>
  )
}
