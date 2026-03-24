// NOTE: We use require() inside a function (not a top-level import) so that
// any failure (missing DATABASE_URL, client not generated, etc.) is thrown
// inside the handler's try/catch and returned as JSON — not as Vercel's HTML.

let _prisma: any;

function getClient(): any {
  if (_prisma) return _prisma;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Go to Vercel Dashboard → Project → Settings → Environment Variables and add DATABASE_URL.",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client");
  _prisma = new PrismaClient();
  return _prisma;
}

// Lazy proxy — client is created on first property access (inside handler try/catch)
export const prisma: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      const client = getClient();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  },
);
