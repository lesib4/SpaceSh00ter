/// <reference path="../../lib/typescript/phaser.d.ts"/>

// +++ Pool of bullets sprites

module Game {

    export class BulletsPool extends Phaser.Group {

        private isPlayer: boolean;

        constructor(game: Phaser.Game, key: string, amount: number, isPlayer: boolean = false) {

            super(game);

            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;
            this.isPlayer = isPlayer;

            this.createMultiple(amount, 'mainSheet', key);
            this.setAll('anchor.x', 0.5);
            this.setAll('anchor.y', 1);

        }

        public resetBullet(x: number, y: number, speed: number, rotate: boolean = false): void {

            let bullet: Phaser.Sprite;

            bullet = this.getFirstDead(true);
            bullet.reset(x, y);
            bullet.body.velocity.y = speed;
            rotate ? bullet.scale.setTo(1, -1): null;

        }

        public update(): void {

            this.forEachAlive(this.checkBounds, this);

        }

        private checkBounds(child: Phaser.Sprite): void {

            if (this.isPlayer) {

                if (child.y + child.height < 0) {

                    child.kill();
                }
            } else {

                if (child.y - child.height > this.game.height) {

                    child.kill();
                }
            }

        }

    }
}
