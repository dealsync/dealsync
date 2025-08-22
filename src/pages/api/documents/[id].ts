import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const id = req.query.id as string
  try{
    if(req.method==='DELETE'){ await prisma.document.delete({ where:{ id } }); return res.status(204).end() }
    res.setHeader('Allow','DELETE'); return res.status(405).json({ error:'Method not allowed' })
  }catch(e:any){ console.error(e); return res.status(500).json({ error:'Internal Server Error' }) }
}
