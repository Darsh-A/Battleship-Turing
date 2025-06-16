import {
	pgTable,
	uuid,
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
	lobbyId: uuid("lobby_id")
		.references(() => lobbies.id)
		.notNull(),
});

export const lobbies = pgTable("lobbies", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const lobby = pgTable("games", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	status: text("status").notNull(),
	boardState: jsonb("board_state").$type<GameState>().notNull(),
});

export const moves = pgTable("moves", {
	id: serial("id").primaryKey(),
	gameId: uuid("game_id")
		.references(() => games.id)
		.notNull(),
	playerId: uuid("player_id")
		.references(() => players.id)
		.notNull(),
	x: integer("x").notNull(),
	y: integer("y").notNull(),
	result: text("result").notNull(),
});
