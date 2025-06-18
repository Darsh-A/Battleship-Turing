import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "./database"

let queryClient: Client | undefined
let db: NodePgDatabase | undefined

export async function connect(): Promise<NodePgDatabase> {
  if (!db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL missing")
    queryClient = new Client({ connectionString: url })
    await queryClient.connect()
    db = drizzle(queryClient, { schema })
  }
  return db
}

export async function close(): Promise<void> {
  if (queryClient) await queryClient.end()
  queryClient = undefined
  db = undefined
}

