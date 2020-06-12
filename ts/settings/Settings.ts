module Game {

    export class Settings {

        public static BG_SPEED: number = 2;
        public static PLAYER_SPEED: number = 350; // 6
        public static PLAYER_BULLET_SPEED: number = 400;
        public static ENEMY_BULLET_SPEED: number = 200;
        public static ENEMY_SPEED: number = 150;

        public static ENEMIES_KEYS: string[] = ['enemyBlack', 'enemyBlue', 'enemyGreen', 'enemyRed'];
        public static SCREEN_X: number[] = [0.10, 0.45, 0.80];

    }

    export enum EnemyType {
        black,
        blue,
        green,
        red,
    };

    export enum ScreenPos {
        left,
        center,
        right
    }

    export interface Ienemy {



    }

    export interface Example {

        var1: number;
        var2: string;
    };

}
