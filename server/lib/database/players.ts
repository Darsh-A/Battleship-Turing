import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InferModel } from "drizzle-orm";
import { DrizzleAdapter } from "./drizzleAdapter";
import { players } from "./schema";

export type Player = InferModel<typeof players>;
export class PlayerAdapter extends DrizzleAdapter<Player> {
  constructor(db: NodePgDatabase) {
    super(db, players, players.id);
  }
}
