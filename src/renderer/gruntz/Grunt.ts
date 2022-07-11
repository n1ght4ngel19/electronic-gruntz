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
  constructor(stage: Stage, x: number, y: number, texture: Texture, selected: boolean, id: string) {
    super(stage, x, y, texture);
    this.stage = stage;
    this.isSelected = selected;
    this.id = id;
  };

  stage: Stage;
  isSelected: boolean;
  id: string;
}
