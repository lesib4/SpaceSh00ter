/// <reference path="../../lib/typescript/phaser.d.ts"/>

module Game {

    export class Player extends Phaser.Sprite {

        private cursor: Phaser.CursorKeys;
        private bullets: BulletsPool;
        private hitable: boolean;

        constructor(game: Phaser.Game, x: number, y: number, bullets?: BulletsPool) {

            super(game, x, y, 'mainSheet', 'playerShip1_blue.png');

            this.game.physics.arcade.enable(this);
            this.anchor.setTo(0.5, 0.5);
            // this.scale.setTo(0.6);
            this.hitable = true;

            this.bullets = new BulletsPool(game, 'laserBlue01.png', 30, true);
            this.cursor = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.shootBullet, this);

        }

        private shootBullet(): void {

            this.bullets.resetBullet(this.x, this.y + this.height * 0.5, -Settings.PLAYER_BULLET_SPEED);
            /*
            let bullet = this.bullets.getFirstExists(false, true);
            if (bullet) {

                bullet.reset(this.x, this.y + this.height * 0.5);
                bullet.body.velocity.y = -Settings.BULLET_SPEED;
                // bulletTime = game.time.now + 200;
            }
            */

        }

        public resetUp(): void {

            if (this.hitable) {

                let tween: Phaser.Tween;

                this.hitable = false;
                this.reset(this.game.width * 0.5, this.game.height * 0.9);
                tween = this.game.make.tween(this).to({alpha: 0}, 250, Phaser.Easing.Default, true, 0, 3, true);
                tween.onComplete.add(function () {

                    this.hitable = true;
                }, this);
            }

        }

        public getBullets(): BulletsPool {

            return this.bullets;

        }

        public update(): void {

            this.body.velocity.setTo(0, 0);
            if (this.cursor.left.isDown) {

                if (this.x - this.width * 0.65 > 0) {

                    this.body.velocity.x = -Settings.PLAYER_SPEED;
                    // this.x -= Settings.PLAYER_SPEED;
                }
            }
            else if (this.cursor.right.isDown) {

                if (this.x + this.width * 0.65 < this.game.width) {

                    this.body.velocity.x = Settings.PLAYER_SPEED;
                    // this.x += Settings.PLAYER_SPEED;
                }
            }

        }

    }

}
