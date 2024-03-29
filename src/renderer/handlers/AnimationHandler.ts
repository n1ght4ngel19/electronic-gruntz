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
   * @param {Grunt[]} gruntz - All of the gruntz currently in-game
   */
  handleWalkingAnimations(gruntz: Grunt[]): void {
    for (const grunt of gruntz) {
      this.stage.gridEngine.movementStarted().subscribe(({charId, direction}) => {
        // Using charId so that gruntz don't play all the same animations but their respective ones
        const gruntType = (this.stage.gridEngine.getSprite(charId) as Grunt).gruntType;

        switch (direction) {
          case 'up':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthWalk`);
            break;
          case 'up-right':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthEastWalk`);
            break;
          case 'right':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}EastWalk`);
            break;
          case 'down-right':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthEastWalk`);
            break;
          case 'down':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthWalk`);
            break;
          case 'down-left':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}SouthWestWalk`);
            break;
          case 'left':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}WestWalk`);
            break;
          case 'up-left':
            // @ts-ignore
            this.stage.gridEngine.getSprite(charId).anims.play(`${gruntType}NorthWestWalk`);
            break;
          default:
            throw new Error('Invalid animation!');
        }
      });
    }
  }

  /**
   * Plays the appropriate idling animation while a Grunt is standing.
   *
   * @param {Grunt[]} gruntz - All of the gruntz currently in-game
   */
  handleIdleAnimations(gruntz: Grunt[]): void {
    for (const grunt of gruntz) {
      this.stage.gridEngine.movementStopped().subscribe(({charId, direction}) => {
        // Using charId so that gruntz don't face all in the same direction, but their respective ones
        const gruntSprite = this.stage.gridEngine.getSprite(charId);
        const gruntType = (gruntSprite as Grunt).gruntType;

        switch (direction) {
          case 'up':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}NorthIdle`);
            break;
          case 'up-right':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}NorthEastIdle`);
            break;
          case 'right':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}EastIdle`);
            break;
          case 'down-right':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}SouthEastIdle`);
            break;
          case 'down':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}SouthIdle`);
            break;
          case 'down-left':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}SouthWestIdle`);
            break;
          case 'left':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}WestIdle`);
            break;
          case 'up-left':
            // @ts-ignore
            gruntSprite.anims.play(`${gruntType}NorthWestIdle`);
            break;
          default:
            throw new Error('Invalid animation!');
        }
      });
    }
  }
}
