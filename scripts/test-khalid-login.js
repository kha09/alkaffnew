const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testKhalidLogin() {
  try {
    console.log('Testing Khalid login...\n');
    
    const credentials = {
      username: 'kha@gmail.com',
      password: '123456'
    };
    
    console.log(`Attempting login with email: ${credentials.username}`);
    
    // First, try to find user in User table
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: credentials.username },
          { email: credentials.username }
        ]
      }
    });

    if (user) {
      console.log('\n✅ User found in User table:');
      console.log(`ID: ${user.id}`);
      console.log(`Full Name: ${user.fullName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      console.log(`Password valid: ${isPasswordValid}`);
      
      if (isPasswordValid) {
        console.log('\n🎉 Login would succeed with User record!');
        console.log('Session would contain:');
        console.log({
          id: user.id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
          username: user.username
        });
        return;
      }
    } else {
      console.log('❌ User not found in User table');
    }

    // If not found in User table, try Agent table
    const agent = await prisma.agent.findFirst({
      where: {
        email: credentials.username
      }
    });

    if (agent && agent.password) {
      console.log('\n✅ Agent found in Agent table:');
      console.log(`ID: ${agent.id}`);
      console.log(`Name: ${agent.name}`);
      console.log(`Email: ${agent.email}`);
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, agent.password);
      console.log(`Password valid: ${isPasswordValid}`);

      if (isPasswordValid) {
        // Find corresponding User entry
        let agentUser = await prisma.user.findFirst({
          where: {
            email: agent.email,
            role: "agent"
          }
        });

        if (agentUser) {
          console.log('\n🎉 Login would succeed with Agent->User mapping!');
          console.log('Session would contain:');
          console.log({
            id: agentUser.id.toString(),
            name: agent.name,
            email: agent.email,
            role: "agent",
            username: agent.email
          });
        } else {
          console.log('\n❌ No corresponding User entry found for agent');
        }
      }
    } else {
      console.log('❌ Agent not found or has no password');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testKhalidLogin();
