import {Stage} from '../Stage';

export class MovementHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage on which the class will work
   */
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  handleMovement(): void {
    const pointerPosition = {
      x: Math.floor(this.stage.input.activePointer.worldX/32),
      y: Math.floor(this.stage.input.activePointer.worldY/32),
    };

    if (this.stage.input.activePointer.isDown) {
      this.stage.gridEngine.moveTo('player', pointerPosition);
    }
  }
}
