/// <reference path="../../lib/typescript/phaser.d.ts"/>

module Game {

    export class Enemy extends Phaser.Sprite {

        private bullets: BulletsPool;
        private hitEnable: boolean;

        private initX: number;
        private frequency: number;
        private spread: number;
        private fireTimer: number;
        private score: number;

        constructor(game: Phaser.Game, key: string, type?: EnemyType) {

            super(game, 0, 0, 'mainSheet', key);

            this.anchor.setTo(0.5, 0.5);
            // this.scale.setTo(0.5);

            this.game.physics.arcade.enable(this);

            this.score = 10;
            this.fireTimer = -1;
            this.hitEnable = false;
            this.bullets = new BulletsPool(game, 'fire04.png', 5);
            this.kill();

        }

        public getScore(): number {

            return this.score;

        }

        public resetOn(x: number, y: number, first: boolean): void {

            let frequency: number = 70;
            let spread: number = 60;

            this.reset(x, y);
            this.body.velocity.y = Settings.ENEMY_SPEED;
            this.initX = x;
            first === true ? this.fireTimer = 1000 * 0.5 : this.fireTimer = -1;

        }

        public update(): void {

            if (this.alive) {

                let frequency: number = 70;
                let spread: number = 60;

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

        private updateTimer(): void {

            if (this.fireTimer > 0) {

                this.fireTimer -= this.game.time.elapsedMS;
                if (this.fireTimer <= 0) {

                    this.bullets.resetBullet(this.x, this.y + this.height * 0.5, Settings.ENEMY_BULLET_SPEED, true);
                    this.fireTimer = 1000 * 0.75;
                }
            }

        }

    }

}
