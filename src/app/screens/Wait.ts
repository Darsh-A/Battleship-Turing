import { Container, Sprite, Text } from "pixi.js";
import { engine } from "../getEngine";

export class Wait extends Container {
    private BgImage: Sprite;
    private MusicButton: Sprite;
    private WaitingText: Text;

    public static assetBundles = ["main"];

    constructor() {
        super();

        this.BgImage = Sprite.from('loginBg.png');

        this.WaitingText = new Text({
            text: 'Waiting for opponent...',
            style: {
                fill: '#ffffff',
                fontSize: 52,
                fontFamily: 'Handjet',
                fontWeight: 'bold',
            },
        });
        this.WaitingText.anchor.set(0.5);

        this.MusicButton = Sprite.from('music.png');
        this.MusicButton.anchor.set(0.5);
        this.MusicButton.scale.set(0.25);
        this.MusicButton.interactive = true;
        this.MusicButton.x = 40;
        this.MusicButton.y = 40;

        this.MusicButton.on('pointerdown', () => {
            const currentMusic = engine().audio.bgm.current;
            if (currentMusic && currentMusic.isPlaying) {
                this.MusicButton.alpha = 0.5;
                currentMusic.pause();
            } else if (currentMusic && currentMusic.paused) {
                this.MusicButton.alpha = 1;
                currentMusic.resume();
            } else {
                this.MusicButton.alpha = 1;
                engine().audio.bgm.play('main/sounds/Outflow.mp3');
            }
        });

        this.addChild(this.BgImage);
        this.addChild(this.WaitingText);
        this.addChild(this.MusicButton);
    }

    public prepare() {}

    public resize(width: number, height: number) {
        this.BgImage.width = width;
        this.BgImage.height = height;

        this.WaitingText.x = width / 2;
        this.WaitingText.y = height / 2;
    }

    public async show(): Promise<void> {
        this.alpha = 1;
    }

    public async hide(): Promise<void> {
        
    }

    public blur() {}

    public destroy() {
        super.destroy();
    }
}


