document.getElementById("hello_text").textContent = "テトリス";
// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

// キー入力によってそれぞれの関数を呼び出す
function onKeyDown(event) {
  if (event.keyCode === 37) {
    moveLeft();
  } else if (event.keyCode === 39) {
    moveRight();
  }
}

var count = 0;
var cells;
var gameInterval;
var fallingBlockNum = 0;
var isFalling = false;

// ブロックのパターン
var blocks = {
  i: { class: "i", pattern: [[1, 1, 1, 1]] },
  o: { class: "o", pattern: [[1, 1], [1, 1]] },
  t: { class: "t", pattern: [[0, 1, 0], [1, 1, 1]] },
  s: { class: "s", pattern: [[0, 1, 1], [1, 1, 0]] },
  z: { class: "z", pattern: [[1, 1, 0], [0, 1, 1]] },
  j: { class: "j", pattern: [[1, 0, 0], [1, 1, 1]] },
  l: { class: "l", pattern: [[0, 0, 1], [1, 1, 1]] },
};

function startGame() {
  count = 0;
  fallingBlockNum = 0;
  isFalling = false;
  loadTable();
  document.getElementById("hello_text").textContent = "テトリス";
  gameInterval = setInterval(function () {
    count++;
    document.getElementById("hello_text").textContent = "テトリス";
    if (hasFallingBlock()) {
      fallBlocks();
    } else {
      deleteRow();
      generateBlock();
    }
  }, 250);
}

function resetGame() {
  clearInterval(gameInterval);
  for (var row = 0; row < 20; row++) {
    for (var col = 0; col < 10; col++) {
      cells[row][col].className = "";
      cells[row][col].blockNum = null;
    }
  }
  startGame();
}

function loadTable() {
  cells = [];
  var td_array = document.getElementsByTagName("td");
  var index = 0;
  for (var row = 0; row < 20; row++) {
    cells[row] = [];
    for (var col = 0; col < 10; col++) {
      cells[row][col] = td_array[index];
      index++;
    }
  }
}

function fallBlocks() {
  for (var col = 0; col < 10; col++) {
    if (cells[19][col].blockNum === fallingBlockNum) {
      isFalling = false;
      return;
    }
  }
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== fallingBlockNum) {
          isFalling = false;
          return;
        }
      }
    }
  }
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row + 1][col].className = cells[row][col].className;
        cells[row + 1][col].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}

function hasFallingBlock() {
  return isFalling;
}

function deleteRow() {
  for (var row = 19; row >= 0; row--) {
    var canDelete = true;
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].className === "") {
        canDelete = false;
      }
    }
    if (canDelete) {
      for (var col = 0; col < 10; col++) {
        cells[row][col].className = "";
      }
      for (var downRow = row - 1; downRow >= 0; downRow--) {
        for (var col = 0; col < 10; col++) {
          cells[downRow + 1][col].className = cells[downRow][col].className;
          cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
          cells[downRow][col].className = "";
          cells[downRow][col].blockNum = null;
        }
      }
    }
  }
}

function generateBlock() {
  var keys = Object.keys(blocks);
  var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
  var nextBlock = blocks[nextBlockKey];
  var nextFallingBlockNum = fallingBlockNum + 1;

  var pattern = nextBlock.pattern;
  for (var row = 0; row < pattern.length; row++) {
    for (var col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] && cells[row][col + 3].className !== "") {
        gameOver();
        return;
      }
    }
  }

  for (var row = 0; row < pattern.length; row++) {
    for (var col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        cells[row][col + 3].className = nextBlock.class;
        cells[row][col + 3].blockNum = nextFallingBlockNum;
      }
    }
  }
  isFalling = true;
  fallingBlockNum = nextFallingBlockNum;
}

function gameOver() {
  alert("ゲームオーバー!");
  resetGame(); // リセットする
}

function moveRight() {
  for (var row = 0; row < 20; row++) {
    for (var col = 9; col >= 0; col--) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row][col + 1].className = cells[row][col].className;
        cells[row][col + 1].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}

function moveLeft() {
  for (var row = 0; row < 20; row++) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row][col - 1].className = cells[row][col].className;
        cells[row][col - 1].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}

// ゲームを開始
startGame();
