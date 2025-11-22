// Real database service using Prisma
import { PrismaClient } from './generated/prisma'

// Create the Prisma client
const globalAny: any = globalThis;

const client = globalAny.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalAny.prisma = client

export default client
