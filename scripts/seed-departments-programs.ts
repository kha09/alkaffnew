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
              tuitionFees: 'USD 5,764',
              duration: '3',
              intakeMonths: 'September, January',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 5.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 5,764' },
                { year: '2nd Year', fee: 'USD 5,764' },
                { year: '3rd Year', fee: 'USD 5,764' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
              ])
            },
            {
              name: 'Master of Science in Artificial Intelligence',
              description: 'Advanced study of AI technologies including machine learning, neural networks, and robotics.',
              tuitionFees: 'USD 6,160',
              duration: '2',
              intakeMonths: 'September',
              qualification: "Master's Degree",
              englishRequirement: 'IELTS 6.0',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 6,160' },
                { year: '2nd Year', fee: 'USD 6,160' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
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
              tuitionFees: 'USD 5,940',
              duration: '4',
              intakeMonths: 'September, February',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 5.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 5,940' },
                { year: '2nd Year', fee: 'USD 5,940' },
                { year: '3rd Year', fee: 'USD 5,940' },
                { year: '4th Year', fee: 'USD 5,940' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
              ])
            },
            {
              name: 'Master of Engineering in Cybersecurity',
              description: 'Specialized program in network security, cryptography, and information assurance.',
              tuitionFees: 'USD 6,380',
              duration: '2',
              intakeMonths: 'January, September',
              qualification: "Master's Degree",
              englishRequirement: 'IELTS 6.0',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 6,380' },
                { year: '2nd Year', fee: 'USD 6,380' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
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
              tuitionFees: 'USD 5,500',
              duration: '3',
              intakeMonths: 'September, January',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 5.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 5,500' },
                { year: '2nd Year', fee: 'USD 5,500' },
                { year: '3rd Year', fee: 'USD 5,500' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
              ])
            },
            {
              name: 'Master of Business Administration',
              description: 'Advanced management program for developing leadership and strategic thinking skills.',
              tuitionFees: 'USD 6,600',
              duration: '2',
              intakeMonths: 'September',
              qualification: "Master's Degree",
              englishRequirement: 'IELTS 6.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 6,600' },
                { year: '2nd Year', fee: 'USD 6,600' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
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
              tuitionFees: 'USD 7,700',
              duration: '5',
              intakeMonths: 'September',
              qualification: "Bachelor's Degree",
              englishRequirement: 'IELTS 6.5',
              offerLetter: true,
              classType: 'Physical',
              yearlyTuitionFees: JSON.stringify([
                { year: '1st Year', fee: 'USD 7,700' },
                { year: '2nd Year', fee: 'USD 7,700' },
                { year: '3rd Year', fee: 'USD 7,700' },
                { year: '4th Year', fee: 'USD 7,700' },
                { year: '5th Year', fee: 'USD 7,700' }
              ]),
              otherFees: JSON.stringify([
                { description: 'International Processing Fee (Student Visa)', fee: 'USD 627' },
                { description: 'Other Payment (per year)', fee: 'USD 88' },
                { description: 'Registration Fee', fee: 'USD 440' },
                { description: 'Deposit', fee: 'USD 330' }
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
