const bcrypt = require('bcrypt');
const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

// Mock credentials provider authorize function
async function testKhalidAuth() {
  console.log('Testing authentication for agent "خالد"...\n');
  
  try {
    // Get Khalid's agent record
    const agent = await prisma.agent.findFirst({
      where: {
        name: {
          contains: 'خالد'
        }
      }
    });
    
    if (!agent) {
      console.log('❌ Agent "خالد" not found');
      return;
    }
    
    console.log('✅ Found Agent:');
    console.log(`  ID: ${agent.id}`);
    console.log(`  Name: ${agent.name}`);
    console.log(`  Email: ${agent.email}`);
    console.log(`  Has Password: ${!!agent.password}\n`);
    
    if (!agent.password) {
      console.log('❌ Agent has no password set');
      return;
    }
    
    // Simulate the authorize function from lib/auth.ts
    console.log('🔐 Testing authentication flow...\n');
    
    // This mimics the authorize function logic for agents
    console.log('1. Looking for agent in Agent table...');
    console.log(`   Found agent with email: ${agent.email}`);
    
    // Verify password (this is what happens in the authorize function)
    console.log('2. Verifying password...');
    // Skip password verification for now, just check if user exists
    console.log('   Skipping password verification for this test');
    
    console.log('3. Looking for corresponding User entry...');
    const agentUser = await prisma.user.findFirst({
      where: {
        email: agent.email,
        role: "agent"
      }
    });
    
    if (agentUser) {
      console.log(`   ✅ Found existing User entry:`);
      console.log(`      User ID: ${agentUser.id}`);
      console.log(`      Name: ${agentUser.fullName}`);
      console.log(`      Email: ${agentUser.email}`);
      console.log(`      Role: ${agentUser.role}`);
    } else {
      console.log('   ⚠️  No User entry found for this agent');
      console.log('   This means the auth system should create one during login');
    }
    
    // Check what User ID 7 is (the one being used incorrectly)
    console.log('\n🔍 Checking User ID 7 (incorrectly used for tickets):');
    const user7 = await prisma.user.findUnique({
      where: { id: 7 }
    });
    
    if (user7) {
      console.log(`   User ID 7: ${user7.fullName} (${user7.email}) - ${user7.role}`);
    } else {
      console.log('   User ID 7 not found');
    }
    
    console.log('\n📝 Summary:');
    console.log(`   Agent ID: ${agent.id} (${agent.name})`);
    console.log(`   Correct User ID for this agent: ${agentUser ? agentUser.id : 'None yet'}`);
    console.log(`   Incorrectly used User ID: 7 (${user7 ? user7.fullName : 'Not found'})`);
    
    // Additional check: See if there are any tickets created by User ID 7
    console.log('\n📋 Checking tickets created by User ID 7:');
    const ticketsCreatedByUser7 = await prisma.supportTicket.findMany({
      where: {
        createdById: 7
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
    
    console.log(`   Found ${ticketsCreatedByUser7.length} tickets created by User ID 7:`);
    ticketsCreatedByUser7.forEach(ticket => {
      console.log(`     Ticket #${ticket.id}: "${ticket.title}"`);
      console.log(`       Created by: ${ticket.createdBy.fullName} (${ticket.createdBy.email}) - ${ticket.createdBy.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testKhalidAuth();
