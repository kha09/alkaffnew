const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function checkKhalidTickets() {
  console.log('🔍 Checking tickets related to agent "خالد" (Khalid)...\n');
  
  try {
    // Find the agent named "خالد"
    const agent = await prisma.agent.findFirst({
      where: {
        name: {
          contains: 'خالد'
        }
      }
    });
    
    if (!agent) {
      console.log('❌ Agent "خالد" not found in Agent table');
      return;
    }
    
    console.log('✅ Found Agent:');
    console.log(`  ID: ${agent.id}`);
    console.log(`  Name: ${agent.name}`);
    console.log(`  Email: ${agent.email}\n`);
    
    // Find corresponding User entry
    const user = await prisma.user.findFirst({
      where: {
        email: agent.email,
        role: "agent"
      }
    });
    
    if (!user) {
      console.log('❌ No corresponding User entry found for this agent');
      return;
    }
    
    console.log('✅ Corresponding User entry:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.fullName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}\n`);
    
    // Check all tickets to see which ones might be related to this agent
    const allTickets = await prisma.supportTicket.findMany({
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
    });
    
    console.log(`🎫 All tickets in system (${allTickets.length} found):`);
    allTickets.forEach(ticket => {
      const isCreatedByKhalid = ticket.createdById === user.id;
      const marker = isCreatedByKhalid ? '⭐' : '  ';
      console.log(`${marker} Ticket #${ticket.id}: "${ticket.title}"`);
      console.log(`    Created by: ${ticket.createdBy.fullName} (${ticket.createdBy.email}) - ${ticket.createdBy.role}`);
      if (isCreatedByKhalid) {
        console.log(`    ⭐ THIS TICKET WAS CREATED BY KHALID'S USER ACCOUNT`);
      }
      console.log('---');
    });
    
    // Specifically check tickets created by User ID 24 (Khalid's user account)
    const khalidTickets = await prisma.supportTicket.findMany({
      where: {
        createdById: user.id
      },
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
    
    console.log(`\n🎯 Tickets specifically created by Khalid's user account (User ID ${user.id}):`);
    if (khalidTickets.length === 0) {
      console.log('  No tickets found');
    } else {
      khalidTickets.forEach(ticket => {
        console.log(`  Ticket #${ticket.id}: "${ticket.title}"`);
        console.log(`    Created by: ${ticket.createdBy.fullName} (${ticket.createdBy.email})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkKhalidTickets();
