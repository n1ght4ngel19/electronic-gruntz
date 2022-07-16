import Key = Phaser.Input.Keyboard.Key;
import {Stage} from './Stage';

export class ControlKeys {
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  upArrowKey!: Key;
  downArrowKey!: Key;
  leftArrowKey!: Key;
  rightArrowKey!: Key;

  wButtonKey!: Key;
  sButtonKey!: Key;
  aButtonKey!: Key;
  dButtonKey!: Key;

  createAllKeys(): void {
    this.upArrowKey = this.stage.input.keyboard.addKey('UP');
    this.downArrowKey = this.stage.input.keyboard.addKey('DOWN');
    this.leftArrowKey = this.stage.input.keyboard.addKey('LEFT');
    this.rightArrowKey = this.stage.input.keyboard.addKey('RIGHT');

    this.wButtonKey = this.stage.input.keyboard.addKey('W');
    this.sButtonKey = this.stage.input.keyboard.addKey('S');
    this.aButtonKey = this.stage.input.keyboard.addKey('A');
    this.dButtonKey = this.stage.input.keyboard.addKey('D');
  }
}
