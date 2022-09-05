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
  constructor(stage: Stage, x: number, y: number, texture: Texture, selected: boolean, id: string, numId: number, gruntType: GruntType) {
    super(stage, x, y, texture);
    this.stage = stage;
    this.isSelected = selected;
    this.id = id;
    this.numId = numId;
    this.gruntType = gruntType;
    this.coords = {
      x: Math.floor(x / 32),
      y: Math.floor(y / 32),
    };
    this.health = 20;
  };

  stage: Stage;
  isSelected: boolean;
  id: string;
  numId: number;
  gruntType: GruntType;
  coords: {
    x: number,
    y: number,
  };
  health: number;

  setGruntType(gruntType: GruntType): void {
    this.gruntType = gruntType;
  }

  damage(amount: number): void {
    this.health -= amount;
    this.stage.healthbarz[this.numId].setFrame(`BarHealth_${this.health + 1}`);
  }
}
