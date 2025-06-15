import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InferModel } from "drizzle-orm";
import { DrizzleAdapter } from "./drizzleAdapter";
import { games } from "./schema";

export type Game = InferModel<typeof games>;
export class GameAdapter extends DrizzleAdapter<Game> {
  constructor(db: NodePgDatabase) {
    super(db, games, games.id);
  }
}
