// lib/prisma.ts —— PrismaClient singleton。dev 熱重載會重複 import，用 globalThis 快取避免多實例耗盡連線。
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
