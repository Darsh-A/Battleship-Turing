import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InferModel } from "drizzle-orm";
import { DrizzleAdapter } from "./drizzleAdapter";
import { moves } from "./schema";

export type Move = InferModel<typeof moves>;
export class MoveAdapter extends DrizzleAdapter<Move> {
  constructor(db: NodePgDatabase) {
    super(db, moves, moves.id);
  }
}
