import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';
import {Direction} from 'grid-engine';
import Vector2 = Phaser.Math.Vector2;

export class CommandHandler {
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
    for (let i = 0; i < gruntz.length; i++) {
      if (this.stage.input.activePointer.rightButtonDown() && gruntz[i].isSelected) {
        const targetPosition = new Vector2(
            Math.floor(this.stage.input.activePointer.worldX / 32),
            Math.floor(this.stage.input.activePointer.worldY / 32),
        );

        if (this.isAdjacentToTarget(gruntz[i], targetPosition) && this.isCollideTile(targetPosition)) {
          console.log(`Can't get there.`);
        } else {
          this.stage.gridEngine.moveTo(gruntz[i].id, targetPosition);
        }
      }
    }
  }

  // TODO: Implement
  /**
   * Handles the logic involving the arrows that force Gruntz to move
   * in a specific direction.
   *
   * @param {Grunt} grunt - The grunt that is walking on the arrows
   */
  handleMoveArrows(gruntz: Grunt[]): void {
    for (let i = 0; i < gruntz.length; i++) {
      const currentX = Math.round(gruntz[i].x / 32);
      const currentY = Math.round(gruntz[i].y / 32);
      const currentTile = this.stage.map.getTileAt(currentX, currentY, true, 'generalLayer');

      if (currentTile.properties.move) {
        this.stage.gridEngine.stopMovement(gruntz[i].id);

        switch (currentTile.properties.move) {
          case 'up': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.UP);
            break;
          }
          case 'up_right': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.UP_RIGHT);
            break;
          }
          case 'right': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.RIGHT);
            break;
          }
          case 'down_right': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.DOWN_RIGHT);
            break;
          }
          case 'down': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.DOWN);
            break;
          }
          case 'down_left': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.DOWN_LEFT);
            break;
          }
          case 'left': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.LEFT);
            break;
          }
          case 'up_left': {
            this.stage.gridEngine.move(gruntz[i].id, Direction.UP_LEFT);
            break;
          }
          case 'fourway': {
            switch (this.stage.gridEngine.getFacingDirection(gruntz[i].id)) {
              case Direction.DOWN: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.DOWN);
                break;
              }
              case Direction.UP: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.UP);
                break;
              }
              case Direction.LEFT: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.LEFT);
                break;
              }
              case Direction.RIGHT: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.RIGHT);
                break;
              }
              default: {
                console.error('Invalid direction!');
              }
            }
            break;
          }
          case 'fourway_cross': {
            switch (this.stage.gridEngine.getFacingDirection(gruntz[i].id)) {
              case Direction.UP_LEFT: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.UP_LEFT);
                break;
              }
              case Direction.UP_RIGHT: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.UP_RIGHT);
                break;
              }
              case Direction.DOWN_RIGHT: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.DOWN_RIGHT);
                break;
              }
              case Direction.DOWN_LEFT: {
                this.stage.gridEngine.move(gruntz[i].id, Direction.DOWN_LEFT);
                break;
              }
              default: {
                console.error('Invalid direction!');
                break;
              }
            }
            break;
          }
          default: {
            console.error('Invalid direction!');
          }
        }
      }
    }
  }

  // TODO: Implement
  /**
   * Handles the logic involving the rocks the player may encounter.
   * Visually these can be diverse, like rocks, cakes, dice, etc.
   *
   * @param {Tile[]} data - The data of the layer containing the rocks
   */
  handleRocks(data: Phaser.Tilemaps.Tile[][]): void {

  }

  // TODO: Implement
  /**
   * Handles the logic involving the buildable/breakable
   * bricks the player may encounter.
   *
   * @param {Tile[]} data - The data of the layer containing the bricks
   */
  handleBricks(data: Phaser.Tilemaps.Tile[][]): void {
    console.log(data);
  }

  /**
   * Checks if the target position is adjacent to the grunt specified.
   *
   * @param {Grunt} grunt - The grunt to be checked
   * @param {Vector2} targetPosition - The target position
   *
   * @return {boolean} - True if the target is adjacent to the character,
   * false otherwise
   */
  isAdjacentToTarget(grunt: Grunt, targetPosition: {x: number, y: number}): boolean {
    const charPosition = this.stage.gridEngine.getPosition(grunt.id);
    const moveX = Math.abs(charPosition.x - targetPosition.x);
    const moveY = Math.abs(charPosition.y - targetPosition.y);

    if (moveX <= 1 && moveY <= 1) {
      return (moveX + moveY === 1 || moveX + moveY === 2);
    } else {
      return false;
    }
  }

  isCollideTile(tilePosition: Vector2): boolean {
    const map = this.stage.map;
    const layerNames = [
      this.stage.map.layers[0].name,
      this.stage.map.layers[1].name,
      this.stage.map.layers[2].name,
    ];

    return map.getTileAt(tilePosition.x, tilePosition.y, true, layerNames[0]).properties.ge_collide ||
      map.getTileAt(tilePosition.x, tilePosition.y, true, layerNames[1]).properties.ge_collide ||
      map.getTileAt(tilePosition.x, tilePosition.y, true, layerNames[2]).properties.ge_collide;
  }
}
