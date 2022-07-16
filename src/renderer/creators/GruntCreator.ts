import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';
import Vector2 = Phaser.Math.Vector2;
import Tilemap = Phaser.Tilemaps.Tilemap;
import Texture = Phaser.Textures.Texture;

export class GruntCreator {
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  private createGridEngineGrunt(id: string, sprite: Grunt, startPosition: Vector2): void {
    const newGrunt = {
      id: id,
      sprite: sprite,
      startPosition: startPosition,
      speed: 4,
    };

    // @ts-ignore
    this.stage.gridEngineConfig.characters.push(newGrunt);
  }

  createAllGridEngineGruntz(): void {
    for (let i = 0; i < this.stage.playerGruntz.length; i++) {
      this.createGridEngineGrunt(this.stage.playerGruntz[i].id, this.stage.playerGruntz[i], this.stage.playerGruntzPositionz[i]);
    }
  }

  // placeAllGruntzOnMap(atlases: Texture[]): void {
  //   for (let i = 0; i < this.stage.map.getLayer('markerLayer').width; i++) {
  //     for (let j = 0; j < this.stage.map.getLayer('markerLayer').height; j++) {
  //       const gruntTypeToAdd = this.stage.map.getTileAt(i, j, true, 'markerLayer').properties.gruntType;
  //
  //       if (gruntTypeToAdd) {
  //         switch (gruntTypeToAdd) {
  //           case 'normalGrunt': {
  //             this.stage.playerGruntz.push(
  //                 this.stage.add.existing(
  //                     new Grunt(this.stage, 0, 0, gruntAnimationAtlases[0], false, `grunt${this.stage.nextGruntIdNumber++}`, gruntTypeToAdd),
  //                 ),
  //             );
  //             break;
  //           }
  //           case 'clubGrunt': {
  //             this.stage.playerGruntz.push(
  //                 this.stage.add.existing(
  //                     new Grunt(this.stage, 0, 0, gruntAnimationAtlases[1], false, `grunt${this.stage.nextGruntIdNumber++}`, gruntTypeToAdd),
  //                 ),
  //             );
  //             break;
  //           }
  //           case 'gauntletzGrunt': {
  //             this.stage.playerGruntz.push(
  //                 this.stage.add.existing(
  //                     new Grunt(this.stage, 0, 0, gruntAnimationAtlases[1], false, `grunt${this.stage.nextGruntIdNumber++}`, gruntTypeToAdd),
  //                 ),
  //             );
  //             break;
  //           }
  //           default: {
  //             throw new Error('Invalid GruntType!');
  //           }
  //         }
  //
  //         this.stage.playerGruntzPositionz.push(new Vector2(i, j));
  //
  //         console.log(this.stage.map.getTileAt(i, j, true, 'markerLayer').properties.gruntType);
  //       }
  //     }
  //   }
  // }
}
