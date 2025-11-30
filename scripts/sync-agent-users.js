const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function syncAgentUsers() {
  console.log('Syncing agents with user entries...');

  try {
    // Get all agents
    const agents = await prisma.agent.findMany();
    
    for (const agent of agents) {
      // Check if this agent already has a corresponding user entry
      const existingUser = await prisma.user.findFirst({
        where: {
          email: agent.email,
          role: "agent"
        }
      });

      if (!existingUser) {
        // Create a User entry for this agent
        const newUser = await prisma.user.create({
          data: {
            username: agent.email,
            password: agent.password || '$2b$10$defaulthash', // Use agent's password or default
            email: agent.email,
            fullName: agent.name,
            role: "agent"
          }
        });
        
        console.log(`Created User entry for agent: ${agent.name} (User ID: ${newUser.id})`);
      } else {
        console.log(`User entry already exists for agent: ${agent.name} (User ID: ${existingUser.id})`);
      }
    }

    console.log('Agent-User sync completed successfully!');
  } catch (error) {
    console.error('Error syncing agents with users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncAgentUsers();
