import {Stage} from '../Stage';
import Texture = Phaser.Textures.Texture;

export class AnimationCreator {
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
   * Counts the number of animations inside the texture atlas
   * specified by the atlas parameter, later to be used for
   * determining how many frames an animation has.
   *
   * @param {Texture} atlas - The texture atlas we are searching in
   * @param {string} animPrefix - The prefix of the animation we are interested in counting
   *
   * @return {number} - The number of animations found
   */
  findFrameCount(atlas: Texture, animPrefix: string): number {
    let count = 0;

    atlas.getFrameNames().forEach((frameName) => {
      if (frameName.startsWith(animPrefix)) {
        count++;
      }
    });

    return count;
  }

  /**
   * Creates an animation from the texture atlas identified by the atlasKey parameter.
   *
   * @param {string} atlasKey - The key of the texture atlas as specified when loaded
   * inside the preload method
   * @param {string} animKey - The key by which the animation should be referred
   * to hereafter
   * @param {string} animPrefix - The prefix of the animation as found inside the
   * descriptor file of the texture atlas
   */
  createAtlasAnimation(atlasKey: string, animKey: string, animPrefix: string) {
    this.stage.anims.create({
      key: animKey,
      repeat: -1,
      frameRate: 10,
      frames: this.stage.anims.generateFrameNames(atlasKey, {
        prefix: animPrefix,
        start: 1,
        end: this.findFrameCount(this.stage.textures.get(atlasKey), animPrefix),
        zeroPad: 2,
      }),
    });
  }

  /**
   * Creates all the animations from the texture atlas identified by the atlasKey parameter.
   *
   * @param {string} atlasKey - The key of the texture atlas we are creating the animations from
   */
  createAtlasAnimations(atlasKey: string): void {
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthAttack', 'NORTH_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastAttack', 'NORTHEAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastAttack', 'EAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastAttack', 'SOUTHEAST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthAttack', 'SOUTH_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestAttack', 'SOUTHWEST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestAttack', 'WEST_ATTACK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestAttack', 'NORTHWEST_ATTACK_');

    this.createAtlasAnimation(atlasKey, 'normalGruntNorthIdle', 'NORTH_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastIdle', 'NORTHEAST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastIdle', 'EAST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastIdle', 'SOUTHEAST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthIdle', 'SOUTH_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestIdle', 'SOUTHWEST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestIdle', 'WEST_IDLE_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestIdle', 'NORTHWEST_IDLE_');

    // this.createAtlasAnimation(atlasKey, 'normalGruntNorthItem', 'NORMALGRUNT_NORTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastItem', 'NORMALGRUNT_NORTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntEastItem', 'NORMALGRUNT_EAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastItem', 'NORMALGRUNT_SOUTHEAST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntSouthItem', 'NORMALGRUNT_SOUTH_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestItem', 'NORMALGRUNT_SOUTHWEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntWestItem', 'NORMALGRUNT_WEST_ITEM_');
    // this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestItem', 'NORMALGRUNT_NORTHWEST_ITEM_');

    this.createAtlasAnimation(atlasKey, 'normalGruntNorthStruck', 'NORTH_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastStruck', 'NORTHEAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastStruck', 'EAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastStruck', 'SOUTHEAST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthStruck', 'SOUTH_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestStruck', 'SOUTHWEST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestStruck', 'WEST_STRUCK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestStruck', 'NORTHWEST_STRUCK_');

    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWalk', 'NORTH_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthEastWalk', 'NORTHEAST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntEastWalk', 'EAST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthEastWalk', 'SOUTHEAST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWalk', 'SOUTH_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntSouthWestWalk', 'SOUTHWEST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntWestWalk', 'WEST_WALK_');
    this.createAtlasAnimation(atlasKey, 'normalGruntNorthWestWalk', 'NORTHWEST_WALK_');
  }
}
