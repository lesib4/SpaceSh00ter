/// <reference path="../../lib/typescript/phaser.d.ts"/>

module Game {

    export class Preloader extends Phaser.State {

        // private preloadBar: Phaser.Sprite;

        public preload (): void {

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

        public create(): void {

            // let tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            // tween.onComplete.add(this.startMainMenu, this);
            this.startMainMenu();

        }

        private startMainMenu(): void {

            this.game.state.start('Gameplay', true, false); // may be mainmenu

        }

    }

}
