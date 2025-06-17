import { Container, Text, Sprite, Ticker } from "pixi.js";
import { Match } from "./Match";
import { engine } from "../getEngine";
import { Input } from "@pixi/ui";
import type { Socket } from "socket.io-client";

interface LoginProps {
	socket: Socket;
}

export class Login extends Container {
	private socket: Socket;

	private Heading: Text;
	private SubHeading: Text;
	private BgImage: Sprite;
	private PlayButton: Sprite;
	private MusicButton: Sprite;

	private UsernameHeading: Text;
	private PasswordHeading: Text;

	private usernameInput: Input;
	private passwordInput: Input;

	private animationTicker: Ticker;
	private baseHeadingY = 0;
	private animationTime = 0;

	public static assetBundles = ["main"];

	constructor({ socket }: LoginProps) {
		super();
		this.socket = socket;

		engine().audio.bgm.play("main/sounds/Outflow.mp3");

		this.BgImage = Sprite.from("loginBg.png");

		this.SubHeading = new Text({
			text: "by Turing",
			style: {
				fill: "#6afab2",
				fontSize: 48,
				fontFamily: "HUMANOID",
			},
		});
		this.SubHeading.anchor.set(0.5);

		this.Heading = new Text({
			text: "Breach",
			style: {
				fill: "#6afab2",
				fontSize: 148,
				fontFamily: "HUMANOID",
			},
		});
		this.Heading.anchor.set(0.5);

		// Create username input
		this.usernameInput = new Input({
			bg: "Box1-White.png",
			placeholder: "",
			maxLength: 20,
			align: "center",
			textStyle: {
				fill: "#ffffff",
				fontSize: 52,
				fontFamily: "Handjet",
			},
			padding: 10,
		});
		this.usernameInput.scale.set(0.8);

		// Create password input
		this.passwordInput = new Input({
			bg: "Box1-White.png",
			placeholder: "",
			maxLength: 20,
			align: "center",
			textStyle: {
				fill: "#ffffff",
				fontSize: 52,
				fontFamily: "Handjet",
			},
			padding: 10,
		});
		this.passwordInput.scale.set(0.8);

		this.PlayButton = Sprite.from("PlayButton.png");
		this.PlayButton.anchor.set(0.5);
		this.PlayButton.scale.set(0.65);
		this.PlayButton.interactive = true;

		this.PlayButton.on("pointerdown", () => {
			const data = {
				username: this.usernameInput._value.trim(),
				password: this.passwordInput._value,
			};

			if (!data.username || !data.password) return;
			console.log(`${data.username} logged in with password ${data.password}`);
			engine().audio.sfx.play("main/sounds/Blip11.wav");
			engine().navigation.showScreen(Match, { socket, userData: data });
		});
		this.PlayButton.on("pointerover", () => {
			this.PlayButton.scale.set(0.7);
			this.PlayButton.y += 10;
		});
		this.PlayButton.on("pointerout", () => {
			this.PlayButton.scale.set(0.65);
			this.PlayButton.y -= 10;
		});

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

		this.PasswordHeading = new Text({
			text: "Password",
			style: {
				fill: "#ffffff",
				fontSize: 48,
				fontFamily: "Handjet",
				fontWeight: "bold",
			},
		});
		this.PasswordHeading.anchor.set(0.5);

		this.UsernameHeading = new Text({
			text: "Username",
			style: {
				fill: "#ffffff",
				fontSize: 48,
				fontFamily: "Handjet",
				fontWeight: "bold",
			},
		});
		this.UsernameHeading.anchor.set(0.5);

		this.addChild(this.BgImage);
		this.addChild(this.Heading);
		this.addChild(this.SubHeading);
		this.addChild(this.MusicButton);

		this.addChild(this.usernameInput);
		this.addChild(this.UsernameHeading);

		this.addChild(this.passwordInput);
		this.addChild(this.PasswordHeading);

		this.addChild(this.PlayButton);
		// Initialize animation ticker
		this.animationTicker = new Ticker();
		this.animationTicker.add(this.animateHeading, this);
	}

	private animateHeading(ticker: Ticker) {
		this.animationTime += ticker.deltaTime * 0.12;

		const bounceAmount = Math.cos(this.animationTime) * 4; // 8 pixels bounce range
		this.Heading.y = this.baseHeadingY + bounceAmount;

		this.SubHeading.y = this.baseHeadingY + 100 + bounceAmount;
	}

	public prepare() {}

	public resize(width: number, height: number) {
		this.BgImage.width = width;
		this.BgImage.height = height;

		const centerX = width / 2;

		// Set pivot points to center the inputs
		this.usernameInput.pivot.set(
			this.usernameInput.width / 2,
			this.usernameInput.height / 2,
		);
		this.passwordInput.pivot.set(
			this.passwordInput.width / 2,
			this.passwordInput.height / 2,
		);
		this.Heading.x = centerX;
		this.baseHeadingY = height * 0.15;
		this.Heading.y = this.baseHeadingY;

		this.SubHeading.x = centerX;
		this.SubHeading.y = this.baseHeadingY + 100;

		this.usernameInput.x = centerX - 49;
		this.usernameInput.y = height / 2.3;

		this.UsernameHeading.x = centerX;
		this.UsernameHeading.y = this.usernameInput.y - 65;

		this.passwordInput.x = centerX - 49;
		this.passwordInput.y = this.usernameInput.y + 170;

		this.PasswordHeading.x = centerX;
		this.PasswordHeading.y = this.passwordInput.y - 65;

		this.PlayButton.x = centerX;
		this.PlayButton.y = this.passwordInput.y + 150;
	}

	public async show(): Promise<void> {
		this.alpha = 1;

		this.animationTicker.start();
	}

	public async hide(): Promise<void> {
		this.animationTicker.stop();
	}

	public blur() {}

	public destroy() {
		this.animationTicker.destroy();
		this.usernameInput.destroy();
		this.passwordInput.destroy();
		super.destroy();
	}
}
