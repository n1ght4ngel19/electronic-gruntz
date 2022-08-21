import {Stage} from './Stage';

export class SelectionBox extends Phaser.GameObjects.Rectangle {
  constructor(stage: Stage) {
    super(stage, 0, 0, 0, 0, 0x1D7196, 0.5);
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
  }

  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
