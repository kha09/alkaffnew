// Mock database service for deployment without a real database
export const mockDb = {
  // Mock data for universities
  universities: [
    {
      id: 1,
      name: "King Saud University",
      country: "Saudi Arabia",
      logo: "/placeholder.jpg",
      ranking: "1st in Saudi Arabia",
      students: "60,000+",
      programs: "150+",
      acceptance: "60%",
      color: "#8B0000",
      flag: "🇸🇦",
      order: 1,
      freeOfferLetter: true,
      departments: [
        {
          id: 1,
          name: "College of Engineering",
          programs: [
            { id: 1, name: "Computer Engineering", description: "Focuses on computer hardware and software integration", tuitionFees: "$2,000/year", duration: "4 years", intakeMonths: "September, February", qualification: "Bachelor's Degree", englishRequirement: "IELTS 6.0", offerLetter: true, classType: "Physical" },
            { id: 2, name: "Civil Engineering", description: "Deals with design and construction of infrastructure", tuitionFees: "$2,000/year", duration: "4 years", intakeMonths: "September, February", qualification: "Bachelor's Degree", englishRequirement: "IELTS 6.0", offerLetter: true, classType: "Physical" }
          ]
        },
        {
          id: 2,
          name: "College of Business",
          programs: [
            { id: 3, name: "Business Administration", description: "Comprehensive business management program", tuitionFees: "$1,800/year", duration: "4 years", intakeMonths: "September, February", qualification: "Bachelor's Degree", englishRequirement: "IELTS 6.0", offerLetter: true, classType: "Physical" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "King Abdulaziz University",
      country: "Saudi Arabia",
      logo: "/placeholder.jpg",
      ranking: "2nd in Saudi Arabia",
      students: "50,000+",
      programs: "120+",
      acceptance: "55%",
      color: "#003366",
      flag: "🇸🇦",
      order: 2,
      freeOfferLetter: true,
      departments: [
        {
          id: 3,
          name: "Faculty of Medicine",
          programs: [
            { id: 4, name: "Medicine", description: "Comprehensive medical training program", tuitionFees: "$3,000/year", duration: "6 years", intakeMonths: "September", qualification: "Bachelor's Degree", englishRequirement: "IELTS 7.0", offerLetter: true, classType: "Physical" }
          ]
        }
      ]
    }
  ],

  // Mock data for programs
  programs: [
    { id: 1, name: "Computer Engineering", description: "Focuses on computer hardware and software integration", tuitionFees: "$2,000/year", duration: "4 years", intakeMonths: "September, February", qualification: "Bachelor's Degree", englishRequirement: "IELTS 6.0", offerLetter: true, classType: "Physical", departmentId: 1 },
    { id: 2, name: "Civil Engineering", description: "Deals with design and construction of infrastructure", tuitionFees: "$2,000/year", duration: "4 years", intakeMonths: "September, February", qualification: "Bachelor's Degree", englishRequirement: "IELTS 6.0", offerLetter: true, classType: "Physical", departmentId: 1 },
    { id: 3, name: "Business Administration", description: "Comprehensive business management program", tuitionFees: "$1,800/year", duration: "4 years", intakeMonths: "September, February", qualification: "Bachelor's Degree", englishRequirement: "IELTS 6.0", offerLetter: true, classType: "Physical", departmentId: 2 },
    { id: 4, name: "Medicine", description: "Comprehensive medical training program", tuitionFees: "$3,000/year", duration: "6 years", intakeMonths: "September", qualification: "Bachelor's Degree", englishRequirement: "IELTS 7.0", offerLetter: true, classType: "Physical", departmentId: 3 }
  ],

  // Mock data for testimonials
  testimonials: [
    {
      id: 1,
      name: "Ahmed Al-Mubarak",
      program: "Computer Engineering",
      text: "SM Alkaff made my university application process so smooth. I got accepted to my dream university!",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      university: "King Saud University",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      date: "2025-05-15",
      hasVideo: false,
      featured: true,
      category: "engineering"
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      program: "Medicine",
      text: "The guidance I received was exceptional. I'm now studying medicine at one of the top universities!",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      university: "King Abdulaziz University",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      date: "2025-04-22",
      hasVideo: true,
      featured: true,
      category: "medicine"
    }
  ],

  // Mock data for FAQs
  faqs: [
    {
      id: 1,
      question: "How long does the application process take?",
      answer: "The application process typically takes 2-4 weeks depending on the university and program.",
      category: "application",
      popular: true,
      order: 1
    },
    {
      id: 2,
      question: "Do I need to take an English proficiency test?",
      answer: "Most programs require IELTS or TOEFL scores, but some universities offer conditional admission with English courses.",
      category: "requirements",
      popular: true,
      order: 2
    }
  ],

  // Mock data for agents
  agents: [
    {
      id: 1,
      name: "Mohammed Al-Saud",
      email: "mohammed@alkaff.com",
      phone: "+966 50 123 4567",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      email: "sarah@alkaff.com",
      phone: "+966 50 234 5678",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Mock data for orders
  orders: [
    {
      id: 1,
      userId: 1,
      formSubmissionId: 1,
      agentId: 1,
      agentStatus: "Created by Agent",
      adminStatus: "Pending",
      paymentStatus: "unpaid",
      invoice: null,
      dateCreated: new Date(),
      agentNotes: "Student is interested in engineering programs",
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 1,
        fullName: "Ali Hassan",
        email: "ali@example.com"
      },
      formSubmission: {
        id: 1,
        fullName: "Ali Hassan",
        preferredProgram: "Computer Engineering"
      },
      agent: {
        id: 1,
        name: "Mohammed Al-Saud"
      }
    },
    {
      id: 2,
      userId: 2,
      formSubmissionId: 2,
      agentId: 2,
      agentStatus: "Submitted",
      adminStatus: "Approved",
      paymentStatus: "paid",
      invoice: "/invoices/invoice-2.pdf",
      dateCreated: new Date(),
      agentNotes: "Student has submitted all required documents",
      adminNotes: "Application approved, waiting for university response",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 2,
        fullName: "Layla Mahmoud",
        email: "layla@example.com"
      },
      formSubmission: {
        id: 2,
        fullName: "Layla Mahmoud",
        preferredProgram: "Medicine"
      },
      agent: {
        id: 2,
        name: "Sarah Ahmed"
      }
    }
  ],

  // Mock data for users
  users: [
    {
      id: 1,
      fullName: "Ali Hassan",
      email: "ali@example.com"
    },
    {
      id: 2,
      fullName: "Layla Mahmoud",
      email: "layla@example.com"
    }
  ],

  // Mock data for form submissions
  formSubmissions: [
    {
      id: 1,
      fullName: "Ali Hassan",
      nationality: "Saudi Arabia",
      email: "ali@example.com",
      countryOfResidence: "Saudi Arabia",
      contactNumber: "+966 50 000 0000",
      cityOfResidence: "Riyadh",
      preferredProgram: "Computer Engineering",
      universityId: 1,
      programId: 1,
      submittedAt: new Date(),
      agentId: 1,
      orderStage: "New",
      userId: 1
    },
    {
      id: 2,
      fullName: "Layla Mahmoud",
      nationality: "Egypt",
      email: "layla@example.com",
      countryOfResidence: "Egypt",
      contactNumber: "+20 100 000 0000",
      cityOfResidence: "Cairo",
      preferredProgram: "Medicine",
      universityId: 2,
      programId: 4,
      submittedAt: new Date(),
      agentId: 2,
      orderStage: "Documents Submitted",
      userId: 2
    }
  ]
};

export default mockDb;
