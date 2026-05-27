import { env } from '@/env';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(env.DATABASE_URL);
export type DB = typeof db;
export type Transaction = Parameters<Parameters<DB["transaction"]>[0]>[0];

export type DBClient = DB | Transaction;