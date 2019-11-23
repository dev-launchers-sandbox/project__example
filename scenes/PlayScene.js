import Phaser from "phaser";
import Player from "../classes/Player.js";
import Enemy from "../classes/Enemy.js";
import Cake from "../classes/Cake.js";
import Powerup from "../classes/Powerup.js";
import FinishLine from "../classes/FinishLine.js";
import Obstacle from "../classes/Obstacle.js";
import RandomDataPoints from "../classes/RandomDataPoints.js";
import Score from "../classes/Score.js";

export default class PlayScene extends Phaser.Scene {
  constructor(loseScene) {
    super("PlayScene");
    console.log("wow");
    this.loseScene = loseScene;
  }
  preload() {
    this.load.spritesheet("johnny", "./assets/johnny_sprite.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet("cake", "./assets/cake.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet("ghost", "./assets/ghost.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet("baker", "./assets/baker.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet("finishLine", "./assets/finish line.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet("trap", "./assets/traps.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet("trap", "./assets/traps.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });

    this.load.image("power", "./assets/powerup.png");
    this.load.image("PlaySceneIMage", "./assets/Hungryghostbc.png");
  }

  create() {
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "PlaySceneIMage"
    );

    /*
      Create our own EventEmitter instance
      to communicate from cake to score to decrement score
    */
    this.emitter = new Phaser.Events.EventEmitter();

    this.player = new Player(this, 30, 5);
    this.enemy = new Enemy(this, 10, 0);
    this.cake = new Cake(this);
    this.powerup = new Powerup(this, 100, 5);
    this.finishLine = new FinishLine(this, 500, 100);
    this.score = new Score(this);

    this.randomDataPointsGenerator = new RandomDataPoints();
    const obstacleLocations = this.randomDataPointsGenerator.datapoints(
      2,
      this.game.config.width - 50,
      this.game.config.height
    );
    console.log("obstacleLocations ", obstacleLocations);
    this.obstacles = [];
    obstacleLocations.forEach(point => {
      console.log("point", point);
      this.obstacles.push(new Obstacle(this, point.x, point.y));
    });

    this.player.setDepth(1);

    const camera = this.cameras.main;
    const cursors = this.input.keyboard.createCursorKeys();
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);

    this.platforms = [
      this.addPhysicalRectangle(
        10 / 2,
        75 / 2,
        300 / 2,
        10 / 2,
        this.RandomColor()
      ),
      this.addPhysicalRectangle(
        250 / 2,
        150 / 2,
        300 / 2,
        10 / 2,
        this.RandomColor()
      ),
      this.addPhysicalRectangle(
        250 / 2,
        300 / 2,
        500 / 2,
        10 / 2,
        this.RandomColor()
      ),
      this.addPhysicalRectangle(
        0 / 2,
        225 / 2,
        350 / 2,
        10 / 2,
        this.RandomColor()
      ),
      this.addPhysicalRectangle(
        500 / 2,
        225 / 2,
        500 / 2,
        10 / 2,
        this.RandomColor()
      )
    ];

    /*this.platforms.forEach(platform => {
      this.changeTint(platform);
    });*/

    //Player collisions
    this.physics.add.collider(this.player, this.platforms);
    //powerup collisions
    this.physics.add.collider(this.powerup, this.platforms);
    //vehicle collisions
    this.physics.add.collider(this.cake, this.platforms);
    //player and vehicle collisions
    this.physics.add.collider(this.player, this.cake);
    //enemy collisions
    this.physics.add.collider(this.enemy, this.platforms);
    //enemy and vehicle collision
    this.physics.add.collider(this.enemy, this.cake, this.enemyAndCakeCallback);
    //obstacles and finishline collision
    this.physics.add.collider(this.obstacles, this.platforms);
    //obstacles collisions
    this.physics.add.collider(
      this.cake,
      this.obstacles,
      this.cakeAndObstacleCallback
    ); //player and finishline collision
    this.physics.add.collider(
      this.cake,
      this.finishLine,
      this.playerAndFinishLineCallback
    );
    this.physics.add.collider(this.finishLine, this.platforms);

    this.enemy.body.setAllowGravity(false);
    //this.obstacles.body.setAllowGravity(true);
  }
  enemyAndCakeCallback(enemy, cake) {
    cake.takeAwayHealth();
  }
  playerAndPowerupCallback(player, powerup) {
    powerup.activate();
  }
  playerAndFinishLineCallback(cake, finishLine) {
    finishLine.winning();
  }
  cakeAndObstacleCallback(cake, obstacle) {
    obstacle.playerLost();
  }

  changeTint(platform) {
    let rand = Math.random() * 0xaa;
    console.log("rand ", rand);
    platform.tint = Math.floor(rand);
  }
  /* Color are in RGB format. The first byte is blue value, the second byte is the green value, and the thrid byte is the red
     value
  */

  RandomColor() {
    return this.randomRed() + this.randomGreen() + this.randomBlue();
  }

  randomBlue() {
    return Math.floor(Math.random() * 0xff);
  }

  randomGreen() {
    return Math.floor(Math.random() * 0xff) << 8;
  }

  randomRed() {
    return Math.floor(Math.random() * 0xaa) << 16;
  }

  update(time, delta) {
    this.player.update(time, delta);
    this.enemy.update(time, delta);
  }

  update(time, delta) {
    this.player.update(time, delta);
    this.enemy.update(time, delta);
    this.cake.update(time, delta);
  }

  /* <Begin> helper functions added by Kris */
  //
  //

  addPhysicalRectangle(x, y, width, height, color, alphaIThinkMaybe) {
    // TODO: alphaIThinkMaybe name change
    let rect = this.add.rectangle(x, y, width, height, color, alphaIThinkMaybe);
    rect = this.physics.add.existing(rect, true);

    return rect;
  }
  

  /*
    Method to switch to win scene, use as a callback for Score object
  */

  /* </End> Helper functions added by kris */
}
