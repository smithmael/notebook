// src/lib/prisma.ts
import { PrismaClient } from '../generated/client/index.js'; // Ensure this matches your generate path
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { ENV } from '../config/env.js'; // ✅ Use our central config [cite: 2026-02-17]

// ✅ Use the validated string from our ENV object
const connectionString = ENV.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (ENV.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;