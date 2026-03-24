import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient | undefined;

function getClient(): PrismaClient {
  if (!_prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Configure it in Vercel dashboard → Settings → Environment Variables.",
      );
    }
    _prisma = new PrismaClient();
  }
  return _prisma;
}

// Lazy proxy — PrismaClient is instantiated only on first DB access (inside handler try/catch)
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
