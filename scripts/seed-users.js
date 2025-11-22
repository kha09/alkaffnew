const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users and agents...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const agentPassword = await bcrypt.hash('agent123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smalkaff.com' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      email: 'admin@smalkaff.com',
      fullName: 'Admin User',
      role: 'admin',
    },
  });

  // Create agent user
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@smalkaff.com' },
    update: {},
    create: {
      username: 'agent',
      password: agentPassword,
      email: 'agent@smalkaff.com',
      fullName: 'Agent User',
      role: 'agent',
    },
  });

  // Create student user
  const student = await prisma.user.upsert({
    where: { email: 'student@smalkaff.com' },
    update: {},
    create: {
      username: 'student',
      password: studentPassword,
      email: 'student@smalkaff.com',
      fullName: 'Student User',
      role: 'student',
    },
  });

  // Create agents
  const agent1 = await prisma.agent.upsert({
    where: { email: 'mohammed@alkaff.com' },
    update: {},
    create: {
      name: 'Mohammed Al-Saud',
      email: 'mohammed@alkaff.com',
      phone: '+966 50 123 4567',
    },
  });

  const agent2 = await prisma.agent.upsert({
    where: { email: 'sarah@alkaff.com' },
    update: {},
    create: {
      name: 'Sarah Ahmed',
      email: 'sarah@alkaff.com',
      phone: '+966 50 234 5678',
    },
  });

  // Create sample student users with form submissions
  const studentUser1 = await prisma.user.upsert({
    where: { email: 'ali@example.com' },
    update: {},
    create: {
      username: 'ali',
      password: await bcrypt.hash('password123', 10),
      email: 'ali@example.com',
      fullName: 'Ali Hassan',
      role: 'student',
    },
  });

  const studentUser2 = await prisma.user.upsert({
    where: { email: 'layla@example.com' },
    update: {},
    create: {
      username: 'layla',
      password: await bcrypt.hash('password123', 10),
      email: 'layla@example.com',
      fullName: 'Layla Mahmoud',
      role: 'student',
    },
  });

  // Create form submissions
  const submission1 = await prisma.formSubmission.upsert({
    where: { userId: studentUser1.id },
    update: {},
    create: {
      fullName: 'Ali Hassan',
      nationality: 'Saudi Arabia',
      email: 'ali@example.com',
      countryOfResidence: 'Saudi Arabia',
      contactNumber: '+966 50 000 0000',
      cityOfResidence: 'Riyadh',
      preferredProgram: 'Computer Engineering',
      universityId: 7,
      programId: null,
      agentId: agent1.id,
      orderStage: 'submitted',
      userId: studentUser1.id,
    },
  });

  const submission2 = await prisma.formSubmission.upsert({
    where: { userId: studentUser2.id },
    update: {},
    create: {
      fullName: 'Layla Mahmoud',
      nationality: 'Egypt',
      email: 'layla@example.com',
      countryOfResidence: 'Egypt',
      contactNumber: '+20 100 000 0000',
      cityOfResidence: 'Cairo',
      preferredProgram: 'Medicine',
      universityId: 8,
      programId: null,
      agentId: agent2.id,
      orderStage: 'approved_by_admin',
      userId: studentUser2.id,
    },
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      userId: studentUser1.id,
      formSubmissionId: submission1.id,
      agentId: agent1.id,
      agentStatus: 'Created by Agent',
      adminStatus: 'Pending',
      paymentStatus: 'unpaid',
      submissionStatus: 'submitted',
      agentNotes: 'Student is interested in engineering programs',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: studentUser2.id,
      formSubmissionId: submission2.id,
      agentId: agent2.id,
      agentStatus: 'Submitted',
      adminStatus: 'Approved',
      paymentStatus: 'paid',
      submissionStatus: 'approved_by_admin',
      agentNotes: 'Student has submitted all required documents',
      adminNotes: 'Application approved, waiting for university response',
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Created users:', { admin: admin.id, agent: agentUser.id, student: student.id });
  console.log('Created agents:', { agent1: agent1.id, agent2: agent2.id });
  console.log('Created student users:', { studentUser1: studentUser1.id, studentUser2: studentUser2.id });
  console.log('Created form submissions:', { submission1: submission1.id, submission2: submission2.id });
  console.log('Created orders:', { order1: order1.id, order2: order2.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
