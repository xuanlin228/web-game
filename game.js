var myGamePiece;
var myBackground;

var gamecanvas = document.getElementById("myCanvas");
// var bgwidth = gamecanvas.width;
// var bgheight = gamecanvas.height;
var dios = [];
var sec = 30;
var liveStars = [];
var whratio = 16 / 9;
var scaleratio = 1;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var gamecanvasWidth = screenWidth;
var gamecanvasHeight = screenHeight;
var shift = 0;
var myMusic;

if (screenHeight > screenWidth) {
  gamecanvasHeight = screenWidth * (1 / whratio);
} else {
  gamecanvasWidth = screenHeight * whratio;
}
if (gamecanvasWidth < screenWidth) {
  shift = screenWidth / 2 - gamecanvasWidth / 2;
} else if (gamecanvasWidth > screenWidth) {
  gamecanvasWidth = screenWidth;
  gamecanvasHeight = screenWidth * (1 / whratio);
}
var imgLoader = {
  imgs: {
    'bg': 'img/minigame_bg.jpg',
    'cheng': 'img/Jotaro_stand_125.png',
    'dio': 'img/Dio_stand_125.png',
    'flower': 'img/Kakyoin_stand_225.png',
    'star': 'img/icon_s.png',
    'Jotaro_stand_225': 'img/Jotaro_stand_225.png',
    'dialog_J': 'img/dialog_J.png',
    'dialog_K': 'img/dialog_K.png'
  },
  setting: function () {
    this.imgLoaded = 0;
    this.numImgs = Object.keys(this.imgs).length;
    this.totalImgs = this.numImgs;
  },
  downloadAll: function () {
    var src = "";
    var finished = true;
    var _this = this;
    for (const [img, value] of Object.entries(_this.imgs)) {
      console.log("img: " + _this.imgs[img]);
      src = _this.imgs[img];
      _this.imgs[img] = new Image();
      _this.imgs[img].status = 'loading';
      console.log("status: " + _this.imgs[img].status);
      _this.imgs[img].name = img;
      _this.imgs[img].onload = function () {

        if (_this.imgs[img].status === "loading") {
          _this.imgs[img].status = "loaded";

        }
        console.log("imgLoaded: " + _this.imgs[img].status);
      }
      _this.imgs[img].src = src;

    }
    return finished;
  }
}

function main() {
  let finish = imgLoader.downloadAll();
  console.log("finish: " + finish);
  if (finish) {
    mainMenu();
  }
}

// mainMenu();

function startGame() {
  myGamePieceCheng = new component(
    75,
    75,
    "img/Jotaro_stand_125.png",
    gamecanvasWidth / 2,
    gamecanvasHeight - 100,
    "image",
    5,
    0
  );

  myBackground = new component(
    gamecanvasWidth,
    gamecanvasHeight,
    "img/minigame_bg.jpg",
    shift,
    0,
    "image",
    0,
    0
  );

  myGameTimer = new component(
    "35px",
    "Comic Sans MS",
    "red",
    shift,
    30,
    "text",
    0,
    0
  );

  myGameStar1 = new component(
    25,
    25,
    "img/icon_s.png",
    shift + 50,
    0,
    "image",
    0,
    0
  );
  liveStars.push(myGameStar1);
  myGameStar2 = new component(
    25,
    25,
    "img/icon_s.png",
    shift + 75,
    0,
    "image",
    0,
    0
  );
  liveStars.push(myGameStar2);
  myGameStar3 = new component(
    25,
    25,
    "img/icon_s.png",
    shift + 100,
    0,
    "image",
    0,
    0
  );
  liveStars.push(myGameStar3);
  myMusic = new sound("music/bgm.mp3");
  myMusic.play();
  myGameArea.start();
}

var myGameArea = {
  canvas: gamecanvas,
  start: function () {
    this.canvas.width = gamecanvasWidth;
    this.canvas.height = gamecanvasHeight;
    this.sec = sec;
    this.context = this.canvas.getContext("2d");
    window.addEventListener("click", function (e) {
      removeDio(e);
    });
    this.x = 0;
    this.y = 0;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};
class component {
  constructor(width, height, color, x, y, type, speedx, speedy) {
    this.type = type;
    if (type == "image") {
      this.image = new Image();
      this.image.src = color;
    }
    if (type == "text") {
      this.text = "" + myGameArea.sec;
      console.log("myGameArea.sec: " + myGameArea.sec);
    }
    if (type == "dio") {
      this.image = new Image();
      this.image.src = color;
    }

    this.width = width;
    this.height = height;
    this.speedX = speedx;
    this.speedY = speedy;
    this.x = x;
    this.y = y;
    this.click = false;
    this.update = function () {
      ctx = myGameArea.context;
      if (type == "image") {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };
    this.newPos = function () {
      ctx = myGameArea.context;
      if (this.x + 125 > gamecanvasWidth + shift) {
        this.speedX = -this.speedX;
        // ctx.translate((700 + this.width),0);
        // ctx.scale(-1,1);
      }
      if (this.x < shift) {
        this.speedX = -this.speedX;
      }

      this.x += this.speedX;
      this.y += this.speedY;
    };
  }
}

class sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.volume = 0.5;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    };
    this.stop = function () {
      this.sound.pause();
    };
  }
}
function updateGameArea() {
  ctx = myGameArea.context;
  if (myGameArea.sec == 0 || liveStars.length == 0) {
    myGameArea.stop();
    myMusic.stop();
    $("#game-over").show();
    gameOver();
  }

  myGameArea.clear();
  myBackground.newPos();
  myBackground.update();
  myGamePieceCheng.newPos();
  myGamePieceCheng.update();
  myGameArea.frameNo += 1;
  if (everyinterval(50)) {
    myGameArea.sec--;
    if (myGameArea.sec < 10) {
      myGameTimer.text = "0" + myGameArea.sec;
    } else {
      myGameTimer.text = "" + myGameArea.sec;
    }
  }
  if (myGameArea.frameNo == 1 || everyinterval(70)) {
    // while (dios.length < 2) {
    dropDio();
    // }
  }
  for (i = 0; i < dios.length; i++) {
    if (collision(dios[i], myGamePieceCheng)) {
      liveStars.pop();
      dios.splice(i, 1);
      break;
    }
  }
  /*將超過畫面的dio消除至於此instead of Component*/
  /*-----------------------------------------------*/
  var temp = 100;
  for (i = 0; i < dios.length; i++) {
    if (dios[i].y > myGamePieceCheng.y + myGamePieceCheng.height / 2) {
      temp = i;
      dios[i].speedY = 0;
      // break;
    }
  }
  // dios.splice(temp, 1);
  /*-----------------------------------------------*/
  for (i = 0; i < dios.length; i++) {
    dios[i].newPos();
    dios[i].update();
  }
  for (i = 0; i < liveStars.length; i++) {
    liveStars[i].newPos();
    liveStars[i].update();
  }

  myGameTimer.update();
}

function dropDio() {
  //將dropDio的interval改成70
  //while (dios.length < 6) {
  var myGamePieceDio = new component(
    60,
    60,
    "img/Dio_stand_125.png",
    random(shift, shift + gamecanvasWidth - 125), //position of x coor
    50,
    "image",
    0,
    random(4, 5) //speed of falling
  );
  dios.push(myGamePieceDio);
  //}
}

function clearmove() {
  myGamePiece.image.src = "CH_DIO.png";
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
function removeDio(e) {
  myGameArea.x = e.offsetX;
  myGameArea.y = e.offsetY;
  console.log(
    "offsetX: " + myGameArea.x + " " + "offsetY: " + myGameArea.y
  );
  // var removeIndex = 100;
  for (i = 0; i < dios.length; i++) {
    var myleft = dios[i].x;
    var myright = dios[i].x + dios[i].width;
    var mytop = dios[i].y;
    var mybottom = dios[i].y + dios[i].height;
    console.log("left: " + myleft + " right: " + myright);
    console.log("top: " + mytop + " bottom: " + mybottom);
    if (
      mybottom > myGameArea.y &&
      mytop < myGameArea.y &&
      myright > myGameArea.x &&
      myleft < myGameArea.x
    ) {
      dios[i].click = true;
    }
    if (dios[i].click) {
      console.log("true");
      // removeIndex = i;
      dios.splice(i, 1);
      break;
    } else {
      console.log("false");
    }
  }
}
function collision(dio, cheng) {
  var dioleft = dio.x;
  var dioright = dio.x + dio.width;
  var diotop = dio.y;
  var diobottom = dio.y + dio.height;
  var chengleft = cheng.x;
  var chengright = cheng.x + cheng.width;
  var chengtop = cheng.y;
  var chengbottom = cheng.y + cheng.height;
  if (
    chengbottom < diotop ||
    chengtop > diobottom ||
    chengright < dioleft ||
    chengleft > dioright
  ) {
    return false;
  } else {
    return true;
  }
}

function mainMenu() {
  menu = document.getElementById("menu");
  let root = document.documentElement; //選取root
  root.style.setProperty("--bgwidth", gamecanvasWidth);
  root.style.setProperty("--bgheight", gamecanvasHeight);
  root.style.setProperty("--shift", shift);
  let main = document.getElementById("main");
  main.style.backgroundImage = "url('img/minigame_bg.jpg')";
  main.style.display = "block";
  document.getElementById("menu").setAttribute("class", "main");
}
function gameOver() {
  gameoverMenu = document.getElementById("game-over");
  let root = document.documentElement; //選取root
  root.style.setProperty("--bgwidth", gamecanvasWidth);
  root.style.setProperty("--bgheight", gamecanvasHeight);
  root.style.setProperty("--shift", shift);
  root.style.setProperty("--display", "block");
  // gameoverMenu.style.backgroundImage = "url('img/minigame_bg.jpg')";
  gameoverMenu.style.display = "block";
}
$(".play").click(function () {
  $("#menu").hide();
  startGame();
});
$(".restart").click(function () {
  $("#game-over").hide();
  window.location.reload();

});
$(".leave").click(function () {
  $("#game-over").hide();
  ctx = myGameArea.context;
  // ctx.fillStyle = "black";
  ctx.save();
  ctx.globalAlpha = 1;
  myGamePieceChenEnd = new component(
    175,
    175,
    "img/Jotaro_stand_225.png",
    (shift + gamecanvasWidth) / 2 - 160,
    100,
    "image",
    0,
    0
  );
  myGamePieceKakyoinEnd = new component(
    175,
    175,
    "img/Kakyoin_stand_225.png",
    (shift + gamecanvasWidth) / 2,
    100,
    "image",
    0,
    0
  );
  jotaroDialog = new component(
    150,
    100,
    "img/dialog_J.png",
    (shift + gamecanvasWidth) / 2 - 240,
    100,
    "image",
    0,
    0
  );
  kalyoinDialog = new component(
    150,
    100,
    "img/dialog_K.png",
    (shift + gamecanvasWidth) / 2 + 150,
    100,
    "image",
    0,
    0
  );
  myBackground.update();
  myGamePieceChenEnd.update();
  myGamePieceKakyoinEnd.update();
  jotaroDialog.update();
  kalyoinDialog.update();
  ctx.restore();
});
