import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const CreateSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['LISTING','INVESTMENT','RENTAL'])
})

async function getUserFromAuthHeader(req: NextApiRequest) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.split(' ')[1]
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getUserFromAuthHeader(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    if (req.method === 'GET') {
      const items = await prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(items)
    }

    if (req.method === 'POST') {
      const parsed = CreateSchema.safeParse(req.body)
      if (!parsed.success) return res.status(400).json({ error: parsed.error.issues })
      const tx = await prisma.transaction.create({
        data: {
          title: parsed.data.title,
          type: parsed.data.type,
          userId: user.id
        }
      })
      return res.status(201).json(tx)
    }

    res.setHeader('Allow','GET, POST')
    return res.status(405).json({ error:'Method not allowed' })
  } catch (e:any) {
    console.error(e)
    return res.status(500).json({ error:'Internal Server Error' })
  }
}
