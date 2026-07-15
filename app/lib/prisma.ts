// src/db.ts
import { PrismaClient } from './../generated/prisma-client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

// 1. Setup the pg Pool using our Neon connection string
const pool = new pg.Pool({ connectionString });

// 2. Instantiate the Prisma driver adapter
const adapter = new PrismaPg(pool);

// 3. Create a Singleton instance to prevent open connection issues during development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;