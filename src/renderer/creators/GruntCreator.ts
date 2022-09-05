import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';
import {GruntType} from '../gruntz/GruntType';
import Texture = Phaser.Textures.Texture;

export class GruntCreator {
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  private addNewGruntToGridEngineConfig(id: string, sprite: Grunt, startPosition: {x: number, y: number}): void {
    const newGrunt = {
      id: id,
      sprite: sprite,
      startPosition: startPosition,
      speed: 4,
    };

    // @ts-ignore
    this.stage.gridEngineConfig.characters.push(newGrunt);
  }

  addAllGruntzToGridEngineConfig(): void {
    for (let i = 0; i < this.stage.playerGruntz.length; i++) {
      this.addNewGruntToGridEngineConfig(
          this.stage.playerGruntz[i].id,
          this.stage.playerGruntz[i],
          {x: this.stage.playerGruntz[i].x, y: this.stage.playerGruntz[i].y}
      );
    }
  }

  private createGrunt(type: GruntType, x: number, y: number, currentId: number, atlases: Texture[]): Grunt {
    const atlas = atlases.find((atlas) => atlas.key === type);
    // @ts-ignore
    return this.stage.add.existing(new Grunt(this.stage, x, y, atlas, false, `grunt${currentId}`, currentId, type));
  }

  createAllGruntz(atlases: Texture[]): void {
    for (const object of this.stage.mapObjects) {
      const coords = {
        // @ts-ignore
        x: Math.floor(object.x / 32),
        // @ts-ignore
        y: Math.floor(object.y / 32),
      };

      for (const type of Object.values(GruntType)) {
        if (object.name === type) {
          const grunt = this.createGrunt(type, coords.x, coords.y, this.stage.nextGruntIdNumber++, atlases);
          this.stage.playerGruntz.push(grunt);
          this.stage.healthbarz.push(this.stage.add.existing(new Phaser.GameObjects.Sprite(this.stage, object.x, object.y - 16, 'barAnimationz')));
          this.stage.staminabarz.push(this.stage.add.existing(new Phaser.GameObjects.Sprite(this.stage, object.x, object.y - 23, 'barAnimationz')));
        }
      }
    }
  }
}
