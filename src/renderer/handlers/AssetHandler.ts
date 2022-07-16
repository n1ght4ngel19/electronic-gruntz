import {Stage} from '../Stage';
import {Grunt} from '../gruntz/Grunt';
import Tilemap = Phaser.Tilemaps.Tilemap;
import Vector2 = Phaser.Math.Vector2;
import Texture = Phaser.Textures.Texture;

export class AssetHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage the class will work on
   */
  constructor(stage: Stage) {
    this.stage = stage;
  };

  stage: Stage;

  loadMapAndTilesets(mapName: string, tilesetName: string): void {
    this.stage.load.tilemapTiledJSON(mapName, `maps/${mapName}.json`);
    this.stage.load.image(
        tilesetName,
        `tilesets/${tilesetName}.png`);
    this.stage.load.image(
        'tilesetGeneral',
        'tilesets/tilesetGeneral.png');
    this.stage.load.image(
        'tilesetBrickz',
        'tilesets/tilesetBrickz.png');
    this.stage.load.image(
        'animatedTilez',
        'tilesets/animatedTilez.png');
    this.stage.load.image(
        'tilesetToolz',
        'tilesets/tilesetToolz.png');
    this.stage.load.image(
        'tilesetMarkerz',
        'tilesets/tilesetMarkerz.png',
    );
  }
  loadAnimationAtlases(): void {
    this.stage.load.atlasXML('normalGrunt', 'animations/normalGrunt.png', 'animations/normalGrunt.xml');
    this.stage.load.atlasXML('clubGrunt', 'animations/clubGrunt.png', 'animations/clubGrunt.xml');
    this.stage.load.atlasXML('gauntletzGrunt', 'animations/gauntletzGrunt.png', 'animations/gauntletzGrunt.xml');
    this.stage.load.atlasXML('pickupz', 'animations/pickupz.png', 'animations/pickupz.xml');
  }

  /**
   * Creates the map and populates it with the different layers
   * used for the game logic.
   *
   * @param {string} mapName - The name of the map which corresponds to the filename of the map in JSON format
   *
   * @return {Tilemap} - The map that is to be used in the game
   */
  makeMapWithLayers(mapName: string, tilesetName: string): Tilemap {
    const returnMap = this.stage.make.tilemap({key: mapName});

    // Add tilesets to create the map layers from
    // TODO: Dynamic tileWidth and tileHeight, specified in Area, together with how big Grunt textures the Area should use
    this.stage.baseLayer = returnMap.addTilesetImage(tilesetName, tilesetName, 32, 32);
    this.stage.generalLayer = returnMap.addTilesetImage('tilesetGeneral', 'tilesetGeneral');
    this.stage.brickLayer = returnMap.addTilesetImage('tilesetBrickz', 'tilesetBrickz');
    this.stage.animatedLayer = returnMap.addTilesetImage('animatedTilez', 'animatedTilez');
    this.stage.toolzLayer = returnMap.addTilesetImage('tilesetToolz', 'tilesetToolz');
    this.stage.markerLayer = returnMap.addTilesetImage('tilesetMarkerz', 'tilesetMarkerz');

    // Create map layers
    returnMap.createLayer('baseLayer', this.stage.baseLayer);
    returnMap.createLayer('generalLayer', this.stage.generalLayer);
    returnMap.createLayer('brickLayer', this.stage.brickLayer);
    returnMap.createLayer('animatedLayer', this.stage.animatedLayer);
    returnMap.createLayer('toolzLayer', this.stage.toolzLayer);
    returnMap.createLayer('markerLayer', this.stage.markerLayer);

    return returnMap;
  }

  // addAllGruntzToTheMap(map: Tilemap, atlases: Texture[]): void {
  //   for (let i = 0; i < map.getLayer('markerLayer').width; i++) {
  //     for (let j = 0; j < map.getLayer('markerLayer').height; j++) {
  //       const gruntTypeToAdd = map.getTileAt(i, j, true, 'markerLayer').properties.gruntType;
  //
  //       if (gruntTypeToAdd) {
  //         switch (gruntTypeToAdd) {
  //           case 'normalGrunt': {
  //             this.stage.playerGruntz.push(
  //                 this.stage.add.existing(
  //                     new Grunt(this.stage, 0, 0, atlases[0], false, `grunt${this.stage.nextGruntIdNumber++}`, gruntTypeToAdd),
  //                 ),
  //             );
  //             break;
  //           }
  //           case 'clubzGrunt': {
  //             this.stage.playerGruntz.push(
  //                 this.stage.add.existing(
  //                     new Grunt(this.stage, 0, 0, atlases[1], false, `grunt${this.stage.nextGruntIdNumber++}`, gruntTypeToAdd),
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
