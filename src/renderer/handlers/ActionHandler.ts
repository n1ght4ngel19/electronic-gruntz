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

  handleToolPickup(gruntz: Grunt[]): void {
    for (const grunt of gruntz) {
      const currentTile = this.stage.itemLayer.getTileAt(grunt.coords.x, grunt.coords.y, true);

      if (currentTile.properties.toolType) {
        this.stage.itemLayer.removeTileAt(grunt.coords.x, grunt.coords.y, false);

        grunt.anims.play(`${currentTile.properties.toolType}Pickup`);
        grunt.setGruntType((`${currentTile.properties.toolType}Grunt`) as GruntType);
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
      const currentTile = this.stage.actionLayer.getTileAt(grunt.coords.x, grunt.coords.y, true);

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
    for (const grunt of this.stage.playerGruntz) {
      if (
        grunt.coords.x === this.stage.secretSwitchPosition.x &&
        grunt.coords.y === this.stage.secretSwitchPosition.y &&
        this.stage.secretSwitch.isUntouched
      ) {
        this.stage.secretSwitch.isUntouched = false;
        this.stage.secretSwitch.anims.play('SecretSwitch');

        for (const [index, pos] of this.stage.secretObjectPositions.entries()) {
          // Showing hidden tiles after 'delay' amount of seconds
          // and removing properties of Tiles on baseLayer so that they don't interfere with the hidden ones
          setTimeout(() => {
            const baseTileProperties = this.stage.baseLayer.getTileAt(pos.x, pos.y, true).properties;

            this.stage.secretLayer.getTileAt(pos.x, pos.y, true).setVisible(true);
            this.stage.baseLayer.getTileAt(pos.x, pos.y, true).properties = {};

            // Removing hidden tiles from the map after 'duration' amount of seconds
            // and giving the Tiles on baseLayer their properties back
            setTimeout(() => {
              this.stage.secretLayer.removeTileAt(pos.x, pos.y, true);
              this.stage.baseLayer.getTileAt(pos.x, pos.y, true).properties = baseTileProperties;
            }, this.stage.secretObjects[index].data.list.duration * 1000);
          }, (this.stage.secretObjects[index].data.list.delay) * 1000);
        }
      }
    }
  }

  handleCheckPointSwitches(): void {
    for (const grunt of this.stage.playerGruntz) {
      for (const [index, properties] of this.stage.checkPointSwitchProperties.entries()) {
        if (
          grunt.coords.x === properties.position.x &&
          grunt.coords.y === properties.position.y &&
          grunt.gruntType === properties.requirement &&
          properties.isUntouched
        ) {
          properties.isUntouched = false;
          // TODO: Play Switch animation

          for (const pyramid of this.stage.checkPointPyramidGroups[index]) {
            pyramid.anims.play('CheckPointPyramid');
            this.stage.baseLayer.getTileAt(pyramid.coordX, pyramid.coordY, true).properties.ge_collide = false;
          }
        }
      }
    }
  }

  handleBlueToggleSwitches(): void {
    for (const grunt of this.stage.playerGruntz) {
      for (const [index, properties] of this.stage.blueToggleSwitchProperties.entries()) {
        if (
          this.stage.playerGruntz.map((grunt) => grunt.coords.x).includes(properties.position.x) &&
          this.stage.playerGruntz.map((grunt) => grunt.coords.y).includes(properties.position.y)
        ) {
          if (properties.isUntouched) {
            properties.isUntouched = false;

            if (properties.isUp) {
              properties.isUp = false;

              this.stage.blueToggleSwitches[index].anims.play('BlueToggleSwitch');

              for (const bridge of this.stage.blueToggleSwitchBridgeGroups[index]) {
                this.stage.baseLayer.getTileAt(bridge.coordX, bridge.coordY, true).properties.ge_collide = false;
                bridge.anims.playReverse('WaterBridge');
              }
            } else if (!properties.isUp) {
              properties.isUp = true;

              this.stage.blueToggleSwitches[index].anims.playReverse('BlueToggleSwitch');

              for (const bridge of this.stage.blueToggleSwitchBridgeGroups[index]) {
                this.stage.baseLayer.getTileAt(bridge.coordX, bridge.coordY, true).properties.ge_collide = true;
                bridge.anims.play('WaterBridge');
              }
            }
          }
        } else {
          properties.isUntouched = true;
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
