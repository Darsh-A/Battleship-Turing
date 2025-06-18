import { io, Socket } from "socket.io-client";  
import { setEngine } from "./app/getEngine";

import { Login } from "./app/screens/Login";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";
import { Assets, Sprite } from "pixi.js";

import "@pixi/sound";
import { GameSetup } from "./app/screens/GameSetup";
import { Match } from "./app/screens/Match";
import { Wait } from "./app/screens/Wait";


const engine = new CreationEngine();
setEngine(engine);

const SOCKET_URL = "http://localhost:3000";
const socket: Socket = io(SOCKET_URL, { withCredentials: true });
engine.setSocket(socket);

(async () => {
	await engine.init({
		background: "#1E1E1E",
		resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
	});

	userSettings.init();
	await Assets.loadBundle("main");

	await engine.navigation.showScreen(Login, { socket });
})();
