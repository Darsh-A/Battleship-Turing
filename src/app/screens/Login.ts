import { Container, Text, Sprite, Ticker } from "pixi.js";


export class Login extends Container {

    private Heading: Text;
    private SubHeading: Text;
    private BgImage: Sprite;
    private box1: Sprite;
    private UsernameHeading: Text;
    private box2: Sprite;
    private PasswordHeading: Text;
    private PlayButton: Sprite;

    private animationTicker: Ticker;
    private baseHeadingY: number = 0;
    private animationTime: number = 0;

    public static assetBundles = ["main"];
    
    constructor() {
        super();

        this.BgImage = Sprite.from('loginBg.png');

        this.SubHeading = new Text({
            text: 'by Turing',
            style: {
                fill: '#6afab2',
                fontSize: 48,
                fontFamily: 'HUMANOID',
            },
        });
        this.SubHeading.anchor.set(0.5);

        this.Heading = new Text({
          text: 'Breach',
          style: {
            fill: '#6afab2',
            fontSize: 148,
            fontFamily: 'HUMANOID',
          },
        });
        this.Heading.anchor.set(0.5);

       
        this.box1 = Sprite.from('Box1-White.png');
        this.box1.anchor.set(0.5);
        this.box1.scale.set(0.75);

        this.box2 = Sprite.from('Box1-White.png');
        this.box2.anchor.set(0.5);
        this.box2.scale.set(0.75);

        this.PlayButton = Sprite.from('PlayButton.png');
        this.PlayButton.anchor.set(0.5);
        this.PlayButton.scale.set(0.65);
        this.PlayButton.interactive = true;
        this.PlayButton.on('pointerdown', () => {
            console.log('Play button clicked');
        });
        this.PlayButton.on('pointerover', () => {
            this.PlayButton.scale.set(0.70);
            this.PlayButton.y += 10;
            
        });
        this.PlayButton.on('pointerout', () => {
            this.PlayButton.scale.set(0.65);
            this.PlayButton.y -= 10;
        });


        this.PasswordHeading = new Text({

            text: 'Password',
            style: {
                fill: '#ffffff',
                fontSize: 48,
                fontFamily: 'Handjet',
            },
        });
        this.PasswordHeading.anchor.set(0.5);

        this.UsernameHeading = new Text({
            text: 'Username',
            style: {
                fill: '#ffffff',
                fontSize: 48,
                fontFamily: 'Handjet',
            },
        });
        this.UsernameHeading.anchor.set(0.5);
    
        
        this.addChild(this.BgImage);
        this.addChild(this.Heading);
        this.addChild(this.SubHeading);
        this.addChild(this.box1);
        this.addChild(this.UsernameHeading);
        this.addChild(this.box2);
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

        
        this.Heading.x = width / 2;
        this.baseHeadingY = height * 0.15;
        this.Heading.y = this.baseHeadingY;

        this.SubHeading.x = width / 2;
        this.SubHeading.y = this.baseHeadingY + 100;

        this.box1.x = width / 2;
        this.box1.y = height / 2.3;

        // align it above the box1
        this.UsernameHeading.x = width / 2;
        this.UsernameHeading.y = this.box1.y - 70;

        this.box2.x = width / 2;
        this.box2.y = this.box1.y + 150;

        this.PasswordHeading.x = width / 2;
        this.PasswordHeading.y = this.box2.y - 70;

        this.PlayButton.x = width / 2;
        this.PlayButton.y = this.box2.y + 150;

    }

    public async show(): Promise<void> {
        this.alpha = 1;

        this.animationTicker.start();
    }

    public async hide(): Promise<void> {

        this.animationTicker.stop();
    }

    public blur() {

    }

    public destroy() {
        
        this.animationTicker.destroy();
        super.destroy();
    }
}