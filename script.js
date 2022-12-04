const leftStick = document.getElementsByClassName("left-stick")[0];
const rightStick = document.getElementsByClassName("right-stick")[0];
const ball = document.getElementsByClassName("ball")[0];
const container = document.getElementsByClassName("pong-container")[0];
ball.style.left = "300px";
ball.style.top = "22px";
const array = [1, 2, 3, 4, 5];
const map = {};
let leftStickPos = 165;
let rightStickPos = 165;
let speed = 3;
let isColison = false;
let ballDirection = {
  top: -speed,
  left: -speed,
};
let stickSpeed = 2;

// console.log(ballDirection.left / Math.abs(ballDirection.left));
let keyDown = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};
window.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    keyDown.w = true;
  } else if (e.key === "s") {
    keyDown.s = true;
  }
  if (e.key === "ArrowUp") {
    keyDown.ArrowUp = true;
  } else if (e.key === "ArrowDown") {
    keyDown.ArrowDown = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w") {
    keyDown.w = false;
  } else if (e.key === "s") {
    keyDown.s = false;
  }
  if (e.key === "ArrowUp") {
    keyDown.ArrowUp = false;
  } else if (e.key === "ArrowDown") {
    keyDown.ArrowDown = false;
  }
});

setInterval(() => {
  if (keyDown.w) {
    if (
      leftStick.getBoundingClientRect().top <
      container.getBoundingClientRect().top + 3
    ) {
    } else {
      leftStickPos -= stickSpeed;
      leftStick.style.top = `${leftStickPos}px`;
    }
  } else if (keyDown.s) {
    if (
      leftStick.getBoundingClientRect().bottom >
      container.getBoundingClientRect().bottom - 3
    ) {
    } else {
      leftStickPos += stickSpeed;
      leftStick.style.top = `${leftStickPos}px`;
    }
  }
  if (keyDown.ArrowUp) {
    if (
      rightStick.getBoundingClientRect().top <
      container.getBoundingClientRect().top + 3
    ) {
    } else {
      rightStickPos -= stickSpeed;
      rightStick.style.top = `${rightStickPos}px`;
    }
  } else if (keyDown.ArrowDown) {
    if (
      rightStick.getBoundingClientRect().bottom >
      container.getBoundingClientRect().bottom - 3
    ) {
    } else {
      rightStickPos += stickSpeed;
      rightStick.style.top = `${rightStickPos}px`;
    }
  }
}, 10);
let gameInterval = setInterval(() => {
  gameAi();
  borderColisonDetection();
  gameLogic();
  ball.style.left = `${getNumber(ball.style.left) - ballDirection.left}px`;
  ball.style.top = `${getNumber(ball.style.top) - ballDirection.top}px`;
  //   console.log(Number(ball.style.left.substring(0, 2)));
}, 16);

let colusionInterval = setInterval(() => {
  colusionDetection();
}, 16);

setInterval(() => {
  if (isColison) {
    clearInterval(colusionInterval);
    setTimeout(() => {
      colusionInterval = setInterval(() => {
        colusionDetection();
      }, 16);
    }, 100);
  }
  isColison = false;
}, 16);

setInterval(() => {
  if (speed === 10) {
    return;
  }
  if (stickSpeed <= 5) {
    stickSpeed += 1;
  }
  speed += 1;
  ballDirection.left =
    (ballDirection.left / Math.abs(ballDirection.left)) * speed;
  // console.log(speed);
}, 7000);

// console.log(ball.getBoundingClientRect());
const getNumber = (pos) => {
  let number = "";
  for (let i = 0; i < pos.length; i++) {
    if (pos[i] === ".") {
      number += pos[i];
      continue;
    }
    if (isNaN(pos[i])) {
      continue;
    }
    number += pos[i];
  }
  return number;
};

const colusionDetection = () => {
  isColison = false;
  const leftStickHeight = [];
  const leftStickWidth = [];
  const leftStickRect = leftStick.getBoundingClientRect();

  for (let i = leftStickRect.bottom + 0; i > leftStickRect.top; i--) {
    leftStickHeight.push(i);
  }
  // const leftTopHalf = leftStickHeight.slice(
  //   leftStickHeight.length / 2,
  //   leftStickHeight.length
  // );
  // const leftBottomHalf = leftStickHeight.slice(0, leftStickHeight.length / 2);

  // console.log(leftStickHeight);
  // console.log(leftTopHalf);
  for (let i = leftStickRect.left - 0; i < leftStickRect.right; i++) {
    leftStickWidth.push(i);
  }

  const rightStickHeight = [];
  const rightStickWidth = [];
  const rightStickRect = rightStick.getBoundingClientRect();
  for (let i = rightStickRect.bottom + 0; i > rightStickRect.top; i--) {
    rightStickHeight.push(i);
  }

  for (let i = rightStickRect.left + 0; i < rightStickRect.right; i++) {
    rightStickWidth.push(i);
  }

  const ballWidth = [];
  const ballHeight = [];
  const ballRect = ball.getBoundingClientRect();
  for (let i = ballRect.left; i < ballRect.right; i++) {
    ballWidth.push(i);
  }
  for (let i = ballRect.bottom; i > ballRect.top; i--) {
    ballHeight.push(i);
  }

  // console.log(leftStickRect);
  outer: for (i of ballWidth) {
    for (j of ballHeight) {
      if (
        (leftStickWidth.includes(i) && leftStickHeight.includes(j)) ||
        (rightStickWidth.includes(i) && rightStickHeight.includes(j))
      ) {
        // if (
        //   leftTopHalf.includes(ball.getBoundingClientRect().y) ||
        //   rightTopHalf.includes(ball.getBoundingClientRect().y)
        // ) {
        //   ballDirection.top = speed;
        // } else if (
        //   leftBottomHalf.includes(ball.getBoundingClientRect().y) ||
        //   rightBottomHalf.includes(ball.getBoundingClientRect().y)
        // ) {
        //   ballDirection.top = -speed;
        // }
        ballDirection.left = -ballDirection.left;
        ballDirection.top =
          (ballDirection.top / Math.abs(ballDirection.top)) *
          Math.floor(Math.random() * 6 + 1);
        isColison = true;
        break outer;
        // console.log(ballWidth);
      }
    }
  }
};

const borderColisonDetection = () => {
  if (
    ball.getBoundingClientRect().top <
      container.getBoundingClientRect().top + 3 ||
    ball.getBoundingClientRect().bottom >
      container.getBoundingClientRect().bottom
  ) {
    ballDirection.top = -ballDirection.top;
  }
};

const gameLogic = () => {
  if (
    ball.getBoundingClientRect().left <
    leftStick.getBoundingClientRect().left - 20
  ) {
    ball.style.left = "300px";
    ball.style.top = "10px";
    ballDirection.top = ballDirection.left = 0;
    speed = 2;
    stickSpeed = 2;
    setTimeout(() => {
      ballDirection.top = -speed;
      ballDirection.left = speed;
    }, 500);
  }
  if (
    ball.getBoundingClientRect().right >
    rightStick.getBoundingClientRect().right + 20
  ) {
    ball.style.left = "300px";
    ball.style.top = "10px";
    ballDirection.top = ballDirection.left = 0;
    speed = 2;
    stickSpeed = 2;
    setTimeout(() => {
      ballDirection.top = -speed;
      ballDirection.left = -speed;
    }, 500);
  }
};

const gameAi = () => {
  // setTimeout(() => {
  //   rightStick.style.top = `${Number(getNumber(ball.style.top)) - 20}px`;
  // }, 1000);
};
