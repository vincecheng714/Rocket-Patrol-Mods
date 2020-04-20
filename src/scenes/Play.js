class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }

    preload()
    {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion','./assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio('spacefunk', ['assets/spacefunk.mp3', 'assets/spacefunk.mp3']);

    }
    create()
    {   
        //music
        this.sound.play('spacefunk');
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFACADE).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        console.log(this.input);
        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width,260, 'spaceship', 0, 10).setOrigin(0, 0);
        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        this.anims.create(
            {
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
                frameRate: 30
            });

        // score
        this.p1Score = 0;
        
        

        // p1 score display
        let p1scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#0000FF',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.p1score = this.add.text(69, 54, this.p1Score, p1scoreConfig);
        this.p1hiscore = this.add.text(200, 54, hiScore, p1scoreConfig);

        // p2 score display
        let p2scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.p2score = this.add.text(480, 54, p2Score, p2scoreConfig);

        // game over flag
        this.gameOver = false;

        let display = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // 60-second play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', display).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', display).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }
    

    update()
    {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
        this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // scroll starfield
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver)
        {
            // update rocket
            this.p1Rocket.update();

            // update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        
        
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        
        
        
        
    }
    
    checkCollision(rocket, ship)
        {
            // simple AABB checking
            if (rocket.x < ship.x + ship.width &&
                rocket.x + rocket.width > ship.x &&
                rocket.y < ship.y + ship.height &&
                rocket.height + rocket.y > ship.y)
                {
                    return true;
                } else
                {
                    return false;
                }
        }
    shipExplode(ship)
    {
        ship.alpha = 0; // temp hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { //callback after animation completes
            ship.reset();   // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });

        // score increment and repaint
        this.p1Score += ship.points;
        this.p1score.text = this.p1Score;
        // score checker
        if(this.p1Score > hiScore)
        {
            hiScore = this.p1Score;
            this.p1hiscore.text = hiScore;
        }
        console.log(p2Score);
        this.p2score.text = p2Score;
        this.sound.play('sfx_explosion');
    }
    /*updateScores()
    {
        this.p2score.text = this.p2Score;
    }*/
}