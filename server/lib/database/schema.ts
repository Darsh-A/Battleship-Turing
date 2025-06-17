import {
	pgTable,
	text,
	timestamp,
	integer,
	serial,
	jsonb,
} from "drizzle-orm/pg-core";
import type { GameState } from "../game";

export const players = pgTable("players", {
	id: text("id").primaryKey(),
	username: text("username").notNull(),
	password: text("password").notNull(),
	lobbyId: text("lobby_id")
		.references(() => lobbies.id)
		.notNull(),
	totalMatchesPlayed: integer("total_matches_played").notNull().default(0),
	totalWins: integer("total_wins").notNull().default(0),
	totalLosses: integer("total_losses").notNull().default(0),
	totalComponentsDestroyed: integer("total_components_destroyed")
		.notNull()
		.default(0),
	totalMinesTriggered: integer("total_mines_triggered").notNull().default(0),
});

export const lobbies = pgTable("lobbies", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
	id: text("id").primaryKey(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	status: text("status").notNull(),
	boardState: jsonb("board_state").$type<GameState>().notNull(),
});

export const moves = pgTable("moves", {
	id: serial("id").primaryKey(),
	gameId: text("game_id")
		.references(() => games.id)
		.notNull(),
	playerId: text("player_id")
		.references(() => players.id)
		.notNull(),
	x: integer("x").notNull(),
	y: integer("y").notNull(),
	result: text("result").notNull(),
});
