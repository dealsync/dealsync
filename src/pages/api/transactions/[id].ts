import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { z } from 'zod'
const UpdateSchema = z.object({ title: z.string().min(1).optional(), status: z.enum(['OPEN','PENDING','CLOSED']).optional() })
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const id = req.query.id as string
  try{
    if(req.method==='GET'){ const item = await prisma.transaction.findUnique({ where:{ id } }); if(!item) return res.status(404).json({ error:'Not found' }); return res.status(200).json(item) }
    if(req.method==='PATCH'){ const parsed=UpdateSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({ error: parsed.error.issues }); const updated=await prisma.transaction.update({ where:{id}, data:parsed.data }); return res.status(200).json(updated) }
    if(req.method==='DELETE'){ await prisma.transaction.delete({ where:{ id } }); return res.status(204).end() }
    res.setHeader('Allow','GET, PATCH, DELETE'); return res.status(405).json({ error:'Method not allowed' })
  }catch(e:any){ console.error(e); return res.status(500).json({ error:'Internal Server Error' }) }
}
