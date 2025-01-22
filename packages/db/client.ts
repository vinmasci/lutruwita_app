import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['query', 'error', 'warn'],
  });
};

// Use global to prevent multiple instances in development
const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

// Handle cleanup on application shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Handle cleanup on unhandled rejections
process.on('unhandledRejection', async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

export { prisma };
