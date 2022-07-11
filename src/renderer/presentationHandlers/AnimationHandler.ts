import {GruntType} from '../gruntz/GruntType';
import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';

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
  handleWalkingAnimations(gruntz: Grunt[], gruntType: GruntType): void {
    for (let i = 0; i < gruntz.length; i++) {
      this.stage.gridEngine.movementStarted().subscribe(({charId, direction}) => {
        switch (direction) {
          case 'up':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthWalk`);
            break;
          case 'up-right':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthEastWalk`);
            break;
          case 'right':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}EastWalk`);
            break;
          case 'down-right':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthEastWalk`);
            break;
          case 'down':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthWalk`);
            break;
          case 'down-left':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthWestWalk`);
            break;
          case 'left':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}WestWalk`);
            break;
          case 'up-left':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthWestWalk`);
            break;
          default:
            throw new Error('Invalid animation.');
        }
      });
    }
  }

  /**
   * Plays the appropriate idling animation a Grunt is standing.
   *
   * @param {Sprite} sprite - The sprite that plays the animation
   * @param {string} gruntType - Defines which type of animation should be played
   */
  handleIdleAnimations(gruntz: Grunt[], gruntType: GruntType): void {
    for (let i = 0; i < gruntz.length; i++) {
      this.stage.gridEngine.movementStopped().subscribe(({charId, direction}) => {
        switch (direction) {
          case 'up':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthIdle`);
            break;
          case 'up-right':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthEastIdle`);
            break;
          case 'right':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}EastIdle`);
            break;
          case 'down-right':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthEastIdle`);
            break;
          case 'down':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthIdle`);
            break;
          case 'down-left':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthWestIdle`);
            break;
          case 'left':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}WestIdle`);
            break;
          case 'up-left':
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthWestIdle`);
            break;
          default:
            throw new Error('Invalid animation.');
        }
      });
    }
  }
}
