import { pgTable, uuid, text, timestamp, integer, serial, jsonb } from "drizzle-orm/pg-core";
import type { GameState } from "../game";

export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: text("status").notNull(),
  boardState: jsonb("board_state").$type<GameState>().notNull(),
});

export const moves = pgTable("moves", {
  id: serial("id").primaryKey(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  playerId: uuid("player_id").references(() => players.id).notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  result: text("result").notNull(),
});
