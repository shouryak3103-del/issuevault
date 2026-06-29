'use client'
import { useState, useEffect, useRef } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Search, Bug, Zap, FileText, History, ArrowRight, X, Clock } from 'lucide-react'
import Link from 'next/link'

const ICON_MAP: Record<string, any> = { issues: Bug, actions: Zap, records: FileText, audit: History }
const COLOR_MAP: Record<string, string> = { issues:'#ff2d78', actions:'#9d00ff', records:'#00f5ff', audit:'#64748b' }

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, any[]> | null>(null)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try { const s = localStorage.getItem('iv_searches'); if(s) setRecent(JSON.parse(s)) } catch {}
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults(null); return }
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      setLoading(true)
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const d = await r.json()
      setResults(d)
      setLoading(false)
      const updated = [query, ...recent.filter(x => x !== query)].slice(0, 8)
      setRecent(updated)
      try { localStorage.setItem('iv_searches', JSON.stringify(updated)) } catch {}
    }, 350)
  }, [query])

  const total: number = results
    ? Object.values(results).reduce((a: number, arr: any[]) => a + (Array.isArray(arr) ? arr.length : 0), 0)
    : 0

  return (
    <PageWrapper title="Search" subtitle="Find anything across all your data">
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input className="input-dark" style={{padding:'14px 44px 14px 46px',fontSize:'16px'}}
            placeholder="Search issues, actions, records..." value={query}
            onChange={e => setQuery(e.target.value)} autoFocus/>
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={16}/>
            </button>
          )}
        </div>

        {!query && recent.length > 0 && (
          <div className="card mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} color="#475569"/>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="text-center text-slate-500 py-10">Searching...</div>}

        {results && !loading && (
          <>
            <p className="text-sm text-slate-500 mb-4">
              {total} result{total !== 1 ? 's' : ''} for &quot;<span className="text-white">{query}</span>&quot;
            </p>
            {total === 0 ? (
              <div className="card text-center py-12">
                <Search size={32} color="#1e293b" style={{margin:'0 auto 12px'}}/>
                <p className="text-slate-400">Nothing found for &quot;{query}&quot;</p>
                <p className="text-sm text-slate-600 mt-1">Try different keywords</p>
              </div>
            ) : (
              Object.entries(results).map(([type, items]) =>
                Array.isArray(items) && items.length > 0 ? (
                  <div key={type} className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      {ICON_MAP[type] && (() => { const Icon = ICON_MAP[type]; return <Icon size={13} color={COLOR_MAP[type]}/>; })()}
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{color: COLOR_MAP[type]||'#94a3b8'}}>{type}</span>
                      <span className="text-xs text-slate-600 ml-1">({items.length})</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((item: any) => (
                        <Link key={item.id} href={type === 'issues' ? `/issues/${item.id}` : `/${type}`}
                          className="card card-hover block group">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                                {item.title || item.action_type || item.filename || item.action || 'Record'}
                              </div>
                              {(item.description || item.notes) && (
                                <div className="text-xs text-slate-500 truncate mt-0.5">{item.description || item.notes}</div>
                              )}
                            </div>
                            {item.status && <span className={`badge badge-${item.status}`}>{item.status}</span>}
                            {item.severity && <span className={`badge badge-${item.severity}`}>{item.severity}</span>}
                            <ArrowRight size={13} color="#475569" className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null
              )
            )}
          </>
        )}

        {!query && !recent.length && (
          <div className="text-center py-16">
            <Search size={40} color="#1e293b" style={{margin:'0 auto 16px'}}/>
            <p className="text-slate-400">Start typing to search everything</p>
            <p className="text-sm text-slate-600 mt-1">Issues, actions, records, audit logs</p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
