export default function PageWrapper({ title, subtitle, children, action }: { title:string; subtitle?:string; children:React.ReactNode; action?:React.ReactNode }) {
  return (
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'"Syne",monospace', margin:0 }}>{title}</h2>
          {subtitle && <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}
