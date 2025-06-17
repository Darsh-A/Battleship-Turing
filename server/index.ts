import "dotenv/config";
import { SocketManager } from "./lib/socket";
import { connect } from "./lib/db";
import { PlayerAdapter, LobbyAdapter } from "./lib/database";
import { slug } from "./lib/slug";

interface Events {
  ping: string;
  join_lobby: { username: string; password: string; lobbyName: string };
}

const db = await connect();
const players = new PlayerAdapter(db);
const lobbies = new LobbyAdapter(db);
const socketManager = new SocketManager<Events>();

socketManager.on("join_lobby", async (client, { username, password, lobbyName }) => {
  const lobbyId = slug(lobbyName);
  const playerId = slug(`${username}_${password}`);
  let lobby = await lobbies.get(lobbyId);
  if (!lobby) lobby = await lobbies.create({ id: lobbyId, name: lobbyName });
  let player = await players.get(playerId);
  if (!player) {
    player = await players.create({ id: playerId, username, password, lobbyId: lobby.id });
  } else if (player.lobbyId !== lobby.id) {
    await players.update(playerId, { lobbyId: lobby.id });
  }
  client.join(lobby.id);
  client.emit("lobby_joined", { lobbyId: lobby.id, playerId: player.id });
});

socketManager.on("ping", (client, msg) => {
  client.emit("ping", msg);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
socketManager.start(PORT);

