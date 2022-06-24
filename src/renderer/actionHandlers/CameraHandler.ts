import Camera = Phaser.Cameras.Scene2D.Camera;
import {Stage} from '../Stage';

export class CameraHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage on which the class will work
   */
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  /**
   * Sets the camera's default zoom value and confines the camera to the limits of the map.
   *
   * @param {Camera} camera - The camera that belongs to the stage
   * @param {number} mapWidth - The width of the map the camera belongs to
   * @param {number} mapHeight - The height of the map the camera belongs to
   */
  setDefaultCameraSettings(camera: Camera, mapWidth: number, mapHeight: number): void {
    camera.setBounds(0, 0, mapWidth, mapHeight);
    camera.zoom = 1.75;
  }

  /**
   * Handles zooming capabilities.
   *
   * @param {Camera} camera - The camera to be zoomed
   * @param {number} mapWidth - The width of the tilemap in pixels
   */
  handleZoom(camera: Camera, mapWidth: number): void {
    const maxZoom = 2.5;
    const zoomIncrement = 0.125;

    this.stage.input.on('wheel', (pointer: any, GameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
      if ((camera.zoom < maxZoom) && (camera.displayWidth < mapWidth)) {
        this.handleZoomOut(camera, deltaY, zoomIncrement);
        this.handleZoomIn(camera, deltaY, zoomIncrement);
      } else if (camera.zoom === maxZoom) {
        this.handleZoomOut(camera, deltaY, zoomIncrement);
      } else if (camera.displayWidth === mapWidth) {
        this.handleZoomIn(camera, deltaY, zoomIncrement);
      }
    });
  }

  /**
   * Handles zooming in.
   *
   * @param {Camera} camera - The camera to be zoomed
   * @param {number} deltaY - The movement of the scroll wheel
   * @param {number} zoomIncrement - The amount of zoom to be applied with each scroll
   */
  handleZoomIn(camera: Camera, deltaY: number, zoomIncrement: number): void {
    if (deltaY < 0) {
      camera.zoom += zoomIncrement;
    }
  }

  /**
   * Handles zooming out.
   *
   * @param {Camera} camera - The main camera of the scene
   * @param {number} deltaY - The movement of the scroll wheel
   * @param {number} zoomIncrement - The amount of zoom to be applied with each scroll
   */
  handleZoomOut(camera: Camera, deltaY: number, zoomIncrement: number): void {
    if (deltaY > 0) {
      camera.zoom -= zoomIncrement;
    }
  }

  /**
   * Handles the camera scrolling when the pointer reaches
   * one of the edges of the screen.
   *
   * @param {Camera} camera - The camera to be moved
   * @param {number} scrollSpeed - The speed at which the camera should move when scrolling
   */
  handleCameraEdgeScroll(camera: Camera, scrollSpeed: number): void {
    if (this.stage.input.activePointer.x >= this.stage.game.canvas.width - 50) {
      camera.scrollX += scrollSpeed;
    }
    if (this.stage.input.activePointer.x <= 50) {
      camera.scrollX -= scrollSpeed;
    }
    if (this.stage.input.activePointer.y >= this.stage.game.canvas.height - 50) {
      camera.scrollY += scrollSpeed;
    }
    if (this.stage.input.activePointer.y <= 50) {
      camera.scrollY -= scrollSpeed;
    }
  }

  /**
   * Handles the camera scrolling when the pointer reaches
   * one of the edges of the screen.
   *
   * @param {Camera} camera - The camera to be moved
   * @param {number} scrollSpeed - The speed at which the camera should move when scrolling
   */
  handleCameraKeysScroll(camera: Camera, scrollSpeed: number): void {
    if (this.stage.upArrowKey.isDown || this.stage.wButtonKey.isDown) {
      camera.scrollY -= 15;
    }
    if (this.stage.downArrowKey.isDown || this.stage.sButtonKey.isDown) {
      camera.scrollY += 15;
    }
    if (this.stage.leftArrowKey.isDown || this.stage.aButtonKey.isDown) {
      camera.scrollX -= 15;
    }
    if (this.stage.rightArrowKey.isDown || this.stage.dButtonKey.isDown) {
      camera.scrollX += 15;
    }
  }
}
