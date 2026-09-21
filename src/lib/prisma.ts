import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // If in production or running in serverless (e.g. Vercel)
  if (process.env.VERCEL || (process.env.NODE_ENV === 'production' && process.platform !== 'win32')) {
    try {
      const tmpDb = path.join('/tmp', 'dev.db');
      if (!fs.existsSync(tmpDb)) {
        const candidates = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'dev.db'),
        ];
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            try {
              fs.mkdirSync(path.dirname(tmpDb), { recursive: true });
              fs.copyFileSync(candidate, tmpDb);
              console.log(`Copied database from ${candidate} to ${tmpDb}`);
              break;
            } catch (e) {
              console.error('Failed to copy database to /tmp:', e);
            }
          }
        }
      }
      if (fs.existsSync(tmpDb)) {
        return `file:${tmpDb}`;
      }
    } catch (err) {
      console.error('Error setting up serverless SQLite:', err);
    }
  }

  return undefined;
}

const dbUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
