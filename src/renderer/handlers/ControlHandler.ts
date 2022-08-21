import {Stage} from '../Stage';
import Pointer = Phaser.Input.Pointer;
import {SelectionBox} from '../SelectionBox';
import {Grunt} from '../gruntz/Grunt';

export class ControlHandler {
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;
  selectionBox!: SelectionBox;

  handleSelection(): void {
    this.selectionBox = new SelectionBox(this.stage);
    this.stage.add.existing(this.selectionBox);

    this.selectGruntzWithBoundingBox();
    this.selectGruntzWithKeys();
  }

  selectGruntzWithBoundingBox(): void {
    this.stage.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    this.stage.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
    this.stage.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
  }

  handlePointerDown(pointer: Pointer): void {
    if (pointer.leftButtonDown()) {
      this.selectionBox.x = pointer.worldX;
      this.selectionBox.y = pointer.worldY;
    }
  }

  handlePointerUp(pointer: Pointer): void {
    if (pointer.leftButtonReleased()) {
      this.selectionBox.width = 0;
      this.selectionBox.height = 0;
    }
  }

  handlePointerMove(pointer: Pointer): void {
    // This way we can only select with the left button, so that movement with the right button is not disturbed
    if (!pointer.leftButtonDown()) {
      return;
    }

    // Setting pointer position displacement with respect to camera zoom
    const dx = (pointer.x - pointer.prevPosition.x) / this.stage.cameras.main.zoom;
    const dy = (pointer.y - pointer.prevPosition.y) / this.stage.cameras.main.zoom;

    this.selectionBox.width += dx;
    this.selectionBox.height += dy;

    this.setBoxMinMaxes(this.selectionBox);

    for (const grunt of this.stage.playerGruntz) {
      grunt.isSelected = this.isInsideTheBox(grunt);
    }
  }

  private isInsideTheBox(grunt: Grunt): boolean {
    return grunt.x >= this.selectionBox.minX &&
      grunt.x <= this.selectionBox.maxX &&
      grunt.y >= this.selectionBox.minY &&
      grunt.y <= this.selectionBox.maxY;
  }

  private setBoxMinMaxes(box: SelectionBox): void {
    if (box.height < 0) {
      box.minY = box.y - box.height;
      box.maxY = box.y;
    } else {
      box.minY = box.y;
      box.maxY = box.y + box.height;
    }

    if (box.width < 0) {
      box.minX = box.x - box.width;
      box.maxX = box.x;
    } else {
      box.minX = box.x;
      box.maxX = box.x + box.width;
    }
  }

  // TODO: Find a better/more elegant way?
  selectGruntzWithKeys(): void {
    this.stage.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case '0':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = false;
          }
          break;
        case '1':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = false;
          }
          this.stage.playerGruntz[0].isSelected = true;
          break;
        case '2':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = false;
          }
          this.stage.playerGruntz[1].isSelected = true;
          break;
        case '3':
          for (const grunt of this.stage.playerGruntz) {
            grunt.isSelected = true;
          }
          break;
        default:
          console.log(`Key ${event.key} was pressed.`);
      }
    });
  }
}
