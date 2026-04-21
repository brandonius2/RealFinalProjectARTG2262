///start and end screen 
let logo;
let highScore = 0;
let isNewHighScore = false;
let blinkTimer = 0;
let glowPulse = 0;
let cornerSize = 0;
let dots = [];
let arrowsHeld = [false, false, false, false];
let chaosLevel = 0;
let chaosTimer = 0;
let screenShake = 0;
let fakeChats = [];
let brainrotWords = [];
let greenBtn;
let yellowBtn;
let redBtn;
let blueBtn;
let outlineBtn;
let gameBg;
let subwayGif, carpetGif, slimeGif, beeGif, slime2Gif, minionsGif, girlGif, nyancatGif, bunnyGif;
//let flashTimers = [0,0,0,0];

//chat messages
let chatMessages = [
  "omg this game goes hard",
  "W game fr fr",
  "no way bro is playing this",
  "SKIBIDI",
  "chat is this real",
  "💀💀💀",
  "bro fell off",
  "this is actually insane",
  "no cap this slaps",
  "KEKW",
  "who made this lmao",
  "GIGACHAD game",
  "i cant focus lol",
  "POV: losing ur mind",
  "🔥🔥🔥",
  "rizz level: MAX",
];

let brainrotList = [
  "SKIBIDI", "RIZZ", "NO CAP", "BASED",
  "GIGACHAD", "BUSSIN", "FR FR", "SLAY",
  "SHEESH", "YEET", "RATIO", "W",
  "SIGMA", "OHIO", "DELULU", "TOUCH GRASS"
];

//game

//songspecific
let arrowFrames;
let arrowTypes;
let holdOnTilMayFrames;
let holdOnTilMayTypes;
let fatLipFrames;
let fatLipTypes;
let loveGirlFrames;
let loveGirlTypes;

// arrow horizontal bounds
let bound1;
let bound2;
let bound3;
let bound4;
let bound5;

let downArrow;
let rightArrow;
let upArrow;
let leftArrow;
let arrows = [];
let spawnY;
let scaleX;
let scaleY;
let despawnPoint;

// arrow velocities
let vel;
let holdOnVel;
let fatLipVel;


let firstNPos;
let secondNPos;
let thirdNPos;
let fourthNPos;
let firstArrow;
let secondArrow;
let thirdArrow;
let fourthArrow;
let arrowCount = 0;
let baseScore = 1;
let scoreX;
let scoreY;
let combo = 0;
let maxCombo;
let ptvCombo;
let fatLipCombo;
let loveGirlCombo;
let test2 = 1;
let test3;

// hitbox maxes and mins, all maxes are represented on top of the note, while mins are below notes,
// meaning the "maxes" are lower y-values than the mins
let perfMax; //perfect hitbox max (from the top)
let perfMin; //perfect hitboc min (from the bottom)
let awesMax;
let awesMin;
let greatMax;
let greatMin;
let goodMax;
let goodMin;
let scoreDis; //distance between hitboxes

//scoreboard variables
let scoreboard;
let stringys = []; //list of stringy objects that pop on screen whenever a note is hit
let timeOffset; //time offset (in milliseconds) between time when program started running and when actual game started


// color variables of squishies
let redColorVel = 1; 
let greenColorVel = 1;
let blueColorVel = 1;

// list of squishie objects in playscene
let squishies = [];
let squishSpawned = false; //checks if a squishie has been spawned in an amount of time

// song variables
let song;
let fatLip;
let holdOn;
let loveGirl;
let fatLipSample;
// gamestate variable
let gameState = "start";
let titleState = "start";

// track outline x positions
let firstOutlineX;
let secondOutlineX;
let thirdOutlineX;
let fourthOutlineX;
// album covers for selection screen
let ptvCover;
let fatLipCover;
let whiteStripesCover;

//selection button
let fatLipButton;
let ptvButton;
let loveGirlButton;

//song objects
let fatLipSong;
let ptvSong;
let loveSong;

//lasers
let leftLasers = [];
let rightLasers = [];
let laserCount = 3;

//game classes
// scoreboard object, controls the ui of the scoreboard in game, along with checking if the score of a hit note
class Scoreboard {
  constructor(){ //scoreboard constructor
    this.score = 0; // player score
    this.posX = scoreX; //x position of score
    this.posY = scoreY; //y position of score
  }

  /*render(){ //renders scoreboard
    push();
    textAlign(CENTER);
    textSize(40); //was 25
    fill(255);
    stroke(0);
    strokeWeight(2);
    text(this.score, this.posX, this.posY); //shows score
    pop();
  } */
    render(){ //renders scoreboard
    push();
    let shakeX = 0;
    let shakeY = 0;
    if (chaosLevel >= 4) {
    let shakeAmt = map(chaosLevel, 4, 10, 1, 8);
    shakeX = random(-shakeAmt, shakeAmt);
    shakeY = random(-shakeAmt, shakeAmt);
    }
    textAlign(CENTER);
    textSize(40);
    fill(255);
    stroke(0);
    strokeWeight(2);
    text(this.score, this.posX + shakeX, this.posY + shakeY);
    pop();
    }

  update(s){ //updates the score with a given s
    this.score += s;
  }

  checkScore(note){ //checks the position of a hit note and gives a score based off of position
    if (note.yPos <= perfMin && note.yPos >= perfMax){ //perfect note
      baseScore = 5; //changes "basescore", which is a variable used to update the score when this function is called
      combo += 5; //updates combo, which impacts the background elements that get more hectic as player does better
    }
    else if (note.yPos <= awesMin && note.yPos >= awesMax){ //awesome note
      baseScore = 4;
      combo += 4;
    }
    else if (note.yPos <= greatMin && note.yPos >= greatMax){ //great note
      baseScore = 3;
      combo += 3;
    }
    else if (note.yPos <= goodMin && note.yPos >= goodMax){ //good note
      baseScore = 2;
      combo += 2;
    } 
    else {
      baseScore = 0;
      combo -= 5;
      if (combo <= 0){
        combo = 0;
      }
    }
  }
}

class Note {
  constructor(t, y, lb, rb, o){
    this.type = t;
    this.yPos = y;
    this.speed = vel;
    if (t == 1) {this.xPos = firstNPos;}
    else if (t == 2) {this.xPos = secondNPos;}
    else if (t == 3) {this.xPos = thirdNPos;}
    else if (t == 4) {this.xPos = fourthNPos;}
    this.leftBound = lb;
    this.rightBound = rb;
    this.hVel = 0;
    this.outline = o;
  }


render(){
  push();
  imageMode(CENTER);
  if (this.type == 1){
    if (this.outline){
      image(outlineBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
    else {
    image(greenBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
  } else if (this.type == 2){
    if (this.outline){
      image(outlineBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
    else {
    image(yellowBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
  } else if (this.type == 3){
    if (this.outline){
      image(outlineBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
    else {
    image(redBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
  } else if (this.type == 4){
    if (this.outline){
      image(outlineBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
    else {
    image(blueBtn, this.xPos, this.yPos, scaleX * 1.4, scaleY * 1.4);
    }
  }
 
  imageMode(CORNER);
  pop();
}

  move(){
    this.yPos += this.speed;
    
  }

  shuffle(){
    if (this.outline){
    this.xPos += this.hVel;
    this.bounce();
    if (this.hVel >= 0){
      this.hVel = map(combo - maxCombo * 0.35, 0, maxCombo, 0, 13);
    }
    else if (this.hVel < 0){
      this.hVel = -1 * map(combo - maxCombo * 0.35, 0, maxCombo, 0, 13);
    }
    }
    else {
      if (this.type == 1){
        this.xPos = firstOutlineX;
      }
      else if (this.type == 2){
        this.xPos = secondOutlineX;
      }
      else if (this.type == 3){
        this.xPos = thirdOutlineX;
      }
      else if (this.type == 4){
        this.xPos = fourthOutlineX;
      }
    }
  }

  bounce(){
    if (this.xPos + (scaleX * 1.4)/2 >= this.rightBound || this.xPos - (scaleX * 1.4)/2 <= this.leftBound){
      this.hVel *= -1;
    }
  }
}

class PopUp {
  constructor(t, n){
    if (t == 0) this.stringy = "Missed!";
    else if (t == 2) this.stringy = "Good!";
    else if (t == 3) this.stringy = "Great!";
    else if (t == 4) this.stringy = "Awesome!";
    else if (t == 5) this.stringy = "Perfect!";
    this.x = n.xPos;
    this.y = n.yPos;
    this.rotation = (this.x <= width / 2) ? -45 : 45;
    this.transparancy = 250;
  }

  render(){
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    textAlign(CENTER);
    textSize(15);
    fill(230, this.transparancy);
    stroke(0, this.transparancy);
    text(this.stringy, 0, 0);
    pop();
  }

  update(){
    this.x -= 1;
    this.y -= 1;
    this.transparancy -= 5;
  }
}

class Squishy {
  constructor(x, y, r, g, b, h){
    this.xPos = x;
    this.yPos = y;
    this.rotation = 1;
    if (h == 1){ this.xVel = 1; this.yVel = 1; }
    else if (h == 2){ this.xVel = -1; this.yVel = 1; }
    this.circles = 5;
    this.red = r;
    this.b = b;  // renamed from this.blue
    this.green = g;
  }

  render(){
    push();
    translate(this.xPos, this.yPos);
    rotate(radians(this.rotation));
    squishyThree(0, 0, this.circles, 50, this.red, this.green, this.b);
    pop();
  }

  bounce(){
    if (this.xPos <= 0 || this.xPos >= width) this.xVel *= -1;
    if (this.yPos <= 0 || this.yPos >= height) this.yVel *= -1;
  }

  update(){
    this.xPos += this.xVel;
    this.yPos += this.yVel;
    this.bounce();
    this.rotation++;
    this.colorChange();
    this.xVel = (this.xVel >= 0) ? map(combo, 0, maxCombo, 1, 20) : -1 * map(combo, 0, maxCombo, 1, 20);
    this.yVel = (this.yVel >= 0) ? map(combo, 0, maxCombo, 1, 20) : -1 * map(combo, 0, maxCombo, 1, 20);
    this.rotation += map(combo, 0, maxCombo, 1, 20);
  }

  colorChange(){
    this.red += map(redColorVel, 0, 400, 0, 255);
    this.b += map(blueColorVel, 0, 400, 0, 255);
    this.green += map(greenColorVel, 0, 400, 0, 255);
    if (this.red >= 240 || this.red <= 5) redColorVel *= -1;
    if (this.green >= 200 || this.green <= 30) greenColorVel *= -1;
    if (this.b >= 220 || this.red <= 70) blueColorVel *= -1;
  }
}

class Song {
  constructor(aud, f, t, sp){
    this.audio = aud;
    this.frames = f;
    this.types = t;
    this.vel = sp;
  }


}

class Laser {
  constructor(t){
    this.type = t;
    if (this.type == 1){
    this.xPos = random(width * 0.1, width * 0.49);
    this.vel = random(5, 10);
    }
    else if (this.type == 2){
      this.xPos = random(width * 0.51, width * 0.99);
      this.vel = -1 * random(5, 10);
    }
  }

  /*render(){
    push();
    fill(200, 0, 0);
    stroke(200, 0, 0);
    strokeWeight(5);
    if (this.type == 1){
      line(0, 0, this.xPos, height);
    }
    else if (this.type == 2){
      line(width, 0, this.xPos, height);
    }
    pop();
  }*/
    render(){
    push();
    let t = frameCount * 0.02 + this.xPos * 0.01;
    let r = sin(t) * 127 + 128;
    let g = sin(t + 2.094) * 127 + 128;
    let b = sin(t + 4.189) * 127 + 128;
    let col = [r, g, b];
      for (let g = 4; g >= 0; g--) {
        stroke(col[0], col[1], col[2], g == 0 ? 255 : 40);
        strokeWeight(g == 0 ? 2 : g * 5);
        if (this.type == 1){
          line(0, 0, this.xPos, height);
        } else if (this.type == 2){
          line(width, 0, this.xPos, height);
        }
      }
      pop();
    }

  move(){
    this.xPos += this.vel;
    this.bounce();
    if (this.vel >= 0){
      this.vel = map(combo, 0, maxCombo, 5, 30);
    }
    else if (this.vel < 0){
      this.vel = -1 * map(combo, 0, maxCombo, 5, 30);
    }
  }

  bounce(){
    if (this.type == 1){
      if (this.xPos >= width / 2 || this.xPos <= 0){
        this.vel *= -1;
      }
    }
    else if (this.type == 2){
      if (this.xPos <= width / 2 || this.xPos >= width){
        this.vel *= -1;
      }
    }
  }
}

//preload
function preload() {
  logo = loadImage("logo.png");
  downArrow = loadImage("downArrow.png");
  rightArrow = loadImage("downArrow.png");
  upArrow = loadImage("downArrow.png");
  leftArrow = loadImage("downArrow.png");
  holdOn = loadSound("HoldOnTilMay.mp3");
  ptvCover = loadImage("PTVCollideWithSky.jpg");
  fatLip = loadSound("FatLipSum41.mp3");
  fatLipCover = loadImage("fatLipCover.jpg");
  greenBtn   = loadImage("greenbutton.png");
  yellowBtn  = loadImage("yellowbutton.png");
  redBtn     = loadImage("redbutton.png");
  blueBtn    = loadImage("bluebutton.png");
  outlineBtn = loadImage("white outline.png");
  whiteStripesCover = loadImage("thewhitestripes_albumcover.jpg");
  gameBg = loadImage("background_final.png");
  loveGirl = loadSound("Fell In Love With a Girl.mp3");
  subwayGif = loadImage("subwaysurfers.gif");
  carpetGif = loadImage("carpetcleaning.gif");
  slimeGif = loadImage("slime.gif");
  beeGif = loadImage("beemovie.gif");
  slime2Gif = loadImage("slime2.gif");
  minionsGif = loadImage("minions.gif");
  girlGif = loadImage("girl.gif");
  nyancatGif = loadImage("nyancat.gif");
  bunnyGif = loadImage("bunny.gif");
}

//setup
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.setAttribute("tabindex", "0");
  canvas.elt.focus();
  drawingContext.imageSmoothingEnabled = false;
  frameRate(60);

  //dots in bg
  for (let i = 0; i < 60; i++) {
    dots.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.2, 0.8),
      opacity: random(80, 180),
      col: random([
        [0, 200, 220],
        [255, 0, 144],
        [123, 0, 212]
      ])
    });
  }
  initChats();

//game setup
  bound1 = width * 0.1;
  bound2 = width * 0.3;
  bound3 = width * 0.5;
  bound4 = width * 0.7;
  bound5 = width * 0.9;
  spawnY = -(height * 0.25);
  scaleX = 50;
  scaleY = 50;
  holdOnVel = height / 90;
  fatLipVel = height/60;
  vel = fatLipVel;
  holdOnTilMayFrames = [13.177, 13.602, 14.266, 14.898, 16.483, 16.869, 17.301, 17.738, 18.153, 18.966, 20.662, 21.081, 21.3, 21.514, 21.95, 22.413, 22.758, 23.23, 23.597, 24.013, 24.412, 24.836, 26.853, 27.409, 28.024, 29.205, 29.618, 30.053, 30.677, 31.263, 32.511, 32.896, 33.291, 33.698, 34.131, 34.571, 35.362, 35.77, 36.177, 36.571, 37.433, 37.689, 37.905, 38.111, 38.465, 39.036, 39.568, 40.542, 40.92, 41.276, 41.644, 42.018, 42.431, 42.823, 43.747, 44.13, 44.542, 44.91, 45.325, 45.73, 46.098, 46.972, 47.348, 47.753, 48.141, 48.576, 48.99, 49.399, 50.254, 50.665, 51.075, 51.488, 52.071, 52.616, 53.221, 53.419, 53.628, 53.874, 54.079, 54.294, 54.544, 54.743, 55.308, 55.944, 56.937, 57.329, 57.68, 58.07, 58.443, 58.806, 59.153, 60.094, 60.485, 60.905, 61.321, 61.684, 62.037, 62.474, 76.624, 76.845, 77.241, 77.613, 78.45, 78.922, 79.278, 79.382, 79.882, 80.205, 80.414, 80.477, 81.29, 81.761, 81.876, 81.985, 82.183, 82.412, 82.623, 82.735, 83.178, 83.378, 83.689, 84.102, 84.398, 85.001, 85.322, 85.542, 85.769, 85.984, 86.095, 86.299, 86.703, 86.807, 87.179, 87.893, 88.321, 88.421, 88.527, 88.947, 89.058, 89.375, 89.575, 89.785, 89.898, 90.199, 90.564, 91.031, 91.894, 92.778, 93.309, 93.413, 93.75, 94.253, 95.732, 95.931, 96.279, 96.591, 97.04, 97.41, 98.768, 98.871, 99.083, 99.944, 100.263, 100.544, 100.725, 101.013, 101.36, 101.621, 101.847, 102.342, 102.742, 103.157, 103.373, 103.579, 103.933, 104.504, 105.036, 106.01, 106.388, 106.744, 107.112, 107.486, 107.899, 108.291, 109.215, 109.598, 110.01, 110.378, 110.793, 111.198, 111.566, 112.44, 112.816, 113.221, 113.609, 114.044, 114.458, 114.867, 115.722, 116.133, 116.543, 116.956, 117.539, 118.084, 118.689, 118.887, 119.096, 119.342, 119.547, 119.762, 120.012, 120.211, 120.776, 121.412, 122.405, 122.797, 123.148, 123.538, 123.911, 124.274, 124.621, 125.562, 125.953, 126.373, 126.789, 127.152, 127.505, 127.942, 131.468, 131.992, 132.732, 133.461, 134.306, 135.094, 135.955, 136.609, 136.825, 141.754, 142.19, 142.821, 143.436, 144.207, 144.64, 144.946, 145.379, 146.001, 146.294, 146.608, 147.203, 147.513, 148.674, 149.188, 149.636, 149.967, 150.486, 151.228, 155.776, 156.133, 156.495, 157.841, 158.244, 158.942, 159.901, 160.731, 161.601, 162.252, 162.997, 164.588, 165.166, 165.467, 165.754, 166.161, 166.637, 166.841, 168.035, 168.391, 169.113, 169.717, 170.494, 170.94, 171.342, 172.067, 172.484, 172.927, 173.302, 173.927, 174.154, 174.564, 175.015, 175.648, 175.742, 176.25, 176.648, 177.317, 177.9, 178.805, 179.144, 179.517, 179.978, 180.669, 208.195, 208.645, 208.979, 209.365, 209.889, 210.499, 211.353, 211.921, 212.233, 212.629, 213.122, 213.463, 213.871, 214.848, 215.128, 215.512, 215.912, 216.31, 216.698, 217.177, 217.945, 218.469, 218.76, 219.158, 219.673, 220.007, 220.431, 221.252, 221.735, 222.043, 222.489, 223.074, 223.638, 224.338, 224.556, 224.756, 224.957, 225.168, 225.386, 225.588, 225.799, 226.361, 226.994, 227.825, 228.25, 228.667, 229.051, 229.547, 229.94, 230.314, 231.605, 231.89, 232.406, 232.723, 233.205, 233.581];
  holdOnTilMayTypes = [3, 3, 1, 2, 1, 1, 1, 3, 4, 1, 4, 1, 1, 4, 4, 4, 4, 4, 3, 3, 3, 2, 3, 1, 1, 2, 2, 1, 4, 1, 2, 2, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 3, 2, 4, 2, 4, 3, 4, 4, 1, 4, 3, 1, 3, 4, 1, 2, 2, 4, 1, 2, 3, 2, 1, 3, 4, 3, 4, 1, 2, 3, 2, 2, 1, 3, 1, 2, 3, 1, 3, 4, 2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 3, 4, 4, 4, 3, 3, 4, 1, 1, 4, 2, 2, 4, 1, 1, 2, 4, 3, 1, 1, 3, 1, 2, 2, 3, 2, 3, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 3, 3, 3, 2, 3, 1, 4, 2, 2, 3, 3, 4, 4, 2, 2, 3, 1, 3, 3, 3, 1, 1, 4, 3, 4, 4, 2, 2, 4, 2, 3, 4, 3, 4, 1, 1, 1, 4, 1, 2, 1, 3, 2, 2, 1, 1, 1, 3, 4, 3, 2, 4, 4, 1, 1, 1, 3, 1, 4, 4, 4, 2, 4, 4, 1, 4, 2, 1, 2, 4, 3, 3, 1, 3, 2, 3, 3, 3, 1, 3, 2, 4, 1, 1, 1, 1, 1, 4, 2, 2, 1, 3, 4, 3, 2, 1, 2, 2, 3, 4, 2, 3, 2, 1, 2, 4, 4, 1, 1, 3, 4, 4, 1, 2, 4, 4, 3, 4, 4, 3, 2, 1, 2, 1, 2, 3, 3, 3, 4, 3, 4, 2, 4, 2, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 4, 1, 2, 1, 4, 3, 2, 3, 3, 2, 4, 2, 1, 2, 3, 2, 4, 3, 2, 1, 1, 2, 1, 4, 1, 2, 1, 4, 2, 2, 3, 3, 4, 2, 4, 4, 2, 4, 1, 1, 4, 3, 1, 2, 4, 3, 3, 4, 1, 1, 4, 1, 1, 3, 1, 3, 1, 4, 3, 3, 3, 1, 3, 4, 3, 2, 1, 3, 3, 4, 4, 4, 2, 4, 1, 3, 3, 4, 3, 1, 4];
  fatLipFrames = [18.864, 19.021, 19.172, 19.286, 19.487, 19.588, 19.692, 19.901, 20.005, 20.179, 20.392, 20.498, 20.705, 20.913, 21.017, 21.224, 21.428, 21.633, 21.934, 22.041, 22.146, 22.348, 22.449, 22.657, 22.761, 2.868, 22.97, 23.177, 23.292, 23.393, 23.494, 23.699, 23.913, 24.116, 24.233, 24.535, 24.639, 24.849, 24.953, 25.068, 25.171, 25.376, 25.78, 25.988, 26.203, 26.504, 26.81, 26.96, 27.117, 27.429, 27.636, 27.75, 27.851, 28.161, 28.362, 28.564, 28.866, 28.97, 29.07, 29.286, 29.388, 29.491, 29.609, 29.815, 30.019, 30.125, 30.329, 30.53, 30.933, 31.242, 31.444, 31.746, 31.848, 31.947, 32.156, 32.264, 32.471, 32.674, 32.881, 32.984, 33.29, 33.491, 33.596, 33.8, 33.908, 34.109, 34.516, 34.731, 34.897, 35.043, 35.148, 35.356, 35.763, 35.964, 36.173, 36.293, 36.498, 36.6, 36.802, 36.912, 37.013, 37.219, 37.822, 38.028, 38.138, 38.242, 38.445, 39.05, 39.555, 40.058, 40.162, 40.465, 40.573, 40.682, 40.885, 41.101, 41.21, 41.425, 41.734, 41.842, 42.052, 42.453, 42.655, 42.86, 42.963, 43.073, 43.275, 43.978, 44.485, 44.988, 45.193, 45.3, 45.509, 45.613, 45.731, 45.938, 46.34, 46.648, 46.752, 46.96, 47.168, 47.477, 47.678, 47.885, 48.157, 48.857, 49.457, 50.057, 50.657, 51.257, 51.857, 57.97, 58.568, 59.159, 59.723, 60.455, 60.558, 60.761, 60.963, 61.204, 61.306, 61.507, 61.609, 61.817, 61.925, 62.127, 62.641, 62.857, 63.029, 63.27, 63.376, 63.579, 63.784, 63.898, 64.104, 64.21, 64.324, 64.432, 64.636, 65.072, 65.175, 65.277, 65.49, 65.694, 66.002, 66.103, 66.304, 66.51, 66.723, 66.937, 67.139, 67.74, 67.85, 68.151, 68.36, 68.668, 68.769, 68.873, 69.078, 69.298, 69.603, 69.906, 70.212, 70.327, 70.542, 70.643, 70.848, 70.956, 71.156, 71.271, 71.478, 71.581, 71.785, 71.889, 72.191, 72.7, 72.803, 73.008, 73.111, 73.319, 73.423, 73.53, 73.748, 73.956, 74.063, 74.168, 74.383, 74.586, 74.986, 75.09, 75.297, 75.411, 75.514, 75.63, 76.133, 76.335, 76.552, 76.655, 76.77, 76.875, 77.382, 77.489, 77.694, 77.796, 77.901, 78.122, 78.226, 78.432, 78.535, 78.738, 79.347, 79.556, 79.668, 79.782, 80.084, 80.596, 81.203, 81.711, 81.818, 82.025, 82.133, 82.236, 82.443, 82.657, 82.766, 82.972, 83.374, 83.481, 83.583, 83.989, 84.194, 84.406, 84.612, 84.725, 84.929, 85.53, 86.034, 86.511, 86.709, 86.916, 87.025, 87.133, 87.338, 87.521, 87.986, 88.17, 88.286, 88.493, 88.825, 89.106, 89.21, 89.41, 89.756, 90.385, 91.035, 91.667, 92.3, 92.932, 93.568, 94.199, 100.524, 100.835, 101.454, 101.842, 103.127, 103.331, 103.626, 103.909, 104.227, 105.073, 105.674, 106.356, 106.611, 108.032, 108.135, 108.457, 108.729, 109.129, 110.142, 110.54, 111.338, 111.516, 112.786, 112.897, 113.007, 113.335, 113.675, 113.987, 114.88, 115.495, 116.147, 116.349, 117.76, 117.965, 118.261, 118.574, 118.677, 118.732, 118.779, 118.868, 118.968, 119.377, 119.679, 119.879, 120.081, 120.193, 120.4, 120.508, 120.723, 121.024, 121.331, 121.64, 121.941, 122.046, 122.15, 122.557, 122.658, 122.774, 122.971, 123.173, 123.479, 123.593, 123.694, 123.802, 124.003, 124.205, 124.309, 124.52, 124.621, 124.726, 124.932, 125.038, 125.244, 125.548, 125.653, 125.858, 125.969, 126.177, 126.283, 126.486, 126.896, 127.001, 127.316, 127.498, 127.5, 127.704, 128.015, 128.119, 128.323, 128.428, 128.445, 128.646, 128.761, 128.965, 129.173, 129.475, 129.78, 129.991, 130.197, 130.304, 130.418, 130.621, 130.73, 130.942, 131.143, 131.246, 131.349, 131.651, 131.965, 132.169, 132.281, 132.395, 132.507, 132.708, 132.909, 133.111, 133.316, 133.427, 133.739, 134.047, 134.152, 134.357, 134.568, 134.679, 134.784, 135.187, 135.401, 135.606, 135.91, 136.014, 136.12, 136.329, 136.431, 136.632, 136.849, 137.051, 137.155, 137.474, 137.575, 137.782, 137.985, 138.389, 138.685, 138.989, 139.285, 139.589, 139.885, 140.189, 140.585, 140.789, 141.185, 141.389, 141.685, 141.989, 142.285, 142.589, 142.985, 143.189, 143.585, 143.889, 144.285, 144.389, 145.53, 145.634, 145.735, 145.788, 146.028, 146.66, 147.167, 147.668, 147.829, 148.038, 148.146, 148.227, 148.462, 148.665, 148.835, 149.021, 149.385, 149.486, 149.593, 150, 150.216, 150.444, 150.5, 150.609, 151.013, 151.621, 152.039, 152.501, 152.626, 152.816, 153.032, 153.136, 153.338, 153.686, 153.985, 154.188, 154.399, 154.504, 154.863, 155.165, 155.246, 155.432, 155.761, 155.823, 156.526, 157.036, 157.557, 157.985, 158.259, 158.493, 158.697, 158.856, 159.129, 159.233, 159.439, 159.826, 160.124, 160.706, 161.191, 161.824, 162.471, 162.772, 163.076, 163.348, 163.72, 163.992, 164.17, 164.381, 164.687, 164.912, 165.028, 165.298, 165.693, 166.193, 166.793, 167.393, 167.793, 168.293, 168.693, 169.293, 169.893, 170.393, 170.793];
  fatLipTypes = [1, 2, 1, 2, 3, 2, 3, 2, 3, 2, 3, 4, 3, 1, 1, 1, 2, 2, 2, 3, 2, 4, 2, 1, 3, 2, 4, 3, 1, 3, 4, 3, 2, 4, 2, 1, 3, 1, 4, 2, 1, 4, 4, 4, 1, 3, 4, 4, 1, 2, 2, 2, 2, 1, 2, 4, 3, 2, 2, 2, 3, 4, 1, 1, 2, 2, 1, 1, 4, 4, 3, 3, 1, 3, 1, 1, 2, 1, 2, 4, 3, 2, 1, 3, 2, 1, 2, 1, 2, 4, 1, 3, 2, 2, 1, 4, 1, 3, 1, 2, 3, 2, 2, 4, 3, 2, 2, 2, 1, 3, 1, 4, 2, 3, 3, 1, 4, 2, 1, 1, 3, 3, 3, 2, 2, 1, 1, 2, 2, 3, 3, 3, 4, 1, 1, 3, 1, 4, 4, 1, 1, 1, 4, 2, 3, 1, 3, 4, 3, 3, 1, 3, 4, 2, 4, 3, 1, 1, 1, 3, 1, 3, 4, 4, 3, 2, 1, 2, 3, 3, 1, 1, 4, 2, 3, 2, 2, 2, 1, 4, 4, 3, 2, 1, 2, 4, 3, 3, 4, 2, 2, 1, 4, 2, 1, 2, 4, 4, 2, 1, 1, 4, 4, 4, 1, 2, 2, 1, 3, 3, 1, 3, 1, 2, 2, 1, 1, 1, 3, 3, 3, 4, 2, 4, 1, 3, 3, 3, 1, 4, 1, 3, 3, 2, 4, 3, 3, 2, 3, 1, 3, 4, 3, 2, 1, 2, 4, 4, 3, 4, 4, 4, 2, 4, 3, 1, 2, 3, 1, 1, 2, 1, 4, 2, 3, 3, 3, 2, 1, 1, 3, 3, 2, 2, 3, 4, 3, 2, 4, 4, 3, 3, 3, 3, 2, 1, 4, 4, 2, 4, 3, 1, 1, 1, 1, 4, 1, 2, 1, 4, 1, 2, 3, 3, 3, 4, 3, 2, 1, 3, 1, 1, 4, 1, 1, 3, 3, 2, 1, 4, 4, 4, 2, 3, 1, 1, 2, 3, 2, 4, 3, 2, 2, 4, 3, 2, 2, 2, 3, 4, 4, 2, 1, 4, 2, 1, 2, 3, 2, 1, 1, 1, 1, 3, 1, 3, 2, 1, 3, 3, 1, 1, 1, 3, 4, 4, 2, 1, 3, 4, 3, 2, 1, 2, 2, 3, 4, 4, 4, 3, 2, 1, 1, 3, 4, 2, 3, 4, 4, 1, 4, 1, 4, 2, 4, 3, 3, 3, 2, 2, 4, 4, 4, 2, 4, 4, 4, 4, 1, 3, 1, 3, 2, 1, 3, 4, 1, 2, 1, 3, 2, 3, 4, 3, 4, 2, 3, 4, 2, 2, 4, 1, 3, 2, 3, 3, 1, 4, 4, 4, 4, 1, 1, 4, 4, 2, 2, 3, 2, 3, 1, 1, 1, 2, 2, 4, 4, 1, 2, 4, 4, 4, 1, 2, 1, 4, 1, 2, 1, 3, 3, 4, 3, 2, 2, 4, 2, 3, 4, 2, 2, 2, 3, 1, 1, 1, 2, 2, 2, 3, 4, 1, 4, 4, 3, 4, 2, 2, 2, 4, 3, 3, 1, 4, 3, 1, 1, 2, 1, 4, 2, 2, 4, 3, 4, 4, 2, 1, 1, 4, 4, 4, 2, 2, 3, 4, 3, 3, 2, 2, 3, 1, 3, 2, 1, 1, 4, 3, 4, 2, 3, 1, 2, 2, 3];
  loveGirlFrames = [5.06, 5.19, 5.389, 5.499, 5.703, 5.842, 7.031, 7.15, 7.402, 7.489, 7.808, 8.207, 8.313, 8.503, 8.761, 9.012, 9.221, 9.92, 10.201, 10.313, 10.492, 10.61, 10.809, 11.615, 11.804, 12.154, 12.488, 12.732, 12.88, 13.092, 13.22, 13.389, 13.679, 13.899, 14.097, 14.907, 15.136, 15.401, 15.499, 15.698, 15.897, 16.209, 16.376, 16.74, 16.79, 16.938, 17.189, 17.528, 17.747, 18.061, 18.216, 18.418, 18.683, 18.879, 19.128, 19.948, 20.131, 20.28, 20.379, 20.595, 20.735, 20.894, 21.027, 21.359, 21.638, 22.136, 22.235, 22.434, 22.514, 22.761, 22.92, 23.058, 23.258, 23.499, 23.573, 23.683, 23.912, 24.182, 24.36, 24.983, 25.243, 25.422, 25.621, 25.743, 26.93, 27.031, 27.179, 27.468, 27.639, 27.811, 27.94, 28.099, 28.238, 28.418, 28.648, 28.847, 29.146, 29.784, 29.894, 30.093, 30.232, 30.395, 30.514, 30.734, 31.593, 31.822, 32.13, 32.479, 32.549, 32.758, 33.006, 33.172, 33.347, 33.558, 33.76, 34.059, 34.916, 35.215, 35.444, 35.542, 35.642, 35.853, 36.076, 36.223, 36.538, 36.838, 37.077, 37.336, 37.65, 37.911, 38.062, 38.161, 38.36, 38.559, 38.758, 39.037, 39.746, 39.954, 40.152, 40.251, 40.453, 40.764, 40.994, 41.262, 41.591, 42.031, 42.21, 42.34, 42.531, 42.713, 43.041, 43.248, 43.386, 43.716, 43.855, 44.164, 44.317, 54.884, 55.154, 55.365, 55.564, 55.664, 55.861, 56.121, 56.299, 56.559, 56.892, 57.073, 57.332, 57.71, 57.979, 58.128, 58.19, 58.318, 58.58, 58.81, 59.118, 59.799, 59.959, 60.238, 60.317, 60.528, 60.747, 61.036, 61.276, 61.521, 61.98, 62.13, 62.289, 62.427, 62.667, 63.037, 63.136, 63.345, 63.622, 63.85, 64.137, 64.279, 64.894, 65.099, 65.269, 65.448, 65.549, 65.778, 66.948, 67.087, 67.249, 67.518, 67.817, 68.046, 68.281, 68.445, 68.684, 68.856, 69.09, 69.842, 70.108, 70.219, 70.388, 70.568, 70.704, 71.574, 71.723, 72.012, 72.342, 72.627, 72.785, 72.985, 73.144, 73.313, 73.542, 73.791, 74.037, 74.774, 74.953, 75.238, 75.386, 75.585, 75.776, 76.024, 76.226, 76.443, 76.564, 76.813, 76.962, 77.221, 77.369, 77.727, 77.978, 78.147, 78.439, 78.678, 78.885, 79.821, 79.922, 80.052, 80.171, 80.431, 80.51, 80.682, 80.843, 81.14, 81.471, 81.934, 82.069, 82.17, 82.419, 82.568, 82.747, 82.916, 83.077, 83.22, 83.429, 83.588, 83.757, 83.997, 84.182, 95.089, 95.327, 95.527, 95.646, 95.825, 96.034, 96.263, 96.503, 96.713, 97.062, 97.229, 97.537, 97.816, 98.157, 98.266, 98.359, 98.538, 98.796, 99.009, 99.254, 100.055, 100.214, 100.413, 100.492, 100.591, 100.942, 101.151, 101.44, 101.719, 102.155, 102.343, 102.553, 102.811, 102.954, 103.223, 103.433, 103.662, 103.913, 104.148, 104.343, 104.555];
  loveGirlTypes = [1, 1, 2, 4, 4, 2, 1, 3, 2, 3, 1, 4, 2, 3, 2, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 4, 4, 1, 2, 1, 2, 3, 2, 2, 4, 4, 3, 4, 1, 4, 3, 3, 1, 4, 1, 3, 2, 4, 1, 1, 4, 4, 4, 1, 4, 3, 1, 1, 3, 2, 4, 2, 4, 1, 2, 1, 4, 2, 1, 1, 3, 4, 1, 4, 2, 4, 3, 3, 4, 3, 2, 4, 1, 2, 3, 4, 2, 4, 1, 2, 1, 2, 1, 3, 2, 3, 4, 3, 4, 2, 1, 4, 4, 3, 3, 1, 4, 4, 2, 3, 3, 3, 3, 3, 2, 3, 2, 1, 1, 4, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 3, 1, 1, 4, 1, 2, 1, 4, 2, 4, 4, 3, 3, 3, 4, 4, 4, 3, 1, 2, 3, 1, 3, 3, 3, 2, 2, 2, 1, 2, 2, 2, 1, 2, 4, 4, 3, 3, 2, 1, 3, 3, 4, 3, 3, 1, 2, 2, 4, 1, 1, 1, 3, 4, 2, 3, 2, 2, 3, 3, 4, 1, 3, 4, 3, 3, 2, 3, 1, 4, 4, 2, 1, 3, 3, 2, 3, 1, 2, 2, 4, 2, 4, 4, 1, 3, 1, 3, 1, 1, 4, 3, 3, 2, 3, 3, 4, 1, 1, 3, 2, 2, 2, 1, 3, 4, 1, 2, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 3, 1, 2, 3, 3, 3, 4, 1, 3, 4, 1, 4, 1, 3, 3, 3, 2, 2, 1, 4, 2, 2, 2, 1, 2, 1, 4, 3, 1, 4, 3, 3, 2, 3, 1, 2, 1, 2, 1, 3, 4, 2, 1, 2, 2, 1, 3, 1, 2, 1, 4, 2, 4, 3, 2, 2, 4, 3, 1, 1, 2, 1, 2, 3, 4, 4, 4, 4, 4];
  //arrowFrames = fatLipFrames;
  //arrowTypes = fatLipTypes;
  firstNPos = width * 0.2;
  secondNPos = width * 0.4;
  thirdNPos = width * 0.6;
  fourthNPos = width * 0.8;
  
  firstArrow = new Note(1, height * 0.75, bound1, bound2, true);
  secondArrow = new Note(2, height * 0.75, bound2, bound3, true);
  thirdArrow = new Note(3, height * 0.75, bound3, bound4, true);
  fourthArrow = new Note(4, height * 0.75, bound4, bound5, true);
  firstOutlineX = firstNPos;
  secondOutlineX = secondNPos;
  thirdOutlineX = thirdNPos;
  fourthOutlineX = fourthNPos;
  scoreDis = height * 0.015;
  perfMax = (height * 0.75) - scoreDis;
  perfMin = (height * 0.75) + scoreDis;
  awesMax = perfMax - scoreDis;
  awesMin = perfMin + scoreDis;
  greatMax = awesMax - scoreDis;
  greatMin = awesMin + scoreDis;
  goodMax = greatMax - scoreDis;
  goodMin = greatMin + scoreDis;
  scoreX = width / 2;
  scoreY = height * 0.1; //try 0.15 next
  scoreboard = new Scoreboard();
  let tempSquishy = new Squishy(width / 2, height / 2, 50, 100, 150, 1);
  squishies.push(tempSquishy);
  //song = fatLip;
  fatLipSong = new Song(fatLip, fatLipFrames, fatLipTypes, fatLipVel);
  ptvSong = new Song(holdOn, holdOnTilMayFrames, holdOnTilMayTypes, holdOnVel); 
  loveSong = new Song(loveGirl, loveGirlFrames, loveGirlTypes, height/60);
  ptvButton = createButton("Play");
  ptvButton.position(0 - 1000, 0 - 1000);
  ptvButton.mousePressed(selectPtvSong);
  fatLipButton = createButton("Play");
  fatLipButton.position(0 - 1000, 0 - 1000);
  fatLipButton.mousePressed(selectFatLip);
  loveGirlButton = createButton("Play");
  loveGirlButton.position(0 - 1000, 0 - 1000);
  loveGirlButton.mousePressed(selectLoveGirl);
  despawnPoint = height + scaleY * 1.4;
  for (let i = 0; i < laserCount; i++){
    let tempLeft = new Laser(1);
    leftLasers.push(tempLeft);
    let tempRight = new Laser(2);
    rightLasers.push(tempRight);
  }
  ptvCombo = 600;
  fatLipCombo = 900;
  loveGirlCombo = 600;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//key handling
function keyPressed() {
  // spacebar starts game from start screen or replays from end screen
  if (keyCode === 32) {
    if (gameState === "start") {
      if (titleState === "start"){
        titleState = "songSelect";
      } else if (titleState === "instructions") {  
        titleState = "start";                       
      }                  
      
    } else if (gameState === "end") {
      gameState = "start";
      cornerSize = 0;
    }
  }

  // D F H J key highlighting start screen
  if (keyCode === 68) arrowsHeld[0] = true; // D
  if (keyCode === 70) arrowsHeld[1] = true; // F
  if (keyCode === 72) arrowsHeld[2] = true; // H
  if (keyCode === 74) arrowsHeld[3] = true; // J

  // Brandon's game key handling
  if (gameState === "play") {
    if (key == 'd') {
      // flashTimers[0] = 8;
      if (arrowCount > 0 && arrows[0].type == 1){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'f') {
      //flashTimers[1] = 8;
      if (arrowCount > 0 && arrows[0].type == 2){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'h') {
      //flashTimers[2] = 8;
      if (arrowCount > 0 && arrows[0].type == 3){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'j') {
      // flashTimers[3] = 8;
      if (arrowCount > 0 && arrows[0].type == 4){
        scoreboard.checkScore(arrows[0]);
        scoreboard.update(baseScore);
        let tempText = new PopUp(baseScore, arrows[0]);
        stringys.push(tempText);
        arrows.splice(0, 1);
        arrowCount--;
      }
    } else if (key == 'b') {
      let tempSquishy = new Squishy(squishies[0].xPos, squishies[0].yPos, squishies[0].red, squishies[0].green, squishies[0].b, 2);
      squishies.push(tempSquishy);
    }
  }
}

function keyReleased() {
  if (keyCode === 68) arrowsHeld[0] = false; // D
  if (keyCode === 70) arrowsHeld[1] = false; // F
  if (keyCode === 72) arrowsHeld[2] = false; // H
  if (keyCode === 74) arrowsHeld[3] = false; // J
}

function mousePressed() {
  document.querySelector("canvas").focus();
    if (gameState === "start" && titleState === "start") {
      if (mouseY > 60 && mouseY < 90 &&
          mouseX > width - 205 && mouseX < width - 55) {
        titleState = "instructions"; 
          }
    }
}

//main draw loop
function draw() {
  textFont("Press Start 2P");
  if (gameState === "start") drawStartScreen();
  else if (gameState === "play") drawGame();
  else if (gameState === "end") drawEndScreen();

  blinkTimer++;

  // check if song finished — switch to end screen
  if (gameState === "play" && song && !song.isPlaying() && timeOffset !== undefined) {
    endGame(scoreboard.score);
  }
}

//START SCREEN
function drawStartScreen() {
  background(0);
  drawDots();

  //aesthetics
  stroke(0, 200, 220, 18);
  strokeWeight(1);
  let gridSize = 60;
  for (let x = 0; x < width; x += gridSize) line(x, 0, x, height);
  for (let y = 0; y < height; y += gridSize) line(0, y, width, y);

  noStroke();
  let pinkWash = drawingContext.createLinearGradient(0, 0, width * 0.5, height);
  pinkWash.addColorStop(0, "rgba(255,0,144,0.07)");
  pinkWash.addColorStop(1, "rgba(0,0,0,0)");
  drawingContext.fillStyle = pinkWash;
  rect(0, 0, width, height);

  let purpleWash = drawingContext.createLinearGradient(width, 0, width * 0.5, height);
  purpleWash.addColorStop(0, "rgba(123,0,212,0.1)");
  purpleWash.addColorStop(1, "rgba(0,0,0,0)");
  drawingContext.fillStyle = purpleWash;
  rect(0, 0, width, height);


  drawCorners(color(0, 200, 220), 40, 40, 3);

  //logo
  if (titleState === "start") {

  
  glowPulse += 0.03;
  let glowSize = sin(glowPulse) * 20 + 40;
  drawingContext.shadowColor = "rgba(255, 255, 255, 0.6)";
  drawingContext.shadowBlur = glowSize;
  let logoW = 420;
  let logoH = logoW * (logo.height / logo.width);
  let logoY = height / 2 - logoH / 2 - 60;
  image(logo, width / 2 - logoW / 2, logoY, logoW, logoH);
  drawingContext.shadowBlur = 0;

  // tagline
  noStroke();
  fill(0, 200, 220);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("// A RHYTHM ASSAULT //", width / 2, logoY + logoH * 0.78);

  drawArrowKeys(width / 2, logoY + logoH * 0.88 + 20);

  // blinking press spacebar to start
  if (floor(blinkTimer / 30) % 2 === 0) {
    fill(255,255,0);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("PRESS SPACEBAR TO START", width / 2, logoY + logoH * 0.88 + 80);
  }

  // HOW TO PLAY button
  fill(255, 0, 144);
  noStroke();
  rectMode(CENTER);
  rect(width - 130, 75, 140, 30, 4);
  rectMode(CORNER);
  fill(0);
  textSize(8);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("HOW TO PLAY", width - 130, 75);

  }
else if (titleState === "songSelect"){
  songSelection();
}
else if (titleState === "instructions"){
  drawInstructions();
}
  // footer
  fill(255, 255, 255, 160);
  textSize(10);
  textStyle(NORMAL);
  textAlign(LEFT);
  text("Brandon Harris & Paulina Valenzuela", 40, height - 20);
  textAlign(CENTER);
  text("WARNING: FLASHING LIGHTS", width / 2, height - 20);
  textAlign(RIGHT);
  text("© SMASHING BUTTONS", width - 40, height - 20);
}

// song selection screen
function songSelection(){
  fill(255, 0, 144);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("SELECT A SONG", width / 2, height * 0.12);

/*songUI(height * 0.3, ptvCover, "Hold On 'Til May", "Pierce the Veil", "2/3");
songUI(height * 0.5, fatLipCover, "Fat Lip", "Sum 41", "3/3");
songUI(height * 0.7, whiteStripesCover, "Fell in Love with a Girl", "The White Stripes", "1/3");

ptvButton.position(width/2 + width * 0.2, height * 0.3 - height * 0.02); //or 0.05
fatLipButton.position(width/2 + width * 0.2, height * 0.5 - height * 0.02);
loveGirlButton.position(width/2 + width * 0.2, height * 0.7 - height * 0.02); */

songUI(height * 0.3, ptvCover, "Hold On 'Til May", "Pierce the Veil", "1/3");
songUI(height * 0.5, whiteStripesCover, "Fell in Love with a Girl", "The White Stripes", "2/3");
songUI(height * 0.7, fatLipCover, "Fat Lip", "Sum 41", "3/3");

ptvButton.position(width/2 + width * 0.2, height * 0.3 - height * 0.02);
loveGirlButton.position(width/2 + width * 0.2, height * 0.5 - height * 0.02);
fatLipButton.position(width/2 + width * 0.2, height * 0.7 - height * 0.02);
}

function drawInstructions(){
  fill(255, 0, 144);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("HOW TO PLAY", width / 2, height * 0.1);

  stroke(255, 0, 144, 120);
  strokeWeight(1);
  line(width * 0.3, height * 0.16, width * 0.7, height * 0.16);
  noStroke();

  fill(0, 200, 220);
  textSize(11);
  text("THE BASICS", width / 2, height * 0.25);
  
  fill(255);
  textSize(9);
  text("NOTES FALL FROM THE TOP OF THE SCREEN.", width / 2, height * 0.32);
  text("HIT THE MATCHING KEY WHEN THEY REACH THE BOTTOM.", width / 2, height * 0.38);

  fill(0, 200, 220);
  textSize(11);
  text("THE KEYS", width / 2, height * 0.46);
  
  let keys = ["D", "F", "H", "J"];
  let keySize = 34;
  let gap = 8;
  let totalW = keys.length * (keySize + gap);
  let startX = width / 2 - totalW / 2;

for (let i = 0; i < keys.length; i++) {
  let x = startX + i * (keySize + gap);
  noFill();
  stroke(255, 255, 255, 60);
  strokeWeight(1.5);
  rect(x, height * 0.53 - keySize / 2, keySize, keySize, 4);
  noStroke();
  fill(255);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(keys[i], x + keySize / 2, height * 0.53);
}
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(9);  
  fill(255);
  text("EACH KEY MATCHES A LANE. HIT THEM IN TIME WITH THE MUSIC!", width / 2, height * 0.59);

  fill(255, 0, 144);
  textSize(11);
  text("WARNING", width / 2, height * 0.67);
  
  fill(255);
  textSize(9);
  text("THE LONGER YOU PLAY, THE MORE CHAOTIC THE SCREEN GETS.", width / 2, height * 0.74);
  text("STAY FOCUSED!", width / 2, height * 0.80);

  if (floor(blinkTimer / 30) % 2 === 0) {
    fill(255,255,0);
    textSize(18);
    textStyle(BOLD);
    text("PRESS SPACEBAR TO GO BACK", width / 2, height * 0.91);
  }
}
/*function songUI(y, i, title, artist, diff){
  push();
  translate(width/2, y);
  let textX = 0 - width * 0.15;
  rectMode(CENTER);
  imageMode(CENTER);
  fill(255, 30);
  stroke(0, 200, 220);
  strokeWeight(3);
  rect(0, 0, width * 0.5, height * 0.2);
  image(i, 0 - width * 0.2, 0, height * 0.17, height * 0.17);
  fill(255);
  noStroke();
  textSize(18);
  textAlign(LEFT);
  text(title, textX, 0 - height * 0.05);
  textSize(12);
  text(artist, textX, 0 - height * 0.02);
  text("Difficulty: " + diff, textX, 0 + height * 0.05);
  pop();
} */

function songUI(y, i, title, artist, diff){
  push();
  translate(width/2, y);
  let cardW = width * 0.55;
  let cardH = height * 0.17;
  let imgSize = cardH * 0.8;
  let imgX = -cardW/2 + imgSize/2 + 15;
  let textX = imgX + imgSize/2 + 20;
  rectMode(CENTER);
  fill(255, 15);
  stroke(0, 200, 220);
  strokeWeight(2);
  rect(0, 0, cardW, cardH, 6);
  imageMode(CENTER);
  image(i, imgX, 0, imgSize, imgSize);
  noStroke();
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(title, textX, -cardH * 0.2);
  textSize(10);
  textStyle(NORMAL);
  fill(255, 255, 255, 180);
  text(artist, textX, cardH * 0.05);
  let diffNum = int(diff.charAt(0));
  for (let d = 0; d < 3; d++){
    if (d < diffNum){
      fill(255, 0, 144);
      noStroke();
    } else {
      noFill();
      stroke(255, 255, 255, 80);
      strokeWeight(1);
    }
    circle(textX + d * 14 + 6, cardH * 0.28, 8);
  }
  pop();
}

function selectFatLip(){
  song = fatLipSong.audio;
  arrowFrames = fatLipSong.frames;
  arrowTypes = fatLipSong.types;
  vel = fatLipSong.vel;
  ptvButton.position(0 - 1000, 0 - 1000);
  fatLipButton.position(0 - 1000, 0 - 1000);
  loveGirlButton.position(0 - 1000, 0 - 1000);
  titleState = "start";
  gameState = "play";
  song.play();
  timeOffset = millis() / 1000;
  maxCombo = fatLipCombo;
}

function selectPtvSong(){
  song = ptvSong.audio;
  arrowFrames = ptvSong.frames;
  arrowTypes = ptvSong.types;
  vel = ptvSong.vel;
  ptvButton.position(0 - 1000, 0 - 1000);
  fatLipButton.position(0 - 1000, 0 - 1000);
  loveGirlButton.position(0 - 1000, 0 - 1000);
  titleState = "start";
  gameState = "play";
  song.play();
  timeOffset = millis() / 1000;
  maxCombo = ptvCombo;
}

function selectLoveGirl(){
  song = loveSong.audio;
  arrowFrames = loveSong.frames;
  arrowTypes = loveSong.types;
  vel = loveSong.vel;
  ptvButton.position(0 - 1000, 0 - 1000);
  fatLipButton.position(0 - 1000, 0 - 1000);
  loveGirlButton.position(0 - 1000, 0 - 1000);
  titleState = "start";
  gameState = "play";
  song.play();
  timeOffset = millis() / 1000;
  maxCombo = loveGirlCombo
}

//GAME///////////////////////////////////////////////
function drawGame() {
  let currentSec = (millis() / 1000) - timeOffset;
  image(gameBg, 0, 0, width, height);

  // gifs appear at different chaos levels
if (chaosLevel >= 3) {
  image(subwayGif, width - 220, 0, 200, 150);
}
if (chaosLevel >= 4) {
  image(slimeGif, 0, height - 180, 200, 180);
}
if (chaosLevel >= 5) {
  image(carpetGif, width - 220, height - 180, 200, 180);
}
if (chaosLevel >= 6) {
  image(beeGif, width / 2 - 150, height / 2 - 100, 300, 200);
}

if (chaosLevel >= 7) {
  push();
  rectMode(CORNER);
  image(slime2Gif, width - width, height - height, 300, 200);
  pop();
}

if (chaosLevel >= 8) {
  push();
  rectMode(CENTER);
  image(minionsGif, width / 2, height * 0.75, 300, 300);
  pop();
}

if (chaosLevel >= 9) {
  push();
  rectMode(CENTER);
  image(girlGif, width - 250, height * 0.3, 250, 200);
  pop();
}

if (chaosLevel >= 10) {
  push();
  rectMode(CENTER);
  image(nyancatGif, width/2, 0 + 50, 250, 200);
  pop();
}

  push();
  applyScreenShake();

 // let r = map(750 - combo, 0, 750, 0, 255);
 // let b = map(combo, 0, 750, 0, 255);
 // let g = map(combo, 0, 300, 0, 255);
 // background(r, g, b);

 if (currentSec >= 39.441){
  let blinkSpeed = floor(map(chaosLevel, 0, 10, 90, 30));
  if (floor(frameCount / blinkSpeed) % 2 === 0) {
  push();
  fill(0, 200);
  rectMode(CENTER);
  rect(width/2, height/2, width, height);
  pop();
  for (let i = 0; i < laserCount; i++){
    leftLasers[i].render();
    leftLasers[i].move();
    rightLasers[i].render();
    rightLasers[i].move();
  }
}

 }

  for (let i = 0; i < squishies.length; i++){
    squishies[i].render();
    squishies[i].update();
  }

  // chaos overlays
  if (chaosLevel >= 2) drawFakeChat();
  spawnBrainrot();
  drawBrainrot();

  //emoji rain
// if (chaosLevel >= 4 && frameCount % 20 === 0) {
// let emojis = ["💀", "🔥", "😭", "🗣️", "⚡", "🎵", "😩", "🤯", "👁️", "💅"];
// brainrotWords.push({
// word: random(emojis),
// x: random(width * 0.1, width * 0.9),
// y: -20,
// size: random(30, 80),
// speed: random(2, 6),
// col: [255, 255, 255],
// opacity: 255
//  );


//ghostscore
/*if (chaosLevel >= 8) {
  push();
  let ghostOffset = map(chaosLevel, 8, 10, 5, 25);
  fill(255, 0, 144, 80);
  textSize(40);
  textAlign(CENTER);
  text(scoreboard.score, scoreX + ghostOffset, scoreY + ghostOffset);
  fill(0, 200, 220, 80);
  text(scoreboard.score, scoreX - ghostOffset, scoreY - ghostOffset);
  pop();
}

// if (chaosLevel >= 9) {
//   let r = sin(frameCount * 0.05) * 127 + 128;
//   let g = sin(frameCount * 0.05 + 2) * 127 + 128;
//   let b = sin(frameCount * 0.05 + 4) * 127 + 128;
//   fill(r, g, b, 30);
//   noStroke();
//   rect(0, 0, width, height); */
//}

    if (chaosLevel >= 7 && frameCount % 45 === 0) {
    let flashColors = ["rgba(255,0,144,0.15)", "rgba(0,200,220,0.15)", "rgba(123,0,212,0.15)"];
    drawingContext.fillStyle = random(flashColors);
    noStroke();
    rect(0, 0, width, height);
  }

    let flashInterval = floor(map(chaosLevel, 2, 10, 90, 8));
    if (chaosLevel >= 2 && frameCount % flashInterval === 0) {
    let flashColors = ["rgba(255,0,144,0.15)", "rgba(0,200,220,0.15)", "rgba(123,0,212,0.15)"];
    drawingContext.fillStyle = random(flashColors);
    noStroke();
    rect(0, 0, width, height);
    }

  // key labels
  fill(255);
  textSize(28); //changed from 20 to 28
  textAlign(CENTER);
  text("D", width * 0.2, height * 0.85);
  text("F", width * 0.4, height * 0.85);
  text("H", width * 0.6, height * 0.85);
  text("J", width * 0.8, height * 0.85);

  push();
  imageMode(CENTER);
  let btnSize = scaleX * 1.4;
  firstArrow.render();
  secondArrow.render();
  thirdArrow.render();
  fourthArrow.render();
  if (combo >= maxCombo * 0.350){
  firstArrow.shuffle();
  firstOutlineX = firstArrow.xPos;
  secondArrow.shuffle();
  secondOutlineX = secondArrow.xPos;
  thirdArrow.shuffle();
  thirdOutlineX = thirdArrow.xPos;
  fourthArrow.shuffle();
  fourthOutlineX = fourthArrow.xPos;
  }
  pop();

  if (arrowFrames.length > 0){
    if (currentSec >= arrowFrames[0]) {
      if (arrowTypes[0] == 1) { spawnLeft(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
      else if (arrowTypes[0] == 2) { spawnDown(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
      else if (arrowTypes[0] == 3) { spawnUp(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
      else if (arrowTypes[0] == 4) { spawnRight(); arrowFrames.splice(0, 1); arrowTypes.splice(0, 1); }
    }
  }

  if (arrowCount > 0){
    for (let i = 0; i < arrowCount; i++){
      arrows[i].render();
      arrows[i].move();
      if (combo >= 0){
      arrows[i].shuffle();
      }
    }
    if (arrows[0].yPos >= despawnPoint){
        arrows.splice(0, 1);
        arrowCount--;
      }   
  }

  scoreboard.render();

  if (stringys.length > 0){
    for (let i = 0; i < stringys.length; i++){
      stringys[i].render();
      stringys[i].update();
      if (stringys[i].transparancy <= 0) stringys.splice(i, 1);
    }
  }

  spawnSquishy();
  drawChaosMeter();
  updateChaos();
//scoreLines();


  pop();
}

function endGame(finalScore) {
  if (finalScore > highScore) {
    highScore = finalScore;
    isNewHighScore = true;
  } else {
    isNewHighScore = false;
  }
  chaosLevel = 0;
  chaosTimer = 0;
  cornerSize = 0;
  gameState = "end";
}

//END SCREEN////////////
function drawEndScreen() {
  background(0);
  drawDots();

  //aesthteics
  stroke(255, 0, 144, 10);
  strokeWeight(1);
  for (let i = -height; i < width + height; i += 20) {
    line(i, 0, i + height, height);
  }

  drawCorners(color(0, 200, 220), 40, 40, 3);

  noStroke();
  textAlign(CENTER, CENTER);

  // song finished label
  fill(0, 200, 220);
  textSize(12);
  textStyle(BOLD);
  text("─────  SONG COMPLETE  ─────", width / 2, height * 0.14);

  // new high score badge
  if (isNewHighScore) {
    fill(255, 0, 144);
    rectMode(CENTER);
    rect(width / 2, height * 0.24, 340, 48, 2);
    rectMode(CORNER);
    fill(0);
    textSize(20);
    textStyle(BOLD);
    text("⚡  NEW HIGH SCORE  ⚡", width / 2, height * 0.24);
  }

  // score label
  fill(255, 255, 255, 100);
  textSize(13);
  textStyle(NORMAL);
  let scoreLabelY = isNewHighScore ? height * 0.36 : height * 0.28;
  text("YOUR SCORE", width / 2, scoreLabelY);

  drawingContext.shadowColor = "rgba(255,0,144,0.5)";
  drawingContext.shadowBlur = 50;
  fill(255);
  textSize(96);
  textStyle(BOLD);
  text(nf(scoreboard.score, 6), width / 2, scoreLabelY + 80);
  drawingContext.shadowBlur = 0;
  stroke(123, 0, 212, 120);
  strokeWeight(1);
  line(width * 0.2, height * 0.62, width * 0.8, height * 0.62);
  noStroke();

  drawStat("BEST\nCOMBO", str(combo),           width * 0.3, height * 0.71);
  drawStat("HITS",        str(scoreboard.score), width * 0.5, height * 0.71);
  drawStat("HIGH\nSCORE", str(highScore),        width * 0.7, height * 0.71);

  fill(255, 0, 144);
  rectMode(CENTER);
  rect(width / 2, height * 0.84, 220, 44, 2);
  rectMode(CORNER);
  fill(0);
  textSize(18);
  textStyle(BOLD);
  text("↺  PLAY AGAIN", width / 2, height * 0.84);



  fill(255, 255, 255, 60);
  textSize(11);
  textStyle(NORMAL);
  text("PRESS SPACEBAR TO PLAY AGAIN", width / 2, height * 0.92);
}

//spawn functions
function spawnLeft() {
  let tempNote = new Note(1, spawnY, bound1, bound2, false);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnRight() {
  let tempNote = new Note(4, spawnY, bound4, bound5, false);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnUp() {
  let tempNote = new Note(3, spawnY, bound3, bound4, false);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnDown() {
  let tempNote = new Note(2, spawnY, bound2, bound3);
  arrows.push(tempNote);
  arrowCount++;
}

function spawnSquishy(){
  if (scoreboard.score % 20 == 0 && scoreboard.score > 20 && !squishSpawned){
    let tempSquishy = new Squishy(squishies[0].xPos, squishies[0].yPos, squishies[0].red, squishies[0].green, squishies[0].b, 2);
    squishies.push(tempSquishy);
    squishSpawned = true;
  }
  if (scoreboard.score % 20 != 0){
    squishSpawned = false;
  }
}

function squishyThree(x, y, circNum, rad, r, g, b) {
  push();
  translate(x, y);
  noStroke();
  for (let i = 0; i < circNum; i++) {
    fill(r, g, b);
    circle(0, 0 - rad, rad * 1.35);
    rotate(radians(360 / circNum));
  }
  push();
  fill(r, g, b);
  circle(0, 0, rad);
  pop();
  pop();
}

//CHAOS SYSTEM
/*function updateChaos() {
  chaosTimer++;
  if (chaosTimer % 900 === 0 && chaosLevel < 10) {
    chaosLevel++;
    screenShake = 20;
  }
  screenShake = max(0, screenShake - 0.5);
}
function updateChaos() { ////chaos as song progresses 
  if (song && timeOffset !== undefined) {
    let currentSec = (millis() / 1000) - timeOffset;
    let songLength = song.duration();
    let progress = currentSec / songLength;
    chaosLevel = floor(map(progress, 0, 1, 0, 10));
    chaosLevel = constrain(chaosLevel, 0, 10);
  }

  chaosTimer++;
  screenShake = max(0, screenShake - 0.5);
} */

//chaos as song progfresses and as points are accumulated
function updateChaos() {
  if (song && timeOffset !== undefined) {
    let currentSec = (millis() / 1000) - timeOffset;
    let songLength = song.duration();
    let progress = currentSec / songLength;
    let progressChaos = floor(map(progress, 0, 1, 0, 5));
    let scoreChaos = floor(scoreboard.score / 20);
    chaosLevel = constrain(progressChaos + scoreChaos, 0, 10);
  }

  chaosTimer++;
  screenShake = max(0, screenShake - 0.5);
}

function applyScreenShake() {
  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
  }
}

function initChats() {
  for (let i = 0; i < 8; i++) {
    fakeChats.push({
      msg: random(chatMessages),
      y: random(height),
      opacity: random(150, 255),
      speed: random(0.3, 0.8)
    });
  }
}

function drawFakeChat() {
textAlign(LEFT, CENTER);
textSize(12);
textStyle(NORMAL);
let speedMult = map(chaosLevel, 0, 10, 1, 6);
let maxChats = floor(map(chaosLevel, 2, 10, 8, 20));
while (fakeChats.length < maxChats) {
  fakeChats.push({
  msg: random(chatMessages),
  y: random(height),
  opacity: random(150, 255),
  speed: random(0.3, 0.8)
 });
  }
for (let c of fakeChats) {
  fill(255, 255, 255, c.opacity);
  text(c.msg, 10, c.y);
  c.y -= c.speed * speedMult;
  if (c.y < 0) {
     c.y = height;
    c.msg = random(chatMessages);
    }
  }
}

function spawnBrainrot() {
  if (chaosLevel >= 3 && frameCount % 120 === 0) {
    brainrotWords.push({
      word: random(brainrotList),
      x: random(width * 0.1, width * 0.9),
      y: height + 20,
      size: random(20, 60),
      speed: random(1, 3),
      col: random([[255,0,144],[0,200,220],[123,0,212],[255,255,255]]),
      opacity: 255
    });
  }
}

function drawBrainrot() {
  for (let i = brainrotWords.length - 1; i >= 0; i--) {
    let w = brainrotWords[i];
    fill(w.col[0], w.col[1], w.col[2], w.opacity);
    noStroke();
    textSize(w.size);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(w.word, w.x, w.y);
    w.y -= w.speed;
    w.opacity -= 1.5;
    if (w.opacity <= 0) brainrotWords.splice(i, 1);
  }
}

function drawChaosMeter() {
  let meterW = 140;
  let meterH = 24; //was 16
  let meterX = width - 20 - meterW;
  let meterY = 20;
  fill(255, 255, 255);
  textSize(10);
  textStyle(BOLD);
  textAlign(RIGHT);
  text("CHAOS LEVEL " + chaosLevel, width - 20, meterY + 4);
  noFill();
  stroke(255, 255, 255, 255);
  strokeWeight(3);
  rect(meterX, meterY + 12, meterW, meterH, 2);
  let r = map(chaosLevel, 0, 10, 0, 255);
  let b = map(chaosLevel, 0, 10, 220, 0);
  fill(r, 0, b, 200);
  noStroke();
  rect(meterX, meterY + 12, meterW * (chaosLevel / 10), meterH, 2);
}

//HELPER FUCTIONS
function drawCorners(col, margin, size, weight) {
  cornerSize = min(cornerSize + 2, size);
  stroke(col);
  strokeWeight(weight);
  noFill();
  line(margin, margin, margin + cornerSize, margin);
  line(margin, margin, margin, margin + cornerSize);
  line(width - margin, margin, width - margin - cornerSize, margin);
  line(width - margin, margin, width - margin, margin + cornerSize);
  line(margin, height - margin, margin + cornerSize, height - margin);
  line(margin, height - margin, margin, height - margin - cornerSize);
  line(width - margin, height - margin, width - margin - cornerSize, height - margin);
  line(width - margin, height - margin, width - margin, height - margin - cornerSize);
  noStroke();
}

function drawArrowKeys(cx, cy) {
  let keys = ["D", "F", "H", "J"];
  let keySize = 34;
  let gap = 8;
  let totalW = keys.length * (keySize + gap) + 30 + 40;
  let startX = cx - totalW / 2;

  textSize(11);
  textStyle(BOLD);
  fill(255, 255, 255, 100);
  textAlign(LEFT, CENTER);
  text("HIT", startX, cy);
  startX += 34;

  for (let i = 0; i < keys.length; i++) {
    let x = startX + i * (keySize + gap);
    if (arrowsHeld[i]) {
      fill(255, 0, 144);
      stroke(255, 0, 144, 200);
      drawingContext.shadowColor = "rgba(255,0,144,0.8)";
      drawingContext.shadowBlur = 20;
    } else {
      noFill();
      stroke(255, 255, 255, 60);
      drawingContext.shadowBlur = 0;
    }
    strokeWeight(1.5);
    rect(x, cy - keySize / 2, keySize, keySize, 4);
    drawingContext.shadowBlur = 0;
    noStroke();
    fill(arrowsHeld[i] ? 0 : 255);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(keys[i], x + keySize / 2, cy);
  }

  startX += keys.length * (keySize + gap) + 6;
  noStroke();
  fill(255, 255, 255, 100);
  textSize(11);
  textAlign(LEFT, CENTER);
  text("TO BEAT", startX, cy);
  textAlign(CENTER, CENTER);
}

function drawDots() {
  noStroke();
  for (let d of dots) {
    fill(d.col[0], d.col[1], d.col[2], d.opacity);
    ellipse(d.x, d.y, d.size);
    d.y -= d.speed;
    if (d.y < 0) {
      d.y = height;
      d.x = random(width);
    }
  }
}

function drawStat(label, val, x, y) {
  fill(255);
  textSize(26);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(val, x, y);
  fill(255, 255, 255, 80);
  textSize(10);
  textStyle(NORMAL);
  text(label, x, y + 28);
}

function scoreLines(){
  push();
  stroke(255, 0, 0);
  fill(255, 0, 0);
  line(0, perfMax, width, perfMax);
  line(0, perfMin, width, perfMin);
  line(0, awesMax, width, awesMax);
  line(0, awesMin, width, awesMin);
  line(0, greatMax, width, greatMax);
  line(0, greatMin, width, greatMin);
  line(0, goodMax, width, goodMax);
  line(0, goodMin, width, goodMin);
  line(bound1, 0, bound1, height);
  line(bound2, 0, bound2, height);
  line(bound3, 0, bound3, height);
  line(bound4, 0, bound4, height);
  line(bound5, 0, bound5, height);
  
  pop();
}
