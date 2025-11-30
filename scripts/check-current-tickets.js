const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function checkCurrentTickets() {
  try {
    console.log('Checking current tickets in database...\n');
    
    // Get all tickets with creator information
    const tickets = await prisma.supportTicket.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${tickets.length} tickets:\n`);
    
    tickets.forEach((ticket, index) => {
      console.log(`${index + 1}. Ticket #${ticket.id}`);
      console.log(`   Title: ${ticket.title}`);
      console.log(`   Created By ID: ${ticket.createdById}`);
      console.log(`   Creator Info:`);
      console.log(`     - ID: ${ticket.createdBy.id}`);
      console.log(`     - Name: ${ticket.createdBy.fullName}`);
      console.log(`     - Email: ${ticket.createdBy.email}`);
      console.log(`     - Role: ${ticket.createdBy.role}`);
      console.log(`     - Username: ${ticket.createdBy.username}`);
      console.log(`   Created At: ${ticket.createdAt}`);
      console.log('');
    });
    
    // Also check all users to see who exists
    console.log('All users in database:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        username: true
      },
      orderBy: { id: 'asc' }
    });
    
    users.forEach(user => {
      console.log(`User ID ${user.id}: ${user.fullName} (${user.email}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentTickets();
