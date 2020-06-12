/// <reference path="../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class App extends Phaser.Game {
        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Game.Boot, false);
            this.state.add('Preloader', Game.Preloader, false);
            this.state.add('MainMenu', Game.MainMenu, false);
            this.state.add('Gameplay', Game.Gameplay, false);
            this.state.start('Boot', true, true);
        }
    }
    Game.App = App;
})(Game || (Game = {}));
window.onload = () => {
    var game = new Game.App();
};
/// <reference path="../../lib/typescript/phaser.d.ts"/>
// +++ Pool of bullets sprites
var Game;
(function (Game) {
    class BulletsPool extends Phaser.Group {
        constructor(game, key, amount, isPlayer = false) {
            super(game);
            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;
            this.isPlayer = isPlayer;
            this.createMultiple(amount, 'mainSheet', key);
            this.setAll('anchor.x', 0.5);
            this.setAll('anchor.y', 1);
        }
        resetBullet(x, y, speed, rotate = false) {
            let bullet;
            bullet = this.getFirstDead(true);
            bullet.reset(x, y);
            bullet.body.velocity.y = speed;
            rotate ? bullet.scale.setTo(1, -1) : null;
        }
        update() {
            this.forEachAlive(this.checkBounds, this);
        }
        checkBounds(child) {
            if (this.isPlayer) {
                if (child.y + child.height < 0) {
                    child.kill();
                }
            }
            else {
                if (child.y - child.height > this.game.height) {
                    child.kill();
                }
            }
        }
    }
    Game.BulletsPool = BulletsPool;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class EnemiesManager {
        constructor(game, group, bulletsPool) {
            this.game = game;
            this.group = group;
            this.enemies = [];
            this.waveTimer = 1000 * 1;
            this.lastPosX = Game.ScreenPos.center;
            this.createPools();
        }
        createPools() {
            let enemyType;
            for (let i = 0; i < Game.Settings.ENEMIES_KEYS.length; i++) {
                enemyType = i;
                this.enemies[i] = new Game.EnemiesPool(this.game, 5, enemyType, this.group);
            }
        }
        selectNextWave() {
            let type;
            let pos;
            type = this.game.rnd.pick([Game.EnemyType.black, Game.EnemyType.blue, Game.EnemyType.green, Game.EnemyType.red]);
            do {
                pos = this.game.rnd.pick([Game.ScreenPos.left, Game.ScreenPos.center, Game.ScreenPos.right]);
            } while (pos === this.lastPosX);
            this.lastPosX = pos;
            console.log('\n--Next Wave : ' + Game.Settings.ENEMIES_KEYS[type] + ' / ' + pos);
            return type;
        }
        releaseNewWave() {
            let amountEnemies = 5;
            let waveType = this.selectNextWave();
            let posX;
            let first;
            posX = Game.Settings.SCREEN_X[this.lastPosX];
            for (let i = 0; i < amountEnemies; i++) {
                let enemy;
                enemy = this.enemies[waveType].getDeadEnemy();
                first = i === 0 ? true : false;
                enemy.resetOn(this.game.width * posX, -enemy.height + -(i * enemy.height * 1.2), first);
            }
        }
        getEnemies() {
            return this.enemies;
        }
        update(player) {
            if (this.waveTimer > 0) {
                this.waveTimer -= this.game.time.elapsedMS;
                if (this.waveTimer <= 0) {
                    this.waveTimer = 1000 * 4;
                    this.releaseNewWave();
                }
            }
        }
        createCheats() {
            let one = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
            one.onDown.add(function () {
                console.log('spawn timer: ' + this.spawnTimer);
            }, this);
        }
    }
    Game.EnemiesManager = EnemiesManager;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
// +++ Pool of enemies sprites
var Game;
(function (Game) {
    class EnemiesPool {
        constructor(game, amount, type, parentGroup) {
            this.game = game;
            this.parentGroup = parentGroup;
            this.type = type;
            this.enemies = [];
            this.addEnemies(amount, type);
        }
        addEnemies(amount, type) {
            // number may be replaced by some parameter like level
            this.key = Game.Settings.ENEMIES_KEYS[type] + '1.png';
            for (let i = 0; i < amount; i++) {
                this.createEnemy();
            }
        }
        createEnemy() {
            let enemy;
            enemy = new Game.Enemy(this.game, this.key, this.type);
            this.enemies.push(enemy);
            this.parentGroup.add(enemy);
            return enemy;
        }
        getDeadEnemy() {
            for (let i = 0; i < this.enemies.length; i++) {
                if (!this.enemies[i].alive) {
                    return this.enemies[i];
                }
            }
            return this.createEnemy();
        }
    }
    Game.EnemiesPool = EnemiesPool;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class Enemy extends Phaser.Sprite {
        constructor(game, key, type) {
            super(game, 0, 0, 'mainSheet', key);
            this.anchor.setTo(0.5, 0.5);
            // this.scale.setTo(0.5);
            this.game.physics.arcade.enable(this);
            this.score = 10;
            this.fireTimer = -1;
            this.hitEnable = false;
            this.bullets = new Game.BulletsPool(game, 'fire04.png', 5);
            this.kill();
        }
        getScore() {
            return this.score;
        }
        resetOn(x, y, first) {
            let frequency = 70;
            let spread = 60;
            this.reset(x, y);
            this.body.velocity.y = Game.Settings.ENEMY_SPEED;
            this.initX = x;
            first === true ? this.fireTimer = 1000 * 0.5 : this.fireTimer = -1;
        }
        update() {
            if (this.alive) {
                let frequency = 70;
                let spread = 60;
                this.body.x = this.initX + Math.sin((this.y) / frequency) * spread; // zig zag
                if (!this.hitEnable && this.y + this.height * 0.5 > 0) {
                    this.hitEnable = true;
                }
                if (this.y - this.height * 0.5 > this.game.height) {
                    this.kill();
                    this.hitEnable = false;
                }
                this.updateTimer();
            }
        }
        updateTimer() {
            if (this.fireTimer > 0) {
                this.fireTimer -= this.game.time.elapsedMS;
                if (this.fireTimer <= 0) {
                    this.bullets.resetBullet(this.x, this.y + this.height * 0.5, Game.Settings.ENEMY_BULLET_SPEED, true);
                    this.fireTimer = 1000 * 0.75;
                }
            }
        }
    }
    Game.Enemy = Enemy;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class Player extends Phaser.Sprite {
        constructor(game, x, y, bullets) {
            super(game, x, y, 'mainSheet', 'playerShip1_blue.png');
            this.game.physics.arcade.enable(this);
            this.anchor.setTo(0.5, 0.5);
            // this.scale.setTo(0.6);
            this.hitable = true;
            this.bullets = new Game.BulletsPool(game, 'laserBlue01.png', 30, true);
            this.cursor = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.shootBullet, this);
        }
        shootBullet() {
            this.bullets.resetBullet(this.x, this.y + this.height * 0.5, -Game.Settings.PLAYER_BULLET_SPEED);
            /*
            let bullet = this.bullets.getFirstExists(false, true);
            if (bullet) {

                bullet.reset(this.x, this.y + this.height * 0.5);
                bullet.body.velocity.y = -Settings.BULLET_SPEED;
                // bulletTime = game.time.now + 200;
            }
            */
        }
        resetUp() {
            if (this.hitable) {
                let tween;
                this.hitable = false;
                this.reset(this.game.width * 0.5, this.game.height * 0.9);
                tween = this.game.make.tween(this).to({ alpha: 0 }, 250, Phaser.Easing.Default, true, 0, 3, true);
                tween.onComplete.add(function () {
                    this.hitable = true;
                }, this);
            }
        }
        getBullets() {
            return this.bullets;
        }
        update() {
            this.body.velocity.setTo(0, 0);
            if (this.cursor.left.isDown) {
                if (this.x - this.width * 0.65 > 0) {
                    this.body.velocity.x = -Game.Settings.PLAYER_SPEED;
                    // this.x -= Settings.PLAYER_SPEED;
                }
            }
            else if (this.cursor.right.isDown) {
                if (this.x + this.width * 0.65 < this.game.width) {
                    this.body.velocity.x = Game.Settings.PLAYER_SPEED;
                    // this.x += Settings.PLAYER_SPEED;
                }
            }
        }
    }
    Game.Player = Player;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Settings {
    }
    Settings.BG_SPEED = 2;
    Settings.PLAYER_SPEED = 350; // 6
    Settings.PLAYER_BULLET_SPEED = 400;
    Settings.ENEMY_BULLET_SPEED = 200;
    Settings.ENEMY_SPEED = 150;
    Settings.ENEMIES_KEYS = ['enemyBlack', 'enemyBlue', 'enemyGreen', 'enemyRed'];
    Settings.SCREEN_X = [0.10, 0.45, 0.80];
    Game.Settings = Settings;
    let EnemyType;
    (function (EnemyType) {
        EnemyType[EnemyType["black"] = 0] = "black";
        EnemyType[EnemyType["blue"] = 1] = "blue";
        EnemyType[EnemyType["green"] = 2] = "green";
        EnemyType[EnemyType["red"] = 3] = "red";
    })(EnemyType = Game.EnemyType || (Game.EnemyType = {}));
    ;
    let ScreenPos;
    (function (ScreenPos) {
        ScreenPos[ScreenPos["left"] = 0] = "left";
        ScreenPos[ScreenPos["center"] = 1] = "center";
        ScreenPos[ScreenPos["right"] = 2] = "right";
    })(ScreenPos = Game.ScreenPos || (Game.ScreenPos = {}));
    ;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class Boot extends Phaser.State {
        preload() {
            /*
              This is also where you would define how the game handles scaling.
              For example if this was aimed at mobile and needed to run at iPad resolution (1024×672) then we would usually add the following code into the ‘mobile settings’ part of the class:

              In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"

              this.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
              this.stage.scale.minWidth = 480;
              this.stage.scale.minHeight = 260;
              this.stage.scale.maxWidth = 1024;
              this.stage.scale.maxHeight = 768;
              this.stage.scale.forceLandscape = true;
              this.stage.scale.pageAlignHorizontally = true;
              this.stage.scale.setScreenSize(true);
            */
        }
        create() {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                //this.stage.scale.pageAlignHorizontally = true;
                this.stage.scale.set(1, 1);
            }
            else {
                //  Same goes for mobile settings.
            }
            this.game.state.start('Preloader', true, true);
        }
    }
    Game.Boot = Boot;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class Gameplay extends Phaser.State {
        init() {
            this.score = 0;
            this.lives = 3;
        }
        create() {
            this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg_blue');
            this.mainGroup = this.make.group();
            this.enemiesGroup = this.game.make.group();
            this.hudGroup = this.game.make.group();
            // this.music = this.add.audio('music', 1, false);
            // this.music.play();
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.player = new Game.Player(this.game, this.game.width * 0.5, this.game.height * 0.9, this.playerBullets);
            this.playerBullets = this.player.getBullets();
            this.enemiesBullets = new Game.BulletsPool(this.game, 'fire06.png', 30);
            this.enemiesManager = new Game.EnemiesManager(this.game, this.enemiesGroup, this.enemiesBullets);
            this.mainGroup.add(this.playerBullets);
            this.mainGroup.add(this.enemiesBullets);
            this.mainGroup.add(this.player);
            this.mainGroup.add(this.enemiesGroup);
            this.mainGroup.add(this.hudGroup);
            this.createHUD();
        }
        createHUD() {
            this.scoreTxt = this.game.add.text(this.game.width * 0.05, this.game.height * 0.05, this.score.toString());
            this.hudGroup.add(this.scoreTxt);
            // shields = game.add.text(game.world.width - 150, 10, 'Shields: ' + player.health +'%', { font: '20px Arial', fill: '#fff' });
            // shields.render = function () {
            // shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
            // };
        }
        update() {
            // +++ Scroll bg
            this.background.tilePosition.y += Game.Settings.BG_SPEED;
            // +++ Update enemies movement
            this.enemiesManager.update(this.player);
            // +++ Check collisions
            this.game.physics.arcade.overlap(this.player, this.enemiesGroup, this.enemyHitPlayer, null, this);
            this.game.physics.arcade.overlap(this.player, this.enemiesBullets, this.shootPlayer, null, this);
            this.game.physics.arcade.overlap(this.playerBullets, this.enemiesGroup, this.shootEnemy, null, this);
        }
        enemyHitPlayer(player, enemy) {
            player.resetUp();
            enemy.kill();
        }
        shootPlayer(player, bullets) {
            player.resetUp();
        }
        shootEnemy(bullet, enemy) {
            bullet.kill();
            enemy.kill();
            this.score += enemy.getScore();
            this.scoreTxt.text = this.score.toString();
        }
        // public render (): void {
        //
        //     this.game.debug.bodyInfo(this.player, 32, 32);
        //     this.game.debug.body(this.player);
        // }
        shutdown() {
            this.player = null;
        }
    }
    Game.Gameplay = Gameplay;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class MainMenu extends Phaser.State {
        create() {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            this.input.onDown.addOnce(this.fadeOut, this);
        }
        fadeOut() {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }
        startGame() {
            this.game.state.start('Gameplay', true, false);
        }
    }
    Game.MainMenu = MainMenu;
})(Game || (Game = {}));
/// <reference path="../../lib/typescript/phaser.d.ts"/>
var Game;
(function (Game) {
    class Preloader extends Phaser.State {
        // private preloadBar: Phaser.Sprite;
        preload() {
            //  Load our actual games assets
            this.load.image('bg_black', 'assets/backgrounds/black.png');
            this.load.image('bg_blue', 'assets/backgrounds/blue.png');
            this.load.image('bg_purple', 'assets/backgrounds/purple.png');
            this.load.atlasXML('mainSheet', 'assets/sheet.png', 'assets/sheet.xml');
            // Audio
            // this.load.audio('music', 'assets/title.mp3', true);
            // Font
            this.game.load.bitmapFont('2lines', 'assets/font/2lines.png', 'assets/font/2lines.xml');
        }
        create() {
            // let tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            // tween.onComplete.add(this.startMainMenu, this);
            this.startMainMenu();
        }
        startMainMenu() {
            this.game.state.start('Gameplay', true, false); // may be mainmenu
        }
    }
    Game.Preloader = Preloader;
})(Game || (Game = {}));
