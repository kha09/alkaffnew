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
    findMany: async () => mockDb.universities,
    findUnique: async ({ where }: any) => mockDb.universities.find(u => u.id === where.id) || null
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
    findMany: async () => mockDb.orders,
    findUnique: async ({ where }: any) => mockDb.orders.find(o => o.id === where.id) || null,
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
    findMany: async () => mockDb.formSubmissions,
    findUnique: async ({ where }: any) => mockDb.formSubmissions.find(fs => fs.id === where.id) || null,
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
