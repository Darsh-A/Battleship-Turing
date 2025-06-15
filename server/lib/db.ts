import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./database";

let queryClient: Client | undefined;
let db: NodePgDatabase | undefined;

export async function connect(): Promise<NodePgDatabase> {
  if (!db) {
    queryClient = new Client({ connectionString: process.env.DATABASE_URL });
    await queryClient.connect();
    db = drizzle(queryClient, { schema });
  }
  return db;
}

export async function close() {
  if (queryClient) await queryClient.end();
  queryClient = undefined;
  db = undefined;
}
