import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';
import {Direction} from 'grid-engine';
import Vector2 = Phaser.Math.Vector2;
import {GruntType} from '../gruntz/GruntType';

export class ActionHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the class will work on
   */
  constructor(stage: Stage) {
    this.stage = stage;
  };

  stage: Stage;

  handleMoveCommand(gruntz: Grunt[]): void {
    const pointer = this.stage.input.activePointer;

    for (const grunt of gruntz) {
      if (pointer.rightButtonDown() && grunt.isSelected) {
        const target = new Vector2(
            Math.floor(pointer.worldX / 32),
            Math.floor(pointer.worldY / 32),
        );

        if (this.isAdjacentToTarget(grunt, target) && this.isCollideTile(target.x, target.y)) {
          // TODO: Replace comment with sound
          console.log(`Can't get there.`);
        } else {
          this.stage.gridEngine.moveTo(grunt.id, target);
        }
      }
    }
  }

  handleToolPickup(gruntz: Grunt[], positions: Vector2[]): void {
    for (const [index, position] of positions.entries()) {
      const toolTile = this.stage.map.getTileAt(position.x, position.y, true, 'itemLayer');

      if (toolTile.properties.toolType) {
        this.stage.map.removeTileAt(position.x, position.y, false, false, 'itemLayer');

        gruntz[index].anims.play(`${toolTile.properties.toolType}Pickup`);
        gruntz[index].setGruntType((`${toolTile.properties.toolType}Grunt`) as GruntType);
      }
    }
  }

  /**
   * Handles the logic involving the arrows that force Gruntz to move
   * in a specific direction.
   *
   * @param {Grunt[]} gruntz - The grunt that is walking on the arrows
   */
  handleMoveArrows(gruntz: Grunt[]): void {
    for (const grunt of gruntz) {
      const gruntX = Math.round(grunt.x / 32);
      const gruntY = Math.round(grunt.y / 32);
      const currentTile = this.stage.map.getTileAt(gruntX, gruntY, true, 'actionLayer');

      if (currentTile.properties.move) {
        this.stage.gridEngine.stopMovement(grunt.id);

        switch (currentTile.properties.move) {
          case 'up':
            this.stage.gridEngine.move(grunt.id, Direction.UP);
            break;
          case 'up_right':
            this.stage.gridEngine.move(grunt.id, Direction.UP_RIGHT);
            break;
          case 'right':
            this.stage.gridEngine.move(grunt.id, Direction.RIGHT);
            break;
          case 'down_right':
            this.stage.gridEngine.move(grunt.id, Direction.DOWN_RIGHT);
            break;
          case 'down':
            this.stage.gridEngine.move(grunt.id, Direction.DOWN);
            break;
          case 'down_left':
            this.stage.gridEngine.move(grunt.id, Direction.DOWN_LEFT);
            break;
          case 'left':
            this.stage.gridEngine.move(grunt.id, Direction.LEFT);
            break;
          case 'up_left':
            this.stage.gridEngine.move(grunt.id, Direction.UP_LEFT);
            break;
          case 'fourway':
            switch (this.stage.gridEngine.getFacingDirection(grunt.id)) {
              case Direction.DOWN:
                this.stage.gridEngine.move(grunt.id, Direction.DOWN);
                break;
              case Direction.UP:
                this.stage.gridEngine.move(grunt.id, Direction.UP);
                break;
              case Direction.LEFT:
                this.stage.gridEngine.move(grunt.id, Direction.LEFT);
                break;
              case Direction.RIGHT:
                this.stage.gridEngine.move(grunt.id, Direction.RIGHT);
                break;
              default:
                throw new Error('Invalid direction!');
            }
            break;
          case 'fourway_cross':
            switch (this.stage.gridEngine.getFacingDirection(grunt.id)) {
              case Direction.UP_LEFT:
                this.stage.gridEngine.move(grunt.id, Direction.UP_LEFT);
                break;
              case Direction.UP_RIGHT:
                this.stage.gridEngine.move(grunt.id, Direction.UP_RIGHT);
                break;
              case Direction.DOWN_RIGHT:
                this.stage.gridEngine.move(grunt.id, Direction.DOWN_RIGHT);
                break;
              case Direction.DOWN_LEFT:
                this.stage.gridEngine.move(grunt.id, Direction.DOWN_LEFT);
                break;
              default:
                throw new Error('Invalid direction!');
            }
            break;
          default:
            throw new Error('Invalid direction!');
        }
      }
    }
  }

  handleSecretSwitch(): void {
    for (const position of this.stage.playerGruntPositions) {
      if (position.equals(this.stage.secretSwitchPosition) && this.stage.secretSwitchState) {
        this.stage.secretSwitchState = false;

        for (const [index, pos] of this.stage.secretObjectPositions.entries()) {
          // Showing hidden tiles after 'delay' amount of seconds
          // and removing properties of BaseLayer tiles so that they don't interfere with the hidden ones
          setTimeout(() => {
            const baseTileProperties = this.stage.baseLayer.getTileAt(pos.x, pos.y, true).properties;

            this.stage.secretLayer.getTileAt(pos.x, pos.y, true).setVisible(true);
            this.stage.baseLayer.getTileAt(pos.x, pos.y, true).properties = {};

            // Removing hidden tiles from the map after 'duration' amount of seconds
            setTimeout(() => {
              this.stage.secretLayer.removeTileAt(pos.x, pos.y, true);
              this.stage.baseLayer.getTileAt(pos.x, pos.y, true).properties = baseTileProperties;
            }, this.stage.secretObjects[index].data.list.duration * 1000);
          }, (this.stage.secretObjects[index].data.list.delay) * 1000);
        }
      }
    }
  }

  /**
   * Checks if the target position is adjacent to the grunt specified.
   *
   * @param {Grunt} grunt - The grunt to be checked
   * @param {Vector2} target - The target position
   *
   * @return {boolean} - True if the target is adjacent to the character,
   * false otherwise
   */
  private isAdjacentToTarget(grunt: Grunt, target: {x: number, y: number}): boolean {
    const gruntPosition = this.stage.gridEngine.getPosition(grunt.id);
    const moveDiff = new Vector2(
        Math.abs(gruntPosition.x - target.x),
        Math.abs(gruntPosition.y - target.y),
    );

    if (moveDiff.x <= 1 && moveDiff.y <= 1) {
      return (moveDiff.x + moveDiff.y === 1 || moveDiff.x + moveDiff.y === 2);
    } else {
      return false;
    }
  }

  private isCollideTile(x: number, y: number): boolean {
    return this.stage.baseLayer.getTileAt(x, y, true).properties.ge_collide ||
      this.stage.secretLayer.getTileAt(x, y, true).properties.ge_collide ||
      this.stage.actionLayer.getTileAt(x, y, true).properties.ge_collide;
  }
}
