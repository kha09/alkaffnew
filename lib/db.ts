// Conditional database service - uses Prisma in development, mock data in production
import { PrismaClient } from '@/lib/generated/prisma'
import mockDb from '@/lib/mockDb'

// Check if we should use mock data (for Vercel deployment without database)
const useMockData = process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'production'

// Mock client that mimics Prisma client methods
class MockPrismaClient {
  // Helper method to disconnect (no-op for mock)
  $disconnect = async () => {}

  university = {
    findMany: async () => mockDb.universities.map(u => ({ ...u, emailAddress: `admissions@${u.name.toLowerCase().replace(/\s+/g, '')}.edu` })),
    findUnique: async ({ where }: any) => {
      const university = mockDb.universities.find(u => u.id === where.id)
      return university ? { ...university, emailAddress: `admissions@${university.name.toLowerCase().replace(/\s+/g, '')}.edu` } : null
    }
  }

  program = {
    findMany: async () => mockDb.programs,
    findUnique: async ({ where }: any) => mockDb.programs.find(p => p.id === where.id) || null
  }

  testimonial = {
    findMany: async () => mockDb.testimonials,
    findUnique: async ({ where }: any) => mockDb.testimonials.find(t => t.id === where.id) || null
  }

  faq = {
    findMany: async () => mockDb.faqs
  }

  agent = {
    findMany: async () => mockDb.agents,
    findUnique: async ({ where }: any) => mockDb.agents.find(a => a.id === where.id) || null,
    create: async (data: any) => {
      const newAgent = {
        id: mockDb.agents.length + 1,
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockDb.agents.push(newAgent as any)
      return newAgent
    },
    update: async ({ where, data }: any) => {
      const agentIndex = mockDb.agents.findIndex(a => a.id === where.id)
      if (agentIndex !== -1) {
        mockDb.agents[agentIndex] = { ...mockDb.agents[agentIndex], ...data.data, updatedAt: new Date() }
        return mockDb.agents[agentIndex]
      }
      return null
    },
    delete: async ({ where }: any) => {
      const agentIndex = mockDb.agents.findIndex(a => a.id === where.id)
      if (agentIndex !== -1) {
        const deletedAgent = mockDb.agents[agentIndex]
        mockDb.agents.splice(agentIndex, 1)
        return deletedAgent
      }
      return null
    },
    count: async () => mockDb.agents.length
  }

  order = {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let orders = mockDb.orders
      
      // Apply where filter
      if (where) {
        orders = orders.filter(order => {
          if (where.userId && order.userId !== where.userId) return false
          if (where.id && order.id !== where.id) return false
          if (where.agentId && order.agentId !== where.agentId) return false
          return true
        })
      }
      
      // Apply ordering
      if (orderBy?.dateCreated === 'desc') {
        orders = orders.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      }
      
      return orders
    },
    findUnique: async ({ where, include }: any) => {
      const order = mockDb.orders.find(o => o.id === where.id)
      return order || null
    },
    findFirst: async ({ where }: any) => {
      const orders = mockDb.orders.filter(order => {
        if (where.userId && order.userId !== where.userId) return false
        if (where.id && order.id !== where.id) return false
        if (where.agentId && order.agentId !== where.agentId) return false
        return true
      })
      return orders[0] || null
    },
    create: async (data: any) => {
      const newOrder = {
        id: mockDb.orders.length + 1,
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockDb.orders.push(newOrder as any)
      return newOrder
    },
    update: async ({ where, data }: any) => {
      const orderIndex = mockDb.orders.findIndex(o => o.id === where.id)
      if (orderIndex !== -1) {
        mockDb.orders[orderIndex] = { ...mockDb.orders[orderIndex], ...data.data, updatedAt: new Date() }
        return mockDb.orders[orderIndex]
      }
      return null
    },
    delete: async ({ where }: any) => {
      const orderIndex = mockDb.orders.findIndex(o => o.id === where.id)
      if (orderIndex !== -1) {
        const deletedOrder = mockDb.orders[orderIndex]
        mockDb.orders.splice(orderIndex, 1)
        return deletedOrder
      }
      return null
    },
    count: async () => mockDb.orders.length
  }

  user = {
    findMany: async () => mockDb.users,
    findUnique: async ({ where }: any) => mockDb.users.find(u => u.id === where.id) || null,
    create: async (data: any) => {
      const newUser = {
        id: mockDb.users.length + 1,
        ...data.data
      }
      mockDb.users.push(newUser as any)
      return newUser
    },
    update: async ({ where, data }: any) => {
      const userIndex = mockDb.users.findIndex(u => u.id === where.id)
      if (userIndex !== -1) {
        mockDb.users[userIndex] = { ...mockDb.users[userIndex], ...data.data }
        return mockDb.users[userIndex]
      }
      return null
    }
  }

  formSubmission = {
    findMany: async ({ include }: any = {}) => {
      const submissions = mockDb.formSubmissions.map(fs => ({
        ...fs,
        uploadedFiles: include?.uploadedFiles ? [] : undefined
      }))
      return submissions
    },
    findUnique: async ({ where, include }: any) => {
      const submission = mockDb.formSubmissions.find(fs => fs.id === where.id)
      if (!submission) return null
      
      return {
        ...submission,
        uploadedFiles: include?.uploadedFiles ? [] : undefined
      }
    },
    create: async (data: any) => {
      const newFormSubmission = {
        id: mockDb.formSubmissions.length + 1,
        ...data.data,
        submittedAt: new Date()
      }
      mockDb.formSubmissions.push(newFormSubmission as any)
      return newFormSubmission
    },
    update: async ({ where, data }: any) => {
      const formSubmissionIndex = mockDb.formSubmissions.findIndex(fs => fs.id === where.id)
      if (formSubmissionIndex !== -1) {
        mockDb.formSubmissions[formSubmissionIndex] = { ...mockDb.formSubmissions[formSubmissionIndex], ...data.data, submittedAt: new Date() }
        return mockDb.formSubmissions[formSubmissionIndex]
      }
      return null
    },
    count: async () => mockDb.formSubmissions.length
  }

  commission = {
    findMany: async () => [],
    findUnique: async ({ where }: any) => null,
    create: async (data: any) => {
      const newCommission = {
        id: 1,
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return newCommission
    },
    update: async ({ where, data }: any) => {
      return { id: where.id, ...data.data, updatedAt: new Date() }
    },
    delete: async ({ where }: any) => {
      return { message: 'Commission deleted successfully' }
    },
    count: async () => 0
  }

  heroSlide = {
    findMany: async () => []
  }

  whySMAlkaff = {
    findMany: async () => []
  }

  howItWorks = {
    findMany: async () => []
  }

  department = {
    findMany: async () => []
  }

  uploadedFile = {
    create: async (data: any) => {
      return {
        id: 1,
        ...data.data,
        uploadedAt: new Date()
      }
    }
  }

  emailTemplate = {
    findMany: async ({ orderBy, include }: any = {}) => {
      // Mock email templates data
      const mockTemplates = [
        {
          id: 1,
          name: 'University Application Template',
          subject: 'Student Application - {{fullName}}',
          body: 'Dear University Admissions Team,\n\nWe are pleased to submit an application for {{fullName}} ({{email}}) from {{nationality}}.\n\nStudent Details:\n- Full Name: {{fullName}}\n- Email: {{email}}\n- Nationality: {{nationality}}\n- Preferred Program: {{preferredProgram}}\n\nPlease find the attached documents for review.\n\nBest regards,\nSM Alkaff Team',
          templateType: 'standard',
          description: 'Standard template for university applications',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { sentEmails: 0 }
        }
      ]
      
      if (include?._count) {
        return mockTemplates
      }
      
      return mockTemplates.map(({ _count, ...template }) => template)
    },
    findUnique: async ({ where }: any) => {
      const mockTemplates = [
        {
          id: 1,
          name: 'University Application Template',
          subject: 'Student Application - {{fullName}}',
          body: 'Dear University Admissions Team,\n\nWe are pleased to submit an application for {{fullName}} ({{email}}) from {{nationality}}.\n\nStudent Details:\n- Full Name: {{fullName}}\n- Email: {{email}}\n- Nationality: {{nationality}}\n- Preferred Program: {{preferredProgram}}\n\nPlease find the attached documents for review.\n\nBest regards,\nSM Alkaff Team',
          templateType: 'standard',
          description: 'Standard template for university applications',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      if (where.id) {
        return mockTemplates.find(t => t.id === where.id) || null
      }
      if (where.name) {
        return mockTemplates.find(t => t.name === where.name) || null
      }
      return null
    },
    create: async ({ data }: any) => {
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    update: async ({ where, data }: any) => {
      return {
        id: where.id,
        ...data,
        updatedAt: new Date()
      }
    },
    delete: async ({ where }: any) => {
      return {
        id: where.id,
        name: 'Deleted Template'
      }
    }
  }

  sentEmail = {
    findMany: async ({ where, include, orderBy, skip, take }: any = {}) => {
      // Mock sent emails data
      const mockSentEmails = [
        {
          id: 1,
          fromEmail: 'no-reply@smalkaff.com',
          toEmail: 'admissions@university.edu',
          subject: 'Student Application - John Doe',
          body: 'Dear University Admissions Team...',
          templateId: 1,
          formSubmissionId: 1,
          universityId: 1,
          attachmentPaths: null,
          status: 'sent',
          sentAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          template: include?.template ? {
            id: 1,
            name: 'University Application Template',
            templateType: 'standard'
          } : undefined,
          formSubmission: include?.formSubmission ? {
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            nationality: 'American',
            preferredProgram: 'Computer Science'
          } : undefined,
          university: include?.university ? {
            id: 1,
            name: 'Harvard University',
            country: 'United States'
          } : undefined
        }
      ]
      
      return mockSentEmails
    },
    create: async ({ data }: any) => {
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        ...data,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    update: async ({ where, data }: any) => {
      return {
        id: where.id,
        ...data,
        updatedAt: new Date()
      }
    },
    count: async ({ where }: any = {}) => {
      return 1 // Mock count
    }
  }

  smtpSettings = {
    findFirst: async ({ where, orderBy }: any = {}) => {
      // Mock SMTP settings - return null initially to simulate no settings configured
      return null
    },
    findUnique: async ({ where }: any) => {
      return null
    },
    create: async ({ data }: any) => {
      return {
        id: 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    update: async ({ where, data }: any) => {
      return {
        id: where.id,
        ...data,
        updatedAt: new Date()
      }
    },
    updateMany: async ({ where, data }: any) => {
      return {
        count: 1 // Mock update count
      }
    },
    delete: async ({ where }: any) => {
      return {
        id: where.id
      }
    }
  }
}

// Create the appropriate client based on environment
let client: PrismaClient | MockPrismaClient

if (useMockData) {
  // Use mock client for production/Vercel deployment
  client = new MockPrismaClient() as any
} else {
  // Use real Prisma client for development
  const globalAny: any = globalThis;
  
  client = globalAny.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalAny.prisma = client as PrismaClient
}

export default client
