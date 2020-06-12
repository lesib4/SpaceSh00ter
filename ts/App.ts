/// <reference path="../lib/typescript/phaser.d.ts"/>

module Game {

    export class App extends Phaser.Game {

        constructor() {

            super(800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Gameplay', Gameplay, false);

            this.state.start('Boot', true, true);

        }

    }

}

window.onload = () => {
  var game = new Game.App();
}
