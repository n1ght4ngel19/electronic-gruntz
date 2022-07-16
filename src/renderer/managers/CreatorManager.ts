import {Stage} from '../Stage';
import {GruntCreator} from '../creators/GruntCreator';
import {AnimationCreator} from '../creators/AnimationCreator';

export class CreatorManager {
  constructor(stage: Stage) {
    this.gruntCreator = new GruntCreator(stage);
    this.animationCreator = new AnimationCreator(stage);
  }

  gruntCreator: GruntCreator;
  animationCreator: AnimationCreator;
}
