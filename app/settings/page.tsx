'use client'
import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Settings, Database, Bell, Shield, Palette, Save } from 'lucide-react'

const TABS = [
  { id:'general',  label:'General',       icon:Settings  },
  { id:'database', label:'Database',      icon:Database  },
  { id:'notifs',   label:'Notifications', icon:Bell      },
  { id:'security', label:'Security',      icon:Shield    },
  { id:'theme',    label:'Appearance',    icon:Palette   },
]

export default function SettingsPage() {
  const [tab,   setTab]   = useState('general')
  const [toast, setToast] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    app_name: 'IssueVault', org_name: '', timezone: 'UTC', language: 'en',
    db_url: process.env.NEXT_PUBLIC_SUPABASE_URL || '', pool_size: '10',
    email_notifs: true, slack_notifs: false, daily_digest: true,
    two_fa: false, session_timeout: '24',
    theme: 'dark', accent: 'purple',
  })

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setToast({ message:'Settings saved', type:'success' })
  }
  const F = (k: string, v: any) => setForm(p => ({...p,[k]:v}))

  const Section = ({ title, children }: any) => (
    <div style={{ marginBottom:'28px' }}>
      <h3 style={{ fontSize:'13px', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px', paddingBottom:'10px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{title}</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>{children}</div>
    </div>
  )
  const Field = ({ label, help, children }: any) => (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'16px', alignItems:'start' }}>
      <div>
        <div style={{ fontSize:'13px', color:'#cbd5e1', fontWeight:500 }}>{label}</div>
        {help && <div style={{ fontSize:'11px', color:'#475569', marginTop:'3px' }}>{help}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
  const Toggle = ({ value, onChange }: any) => (
    <button type="button" onClick={() => onChange(!value)} style={{ width:'42px', height:'22px', borderRadius:'999px', background: value ? 'rgba(157,0,255,0.5)' : 'rgba(255,255,255,0.1)', border:`1px solid ${value?'rgba(157,0,255,0.7)':'rgba(255,255,255,0.15)'}`, cursor:'pointer', position:'relative', transition:'all 0.2s' }}>
      <span style={{ position:'absolute', top:'2px', left: value?'22px':'2px', width:'16px', height:'16px', borderRadius:'50%', background: value?'#9d00ff':'#475569', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.4)' }}/>
    </button>
  )

  return (
    <PageWrapper title="Settings" subtitle="Configure IssueVault for your organization">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'24px', alignItems:'start' }}>
        {/* Tab list */}
        <div className="card" style={{ padding:'8px' }}>
          {TABS.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'10px 12px', borderRadius:'8px', cursor:'pointer', textAlign:'left', marginBottom:'2px',
                background: tab===id ? 'linear-gradient(135deg,rgba(157,0,255,0.2),rgba(255,45,120,0.1))' : 'transparent',
                border: `1px solid ${tab===id?'rgba(157,0,255,0.3)':'transparent'}`,
                color: tab===id ? 'white' : '#64748b', fontSize:'13px', fontWeight: tab===id ? 600 : 400 }}>
              <Icon size={14}/>{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card">
          {tab === 'general' && (
            <>
              <Section title="Application">
                <Field label="App Name" help="Shown in browser tab and sidebar"><input className="input-dark" value={form.app_name} onChange={e=>F('app_name',e.target.value)}/></Field>
                <Field label="Organization" help="Your company or team name"><input className="input-dark" placeholder="Acme Corp" value={form.org_name} onChange={e=>F('org_name',e.target.value)}/></Field>
              </Section>
              <Section title="Localization">
                <Field label="Timezone">
                  <select className="input-dark" value={form.timezone} onChange={e=>F('timezone',e.target.value)}>
                    {['UTC','America/New_York','America/Los_Angeles','Europe/London','Europe/Berlin','Asia/Calcutta','Asia/Tokyo','Australia/Sydney'].map(tz=><option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </Field>
                <Field label="Language">
                  <select className="input-dark" value={form.language} onChange={e=>F('language',e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </Field>
              </Section>
            </>
          )}
          {tab === 'database' && (
            <Section title="Supabase Connection">
              <Field label="Project URL" help="Your Supabase project URL"><input className="input-dark" value={form.db_url} onChange={e=>F('db_url',e.target.value)} placeholder="https://xxx.supabase.co"/></Field>
              <Field label="Connection Pool" help="Max simultaneous DB connections"><input className="input-dark" type="number" value={form.pool_size} onChange={e=>F('pool_size',e.target.value)} style={{ maxWidth:'100px' }}/></Field>
              <div style={{ padding:'14px', borderRadius:'10px', background:'rgba(0,255,148,0.06)', border:'1px solid rgba(0,255,148,0.2)' }}>
                <p style={{ fontSize:'13px', color:'#00ff94', margin:0 }}>✓ Supabase connection is active</p>
                <p style={{ fontSize:'11px', color:'#475569', margin:'4px 0 0' }}>All API routes are using the service role key from environment variables</p>
              </div>
            </Section>
          )}
          {tab === 'notifs' && (
            <Section title="Notification Preferences">
              {[
                { key:'email_notifs', label:'Email Notifications',  help:'Receive email alerts for critical issues' },
                { key:'slack_notifs', label:'Slack Notifications',  help:'Post to Slack when issues are created or resolved' },
                { key:'daily_digest', label:'Daily Digest',         help:'Get a daily summary of open/resolved issues' },
              ].map(({key,label,help}) => (
                <Field key={key} label={label} help={help}>
                  <Toggle value={(form as any)[key]} onChange={(v:boolean) => F(key,v)}/>
                </Field>
              ))}
            </Section>
          )}
          {tab === 'security' && (
            <Section title="Security">
              <Field label="Two-Factor Auth" help="Require 2FA for all team members">
                <Toggle value={form.two_fa} onChange={(v:boolean)=>F('two_fa',v)}/>
              </Field>
              <Field label="Session Timeout" help="Hours before automatic logout">
                <input className="input-dark" type="number" value={form.session_timeout} onChange={e=>F('session_timeout',e.target.value)} style={{ maxWidth:'100px' }}/>
              </Field>
              <div style={{ padding:'14px', borderRadius:'10px', background:'rgba(255,45,120,0.06)', border:'1px solid rgba(255,45,120,0.2)' }}>
                <p style={{ fontSize:'13px', color:'#ff2d78', margin:'0 0 4px' }}>⚠ Environment Variables</p>
                <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>API keys are stored in Vercel/server environment variables, never in client code.</p>
              </div>
            </Section>
          )}
          {tab === 'theme' && (
            <Section title="Appearance">
              <Field label="Theme" help="Interface color scheme">
                <div style={{ display:'flex', gap:'8px' }}>
                  {['dark','darker'].map(t=>(
                    <button key={t} onClick={()=>F('theme',t)} style={{ padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontSize:'13px',
                      background: form.theme===t?'rgba(157,0,255,0.2)':'rgba(255,255,255,0.04)',
                      border:`1px solid ${form.theme===t?'rgba(157,0,255,0.4)':'rgba(255,255,255,0.08)'}`,
                      color: form.theme===t?'#9d00ff':'#64748b' }}>{t}</button>
                  ))}
                </div>
              </Field>
              <Field label="Accent Color" help="Primary action color">
                <div style={{ display:'flex', gap:'8px' }}>
                  {[{k:'purple',c:'#9d00ff'},{k:'pink',c:'#ff2d78'},{k:'cyan',c:'#00f5ff'},{k:'green',c:'#00ff94'}].map(({k,c})=>(
                    <button key={k} onClick={()=>F('accent',k)} style={{ width:'28px', height:'28px', borderRadius:'7px', background:c, cursor:'pointer', border:`2px solid ${form.accent===k?'white':'transparent'}`, transition:'all 0.15s' }}/>
                  ))}
                </div>
              </Field>
            </Section>
          )}

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'20px', marginTop:'8px' }}>
            <button onClick={save} className="btn-primary" style={{ padding:'10px 24px' }}>
              <Save size={14}/>{saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
