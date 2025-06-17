import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { InferModel } from "drizzle-orm";
import { DrizzleAdapter } from "./drizzleAdapter";
import { lobbies } from "./schema";

export type Lobby = InferModel<typeof lobbies>;

export class LobbyAdapter extends DrizzleAdapter<Lobby> {
	constructor(db: NodePgDatabase) {
		super(db, lobbies, lobbies.id);
	}

	async get(id: string) {
		return this.db
			.select()
			.from(this.table)
			.where(eq(this.table.id, id))
			.then((r) => r[0]);
	}
}
