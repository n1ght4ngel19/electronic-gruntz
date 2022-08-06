import {Stage} from '../Stage';

export class ControlHandler {
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  // TODO: Find a better/more elegant way?
  selectGruntzWithKeys(): void {
    this.stage.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case '0':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = false;
          }
          break;
        case '1':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = false;
          }
          this.stage.playerGruntz[0].isSelected = true;
          break;
        case '2':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = false;
          }
          this.stage.playerGruntz[1].isSelected = true;
          break;
        case '3':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = true;
          }
          break;
        default:
          console.log(`Key ${event.key} was pressed.`);
      }
    });
  }
}
