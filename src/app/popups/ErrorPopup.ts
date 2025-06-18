import { Container, Sprite, Text } from "pixi.js";
import { engine } from "../getEngine";

export class ErrorPopup extends Container {
	/** Static property to store the error message */
	public static currentMessage: string = "An error occurred";

	private errorContainer: Container;
	private background: Sprite;
	private title: Text;
	private errorMessage: Text;
	private okButton: Sprite;

	/** Static method to set the error message before showing the popup */
	public static setMessage(message: string) {
		ErrorPopup.currentMessage = message;
	}

	constructor() {
		super();

		// Create main error container
		this.errorContainer = new Container();
        
		this.addChild(this.errorContainer);

		// Create background using Error.png
		this.background = Sprite.from("Error.png");
		this.background.anchor.set(0.5);
		this.background.scale.set(2); // Scale up the background to fit content
		this.errorContainer.addChild(this.background);

		// Create title text "ERROR"
		this.title = new Text({
			text: "ERROR",
			style: {
				fill: "#F55558",
				fontSize: 48,
				fontFamily: "Handjet",
				fontWeight: "bold",
				align: "center",
                stroke: "#272626",
                strokeThickness: 4,
			},
		});
		this.title.anchor.set(0.5);
		this.title.y = -130; // Position at top of the larger container
		this.errorContainer.addChild(this.title);

		// Create error message text below the title
		this.errorMessage = new Text({
			text: ErrorPopup.currentMessage,
			style: {
				fill: "#272626",
				fontSize: 28,
				fontFamily: "Handjet",
				fontWeight: "bold",
				align: "center",
				wordWrap: true,
				wordWrapWidth: 230, // Reduced width for more left/right padding
			},
		});
		this.errorMessage.anchor.set(0.5);
		this.errorMessage.y = -20; // Position in the middle area
		this.errorContainer.addChild(this.errorMessage);

		// Create OK button
		this.okButton = Sprite.from("OK_Button.png");
		this.okButton.anchor.set(0.5);
		this.okButton.interactive = true;
		this.okButton.cursor = "pointer";
		this.okButton.y = 100; // Position at bottom of the larger container

		// Add button interactions
		this.okButton.on("pointerdown", () => {
			this.okButton.scale.set(0.95);
			this.okButton.alpha = 0.8;
		});

		this.okButton.on("pointerup", () => {
			this.okButton.scale.set(1.0);
			this.okButton.alpha = 1.0;
			engine().navigation.dismissPopup();
		});

		this.okButton.on("pointerupoutside", () => {
			this.okButton.scale.set(1.0);
			this.okButton.alpha = 1.0;
		});

		this.okButton.on("pointerover", () => {
			this.okButton.scale.set(1.05);
		});

		this.okButton.on("pointerout", () => {
			this.okButton.scale.set(1.0);
		});

		this.errorContainer.addChild(this.okButton);
	}

	public resize(width: number, height: number) {
		// Center the error container in the screen
		this.errorContainer.x = width / 2;
		this.errorContainer.y = height / 2;
	}

	public async show(): Promise<void> {
		// Update the error message text in case it changed
		this.errorMessage.text = ErrorPopup.currentMessage;
		
		this.alpha = 0;
		// Simple fade-in animation
		const fadeIn = () => {
			this.alpha += 0.1;
			if (this.alpha < 1) {
				requestAnimationFrame(fadeIn);
			}
		};
		fadeIn();
	}

	public async hide(): Promise<void> {
		// Simple fade-out animation
		const fadeOut = () => {
			this.alpha -= 0.1;
			if (this.alpha > 0) {
				requestAnimationFrame(fadeOut);
			}
		};
		fadeOut();
	}
}
