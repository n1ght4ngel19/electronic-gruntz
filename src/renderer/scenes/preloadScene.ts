import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'preloadScene' });
  }
  
  graphics!: Phaser.GameObjects.Graphics;
  newGraphics!: Phaser.GameObjects.Graphics;
  loadingText!: Phaser.GameObjects.Text;
  
  preload() {
    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    const progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
    const progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(progressBarFill);

    const loadingText = this.add.text(250,260,'Loading: ', { fontSize: '32px'});

    this.load.on('progress', this.updateBar, { newGraphics:this.newGraphics, loadingText:loadingText});
    this.load.on('complete', this.complete, { scene: this.scene });

    this.load.image('electron', 'assets/electron.png');
  }

  updateBar(percentage: number) {
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(205, 205, percentage*390, 40));

    percentage = percentage * 100;
    this.loadingText.setText('Loading: ' + percentage.toFixed(2) + '%');
    console.log('P: ' + percentage);
  }

  complete() {
    console.log('COMPLETE!');
    // this.scene.start('createScene');
  }
}