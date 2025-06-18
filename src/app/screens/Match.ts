import { Container, Sprite, Text } from "pixi.js";
import { engine } from "../getEngine";
import { Input } from "@pixi/ui";
import { Wait } from "./Wait";
import type { Socket } from "socket.io-client";
import type { PlayerStats } from "../../../server/lib/database/players";
import { ErrorPopup } from "../popups/ErrorPopup";

interface MatchProps {
	socket: Socket;
	userData: {
		username: string;
		password: string;
	};
	playerId: string;
	stats: PlayerStats;
}

export class Match extends Container {
	private socket: Socket;
	private userData: { username: string; password: string };
	private playerId: string;
	private stats: PlayerStats;

	private BgImage: Sprite;
	private MusicButton: Sprite;
	private UserName: Text;

	private CreateInput: Input;
	private JoinInput: Input;
	private CreateHeading: Text;
	private JoinHeading: Text;
	private CreateButton: Sprite;
	private JoinButton: Sprite;

	private MatchesListContainer: Container;
	private MatchesHeading: Text;

	public static assetBundles = ["main"];

	constructor({ socket, userData, playerId, stats }: MatchProps) {
		super();
		this.socket = socket;
		this.userData = userData;
		this.playerId = playerId;
		this.stats = stats;

		this.BgImage = Sprite.from("loginBg.png");

		this.UserName = new Text({
			text: `Player: ${this.userData.username}`,
			style: {
				fill: "#6afab2",
				fontSize: 32,
				fontFamily: "Handjet",
			},
		});
		this.UserName.anchor.set(1);

		this.CreateInput = new Input({
			bg: "Box2Big.svg",
			placeholder: "",
			align: "center",
			textStyle: {
				fill: "#ffffff",
				fontSize: 32,
				fontFamily: "Handjet",
			},
			padding: { top: 10, bottom: 20, left: 10, right: 10 },
		});
		this.CreateInput.scale.set(1.5);

		this.JoinInput = new Input({
			bg: "Box2Big.svg",
			placeholder: "",
			align: "center",
			textStyle: {
				fill: "#ffffff",
				fontSize: 32,
				fontFamily: "Handjet",
			},
			padding: { top: 10, bottom: 20, left: 10, right: 10 },
		});
		this.JoinInput.scale.set(1.5);

		this.CreateHeading = new Text({
			text: "CREATE",
			style: {
				fill: "#ffffff",
				fontSize: 52,
				fontFamily: "Handjet",
				fontWeight: "bold",
			},
		});
		this.CreateHeading.anchor.set(1, 0);

		this.JoinHeading = new Text({
			text: "JOIN",
			style: {
				fill: "#ffffff",
				fontSize: 52,
				fontFamily: "Handjet",
				fontWeight: "bold",
			},
		});
		this.JoinHeading.anchor.set(1, 0);

		this.CreateButton = Sprite.from("Play.svg");
		this.CreateButton.interactive = true;
		this.CreateButton.scale.set(1.3);

		this.CreateButton.on("pointerdown", () => {
			this.CreateButton.scale.set(1.2);
			this.CreateButton.y += 3;
		});

		this.CreateButton.on("pointerup", () => {
			this.CreateButton.scale.set(1.3);
			this.CreateButton.y -= 3;
			this.socket.emit("create_lobby", {
				username: this.userData.username,
				password: this.userData.password,
				lobbyName: this.CreateInput.value,
			});
		});
		this.socket.on("lobby_already_exists", ({ lobbyName }) => {
			ErrorPopup.setMessage(`Lobby ${lobbyName} already exists`);
			console.log(`[ERROR] Already exists Lobby: ${lobbyName}`);
		});
		this.socket.once("lobby_created", ({ lobbyId, playerId }) => {
			// [TODO] Where do we want to navigate from here?
			// [REPLY] To Wait.ts > GameSetup.ts ; Wait is if no person from other team has joined yet.
			// 	   Once theres more than one person in each team move to Gamesetup.
			//	   Teams can wait for all their members before starting.
			console.log(`[DEBUG] Player ${playerId} joined Lobby: ${lobbyId}`);
		});

		this.CreateButton.on("pointerupoutside", () => {
			this.CreateButton.scale.set(1.3);
			this.CreateButton.y -= 3;
		});

		this.JoinButton = Sprite.from("Play.svg");
		this.JoinButton.interactive = true;
		this.JoinButton.scale.set(1.3);

		this.JoinButton.on("pointerdown", () => {
			this.JoinButton.scale.set(1.2);
			this.JoinButton.y += 3;
		});

		this.JoinButton.on("pointerup", () => {
			this.JoinButton.scale.set(1.3);
			this.JoinButton.y -= 3;
			this.socket.emit("join_lobby", {
				username: this.userData.username,
				password: this.userData.password,
				lobbyName: this.JoinInput.value,
			});
		});
		this.socket.on("lobby_not_found", ({ lobbyName }) => {
			ErrorPopup.setMessage(`Lobby ${lobbyName} not found`);
			console.log(`[ERROR] Not found Lobby: ${lobbyName}`);
		});
		this.socket.once("lobby_joined", ({ lobbyId, playerId }) => {
			// [TODO] Where do we want to navigate from here?
			// [REPLY] To Gamesetup.ts as theres no req for Wait.ts
			console.log(`[DEBUG] Player ${playerId} joined Lobby: ${lobbyId}`);
		});

		this.JoinButton.on("pointerupoutside", () => {
			this.JoinButton.scale.set(1.3);
			this.JoinButton.y -= 3;
		});

		this.MatchesListContainer = new Container();
		this.MatchesListContainer.scale.set(1.5);

		this.MatchesHeading = new Text({
			text: "MATCHES",
			style: {
				fill: "#ffffff",
				fontSize: 52,
				fontFamily: "Handjet",
				fontWeight: "bold",
			},
		});

		const containerBackground = Sprite.from("Container1.png");
		containerBackground.anchor.set(0, 0.5);
		this.MatchesListContainer.addChild(containerBackground);

		this.MusicButton = Sprite.from("music.png");
		this.MusicButton.anchor.set(0.5);
		this.MusicButton.scale.set(0.25);
		this.MusicButton.interactive = true;
		this.MusicButton.x = 40;
		this.MusicButton.y = 40;

		this.MusicButton.on("pointerdown", () => {
			const currentMusic = engine().audio.bgm.current;
			if (currentMusic && currentMusic.isPlaying) {
				this.MusicButton.alpha = 0.5;
				currentMusic.pause();
			} else if (currentMusic && currentMusic.paused) {
				this.MusicButton.alpha = 1;
				currentMusic.resume();
			} else {
				this.MusicButton.alpha = 1;
				engine().audio.bgm.play("main/sounds/Outflow.mp3");
			}
		});

		this.addChild(this.BgImage);
		this.addChild(this.MatchesListContainer);
		this.addChild(this.MatchesHeading);
		this.addChild(this.MusicButton);
		this.addChild(this.UserName);
		this.addChild(this.CreateInput);
		this.addChild(this.JoinInput);
		this.addChild(this.CreateHeading);
		this.addChild(this.JoinHeading);
		this.addChild(this.CreateButton);
		this.addChild(this.JoinButton);

		this.renderStats(stats);
	}
	// [TODO] Dorsh take look at this
	private renderStats(s: PlayerStats) {
		const entries: [string, number][] = [
			["Matches Played", s.totalMatchesPlayed],
			["Wins", s.totalWins],
			["Losses", s.totalLosses],
			["Components Destroyed", s.totalComponentsDestroyed],
			["Mines Triggered", s.totalMinesTriggered],
		];

		entries.forEach(([label, value], i) => {
			const txt = new Text({
				text: `${label}: ${value}`,
				style: {
					fill: "#ffffff",
					fontSize: 24,
					fontFamily: "Handjet",
				},
			});
			txt.x = 20;
			txt.y = 80 + i * 30;
			this.MatchesListContainer.addChild(txt);
		});
	}

	public prepare() {}

	public resize(width: number, height: number) {
		this.BgImage.width = width;
		this.BgImage.height = height;

		this.MatchesListContainer.x = 100;
		this.MatchesListContainer.y = height / 2;

		this.MatchesHeading.x =
			this.MatchesListContainer.x + this.MatchesListContainer.width / 2 - 70;
		this.MatchesHeading.y =
			this.MatchesListContainer.y - this.MatchesListContainer.height / 2 + 70;

		this.UserName.x = width - 20;
		this.UserName.y = height - 20;

		this.CreateInput.x = width - width / 2.2;
		this.CreateInput.y = height / 3.3;

		this.CreateHeading.x = this.CreateInput.x + this.CreateInput.width / 2 + 60;
		this.CreateHeading.y = this.CreateInput.y - 60;

		this.JoinHeading.x = this.CreateInput.x + this.CreateInput.width / 2 + 55;
		this.JoinHeading.y = this.CreateInput.y + this.CreateInput.height + 40;

		this.JoinInput.x = this.CreateInput.x;
		this.JoinInput.y = this.JoinHeading.y + this.JoinHeading.height;

		this.CreateButton.x = this.CreateInput.x + this.CreateInput.width + 20;
		this.CreateButton.y = this.CreateInput.y + this.CreateInput.height / 4 - 10;

		this.JoinButton.x = this.JoinInput.x + this.JoinInput.width + 20;
		this.JoinButton.y = this.JoinInput.y + this.JoinInput.height / 4 - 10;
	}

	public async show(): Promise<void> {
		this.alpha = 1;
	}

	public async hide(): Promise<void> {}

	public blur() {}

	public destroy() {
		super.destroy();
	}
}
