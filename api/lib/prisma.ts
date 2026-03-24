import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient | undefined;

function getClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Go to Vercel Dashboard → Project → Settings → Environment Variables and add DATABASE_URL.",
    );
  }
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

// Lazy proxy — PrismaClient is created on first property access (inside handler try/catch)
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
