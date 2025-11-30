const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function checkKhalidAgent() {
  console.log('🔍 Checking agent "خالد" (Khalid)...\n');
  
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
    console.log(`  Email: ${agent.email}`);
    console.log(`  Created: ${agent.createdAt}`);
    
    // Find corresponding User entry
    const user = await prisma.user.findFirst({
      where: {
        email: agent.email,
        role: "agent"
      }
    });
    
    if (!user) {
      console.log('\n❌ No corresponding User entry found for this agent');
      return;
    }
    
    console.log('\n✅ Corresponding User entry:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.fullName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    
    // Check tickets created by this user
    const tickets = await prisma.supportTicket.findMany({
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
    
    console.log(`\n🎫 Tickets created by this agent (${tickets.length} found):`);
    tickets.forEach(ticket => {
      console.log(`  Ticket #${ticket.id}: "${ticket.title}"`);
      console.log(`    Created by: ${ticket.createdBy.fullName} (${ticket.createdBy.email})`);
      console.log(`    Role: ${ticket.createdBy.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkKhalidAgent();
