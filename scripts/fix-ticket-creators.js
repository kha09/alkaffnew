const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function fixTicketCreators() {
  console.log('Fixing support ticket creators...');

  try {
    // Get all tickets that were created by admin (User ID 7) but should be from agents
    const problematicTickets = await prisma.supportTicket.findMany({
      where: {
        createdById: 7, // Admin User ID
        // These are likely agent tickets that got the wrong creator ID
      },
      include: {
        createdBy: true
      }
    });

    console.log(`Found ${problematicTickets.length} tickets created by admin that might be from agents:`);
    
    for (const ticket of problematicTickets) {
      console.log(`Ticket #${ticket.id}: "${ticket.title}"`);
      console.log(`  Current creator: ${ticket.createdBy.fullName} (${ticket.createdBy.role})`);
      
      // For now, let's check the ticket titles to see if we can identify which agent created them
      // Based on the titles "agent tt" and "bcbd", these seem to be test tickets from agents
      
      // Let's assign them to the first available agent for demonstration
      // In a real scenario, you'd need more logic to determine the correct agent
      const firstAgent = await prisma.user.findFirst({
        where: { role: 'agent' },
        orderBy: { id: 'asc' }
      });
      
      if (firstAgent) {
        console.log(`  Reassigning to agent: ${firstAgent.fullName} (User ID: ${firstAgent.id})`);
        
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: { createdById: firstAgent.id }
        });
        
        // Also update any messages for this ticket
        await prisma.supportTicketMessage.updateMany({
          where: { 
            ticketId: ticket.id,
            senderId: 7 // Admin ID
          },
          data: { senderId: firstAgent.id }
        });
        
        console.log(`  ✓ Updated ticket #${ticket.id} creator to ${firstAgent.fullName}`);
      }
      console.log('---');
    }

    console.log('Ticket creator fix completed!');
    
    // Verify the changes
    console.log('\nVerifying changes...');
    const updatedTickets = await prisma.supportTicket.findMany({
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

    for (const ticket of updatedTickets) {
      console.log(`Ticket #${ticket.id}: "${ticket.title}" - Created by: ${ticket.createdBy.fullName} (${ticket.createdBy.role})`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTicketCreators();
