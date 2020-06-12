/// <reference path="../../lib/typescript/phaser.d.ts"/>

module Game {

    export class Boot extends Phaser.State {

        public preload(): void {

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

        public create(): void {

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

}
