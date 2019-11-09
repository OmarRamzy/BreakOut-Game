var Board = document.querySelector('#board');
var BrickArea = document.querySelector('#brick-area');
var Ball = document.querySelector('#ball');
var Plate = document.querySelector('#plate');
var GunBonus = document.querySelector('#gun-bonus');
var LongBonus = document.querySelector('#long-bonus');
var Guns = document.querySelectorAll('.guns');
var RightBullet = document.querySelector('#rightBullet');
var LeftBullet = document.querySelector('#leftBullet');
var win = document.querySelector('.win')
var gameover = document.querySelector('.gameover')
var playAgain = document.querySelector('#yes')
var start = false;
var gun = false;
var long = false;
var leftGun = true;
var rightGun = true;
var LIFES = 3;
var score = 0;
var endGame = document.querySelector('#endGame')
var ballAnimationID = 0;
var bricks = [];
Board.style.height = (window.innerHeight - 36) + 'px';
var bricksLength;
var gameSpeed = 8;
var lifesCnt = document.querySelector('#lifecnt')


/* brick properties */
var brickAspects = {
  rows: 5,
  margin: 23,
  width: 80,
  height: 20,
  padding: 9
}

function Brick(x, y, id) {
  this.ID = id;
  this.X = x;
  this.Y = y;
  this.bonus = "";
}

/* plate properties */
var plate = {
  width: 100,
  height: 15,
  longWidth: 150,
  normalWidth: 100,
  X: 0,
  Y: Board.clientHeight - 15,
  DX: 8
}
Plate.style.width = plate.width + 'px';
Plate.style.height = plate.height + 'px';

/* ball properties */
var ball = {
  size: 15,
  speed: 5,
  X: 0,
  Y: 0,
  DX: 3,
  DY: -3
}

/* bricks construction */
function constructBrick(x, y, id) {
  var brickDiv = document.createElement('div');
  brickDiv.id = "id" + id;
  brickDiv.className = 'brick';
  brickDiv.style.left = x + 'px';
  brickDiv.style.top = y + 'px';
  brickDiv.style.width = brickAspects.width + 'px';
  brickDiv.style.height = brickAspects.height + 'px';

  brickDiv.appendChild(document.createElement('div'));
  brickDiv.appendChild(document.createElement('div'));
  brickDiv.appendChild(document.createElement('div'));
  brickDiv.appendChild(document.createElement('div'));

  BrickArea.appendChild(brickDiv);
  bricks.push(new Brick(x, y, id));
}

function construckBrickArea() {
  brickAspects.margin = (Board.clientWidth % (brickAspects.width + brickAspects.padding) + brickAspects.padding) / 2;
  var x = brickAspects.margin;
  var y = 0;
  var rows = brickAspects.rows;

  for (var i = 0; rows > 0; i++) {
    constructBrick(x, y, i);
    x += brickAspects.width + brickAspects.padding;

    if (x + brickAspects.width >= BrickArea.clientWidth) {
      x = brickAspects.margin;
      y += brickAspects.height + brickAspects.padding;
      rows--;
    }
  }
  bricksLength = bricks.length;

  // distribute bonus to bricks
  bricks[bricks.length - 4].bonus = "Long";
  bricks[bricks.length - 2].bonus = "Gun";
}

lifesCnt.innerText = LIFES;

/* ball collision handling */
function ballWallCollision() {
  if (ball.X + ball.size > Board.clientWidth || ball.X < 0) {
    ball.DX = - ball.DX;
  }

  if (ball.Y < 0) {
    ball.DY = -ball.DY;
  }

  if (ball.Y + ball.size > Board.clientHeight) {

    // reset ball position
    resetBall();
    LIFES--;
    lifesCnt.innerText = LIFES
    
    // to restart animation
    var old = lifesCnt;
    var newone = old.cloneNode(true);
    old.parentNode.replaceChild(newone, old);
    lifesCnt = newone;
  }
}
var f = false;
function ballPlateCollision() {
  if (ball.X + ball.size > plate.X && ball.X < plate.X + plate.width && ball.Y + ball.size > plate.Y && ball.Y < plate.Y + plate.height) {
    var collidePoint = ball.X - (plate.X + plate.width / 2);
    collidePoint = collidePoint / (plate.width / 2);

    var angle = collidePoint * Math.PI / 3;
    ball.DX = ball.speed * Math.sin(angle);
    ball.DY = - ball.speed * Math.cos(angle);
  }

}

function ballBrickCollision() {
  for (var i = 0; i < bricks.length; i++) {

    if (ball.X + ball.size > bricks[i].X && ball.X < bricks[i].X + brickAspects.width && ball.Y + ball.size > bricks[i].Y && ball.Y < bricks[i].Y + brickAspects.height) {
      ball.DY = - ball.DY;

      if (bricks[i].bonus != "") {
        if (bricks[i].bonus == "Gun") {
          GunBonus.style.left = bricks[i].X + 'px';
          GunBonus.style.top = bricks[i].Y + 'px';
          startBonus(bricks[i].X, bricks[i].Y, GunBonus);
        }
        else {
          LongBonus.style.left = bricks[i].X + 'px';
          LongBonus.style.top = bricks[i].Y + 'px';
          startBonus(bricks[i].X, bricks[i].Y, LongBonus);
        }

      }
      score++;

      document.querySelector("#id" + bricks[i].ID).classList.add('remove-item');
      bricks.splice(i, 1);
    }
  }
}

/* bullet collision handling */
function bulletBrickCollision(bulletX, bulletY) {
  for (var i = 0; i < bricks.length; i++) {

    if (bulletY <= bricks[i].Y + brickAspects.height && bulletX + RightBullet.clientWidth > bricks[i].X && bulletX < bricks[i].X + brickAspects.width) {
      if (bricks[i].bonus != "") {
        if (bricks[i].bonus == "Gun") {
          GunBonus.style.left = bricks[i].X + 'px';
          GunBonus.style.top = bricks[i].Y + 'px';
          startBonus(bricks[i].X, bricks[i].Y, GunBonus);
        }
        else {
          LongBonus.style.left = bricks[i].X + 'px';
          LongBonus.style.top = bricks[i].Y + 'px';
          startBonus(bricks[i].X, bricks[i].Y, LongBonus);
        }

      }
      score++;

      document.querySelector("#id" + bricks[i].ID).classList.add('remove-item');
      bricks.splice(i, 1);

      return true;
    }
  }

  return false;
}

/* ball animation */
function moveBall(ball) {
  Ball.style.left = ball.X + 'px';
  Ball.style.top = ball.Y + 'px';
}

function resetBall() {
  clearInterval(ballAnimationID);
  ball.X = plate.X + plate.width / 2 - ball.size / 2;
  ball.Y = plate.Y - ball.size;
  ball.DX = 0;
  ball.DY = -3;

  moveBall(ball);
  start = false;
}

/* plate animation by mouse */
Board.addEventListener('mousemove', function (e) {
  plate.X = e.clientX - plate.width / 2;

  if (plate.X < 0) {
    plate.X = 0;
  }
  else if (plate.X + plate.width > Board.clientWidth) {
    plate.X = Board.clientWidth - plate.width;
  }

  // move plate
  Plate.style.left = plate.X + 'px';

  if (!start) {
    ball.X = plate.X + plate.width / 2 - ball.size / 2;
    moveBall(ball);
  }
})

/* plate animation by Keyboard */
var leftArrow = false, rightArrow = false;
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    leftArrow = true;
  } else if (event.keyCode == 39) {
    rightArrow = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
});

function movePlate() {
  if (rightArrow && plate.X + plate.width < Board.clientWidth) {
    plate.X += plate.DX;
    Plate.style.left = plate.X + 'px';
  } else if (leftArrow && plate.X > 0) {
    plate.X -= plate.DX;
    Plate.style.left = plate.X + 'px';
  }
}

Board.addEventListener('click', function () {
  if (!start) {
    start = true;
    startGame();
  }
  else if (gun) {
    if (rightGun) {
      rightBulletAnimation();
    }
    else if (leftGun) {
      leftBulletAnimation();
    }
  }
})


/* bonus animation */
function startBonus(x, y, Bonus) {
  Bonus.style.display = 'block';

  var bonusAnimationID = setInterval(() => {
    Bonus.style.top = y + 'px';

    if (x + Bonus.clientWidth >= plate.X && x <= plate.X + plate.width && y + Bonus.clientHeight >= plate.Y) {
      clearInterval(bonusAnimationID);
      Bonus.style.display = 'none';

      var bonusType = Bonus.innerText.trim();
      switch (bonusType) {
        case 'Gun':
          gun = true;
          Guns[0].style.display = 'block';
          Guns[1].style.display = 'block';
          break;
        case 'Long':
          Plate.classList.add('long');
          plate.width = plate.longWidth;
          break;
      }

      BonusTimeout(Bonus);
    }
    else if (y + Bonus.clientHeight >= Board.clientHeight) {
      clearInterval(bonusAnimationID);
      Bonus.style.display = 'none';
    }

    y += 3;
  }, 20);
}

function BonusTimeout(Bonus) {
  var bonusType = Bonus.innerText.trim();
  setTimeout(function () {
    switch (bonusType) {
      case 'Gun':
        gun = false;
        Guns[0].style.display = 'none';
        Guns[1].style.display = 'none';
        console.log('end gun')
        break;
      case 'Long':
        Plate.classList.remove('long');
        plate.width = plate.normalWidth;
        console.log('end long')
        break;
    }


  }, 10000)
}

/* bullet animation */
function rightBulletAnimation() {
  var rightBulletY = (plate.Y - Guns[0].clientHeight - 10);
  RightBullet.style.left = (plate.X + plate.width - Guns[0].clientWidth / 2) + 'px';
  RightBullet.style.display = 'block';
  rightGun = false;

  var bulletAnimationID = setInterval(() => {
    RightBullet.style.top = rightBulletY + 'px';

    if (bulletBrickCollision(RightBullet.offsetLeft, rightBulletY) || rightBulletY < 0) {
      clearInterval(bulletAnimationID);
      RightBullet.style.display = 'none';
      rightGun = true;
    }

    rightBulletY -= 3;
  }, 10);
}

function leftBulletAnimation() {
  var leftBulletY = (plate.Y - Guns[0].clientHeight - 10);
  LeftBullet.style.left = (plate.X + 6 + Guns[0].clientWidth / 2) + 'px';
  LeftBullet.style.display = 'block';
  leftGun = false;

  var bulletAnimationID = setInterval(() => {
    LeftBullet.style.top = leftBulletY + 'px';

    if (bulletBrickCollision(LeftBullet.offsetLeft, leftBulletY) || leftBulletY < 0) {
      clearInterval(bulletAnimationID);
      LeftBullet.style.display = 'none';
      leftGun = true;
    }

    leftBulletY -= 3;
  }, 10);
}

function checkLifesAndScore() {
  if (LIFES == 0) {
    Board.style.display = "none";
    endGame.style.display = "block"
    gameover.style.display = "block"
    win.style.display = "none";
    console.log('here')
    score = 0;
    bricks = []
    document.querySelector("#life-area").style.display = 'none';
  }
  else if (bricksLength == score) {
    console.log('win')
    Board.style.display = "none";
    endGame.style.display = "block"
    win.style.display = "block"
    gameover.style.display = "none";
    score = 0;

  }
}

playAgain.addEventListener('click', function () {

  endGame.style.display = "none";
  Board.style.display = "block";
  document.querySelector("#life-area").style.display = 'block';
  LIFES = 3;
  lifesCnt.innerText = LIFES
  BrickArea.innerHTML = ""
  construckBrickArea()
  resetBall()

})

function startGame() {
  ballAnimationID = setInterval(() => {
    ball.X += ball.DX;
    ball.Y += ball.DY;
    movePlate()
    ballPlateCollision();
    ballWallCollision();
    ballBrickCollision();
    moveBall(ball);
    checkLifesAndScore()

  }, gameSpeed);
}

function setBoard() {
  construckBrickArea()
  resetBall();

}

setBoard()

