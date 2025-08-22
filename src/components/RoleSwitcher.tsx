type Props={role:'INVESTOR'|'AGENT';onChange:(r:'INVESTOR'|'AGENT')=>void}
export default function RoleSwitcher({role,onChange}:Props){
  return(<div style={{display:'flex',gap:8,alignItems:'center'}}>
    <span style={{opacity:.7}}>Role:</span>
    <button onClick={()=>onChange('INVESTOR')} style={{padding:'0.5rem 0.75rem',border:'1px solid #e5e7eb',borderRadius:10,background:role==='INVESTOR'?'#eef2ff':'white'}}>Investor</button>
    <button onClick={()=>onChange('AGENT')} style={{padding:'0.5rem 0.75rem',border:'1px solid #e5e7eb',borderRadius:10,background:role==='AGENT'?'#eef2ff':'white'}}>Agent</button>
  </div>)}
