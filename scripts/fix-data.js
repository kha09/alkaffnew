const { PrismaClient } = require('../lib/generated/prisma');

async function fixData() {
  const prisma = new PrismaClient();
  
  try {
    // Update the user to set formSubmissionId
    const updatedUser = await prisma.user.update({
      where: { id: 1 },
      data: { formSubmissionId: 1 }
    });
    console.log('Updated user:', updatedUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixData();
