import { io, Socket } from "socket.io-client";

interface Events {
	lobby_joined: { lobbyId: string; playerId: string };
}

export const socket: Socket<Events, Record<string, unknown>> = io(
	process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined,
);
