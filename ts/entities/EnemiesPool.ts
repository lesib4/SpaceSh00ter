/// <reference path="../../lib/typescript/phaser.d.ts"/>

// +++ Pool of enemies sprites

module Game {

    export class EnemiesPool {

        private game: Phaser.Game;
        private parentGroup: Phaser.Group;
        private enemies: Enemy[];
        private type: EnemyType;
        private key: string;

        constructor(game: Phaser.Game, amount: number, type?: EnemyType, parentGroup?: Phaser.Group) {

            this.game = game;
            this.parentGroup = parentGroup;
            this.type = type;
            this.enemies = [];
            this.addEnemies(amount, type);

        }

        private addEnemies(amount: number, type?: number): void {

            // number may be replaced by some parameter like level
            this.key = Settings.ENEMIES_KEYS[type] + '1.png';

            for (let i = 0; i < amount; i++) {

                this.createEnemy();
            }

        }

        private createEnemy(): Enemy {

            let enemy: Enemy;

            enemy = new Enemy(this.game, this.key, this.type);
            this.enemies.push(enemy);
            this.parentGroup.add(enemy);

            return enemy;

        }

        public getDeadEnemy(): Enemy {

            for (let i = 0; i < this.enemies.length; i++) {

                if (!this.enemies[i].alive) {

                    return this.enemies[i];
                }
            }

            return this.createEnemy();

        }

    }
}
