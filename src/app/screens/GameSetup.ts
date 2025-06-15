import { Container, Sprite, Text } from "pixi.js";
import { engine } from "../getEngine";

export class GameSetup extends Container {
    private BgImage: Sprite;
    private GameSetHeading: Text;
    private MusicButton: Sprite;

    private QSetContainer: Container;
    private QSetHeading: Text;

    private Team1: Text;
    private Team2: Text;
    private UserName: Text; // To show logged in user name

    public static assetBundles = ["main"];

    constructor() {
        super();

        this.BgImage = Sprite.from('loginBg.png');

        this.GameSetHeading = new Text({
            text: 'S e t u p',
            style: {
                fill: '#6afab2',
                fontSize: 84,
                fontFamily: 'HUMANOID',
                
            },
        });
        this.GameSetHeading.anchor.set(0.5,0);

        this.QSetContainer = new Container();
        const QSetBackground = Sprite.from('Container1.png');
        QSetBackground.anchor.set(0.5);
        QSetBackground.scale.set(1.1);
        this.QSetContainer.addChild(QSetBackground);

        this.QSetHeading = new Text({

            text: 'Question Set',
            style: {
                fill: '#9EF0CF',
                fontSize: 52,
                fontFamily: 'Handjet',
                fontWeight: 'bold',
            },
        });
        this.QSetHeading.anchor.set(0.5,0);

        this.QSetContainer.addChild(this.QSetHeading);

        this.Team1 = new Text({
            text: 'Team 1',
            style: {
                fill: '#ffffff',
                fontSize: 52,
                fontFamily: 'Handjet',
                fontWeight: 'bold',
            },
        });
        this.Team1.anchor.set(0.5);

        this.Team2 = new Text({
            text: 'Team 2',
            style: {
                fill: '#ffffff',
                fontSize: 52,
                fontFamily: 'Handjet',
                fontWeight: 'bold',
            },
        });
        this.Team2.anchor.set(0.5);

        this.UserName = new Text({
            text: 'Team: Ardo',
            style: {
                fill: '#6afab2',
                fontSize: 32,
                fontFamily: 'Handjet',
            },
        });
        this.UserName.anchor.set(1);






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
        this.addChild(this.GameSetHeading);
        this.addChild(this.MusicButton);
        this.addChild(this.QSetContainer);
        this.addChild(this.Team1);
        this.addChild(this.Team2);
        this.addChild(this.UserName);
    }

    public prepare() {}

    public resize(width: number, height: number) {
        this.BgImage.width = width;
        this.BgImage.height = height;

        this.GameSetHeading.x = width / 2;
        this.GameSetHeading.y = 100;

        this.QSetContainer.x = width / 2;
        this.QSetContainer.y = height / 2;

        this.QSetHeading.x = 0;
        this.QSetHeading.y = -this.QSetContainer.height / 2 + 55;

        this.Team1.x = this.QSetContainer.x - this.QSetContainer.width ;
        this.Team1.y = this.QSetContainer.y - this.QSetContainer.height / 2 + 80;

        this.Team2.x = this.QSetContainer.x + this.QSetContainer.width;
        this.Team2.y = this.QSetContainer.y - this.QSetContainer.height / 2 + 80;

        this.UserName.x = width - 20;
        this.UserName.y = height - 20;
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
