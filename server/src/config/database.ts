// ✅ Point to your custom generated folder
import { PrismaClient } from "../generated/client/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg'; // You need the 'Pool' from pg for the adapter

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// ✅ Create the client using your custom-generated class
const prisma = new PrismaClient({ adapter });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;