//Point Breakdown
// 10 points - High score system
// 10 points - move rocket after firing
// 10 points - BGM
// 25 points - mouse movement/click to fire
// 50 points - 2 players
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play],
    
};

let game = new Phaser.Game(config);

var hiScore = 0;
var p2Score = 0;
var ship01move = false;
var ship02move = false;
var ship03move = false;

game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT, keyQ, keyW, keyE;