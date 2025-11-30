const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function testTicketCreation() {
  try {
    console.log('Testing ticket creation by agent خالد...\n');
    
    // Simulate the agent session (User ID 24)
    const agentUserId = 24;
    
    // Get the user info first
    const user = await prisma.user.findUnique({
      where: { id: agentUserId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('Agent user info:');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.fullName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    
    // Create a test ticket
    const ticketData = {
      title: 'Test ticket by خالد',
      description: 'This is a test ticket created by agent خالد to verify the creator information is properly saved and displayed.',
      priority: 'medium',
      category: 'general',
      createdById: agentUserId,
      status: 'open'
    };
    
    console.log('\n🎫 Creating ticket...');
    const ticket = await prisma.supportTicket.create({
      data: ticketData,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      }
    });
    
    console.log('✅ Ticket created successfully!');
    console.log(`Ticket ID: ${ticket.id}`);
    console.log(`Title: ${ticket.title}`);
    console.log(`Created By ID: ${ticket.createdById}`);
    console.log('Creator Data:', ticket.createdBy);
    
    // Create initial message
    await prisma.supportTicketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: agentUserId,
        message: ticketData.description,
        isInternal: false
      }
    });
    
    console.log('✅ Initial message created');
    
    // Now fetch the ticket as the admin would see it
    console.log('\n📋 Fetching ticket as admin would see it...');
    const adminViewTicket = await prisma.supportTicket.findUnique({
      where: { id: ticket.id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      }
    });
    
    console.log('Admin view of ticket:');
    console.log(`ID: ${adminViewTicket.id}`);
    console.log(`Title: ${adminViewTicket.title}`);
    console.log(`Status: ${adminViewTicket.status}`);
    console.log(`Priority: ${adminViewTicket.priority}`);
    console.log(`Category: ${adminViewTicket.category}`);
    console.log(`Created By: ${adminViewTicket.createdBy.fullName} (${adminViewTicket.createdBy.email}) - Role: ${adminViewTicket.createdBy.role}`);
    console.log(`Message Count: ${adminViewTicket._count.messages}`);
    
    if (adminViewTicket.createdBy.fullName === 'خالد' && adminViewTicket.createdBy.email === 'kha@gmail.com') {
      console.log('\n🎉 SUCCESS! Agent name and email are properly displayed in ticket details!');
    } else {
      console.log('\n❌ ISSUE: Agent name or email not properly displayed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTicketCreation();
