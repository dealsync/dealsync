import { useEffect, useState } from 'react'
export default function TransactionList(){
  const [items,setItems]=useState<any[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{ 
    setLoading(true)
    fetch('/api/transactions')
      .then(r=>r.json()).then(setItems).finally(()=>setLoading(false))
  },[])

  if (loading) return <div>Loading…</div>
  if (!items.length) return <div>No transactions yet.</div>

  return (
    <ul style={{display:'grid',gap:8}}>
      {items.map(it=>(
        <li key={it.id} style={{border:'1px solid #e5e7eb',borderRadius:10,padding:'0.75rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>{it.title}</div>
              <div style={{opacity:.7,fontSize:12}}>{it.type} • {new Date(it.createdAt).toLocaleString()}</div>
            </div>
            <span style={{fontSize:12,opacity:.7}}>{it.status}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
