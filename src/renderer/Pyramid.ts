import {Stage} from './Stage';

export class Pyramid extends Phaser.GameObjects.Sprite {
  constructor(stage: Stage, x: number, y: number, texture: string, frame: string) {
    super(stage, x, y, texture, frame);

    this.stage = stage;
    this.coordX = Math.floor(x / this.stage.tileSize);
    this.coordY = Math.floor(y / this.stage.tileSize);
  }

  stage: Stage;
  coordX: number;
  coordY: number;
}
