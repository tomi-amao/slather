import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Function to create a Prisma client with connection handling
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : [],
    errorFormat: 'pretty',
  })

  // Add middleware for connection error handling
  client.$use(async (params, next) => {
    try {
      return await next(params)
    } catch (error) {
      // Check if it's a connection error
      if (
        isErrorWithMessage(error) &&
        (
          error.message.includes("Can't reach database server") ||
          error.message.includes("Connection refused")
        )
      ) {
        console.error(`
===================================================================
DATABASE CONNECTION ERROR: 
Please make sure your database server is running at ${process.env.DATABASE_URL || 'localhost:5432'}
===================================================================
        `)
      }
      throw error
    }
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  );
}