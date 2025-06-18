import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

export interface MessageMap {
	[event: string]: unknown;
}

export class SocketManager<M extends MessageMap> {
	readonly app: express.Express;
	readonly http: ReturnType<typeof createServer>;
	readonly io: Server;

	private handlers: Partial<{
		[K in keyof M]: ((s: Socket, d: M[K]) => void)[];
	}> = {};

	constructor() {
		this.app = express();
		this.app.use(
			cors({
				origin: "http://localhost:8080",
				methods: ["GET", "POST"],
				credentials: true,
			}),
		);

		this.http = createServer(this.app);
		this.io = new Server(this.http, {
			cors: {
				origin: "http://localhost:8080",
				methods: ["GET", "POST"],
				credentials: true,
			},
		});
	}

	start(port: number) {
		this.io.on("connection", (socket) => this.bind(socket));
		this.http.listen(port, () => {
			console.log(`Server listening on ${port}`);
		});
	}

	on<K extends keyof M>(event: K, fn: (socket: Socket, payload: M[K]) => void) {
		const list = this.handlers[event] ?? [];
		list.push(fn);
		this.handlers[event] = list;
	}

	emit<K extends keyof M>(event: K, payload: M[K]) {
		this.io.emit(event as string, payload);
	}

	private bind(socket: Socket) {
		socket.onAny((event: string, payload: unknown) => {
			const fns = (
				this.handlers as Record<
					string,
					((s: Socket, d: unknown) => void)[] | undefined
				>
			)[event];
			fns?.forEach((fn) => fn(socket, payload));
		});
	}
}
