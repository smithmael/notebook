// book-rent-api/db.js

const { Pool } = require('pg');
require('dotenv').config();

// The Pool will use the DATABASE_URL from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database!');
  client.release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

const { PrismaClient } = require('@prisma/client');

// This creates one single connection instance to reuse
const prisma = new PrismaClient();

module.exports = prisma;