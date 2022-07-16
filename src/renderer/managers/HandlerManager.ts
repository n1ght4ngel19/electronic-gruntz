import {AssetHandler} from '../handlers/AssetHandler';
import {CameraHandler} from '../handlers/CameraHandler';
import {AnimationHandler} from '../handlers/AnimationHandler';
import {PauseMenuHandler} from '../handlers/PauseMenuHandler';
import {ActionHandler} from '../handlers/ActionHandler';
import {Stage} from '../Stage';

export class HandlerManager {
  constructor(stage: Stage) {
    this.assetHandler = new AssetHandler(stage);
    this.cameraHandler = new CameraHandler(stage);
    this.animationHandler = new AnimationHandler(stage);
    this.pauseMenuHandler = new PauseMenuHandler(stage);
    this.actionHandler = new ActionHandler(stage);
  }

  assetHandler: AssetHandler;
  cameraHandler: CameraHandler;
  animationHandler: AnimationHandler;
  pauseMenuHandler: PauseMenuHandler;
  actionHandler: ActionHandler;
}
