const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkKhalidAgent() {
  try {
    console.log('Checking Khalid agent data...\n');
    
    // Find the agent
    const agent = await prisma.agent.findFirst({
      where: {
        email: 'kha@gmail.com'
      }
    });
    
    if (!agent) {
      console.log('❌ Agent with email kha@gmail.com not found');
      return;
    }
    
    console.log('Agent found:');
    console.log(`ID: ${agent.id}`);
    console.log(`Name: ${agent.name}`);
    console.log(`Email: ${agent.email}`);
    console.log(`Has Password: ${agent.password ? 'Yes' : 'No'}`);
    
    // Check corresponding User entry
    const user = await prisma.user.findFirst({
      where: {
        email: 'kha@gmail.com',
        role: 'agent'
      }
    });
    
    if (user) {
      console.log('\nCorresponding User found:');
      console.log(`User ID: ${user.id}`);
      console.log(`Full Name: ${user.fullName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Has Password: ${user.password ? 'Yes' : 'No'}`);
    } else {
      console.log('\n❌ No corresponding User entry found');
    }
    
    // If agent doesn't have password, set one
    if (!agent.password) {
      console.log('\n🔧 Setting password for agent...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await prisma.agent.update({
        where: { id: agent.id },
        data: { password: hashedPassword }
      });
      
      console.log('✅ Password set for agent');
      
      // Update user password too if user exists
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        console.log('✅ Password updated for corresponding user');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkKhalidAgent();
