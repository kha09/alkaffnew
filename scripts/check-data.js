const { PrismaClient } = require('../lib/generated/prisma');

async function checkData() {
  const prisma = new PrismaClient();
  
  try {
    const users = await prisma.user.findMany({
      include: { formSubmission: true }
    });
    console.log('Users:', JSON.stringify(users, null, 2));
    
    const submissions = await prisma.formSubmission.findMany({
      include: { user: true }
    });
    console.log('Submissions:', JSON.stringify(submissions, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
