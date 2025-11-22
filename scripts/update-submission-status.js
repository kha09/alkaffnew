const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function updateSubmissionStatus() {
  try {
    console.log('Starting to update submission status...');
    
    // Get all form submissions
    const submissions = await prisma.formSubmission.findMany();
    
    console.log(`Found ${submissions.length} submissions to update`);
    
    for (const submission of submissions) {
      let newSubmissionStatus = 'submitted'; // default
      
      // Map orderStage to submissionStatus
      switch (submission.orderStage) {
        case 'New':
        case 'Pending':
          newSubmissionStatus = 'submitted';
          break;
        case 'Approved':
        case 'In Progress':
          newSubmissionStatus = 'approved_by_admin';
          break;
        case 'Sent to University':
          newSubmissionStatus = 'sent_to_university';
          break;
        case 'Accepted by University':
          newSubmissionStatus = 'accepted_by_university';
          break;
        case 'Rejected':
        case 'Rejected by University':
          newSubmissionStatus = 'rejected_by_university';
          break;
        case 'Completed':
          newSubmissionStatus = 'completed';
          break;
        default:
          newSubmissionStatus = 'submitted';
      }
      
      // Update the submission
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { submissionStatus: newSubmissionStatus }
      });
      
      console.log(`Updated submission ${submission.id}: ${submission.orderStage} -> ${newSubmissionStatus}`);
    }
    
    console.log('Successfully updated all submission statuses');
  } catch (error) {
    console.error('Error updating submission status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSubmissionStatus();
