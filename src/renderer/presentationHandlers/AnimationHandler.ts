import Sprite = Phaser.GameObjects.Sprite;
import {GruntType} from '../gruntz/GruntType';
import {Stage} from '../Stage';

export class AnimationHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the class will work on
   */
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  /**
   * Plays the appropriate walking animation a Grunt is moving.
   *
   * @param {Sprite} sprite - The sprite that plays the animation
   * @param {string} gruntType - Defines which type of animation should be played
   */
  handleWalkingAnimations(sprite: Sprite, gruntType: GruntType): void {
    this.stage.gridEngine.movementStarted().subscribe(({charId, direction}) => {
      switch (direction) {
        case 'up':
          sprite.anims.play(`${gruntType}NorthWalk`);
          break;
        case 'up-right':
          sprite.anims.play(`${gruntType}NorthEastWalk`);
          break;
        case 'right':
          sprite.anims.play(`${gruntType}EastWalk`);
          break;
        case 'down-right':
          sprite.anims.play(`${gruntType}SouthEastWalk`);
          break;
        case 'down':
          sprite.anims.play(`${gruntType}SouthWalk`);
          break;
        case 'down-left':
          sprite.anims.play(`${gruntType}SouthWestWalk`);
          break;
        case 'left':
          sprite.anims.play(`${gruntType}WestWalk`);
          break;
        case 'up-left':
          sprite.anims.play(`${gruntType}NorthWestWalk`);
          break;
        default:
          throw new Error('Invalid animation.');
      }
    });
  }

  /**
   * Plays the appropriate idling animation a Grunt is standing.
   *
   * @param {Sprite} sprite - The sprite that plays the animation
   * @param {string} gruntType - Defines which type of animation should be played
   */
  handleIdleAnimations(sprite: Sprite, gruntType: GruntType): void {
    this.stage.gridEngine.movementStopped().subscribe(({charId, direction}) => {
      switch (direction) {
        case 'up':
          sprite.anims.play(`${gruntType}NorthIdle`);
          break;
        case 'up-right':
          sprite.anims.play(`${gruntType}NorthEastIdle`);
          break;
        case 'right':
          sprite.anims.play(`${gruntType}EastIdle`);
          break;
        case 'down-right':
          sprite.anims.play(`${gruntType}SouthEastIdle`);
          break;
        case 'down':
          sprite.anims.play(`${gruntType}SouthIdle`);
          break;
        case 'down-left':
          sprite.anims.play(`${gruntType}SouthWestIdle`);
          break;
        case 'left':
          sprite.anims.play(`${gruntType}WestIdle`);
          break;
        case 'up-left':
          sprite.anims.play(`${gruntType}NorthWestIdle`);
          break;
        default:
          throw new Error('Invalid animation.');
      }
    });
  }
}
