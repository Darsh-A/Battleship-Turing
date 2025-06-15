import { eq } from "drizzle-orm";
import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Repository } from "./repository";

export class DrizzleAdapter<T> implements Repository<T> {
  constructor(
    protected readonly db: NodePgDatabase,
    protected readonly table: AnyPgTable,
    protected readonly idColumn: AnyPgColumn,
  ) {}

  async get(id: string): Promise<T | undefined> {
    const [row] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.idColumn, id));
    return row as T | undefined;
  }

  async all(): Promise<T[]> {
    return (await this.db.select().from(this.table)) as T[];
  }

  async create(data: Partial<T>): Promise<T> {
    const [row] = await this.db.insert(this.table).values(data).returning();
    return row as T;
  }
}
