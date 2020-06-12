/// <reference path="../../lib/typescript/phaser.d.ts"/>

module Game {

    export class Gameplay extends Phaser.State {

        private mainGroup: Phaser.Group;
        private background: Phaser.TileSprite;
        private music: Phaser.Sound;

        private player: Game.Player;
        private playerBullets: BulletsPool;
        private enemiesBullets: BulletsPool;
        private enemiesGroup: Phaser.Group;
        private enemiesManager: EnemiesManager;

        private score: number;
        private lives: number;
        private scoreTxt: Phaser.Text;
        private hudGroup: Phaser.Group;

        public init(): void {

            this.score = 0;
            this.lives = 3;

        }

        public create(): void {

            this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg_blue');
            this.mainGroup = this.make.group();
            this.enemiesGroup = this.game.make.group();
            this.hudGroup = this.game.make.group();

            // this.music = this.add.audio('music', 1, false);
            // this.music.play();

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.player = new Player(this.game, this.game.width * 0.5, this.game.height * 0.9, this.playerBullets);
            this.playerBullets = this.player.getBullets();
            this.enemiesBullets = new BulletsPool(this.game, 'fire06.png', 30);
            this.enemiesManager = new EnemiesManager(this.game, this.enemiesGroup, this.enemiesBullets);

            this.mainGroup.add(this.playerBullets);
            this.mainGroup.add(this.enemiesBullets);
            this.mainGroup.add(this.player);
            this.mainGroup.add(this.enemiesGroup);
            this.mainGroup.add(this.hudGroup);

            this.createHUD();

        }

        private createHUD(): void {

            this.scoreTxt = this.game.add.text(this.game.width * 0.05, this.game.height * 0.05, this.score.toString());
            this.hudGroup.add(this.scoreTxt);

            // shields = game.add.text(game.world.width - 150, 10, 'Shields: ' + player.health +'%', { font: '20px Arial', fill: '#fff' });
            // shields.render = function () {
            // shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
            // };

        }

        public update(): void {

            // +++ Scroll bg
            this.background.tilePosition.y += Settings.BG_SPEED;

            // +++ Update enemies movement
            this.enemiesManager.update(this.player);

            // +++ Check collisions
            this.game.physics.arcade.overlap(this.player, this.enemiesGroup, this.enemyHitPlayer, null, this);
            this.game.physics.arcade.overlap(this.player, this.enemiesBullets, this.shootPlayer, null, this);
            this.game.physics.arcade.overlap(this.playerBullets, this.enemiesGroup ,this.shootEnemy, null, this);

        }

        private enemyHitPlayer(player: Player, enemy: Phaser.Sprite): void {

            player.resetUp();
            enemy.kill();

        }

        private shootPlayer(player: Player, bullets: BulletsPool): void {

            player.resetUp();

        }

        private shootEnemy(bullet: BulletsPool, enemy: Enemy): void {

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

        public shutdown(): void {

            this.player = null;

        }

    }

}
