import {Stage} from './Stage';

export class Switch extends Phaser.GameObjects.Sprite {
  constructor(stage: Stage, x: number, y: number, texture: string, frame: string) {
    super(stage, x, y, texture, frame);

    this.stage = stage;
    this.coordX = Math.floor(x / 32);
    this.coordY = Math.floor(y / 32);
    this.isUntouched = true;
  }

  stage: Stage;
  coordX: number;
  coordY: number;
  isUntouched: boolean;
}
