import db from './db.js'

async function seedDepartmentsAndPrograms() {
  try {
    // Clear existing departments and programs
    await db.program.deleteMany()
    await db.department.deleteMany()

    // Create departments and programs for university with id 7
    const csDepartment = await db.department.create({
      data: {
        name: 'Computer Science',
        universityId: 7,
        programs: {
          create: [
            {
              name: 'Bachelor of Science in Computer Science',
              description: 'A comprehensive program covering software development, algorithms, and computer systems.',
              tuitionFees: '15,000 RM',
              duration: '3',
              intakeMonths: 'September, January',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 5.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 26,200' },
                { year: '2nd Year', fee: 'MYR 26,200' },
                { year: '3rd Year', fee: 'MYR 26,200' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            },
            {
              name: 'Master of Science in Artificial Intelligence',
              description: 'Advanced study of AI technologies including machine learning, neural networks, and robotics.',
              tuitionFees: '20,000 RM',
              duration: '2',
              intakeMonths: 'September',
              qualification: "Master's Degree",
              englishRequirement: 'IELTS 6.0',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 28,000' },
                { year: '2nd Year', fee: 'MYR 28,000' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            }
          ]
        }
      },
      include: {
        programs: true
      }
    })

    const engineeringDepartment = await db.department.create({
      data: {
        name: 'Engineering',
        universityId: 7,
        programs: {
          create: [
            {
              name: 'Bachelor of Engineering in Software Engineering',
              description: 'Focuses on software design, development, and maintenance with hands-on projects.',
              tuitionFees: '18,000 RM',
              duration: '4',
              intakeMonths: 'September, February',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 5.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 27,000' },
                { year: '2nd Year', fee: 'MYR 27,000' },
                { year: '3rd Year', fee: 'MYR 27,000' },
                { year: '4th Year', fee: 'MYR 27,000' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            },
            {
              name: 'Master of Engineering in Cybersecurity',
              description: 'Specialized program in network security, cryptography, and information assurance.',
              tuitionFees: '22,000 RM',
              duration: '2',
              intakeMonths: 'January, September',
              qualification: "Master's Degree",
              englishRequirement: 'IELTS 6.0',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 29,000' },
                { year: '2nd Year', fee: 'MYR 29,000' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            }
          ]
        }
      },
      include: {
        programs: true
      }
    })

    // Create departments and programs for university with id 8
    const businessDepartment = await db.department.create({
      data: {
        name: 'Business Administration',
        universityId: 8,
        programs: {
          create: [
            {
              name: 'Bachelor of Business Administration',
              description: 'Comprehensive business education covering management, marketing, and finance.',
              tuitionFees: '16,000 RM',
              duration: '3',
              intakeMonths: 'September, January',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 5.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 25,000' },
                { year: '2nd Year', fee: 'MYR 25,000' },
                { year: '3rd Year', fee: 'MYR 25,000' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            },
            {
              name: 'Master of Business Administration',
              description: 'Advanced management program for developing leadership and strategic thinking skills.',
              tuitionFees: '25,000 RM',
              duration: '2',
              intakeMonths: 'September',
              qualification: "Master's Degree",
              englishRequirement: 'IELTS 6.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 30,000' },
                { year: '2nd Year', fee: 'MYR 30,000' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            }
          ]
        }
      },
      include: {
        programs: true
      }
    })

    const medicineDepartment = await db.department.create({
      data: {
        name: 'Medicine',
        universityId: 8,
        programs: {
          create: [
            {
              name: 'Bachelor of Medicine',
              description: 'Comprehensive medical program covering all aspects of healthcare and patient treatment.',
              tuitionFees: '30,000 RM',
              duration: '5',
              intakeMonths: 'September',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 6.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'MYR 35,000' },
                { year: '2nd Year', fee: 'MYR 35,000' },
                { year: '3rd Year', fee: 'MYR 35,000' },
                { year: '4th Year', fee: 'MYR 35,000' },
                { year: '5th Year', fee: 'MYR 35,000' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'MYR 2,850' },
                { description: 'Other Payment (per year)', fee: 'MYR 400' },
                { description: 'Registration Fee', fee: 'MYR 2,000' },
                { description: 'Deposit', fee: 'MYR 1,500' }
              ])
            }
          ]
        }
      },
      include: {
        programs: true
      }
    })

    console.log('Seed data created successfully:')
    console.log('University 7 (جامعة آم القرى):')
    console.log('- Department:', csDepartment.name)
    console.log('  Programs:', csDepartment.programs.map((p: any) => p.name))
    console.log('- Department:', engineeringDepartment.name)
    console.log('  Programs:', engineeringDepartment.programs.map((p: any) => p.name))
    
    console.log('University 8 (جامعة أكسفورد):')
    console.log('- Department:', businessDepartment.name)
    console.log('  Programs:', businessDepartment.programs.map((p: any) => p.name))
    console.log('- Department:', medicineDepartment.name)
    console.log('  Programs:', medicineDepartment.programs.map((p: any) => p.name))
  } catch (error) {
    console.error('Error seeding departments and programs:', error)
  } finally {
    await db.$disconnect()
  }
}

seedDepartmentsAndPrograms()
