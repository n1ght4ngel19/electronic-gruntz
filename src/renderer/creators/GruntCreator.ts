import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';
import {GruntType} from '../gruntz/GruntType';
import Vector2 = Phaser.Math.Vector2;
import Texture = Phaser.Textures.Texture;

export class GruntCreator {
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  private addNewGruntToGridEngineConfig(id: string, sprite: Grunt, startPosition: Vector2): void {
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
      this.addNewGruntToGridEngineConfig(this.stage.playerGruntz[i].id, this.stage.playerGruntz[i], this.stage.playerGruntPositions[i]);
    }
  }

  private createGrunt(type: GruntType, x: number, y: number, currentId: number, atlases: Texture[]): Grunt {
    const atlas = atlases.find((atlas) => atlas.key === type);
    // @ts-ignore
    return this.stage.add.existing(new Grunt(this.stage, x, y, atlas, false, `grunt${currentId}`, type));
  }

  createAllGruntz(atlases: Texture[]): void {
    for (const object of this.stage.mapObjects) {
      // @ts-ignore
      const currentX = Math.floor(object.x / 32);
      // @ts-ignore
      const currentY = Math.floor(object.y / 32);
      const objectName = object.name;

      for (const type of Object.values(GruntType)) {
        if (objectName === type) {
          this.stage.playerGruntPositions.push(<Vector2>{x: currentX, y: currentY});
          const grunt = this.createGrunt(type, currentX, currentY, this.stage.nextGruntIdNumber++, atlases);
          this.stage.playerGruntz.push(grunt);
        }
      }
    }
  }
}
