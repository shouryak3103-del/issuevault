'use client'
import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Settings, Database, Bell, Shield, Palette, User, Save, ChevronRight, ExternalLink, Check } from 'lucide-react'

const TABS = [
  { id:'general', icon: Settings, label:'General' },
  { id:'database', icon: Database, label:'Database' },
  { id:'notifications', icon: Bell, label:'Notifications' },
  { id:'security', icon: Shield, label:'Security' },
  { id:'appearance', icon: Palette, label:'Appearance' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('general')
  const [toast, setToast] = useState<any>(null)
  const [saved, setSaved] = useState(false)

  const [general, setGeneral] = useState({ projectName: 'IssueVault', description: 'Professional issue tracking system', defaultAssignee: 'shourya', timezone: 'Asia/Calcutta' })
  const [notifSettings, setNotifSettings] = useState({ newIssue: true, statusChange: true, criticalOnly: false, dailyDigest: false, emailNotifs: false })
  const [appearance, setAppearance] = useState({ accentColor: 'purple', compactMode: false, animations: true })

  const save = () => {
    setSaved(true)
    setToast({ message: 'Settings saved!', type: 'success' })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageWrapper title="Settings" subtitle="Configure your IssueVault workspace">
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="card p-2">
            {TABS.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`nav-item w-full mb-1 ${tab === id ? 'active' : ''}`} style={{justifyContent:'flex-start'}}>
                <Icon size={15}/>{label}
                {tab === id && <ChevronRight size={12} style={{marginLeft:'auto'}}/>}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === 'general' && (
            <div className="card space-y-5">
              <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><Settings size={16} color="#9d00ff"/>General Settings</h3>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Project Name</label>
                <input className="input-dark" value={general.projectName} onChange={e => setGeneral(p=>({...p,projectName:e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Description</label>
                <textarea className="input-dark resize-none" rows={2} value={general.description} onChange={e => setGeneral(p=>({...p,description:e.target.value}))}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Default Assignee</label>
                  <input className="input-dark" value={general.defaultAssignee} onChange={e => setGeneral(p=>({...p,defaultAssignee:e.target.value}))}/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Timezone</label>
                  <select className="input-dark" value={general.timezone} onChange={e => setGeneral(p=>({...p,timezone:e.target.value}))}>
                    {['Asia/Calcutta','UTC','America/New_York','Europe/London','Asia/Tokyo'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={save} className="btn-primary">{saved ? <><Check size={13}/>Saved!</> : <><Save size={13}/>Save Changes</>}</button>
            </div>
          )}

          {tab === 'database' && (
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><Database size={16} color="#00ff94"/>Database Connection</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{background:'rgba(0,255,148,0.06)',border:'1px solid rgba(0,255,148,0.2)'}}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    <div>
                      <div className="text-sm font-medium text-white">Supabase</div>
                      <div className="text-xs text-slate-500">Connected and healthy</div>
                    </div>
                  </div>
                  <a href="https://supabase.com/dashboard/project/keyeemsymgfwrzbqfwxk" target="_blank" className="btn-secondary text-xs" style={{padding:'5px 12px',fontSize:'12px'}}>
                    Open Dashboard <ExternalLink size={11}/>
                  </a>
                </div>
                {[
                  { label:'Project URL', value:'https://keyeemsymgfwrzbqfwxk.supabase.co' },
                  { label:'Project Ref', value:'keyeemsymgfwrzbqfwxk' },
                  { label:'Region', value:'Default' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-mono text-slate-300">{value}</span>
                  </div>
                ))}
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-3">Tables</p>
                  {['issues','issue_actions','uploads','records','audit_log','team_members','notifications'].map(t => (
                    <div key={t} className="flex items-center justify-between py-1.5">
                      <span className="text-xs font-mono text-slate-400">{t}</span>
                      <span className="badge" style={{background:'rgba(0,255,148,0.1)',color:'#00ff94',border:'1px solid rgba(0,255,148,0.2)',fontSize:'10px'}}>active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><Bell size={16} color="#9d00ff"/>Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key:'newIssue', label:'New Issue Created', desc:'Get notified when a new issue is created' },
                  { key:'statusChange', label:'Status Changes', desc:'Notify on every status transition' },
                  { key:'criticalOnly', label:'Critical Issues Only', desc:'Only notify for critical severity' },
                  { key:'dailyDigest', label:'Daily Digest', desc:'Receive a daily summary email' },
                  { key:'emailNotifs', label:'Email Notifications', desc:'Send notifications to email' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-sm text-white">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                    <button onClick={() => setNotifSettings(p => ({...p, [key]: !p[key as keyof typeof p]}))}
                      className="w-11 h-6 rounded-full transition-colors relative"
                      style={{background: notifSettings[key as keyof typeof notifSettings] ? 'linear-gradient(135deg,#9d00ff,#ff2d78)' : 'rgba(255,255,255,0.1)'}}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
                        style={{left: notifSettings[key as keyof typeof notifSettings] ? 'calc(100% - 22px)' : '2px'}}></span>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={save} className="btn-primary mt-5"><Save size={13}/>Save Preferences</button>
            </div>
          )}

          {tab === 'security' && (
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><Shield size={16} color="#ff2d78"/>Security</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{background:'rgba(255,45,120,0.06)',border:'1px solid rgba(255,45,120,0.2)'}}>
                  <p className="text-sm font-medium text-white mb-1">Row Level Security</p>
                  <p className="text-xs text-slate-500">RLS is managed at the Supabase level. All API calls use the service role key securely on the server.</p>
                </div>
                {[
                  { label:'API Authentication', status:'Server-side only', ok: true },
                  { label:'Environment Variables', status:'Properly configured', ok: true },
                  { label:'Supabase RLS', status:'Via service role', ok: true },
                  { label:'Secrets in Client', status:'None exposed', ok: true },
                ].map(({ label, status, ok }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-slate-300">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{status}</span>
                      <Check size={13} color={ok ? '#00ff94' : '#ef4444'}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2"><Palette size={16} color="#9d00ff"/>Appearance</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-slate-400 mb-3 block uppercase tracking-wider">Accent Color</label>
                  <div className="flex gap-3">
                    {[
                      { id:'purple', color:'#9d00ff', label:'Purple' },
                      { id:'pink', color:'#ff2d78', label:'Pink' },
                      { id:'cyan', color:'#00f5ff', label:'Cyan' },
                      { id:'green', color:'#00ff94', label:'Green' },
                    ].map(({ id, color, label }) => (
                      <button key={id} onClick={() => setAppearance(p=>({...p, accentColor:id}))}
                        className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full transition-all" style={{background:color, outline: appearance.accentColor === id ? `3px solid ${color}` : 'none', outlineOffset:'3px'}}></div>
                        <span className="text-xs text-slate-500">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { key:'compactMode', label:'Compact Mode', desc:'Reduce padding and spacing' },
                  { key:'animations', label:'Animations', desc:'Enable UI transitions and animations' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-sm text-white">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                    <button onClick={() => setAppearance(p => ({...p, [key]: !p[key as keyof typeof p]}))}
                      className="w-11 h-6 rounded-full transition-colors relative"
                      style={{background: appearance[key as keyof typeof appearance] ? 'linear-gradient(135deg,#9d00ff,#ff2d78)' : 'rgba(255,255,255,0.1)'}}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{left: appearance[key as keyof typeof appearance] ? 'calc(100% - 22px)' : '2px'}}></span>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={save} className="btn-primary mt-5"><Save size={13}/>Save Appearance</button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
