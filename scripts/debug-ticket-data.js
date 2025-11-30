const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function debugTicketData() {
  try {
    console.log('🔍 Debugging ticket data...\n')
    
    // Get all tickets with their creators
    const tickets = await prisma.supportTicket.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { id: 'asc' }
    })
    
    console.log(`Found ${tickets.length} tickets:\n`)
    
    tickets.forEach(ticket => {
      console.log(`Ticket #${ticket.id}:`)
      console.log(`  Title: ${ticket.title}`)
      console.log(`  Created By ID: ${ticket.createdById}`)
      console.log(`  Creator Data:`, ticket.createdBy)
      console.log(`  Status: ${ticket.status}`)
      console.log('---')
    })
    
    // Also check what users exist
    console.log('\n📋 All Users in database:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true
      },
      orderBy: { id: 'asc' }
    })
    
    users.forEach(user => {
      console.log(`User #${user.id}: ${user.fullName} (${user.email}) - Role: ${user.role}`)
    })
    
    // Check agents
    console.log('\n👥 All Agents in database:')
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: { id: 'asc' }
    })
    
    agents.forEach(agent => {
      console.log(`Agent #${agent.id}: ${agent.name} (${agent.email})`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugTicketData()
