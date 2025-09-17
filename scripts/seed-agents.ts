import prisma from '@/lib/db'

async function main() {
  console.log('Seeding agents...')

  const agents = [
    {
      name: 'أحمد محمود',
      email: 'ahmed.mahmoud@example.com',
      phone: '+966 50 123 4567'
    },
    {
      name: 'فاطمة علي',
      email: 'fatima.ali@example.com',
      phone: '+966 55 987 6543'
    },
    {
      name: 'محمد سالم',
      email: 'mohammed.salem@example.com',
      phone: '+966 56 456 7890'
    },
    {
      name: 'نور الدين',
      email: 'nour.din@example.com',
      phone: '+966 54 321 0987'
    },
    {
      name: 'عائشة أحمد',
      email: 'aisha.ahmed@example.com',
      phone: '+966 53 789 0123'
    }
  ]

  for (const agentData of agents) {
    const existingAgent = await prisma.agent.findUnique({
      where: { email: agentData.email }
    })

    if (!existingAgent) {
      await prisma.agent.create({
        data: agentData
      })
      console.log(`Created agent: ${agentData.name}`)
    } else {
      console.log(`Agent already exists: ${agentData.name}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
