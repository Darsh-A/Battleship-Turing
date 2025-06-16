import { Container, Sprite, Text, Graphics } from "pixi.js";
import { engine } from "../getEngine";

export class GameSetup extends Container {
    private BgImage: Sprite;
    private GameSetHeading: Text;
    private MusicButton: Sprite;
    private StartButton: Sprite;

    private QSetContainer: Container;
    private QSetHeading: Text;
    private QSetContentContainer: Container;
    private QSetMask: Graphics;

    private Team1: Text;
    private Team2: Text;
    private UserName: Text;

    private Team1Container: Container;
    private Team2Container: Container;
    private Team1Selected: string[] = [];
    private Team2Selected: string[] = [];
    private Team1SelectedContainers: Container[] = [];
    private Team2SelectedContainers: Container[] = [];

    private maxTypesPerTeam: number = 4;

    private Qtypes: string[] = ['Computer Science', 'Biology', 'Chemistry', 'Physics', 'Maths', 'History', 'Geography', 'Literature', 'Economics', 'Psychology'];
    private QtypeContainers: Container[] = [];

    private scrollY: number = 0;
    private maxScrollY: number = 0;
    private containerHeight: number = 400;
    private itemHeight: number = 80;

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
        this.GameSetHeading.anchor.set(0.5, 0);

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
        this.QSetHeading.anchor.set(0.5, 0);

        this.QSetContentContainer = new Container();
        
        this.QSetMask = new Graphics();
        this.QSetMask.rect(-200, 0, 400, this.containerHeight);
        this.QSetMask.fill(0xffffff);
        this.QSetContainer.addChild(this.QSetMask);
        
        this.QSetContentContainer.mask = this.QSetMask;

        this.QSetContainer.addChild(this.QSetHeading);
        this.QSetContainer.addChild(this.QSetContentContainer);

        this.QSetContainer.interactive = true;
        this.QSetContainer.on('wheel', this.onWheel.bind(this));

        this.Team1Container = new Container();
        this.Team2Container = new Container();

        this.createQuestionTypes();

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

        this.StartButton = Sprite.from('StartButton.png');
        this.StartButton.anchor.set(0.5);
        this.StartButton.scale.set(1.2);
        this.StartButton.interactive = true;
        this.StartButton.cursor = 'pointer';

        this.StartButton.on('pointerdown', () => {
            this.StartButton.scale.set(1.1);
            this.StartButton.alpha = 0.9;
        });

        this.StartButton.on('pointerup', () => {
            this.StartButton.scale.set(1.2);
            this.StartButton.alpha = 1.0;
            this.onStartButtonClicked();
        });

        this.StartButton.on('pointerupoutside', () => {
            this.StartButton.scale.set(1.2);
            this.StartButton.alpha = 1.0;
        });

        this.StartButton.on('pointerover', () => {
            this.StartButton.scale.set(1.3);
        });

        this.StartButton.on('pointerout', () => {
            this.StartButton.scale.set(1.2);
        });

        this.addChild(this.BgImage);
        this.addChild(this.GameSetHeading);
        this.addChild(this.MusicButton);
        this.addChild(this.QSetContainer);
        this.addChild(this.Team1);
        this.addChild(this.Team2);
        this.addChild(this.Team1Container);
        this.addChild(this.Team2Container);
        this.addChild(this.StartButton);
        this.addChild(this.UserName);
    }

    private createQuestionTypes() {
        this.Qtypes.forEach((qtypeName, index) => {
            const rowContainer = new Container();
            rowContainer.scale.set(0.8);

            const qtypeContainer = new Container();
            const qtypeBackground = Sprite.from('Container2Red.png');
            qtypeBackground.anchor.set(0.5);
            qtypeBackground.scale.set(0.8);
            qtypeContainer.addChild(qtypeBackground);

            const qtypeText = new Text({
                text: qtypeName,
                style: {
                    fill: '#ffffff',
                    fontSize: 32,
                    fontFamily: 'Handjet',
                    fontWeight: 'bold',
                },
            });
            qtypeText.anchor.set(0.5);
            qtypeContainer.addChild(qtypeText);

            qtypeContainer.x = 0;
            qtypeContainer.y = 50;
            rowContainer.addChild(qtypeContainer);

            
            const leftButton = Sprite.from('Play.svg');
            leftButton.interactive = true;
            leftButton.scale.set(-1.0, 1.0);
            leftButton.x = -qtypeBackground.width / 2;
            leftButton.y = 20;

            leftButton.on('pointerdown', () => {
                if (this.Team1Selected.length >= this.maxTypesPerTeam) return;
                leftButton.scale.set(-0.9, 0.9);
                leftButton.y += 3;
            });

            leftButton.on('pointerup', () => {
                if (this.Team1Selected.length >= this.maxTypesPerTeam) return;
                leftButton.scale.set(-1.0, 1.0);
                leftButton.y -= 3;
                this.moveToTeam1(qtypeName, index);
            });

            leftButton.on('pointerupoutside', () => {
                leftButton.scale.set(-1.0, 1.0);
                leftButton.y -= 3;
            });

            rowContainer.addChild(leftButton);

            
            const rightButton = Sprite.from('Play.svg');
            rightButton.interactive = true;
            rightButton.scale.set(1.0);
            rightButton.x = qtypeBackground.width / 2;
            rightButton.y = 20;

            rightButton.on('pointerdown', () => {
                if (this.Team2Selected.length >= this.maxTypesPerTeam) return;
                rightButton.scale.set(0.9);
                rightButton.y += 3;
            });

            rightButton.on('pointerup', () => {
                if (this.Team2Selected.length >= this.maxTypesPerTeam) return;
                rightButton.scale.set(1.0);
                rightButton.y -= 3;
                this.moveToTeam2(qtypeName, index);
            });

            rightButton.on('pointerupoutside', () => {
                rightButton.scale.set(1.0);
                rightButton.y -= 3;
            });

            rowContainer.addChild(rightButton);

            
            this.QtypeContainers.push(rowContainer);
            this.QSetContentContainer.addChild(rowContainer);
        });

        this.updateScrollBounds();
    }

    private moveToTeam1(qtypeName: string, originalIndex: number) {
        if (this.Team1Selected.length >= this.maxTypesPerTeam) {
            return;
        }

        this.Team1Selected.push(qtypeName);
        
        const containerIndex = this.Qtypes.indexOf(qtypeName);
        if (containerIndex > -1) {
            this.Qtypes.splice(containerIndex, 1);
            
            const container = this.QtypeContainers[containerIndex];
            this.QSetContentContainer.removeChild(container);
            this.QtypeContainers.splice(containerIndex, 1);
            
            const team1Container = this.createTeamContainer(qtypeName);
            this.Team1SelectedContainers.push(team1Container);
            this.Team1Container.addChild(team1Container);
            
            this.updateQTypePositions();
            this.updateTeamPositions();
            this.updateScrollBounds();
            this.updateButtonStates();
        }
    }

    private moveToTeam2(qtypeName: string, originalIndex: number) {
        if (this.Team2Selected.length >= this.maxTypesPerTeam) {
            return;
        }

        this.Team2Selected.push(qtypeName);
        
        const containerIndex = this.Qtypes.indexOf(qtypeName);
        if (containerIndex > -1) {
            this.Qtypes.splice(containerIndex, 1);
            
            const container = this.QtypeContainers[containerIndex];
            this.QSetContentContainer.removeChild(container);
            this.QtypeContainers.splice(containerIndex, 1);
            
            const team2Container = this.createTeamContainer(qtypeName);
            this.Team2SelectedContainers.push(team2Container);
            this.Team2Container.addChild(team2Container);
            
            this.updateQTypePositions();
            this.updateTeamPositions();
            this.updateScrollBounds();
            this.updateButtonStates();
        }
    }

    private createTeamContainer(qtypeName: string): Container {
        const rowContainer = new Container();
        rowContainer.scale.set(0.6);

        const qtypeContainer = new Container();
        const qtypeBackground = Sprite.from('Container2Red.png');
        qtypeBackground.anchor.set(0.5);
        qtypeBackground.scale.set(1);
        qtypeContainer.addChild(qtypeBackground);

        const qtypeText = new Text({
            text: qtypeName,
            style: {
                fill: '#ffffff',
                fontSize: 32,
                fontFamily: 'Handjet',
                fontWeight: 'bold',
            },
        });
        qtypeText.anchor.set(0.5);
        qtypeContainer.addChild(qtypeText);

        qtypeContainer.x = 0;
        qtypeContainer.y = 20;
        rowContainer.addChild(qtypeContainer);

        rowContainer.interactive = true;
        rowContainer.cursor = 'pointer';

        rowContainer.on('pointerdown', () => {
            rowContainer.scale.set(0.55);
        });

        rowContainer.on('pointerup', () => {
            rowContainer.scale.set(0.6);
            this.moveBackToQSet(qtypeName);
        });

        rowContainer.on('pointerupoutside', () => {
            rowContainer.scale.set(0.6);
        });

        return rowContainer;
    }

    private moveBackToQSet(qtypeName: string) {
        const team1Index = this.Team1Selected.indexOf(qtypeName);
        if (team1Index > -1) {
            this.moveFromTeam1(qtypeName, team1Index);
            return;
        }

        const team2Index = this.Team2Selected.indexOf(qtypeName);
        if (team2Index > -1) {
            this.moveFromTeam2(qtypeName, team2Index);
            return;
        }
    }

    private moveFromTeam1(qtypeName: string, teamIndex: number) {
        this.Team1Selected.splice(teamIndex, 1);
        
        const teamContainer = this.Team1SelectedContainers[teamIndex];
        this.Team1Container.removeChild(teamContainer);
        this.Team1SelectedContainers.splice(teamIndex, 1);
        
        this.addBackToQSet(qtypeName);
        
        this.updateTeamPositions();
        this.updateButtonStates();
    }

    private moveFromTeam2(qtypeName: string, teamIndex: number) {
        this.Team2Selected.splice(teamIndex, 1);
        
        const teamContainer = this.Team2SelectedContainers[teamIndex];
        this.Team2Container.removeChild(teamContainer);
        this.Team2SelectedContainers.splice(teamIndex, 1);
        
        this.addBackToQSet(qtypeName);
        
        this.updateTeamPositions();
        this.updateButtonStates();
    }

    private addBackToQSet(qtypeName: string) {
        this.Qtypes.push(qtypeName);
        
        const rowContainer = new Container();
        rowContainer.scale.set(0.8);

        const qtypeContainer = new Container();
        const qtypeBackground = Sprite.from('Container2Red.png');
        qtypeBackground.anchor.set(0.5);
        qtypeBackground.scale.set(0.8);
        qtypeContainer.addChild(qtypeBackground);

        const qtypeText = new Text({
            text: qtypeName,
            style: {
                fill: '#ffffff',
                fontSize: 32,
                fontFamily: 'Handjet',
                fontWeight: 'bold',
            },
        });
        qtypeText.anchor.set(0.5);
        qtypeContainer.addChild(qtypeText);

        qtypeContainer.x = 0;
        qtypeContainer.y = 50;
        rowContainer.addChild(qtypeContainer);

        const leftButton = Sprite.from('Play.svg');
        leftButton.interactive = true;
        leftButton.scale.set(-1.0, 1.0);
        leftButton.x = -qtypeBackground.width / 2;
        leftButton.y = 20;

        leftButton.on('pointerdown', () => {
            leftButton.scale.set(-0.9, 0.9);
            leftButton.y += 3;
        });

        leftButton.on('pointerup', () => {
            leftButton.scale.set(-1.0, 1.0);
            leftButton.y -= 3;
            this.moveToTeam1(qtypeName, this.Qtypes.length - 1);
        });

        leftButton.on('pointerupoutside', () => {
            leftButton.scale.set(-1.0, 1.0);
            leftButton.y -= 3;
        });

        rowContainer.addChild(leftButton);

        const rightButton = Sprite.from('Play.svg');
        rightButton.interactive = true;
        rightButton.scale.set(1.0);
        rightButton.x = qtypeBackground.width / 2;
        rightButton.y = 20;

        rightButton.on('pointerdown', () => {
            rightButton.scale.set(0.9);
            rightButton.y += 3;
        });

        rightButton.on('pointerup', () => {
            rightButton.scale.set(1.0);
            rightButton.y -= 3;
            this.moveToTeam2(qtypeName, this.Qtypes.length - 1);
        });

        rightButton.on('pointerupoutside', () => {
            rightButton.scale.set(1.0);
            rightButton.y -= 3;
        });

        rowContainer.addChild(rightButton);

        this.QtypeContainers.push(rowContainer);
        this.QSetContentContainer.addChild(rowContainer);
        
        this.updateQTypePositions();
        this.updateScrollBounds();
    }

    private updateQTypePositions() {
        this.QtypeContainers.forEach((container, index) => {
            container.x = 0;
            container.y = index * this.itemHeight;
        });
    }

    private updateTeamPositions() {
        this.Team1SelectedContainers.forEach((container, index) => {
            container.x = 0;
            container.y = index * 50;
        });

        this.Team2SelectedContainers.forEach((container, index) => {
            container.x = 0;
            container.y = index * 50;
        });
    }

    private onWheel(event: any) {
        const deltaY = event.deltaY;
        const scrollSpeed = 2;
        
        this.scrollY += deltaY * scrollSpeed;
        this.scrollY = Math.max(0, Math.min(this.scrollY, this.maxScrollY));
        
        this.updateScrollPosition();
    }

    private updateScrollBounds() {
        const totalContentHeight = this.QtypeContainers.length * this.itemHeight;
        const visibleHeight = this.containerHeight - 45;
        this.maxScrollY = Math.max(0, totalContentHeight - visibleHeight);
    }

    private updateScrollPosition() {
        this.QSetContentContainer.y = -130 - this.scrollY;
    }

    public prepare() { }

    public resize(width: number, height: number) {
        this.BgImage.width = width;
        this.BgImage.height = height;

        this.GameSetHeading.x = width / 2;
        this.GameSetHeading.y = 100;

        this.QSetContainer.x = width / 2;
        this.QSetContainer.y = height / 2;

        this.QSetHeading.x = 0;
        this.QSetHeading.y = -220;

        this.QSetMask.clear();
        this.QSetMask.rect(-200, -150, 400, this.containerHeight - 40);
        this.QSetMask.fill(0xffffff);

        this.updateQTypePositions();

        this.updateScrollBounds();
        this.updateScrollPosition();

        this.Team1.x = this.QSetContainer.x - this.QSetContainer.width;
        this.Team1.y = this.QSetContainer.y - this.QSetContainer.height / 2 + 80;

        this.Team2.x = this.QSetContainer.x + this.QSetContainer.width;
        this.Team2.y = this.QSetContainer.y - this.QSetContainer.height / 2 + 80;

        this.Team1Container.x = this.Team1.x;
        this.Team1Container.y = this.Team1.y + 60;

        this.Team2Container.x = this.Team2.x;
        this.Team2Container.y = this.Team2.y + 60;

        this.updateTeamPositions();

        this.StartButton.x = width / 2;
        this.StartButton.y = this.QSetContainer.y + this.QSetContainer.height / 2 + 80;

        this.UserName.x = width - 20;
        this.UserName.y = height - 20;
    }

    public async show(): Promise<void> {
        this.alpha = 1;
    }

    public async hide(): Promise<void> {

    }

    public blur() { }

    public destroy() {
        super.destroy();
    }

    private updateButtonStates() {
        const team1Full = this.Team1Selected.length >= this.maxTypesPerTeam;
        const team2Full = this.Team2Selected.length >= this.maxTypesPerTeam;

        this.QtypeContainers.forEach(container => {
            const leftButton = container.children[1] as Sprite; // Left arrow button
            const rightButton = container.children[2] as Sprite; // Right arrow button

            // Update left button (Team 1)
            if (team1Full) {
                leftButton.alpha = 0.3;
                leftButton.interactive = false;
            } else {
                leftButton.alpha = 1.0;
                leftButton.interactive = true;
            }

            // Update right button (Team 2)
            if (team2Full) {
                rightButton.alpha = 0.3;
                rightButton.interactive = false;
            } else {
                rightButton.alpha = 1.0;
                rightButton.interactive = true;
            }
        });
    }

    private onStartButtonClicked() {
        console.log('Start button clicked!');
        console.log('Team 1 selected:', this.Team1Selected);
        console.log('Team 2 selected:', this.Team2Selected);
        
        // Example: You could navigate to the next screen or start the game
        // engine().navigation.showScreen(NextScreen);
    }
}
