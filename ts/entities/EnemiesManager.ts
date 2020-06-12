/// <reference path="../../lib/typescript/phaser.d.ts"/>

module Game {

    export class EnemiesManager {

        private game: Phaser.Game;
        private group: Phaser.Group;

        private enemies: EnemiesPool[];
        private lastPosX: ScreenPos;
        private waveTimer: number;

        constructor (game: Phaser.Game, group: Phaser.Group, bulletsPool?: BulletsPool) {

            this.game = game;
            this.group = group;

            this.enemies = [];
            this.waveTimer = 1000 * 1;
            this.lastPosX = ScreenPos.center;
            this.createPools();

        }

        private createPools(): void {

            let enemyType: EnemyType;

            for (let i = 0; i < Settings.ENEMIES_KEYS.length; i++) {

                enemyType = i;
                this.enemies[i] = new EnemiesPool(this.game, 5, enemyType, this.group);
            }

        }

        private selectNextWave(): EnemyType {

            let type: EnemyType;
            let pos: ScreenPos;

            type = this.game.rnd.pick([EnemyType.black, EnemyType.blue, EnemyType.green, EnemyType.red]);

            do {

                pos = this.game.rnd.pick([ScreenPos.left, ScreenPos.center, ScreenPos.right]);

            } while (pos === this.lastPosX)

            this.lastPosX = pos;
            console.log('\n--Next Wave : ' + Settings.ENEMIES_KEYS[type] + ' / ' + pos);

            return type;

        }


        private releaseNewWave(): void {

            let amountEnemies: number = 5;
            let waveType: EnemyType = this.selectNextWave();
            let posX: number;
            let first: boolean;

            posX = Settings.SCREEN_X[this.lastPosX];

            for (let i = 0; i < amountEnemies; i++) {

                let enemy: Enemy;

                enemy = this.enemies[waveType].getDeadEnemy();
                first = i === 0 ? true : false;
                enemy.resetOn(this.game.width * posX, -enemy.height + -(i * enemy.height * 1.2), first);
            }

        }

        public getEnemies(): EnemiesPool[] {

            return this.enemies;

        }

        public update(player?: Player): void {

            if (this.waveTimer > 0) {

                this.waveTimer -= this.game.time.elapsedMS;
                if (this.waveTimer <= 0) {

                    this.waveTimer = 1000 * 4;
                    this.releaseNewWave();
                }
            }

        }

        private createCheats(): void {

            let one: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);

            one.onDown.add(function () {
                console.log('spawn timer: ' + this.spawnTimer);
            }, this);


        }

    }

}
