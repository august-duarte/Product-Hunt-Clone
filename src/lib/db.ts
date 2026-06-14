import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(databaseUrl);

export default sql;
