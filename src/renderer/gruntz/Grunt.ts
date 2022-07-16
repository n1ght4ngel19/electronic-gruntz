import Texture = Phaser.Textures.Texture;
import {Stage} from '../Stage';
import {GruntType} from './GruntType';

export class Grunt extends Phaser.GameObjects.Sprite {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the sprite belongs to
   * @param {number} x - The x coordinate of the sprite on the stage
   * @param {number} y - The y coordinate of the sprite on the stage
   * @param {Texture} texture - The texture that belongs to the sprite
   */
  constructor(stage: Stage, x: number, y: number, texture: Texture, selected: boolean, id: string, gruntType: GruntType) {
    super(stage, x, y, texture);
    this.stage = stage;
    this.isSelected = selected;
    this.id = id;
    this.gruntType = gruntType;
  };

  stage: Stage;
  isSelected: boolean;
  id: string;
  gruntType: GruntType;

  setGruntType(gruntType: GruntType): void {
    this.gruntType = gruntType;
  }
}
