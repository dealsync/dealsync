import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { z } from 'zod'
const CreateDoc = z.object({ transactionId: z.string().uuid(), filename: z.string().min(1), url: z.string().url() })
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if(req.method==='GET'){ const { transactionId } = req.query; const docs = await prisma.document.findMany({ where: transactionId?{transactionId: transactionId as string}:undefined, orderBy:{createdAt:'desc'} }); return res.status(200).json(docs) }
    if(req.method==='POST'){ const parsed = CreateDoc.safeParse(req.body); if(!parsed.success) return res.status(400).json({ error: parsed.error.issues }); const doc = await prisma.document.create({ data: parsed.data as any }); return res.status(201).json(doc) }
    res.setHeader('Allow','GET, POST'); return res.status(405).json({ error:'Method not allowed' })
  }catch(e:any){ console.error(e); return res.status(500).json({ error:'Internal Server Error' }) }
}
