import { PrismaClient } from '@prisma/client';

// กำหนดตัวแปร global เพื่อป้องกันการสร้าง PrismaClient หลายตัวในโหมด development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;