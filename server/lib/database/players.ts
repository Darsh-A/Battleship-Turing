import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { InferModel } from "drizzle-orm";
import { DrizzleAdapter } from "./drizzleAdapter";
import { players } from "./schema";

export type Player = InferModel<typeof players>;

export type PlayerStats = Pick<
	Player,
	| "totalMatchesPlayed"
	| "totalWins"
	| "totalLosses"
	| "totalComponentsDestroyed"
	| "totalMinesTriggered"
>;

export class PlayerAdapter extends DrizzleAdapter<Player> {
	constructor(db: NodePgDatabase) {
		super(db, players, players.id);
	}

	async getStats(id: string): Promise<PlayerStats | undefined> {
		const p = await this.get(id);
		if (!p) return undefined;
		const {
			totalMatchesPlayed,
			totalWins,
			totalLosses,
			totalComponentsDestroyed,
			totalMinesTriggered,
		} = p;
		return {
			totalMatchesPlayed,
			totalWins,
			totalLosses,
			totalComponentsDestroyed,
			totalMinesTriggered,
		};
	}

	async updateStats(id: string, stats: Partial<PlayerStats>): Promise<Player> {
		const [row] = await this.db
			.update(this.table)
			.set(stats)
			.where(eq(this.idColumn, id))
			.returning();
		return row as Player;
	}

	async resetStats(id: string): Promise<void> {
		await this.db
			.update(this.table)
			.set({
				totalMatchesPlayed: 0,
				totalWins: 0,
				totalLosses: 0,
				totalComponentsDestroyed: 0,
				totalMinesTriggered: 0,
			})
			.where(eq(this.idColumn, id));
	}

	async incrementStat(
		id: string,
		statKey: keyof PlayerStats,
		by = 1,
	): Promise<void> {
		const stats = await this.getStats(id);
		if (!stats) return;

		const current = stats[statKey];
		const update: Partial<PlayerStats> = {};
		update[statKey] = current + by;
		await this.updateStats(id, update);
	}
}
