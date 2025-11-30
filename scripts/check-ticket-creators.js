const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function checkTicketCreators() {
  console.log('Checking support ticket creators...');

  try {
    // Get all support tickets with their creators
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
      }
    });

    console.log(`Found ${tickets.length} tickets:`);
    
    for (const ticket of tickets) {
      console.log(`Ticket #${ticket.id}: "${ticket.title}"`);
      console.log(`  Created by User ID: ${ticket.createdById}`);
      if (ticket.createdBy) {
        console.log(`  Creator: ${ticket.createdBy.fullName} (${ticket.createdBy.email}) - Role: ${ticket.createdBy.role}`);
      } else {
        console.log(`  Creator: NOT FOUND - User ID ${ticket.createdById} doesn't exist`);
      }
      console.log('---');
    }

    // Also check all users to see what we have
    console.log('\nAll Users:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true
      }
    });

    for (const user of users) {
      console.log(`User ID ${user.id}: ${user.fullName} (${user.email}) - Role: ${user.role}`);
    }

    // Check all agents
    console.log('\nAll Agents:');
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    for (const agent of agents) {
      console.log(`Agent ID ${agent.id}: ${agent.name} (${agent.email})`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTicketCreators();
