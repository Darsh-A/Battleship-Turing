import "dotenv/config";
import { Client } from "pg";
import { SocketManager } from "./lib/socket";
import { connect } from "./lib/db";
import { PlayerAdapter, LobbyAdapter } from "./lib/database";
import { slug } from "./lib/slug";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

interface Events {
	ping: string;
	login: { username: string; password: string };
	create_lobby: { username: string; password: string; lobbyName: string };
	join_lobby: { username: string; password: string; lobbyName: string };
}

async function runMigrations() {
	console.log("[INFO] Running Migrations First.");
	const client = new Client({ connectionString: process.env.DATABASE_URL });
	await client.connect();

	const db = drizzle(client);
	await migrate(db, { migrationsFolder: "./drizzle" });

	await client.end();
}
await runMigrations();

const db = await connect();
const players = new PlayerAdapter(db);
const lobbies = new LobbyAdapter(db);
const socketManager = new SocketManager<Events>();

socketManager.on("login", async (client, { username, password }) => {
	const playerId = slug(`${username}_${password}`);
	console.log(`[DEBUG] Player ID: ${playerId}`);
	let player = await players.get(playerId);

	if (!player) {
		const defaultLobby =
			(await lobbies.get("global")) ||
			(await lobbies.create({ id: "global", name: "Global Lobby" }));
		player = await players.create({
			id: playerId,
			username,
			password,
			lobbyId: defaultLobby.id,
		});
	}

	const stats = await players.getStats(playerId);
	client.emit("login_success", { playerId, stats });
});

socketManager.on(
	"create_lobby",
	async (client, { username, password, lobbyName }) => {
		const lobbyId = slug(lobbyName);
		const playerId = slug(`${username}_${password}`);
		let lobby = await lobbies.get(lobbyId);
		if (lobby) {
			client.emit("lobby_already_exists", { lobbyName });
			return;
		}
		lobby = await lobbies.create({ id: lobbyId, name: lobbyName });
		let player = await players.get(playerId);
		if (!player) {
			player = await players.create({
				id: playerId,
				username,
				password,
				lobbyId: lobby.id,
			});
		} else if (player.lobbyId !== lobby.id) {
			await players.update(playerId, { lobbyId: lobby.id });
		}
		client.join(lobby.id);
		client.emit("lobby_created", { lobbyId: lobby.id, playerId: player.id });
		console.log(`[DEBUG] Lobby Created with Id: ${lobby.id}`);
	},
);

socketManager.on(
	"join_lobby",
	async (client, { username, password, lobbyName }) => {
		const lobbyId = slug(lobbyName);
		const playerId = slug(`${username}_${password}`);
		const lobby = await lobbies.get(lobbyId);
		if (!lobby) {
			client.emit("lobby_not_found", { lobbyName: lobbyName });
			return;
		}
		let player = await players.get(playerId);
		if (!player) {
			player = await players.create({
				id: playerId,
				username,
				password,
				lobbyId: lobby.id,
			});
		} else if (player.lobbyId !== lobby.id) {
			await players.update(playerId, { lobbyId: lobby.id });
		}
		client.join(lobby.id);
		client.emit("lobby_joined", { lobbyId: lobby.id, playerId: player.id });
		console.log(`[DEBUG] Player ${playerId} joined Lobby: ${lobby.id}`);
	},
);

socketManager.on("ping", (client, msg) => {
	client.emit("ping", msg);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
socketManager.start(PORT);
