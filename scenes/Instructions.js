import Phaser from "phaser";
import Player from "../classes/Player.js";
import PlayScene from "./PlayScene.js";
import LoseScene from "./LoseScene.js";
import WinScene from "./WinScene.js";

export default class Instructions extends Phaser.Scene {
  constructor() {
    super({ key: "instruction" });
  }
  preload() {
    this.load.image("instruction", "./assets/instructionscreennew.png");
    this.load.audio("music", "./assets/Hypnotic-Puzzle3.mp3");

    //this.load.audio('introMusic', "./assests/Hypnotic-Puzzle3.mp3");
  }

  create() {
    //console.log("enter");

    //console.log(this);
    const camera = this.cameras.main;
    const cursors = this.input.keyboard.createCursorKeys();
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);
    this.backgroundImage = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "instruction"
    );

    this.coolMusic = this.sound.add("music");
    this.coolMusic.play();
    /* 
    let sound = this.sound.add("introMusic");
    this.sound.play('introMusic', {
      loop: true
    });
  */
    /*
    this.add.text(
      this.game.config.width / 3,
      this.game.config.height / 3,
      "Hungry Ghost",
      {
        font: "13px monospace",
        fill: "#ffffff",
        padding: { x: 1, y: 1 },
        backgroundColor: "#0000ff"
      }
    );
    */

    //this.input.on("pointerdown", () => console.log("clicked"));
    this.backgroundImage
      .setInteractive()
      .on("pointerdown", (pointer, localX, localY, event) => {
        this.coolMusic.stop();
        this.scene.start("PlayScene");
      });
    // ...
    // console.log("exit");
  }
  takeToPlayScene() {
    //this.scene.scene.add("default", sceneConfig, true);
    // var newScene = game.scene.add(key, sceneConfig, autoStart, data);
    console.log("clicked");
    this.scene.start("default");
    // game.scene.add(key, sceneConfig, autoStart);
  }

  /* </End> Helper functions added by kris */
}
