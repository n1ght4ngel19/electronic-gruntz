import Texture = Phaser.Textures.Texture;
import {Stage} from '../Stage';

export class Grunt extends Phaser.GameObjects.Sprite {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the sprite belongs to
   * @param {number} x - The x coordinate of the sprite on the stage
   * @param {number} y - The y coordinate of the sprite on the stage
   * @param {Texture} texture - The texture that belongs to the sprite
   */
  constructor(stage: Stage, x: number, y: number, texture: Texture) {
    super(stage, x, y, texture);
    this.stage = stage;
  };

  stage: Stage;

  isActive: boolean = true;
}
