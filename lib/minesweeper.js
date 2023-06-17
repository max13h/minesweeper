let ROWS = 9;
let COLUMNS = 9;
let BOMBS = 0;
let bombList = [];
let isGameLost = false;
let nbOfBombFlagged = 0;
const flagcount = document.getElementById("nb-bombs-flagged");
const amountOfBombInGame = document.getElementById("nb-bomb-in-game");
const restartBtn = document.getElementById("restart");
const minesweeperHTML = document.getElementById("minesweeper");

// MENU ====================
const menu = document.getElementById("show-menu");
const table = document.getElementById("show-minesweeper");
const easy = document.getElementById("easy")
const medium = document.getElementById("medium")
const hard = document.getElementById("hard")

easy.addEventListener("click", () => {
  BOMBS = 10;
  amountOfBombInGame.innerText = "10"
  bombList = whichBoxIsABomb();
  table.classList.remove("disable")
  menu.classList.add("disable")
  gameInitialization();
});
medium.addEventListener("click", () => {
  BOMBS = 15;
  amountOfBombInGame.innerText = "15"
  bombList = whichBoxIsABomb();
  table.classList.remove("disable")
  menu.classList.add("disable")
  gameInitialization();
});
hard.addEventListener("click", () => {
  BOMBS = 20;
  amountOfBombInGame.innerText = "20"
  bombList = whichBoxIsABomb();
  table.classList.remove("disable")
  menu.classList.add("disable")
  gameInitialization();
});

// GAME INITIALIZATION ====================
const gameInitialization = () => {
  generateGameBoard();
  startTimer();

  const allUnopened = document.querySelectorAll(".unopened");

  allUnopened.forEach((unopened) => {
    // LEFT CLICK LISTENER
    unopened.addEventListener("click", () => {
      if (!(unopened.classList.contains("flagged") || unopened.classList.contains("opened"))) {
        eventClickOnBox(unopened);
        checkGameWon();
        checkGameLost();
      }
    });

    // RIGHT CLICK LISTENER
    unopened.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (!unopened.classList.contains("opened")) {
        unopened.classList.toggle("flagged");
        if (unopened.classList.contains("flagged")) {
          nbOfBombFlagged++;
        } else {
          nbOfBombFlagged--;
        }
        flagcount.innerText = nbOfBombFlagged;
      }
    });
  });

  restartBtn.addEventListener("click", () => {
    location.reload();
  });

};

// GENERATE GAMEBOARD ====================
const generateGameBoard = () => {
  const htmlBoard = [];
  let rowNb = 1;

  for (let i = 0; i < ROWS; i++) {
    const row = [];
    let columnNb = 1;
    for (let j = 0; j < COLUMNS; j++) {
      row.push(`<td class="unopened" id="c${rowNb}${columnNb}"></td>`);
      columnNb++;
    }
    htmlBoard.push(`<tr>${row.join('')}</tr>`);
    rowNb++;
  }
  minesweeperHTML.innerHTML = htmlBoard.join('');
  return;
};

// GENERATE WHICH BOX IS A BOMB
const whichBoxIsABomb = () => {
  const bombs = [];
  while (bombs.length < BOMBS) {
    const row = Math.floor(Math.random() * ROWS) + 1;
    const column = Math.floor(Math.random() * COLUMNS) + 1;
    const box = `c${row}${column}`;
    if (!bombs.includes(box)) {
      bombs.push(box);
    }
  }
  return bombs;
};
const bombFlagged = [];

// GET IDS OF BOXES AROUND A BOX ID (ARRAY)
const getBoxesIDAround = (boxID) => {
  let boxIDSplitted = boxID.split("");
  boxIDSplitted.shift();
  boxIDSplitted = boxIDSplitted.map(e => Number.parseInt(e, 10));

  // WE RECOVER BOXES' ID AROUND 
  const boxesIDArround = []

  const insertIfExist = (idString) => {
    const box = document.getElementById(idString);
    if (box)
      boxesIDArround.push(idString);
  };

  let buildBoxID = "";

  buildBoxID = `c${boxIDSplitted[0] - 1}${boxIDSplitted[1] - 1}`;
  insertIfExist(buildBoxID);
  buildBoxID = `c${boxIDSplitted[0] - 1}${boxIDSplitted[1]}`;
  insertIfExist(buildBoxID);
  buildBoxID = `c${boxIDSplitted[0] - 1}${boxIDSplitted[1] + 1}`;
  insertIfExist(buildBoxID);

  buildBoxID = `c${boxIDSplitted[0]}${boxIDSplitted[1] - 1}`;
  insertIfExist(buildBoxID);
  buildBoxID = `c${boxIDSplitted[0]}${boxIDSplitted[1] + 1}`;
  insertIfExist(buildBoxID);

  buildBoxID = `c${boxIDSplitted[0] + 1}${boxIDSplitted[1] - 1}`;
  insertIfExist(buildBoxID);
  buildBoxID = `c${boxIDSplitted[0] + 1}${boxIDSplitted[1]}`;
  insertIfExist(buildBoxID);
  buildBoxID = `c${boxIDSplitted[0] + 1}${boxIDSplitted[1] + 1}`;
  insertIfExist(buildBoxID);

  return boxesIDArround
};

// COUNT NUMBER OF BOMBS AROUND A BOX ID
const countBombAround = (boxID) => {
  const arrayOfBoxesID = getBoxesIDAround(boxID);
  let nbOfBombAround = 0;
  arrayOfBoxesID.forEach((id) => {
    if (bombList.includes(id)) {
      nbOfBombAround++;
    }
  });
  return nbOfBombAround;
};

// REVEAL BOX CONTENT
const eventClickOnBox = (box) => {
  const boxID = box.id;
  if (bombList.includes(boxID)) {
    box.classList.add('mine');
    isGameLost = true;
  } else {
    changeBackgroundOfBox(boxID);
  }
};

// CHANGE BACKGROUND OF A BOX
const changeBackgroundOfBox = (boxID) => {
  const box = document.getElementById(boxID);
  const nbOfBombAround = countBombAround(boxID);
  if (nbOfBombAround === 0) {
    if (box.classList.contains("unopened")) {
      box.classList.remove("unopened");
      box.classList.add("opened");
    }
    revealEmptyBoxesAround(boxID);
  } else {
    if (box.classList.contains("unopened")) {
      box.classList.remove("unopened");
      box.classList.add("opened");
      if (nbOfBombAround > 0) {
        box.classList.add(`mine-neighbour-${nbOfBombAround}`);
      }
    }
  }
};

// REVEAL BOXES AROUND
const revealEmptyBoxesAround = (boxID) => {
  const arrayOfBoxesIDAround = getBoxesIDAround(boxID);
  arrayOfBoxesIDAround.forEach((id) => {
    const nbOfBombAround = countBombAround(id);
    if (nbOfBombAround === 0) {
      const node = document.getElementById(id);
      if (node.classList.contains("unopened")) {
        node.classList.remove("unopened");
        node.classList.add("opened");
        revealEmptyBoxesAround(id);
      }
    } else {
      changeBackgroundOfBox(id);
    }
  });
};

// REVEAL ALL END GAME
const revealAll = () => {
  bombList.forEach((id) => {
    const boxBomb = document.getElementById(id);
    boxBomb.classList.remove("unopened");
    boxBomb.classList.add("opened");
    if (isGameLost) {
      boxBomb.classList.add("mine");

    } else {
      boxBomb.classList.add("flagged");
    }
  });

  const unopened = document.querySelectorAll(".unopened");
  unopened.forEach((element) => {
    changeBackgroundOfBox(element.id);
  });
};


// CHECK IF GAME IS WON
const checkGameWon = () => {
  if (!isGameLost) {
    const remainingBoxes = document.querySelectorAll(".unopened");
    const remainingBoxesID = [];
    remainingBoxes.forEach((element) => {
      remainingBoxesID.push(element.id);
    });

    if (JSON.stringify(remainingBoxesID.sort()) === JSON.stringify(bombList.sort())) {
      revealAll();
      alert("WIN")
      stopTimer();
    }
  }
};

// CHECK IF GAME IS LOST
const checkGameLost = () => {
  if (isGameLost) {
    revealAll();
    alert("YOU LOST");
    stopTimer();
  }
}

// TIMER ===============
const timerElement = document.getElementById('timer');

let startTime = 0; // Variable to store the start time
let timerInterval = 0; // Variable to store the interval ID

const startTimer = () => {
  startTime = Date.now(); // Get the current timestamp
  timerInterval = setInterval(updateTimer, 10); // Update timer every 10 milliseconds (adjust as needed)
};

const updateTimer = () => {
  const currentTime = Date.now(); // Get the current timestamp
  const elapsedTime = currentTime - startTime; // Calculate elapsed time in milliseconds

  // Calculate minutes, seconds, and milliseconds
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = elapsedTime % 1000;

  // Format the timer display
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;

  // Update the timer element
  timerElement.innerText = formattedTime;
};

const stopTimer = () => {
  clearInterval(timerInterval); // Clear the interval
};
