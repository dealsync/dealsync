import { useState } from 'react'
import TransactionList from '@/components/TransactionList'
import NewTransactionForm from '@/components/NewTransactionForm'

export default function Dashboard(){
  const [refreshKey,setRefreshKey]=useState(0)
  return (
    <div style={{padding:'1.5rem',maxWidth:1000,margin:'0 auto'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <h1>Dashboard</h1>
      </header>
      <section style={{display:'grid',gap:'1rem'}}>
        <div style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'1rem'}}>
          <h2 style={{marginBottom:8}}>Create New Transaction</h2>
          <NewTransactionForm onCreated={()=>setRefreshKey(k=>k+1)} />
        </div>
        <div style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'1rem'}}>
          <h2 style={{marginBottom:8}}>My Transactions</h2>
          <TransactionList key={refreshKey}/>
        </div>
      </section>
    </div>
  )
}
