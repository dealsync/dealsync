import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@dealsync.local' },
    update: {},
    create: { email: 'demo@dealsync.local', name: 'Demo User' } // no role
  })

  await prisma.transaction.createMany({
    data: [
      { title: '123 Main St Listing', type: 'LISTING', userId: user.id },
      { title: 'Duplex Purchase',      type: 'INVESTMENT', userId: user.id },
      { title: 'Unit 4B Renewal',      type: 'RENTAL', userId: user.id }
    ]
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
