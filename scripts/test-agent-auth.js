const bcrypt = require('bcrypt');
const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function testAgentAuth() {
  try {
    console.log('Creating test agent...');
    
    // Create a test agent with password
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const agent = await prisma.agent.create({
      data: {
        name: 'Test Agent',
        email: 'testagent@example.com',
        phone: '+966501234567',
        password: hashedPassword
      }
    });
    
    console.log('Test agent created:', {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      plainPassword: testPassword
    });
    
    // Test password verification
    const isValid = await bcrypt.compare(testPassword, agent.password);
    console.log('Password verification test:', isValid ? 'PASSED' : 'FAILED');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAgentAuth();
