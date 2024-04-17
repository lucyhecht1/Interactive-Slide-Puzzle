let emptyTileRow = 0;
let emptyTileCol = 0;
let timerOn = false;
var cellDisplacement = "66.5px";
var goal_arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];
heur = "mis";
let timerInterval;
let totalSeconds = 0;
let puzzleCompleted = false;

var grid = document.getElementById("confetti");
// document.body.appendChild(grid);

isWin = false;
isShuffle = false;
isDebug = false;
function buildPuzzle(gridArray) {
  // Create the main grid container div
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid", "start");

  // Iterate through each row in the 2D array
  for (let i = 0; i < gridArray.length; i++) {
    const rowData = gridArray[i];

    // Create a div for the row
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    // Iterate through each element in the row
    for (let j = 0; j < rowData.length; j++) {
      const cellData = rowData[j];

      // Create a div for the cell
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.setAttribute("data-row", `${i}`);
      cellDiv.setAttribute("data-col", `${j}`);

      if (i == 0 && rowData[0] == 1 && rowData[1] == 2 && rowData[2] == 3) {
        cellDiv.style.backgroundColor = "green";
      }
      if (
        gridArray[0][0] == 1 &&
        gridArray[1][0] == 4 &&
        gridArray[2][0] == 7
      ) {
        if (cellData == 1 || cellData == 4 || cellData == 7) {
          cellDiv.style.backgroundColor = "green";
        }
      }

      if (cellData == 0) {
        cellDiv.id = "empty";
      } else {
        const spanElement = document.createElement("span");
        spanElement.textContent = cellData;
        // Append the span element to the cell div
        cellDiv.appendChild(spanElement);
      }

      // Append the cell div to the row div
      rowDiv.appendChild(cellDiv);
    }

    // Append the row div to the grid container
    gridContainer.appendChild(rowDiv);
  }

  return gridContainer;
}

function moveTile() {
  emptyTileRow = parseInt($("#empty").attr("data-row"));
  emptyTileCol = parseInt($("#empty").attr("data-col"));
  if (isDebug) console.log(pos);
  var posRow = parseInt($(this).attr("data-row"));
  var posCol = parseInt($(this).attr("data-col"));
  let parent = $(this).parent().parent().parent();
  if (parent.attr("data-mode") != "quiz") {
    if (checkStepComplete() == true) {
      return;
    }
  } else {
    if (checkQuizComplete() == true) {
      return;
    }
    if (!timerOn) {
      console.log("starting timer");
      startTimer();
    }
  }

  // Move tile down
  if (posRow + 1 == emptyTileRow && posCol == emptyTileCol) {
    $(this).animate({
      top: "+=" + cellDisplacement,
    });

    $("#empty").animate({
      top: "-=" + cellDisplacement,
    });

    emptyTileRow -= 1;
    $(this).attr("data-row", posRow + 1);
  }

  // Move tile up
  if (posRow - 1 == emptyTileRow && posCol == emptyTileCol) {
    $(this).animate({
      top: "-=" + cellDisplacement,
    });

    $("#empty").animate({
      top: "+=" + cellDisplacement,
    });

    emptyTileRow += 1;
    $(this).attr("data-row", posRow - 1);
  }

  // Move tile right
  if (posRow == emptyTileRow && posCol + 1 == emptyTileCol) {
    $(this).animate({
      right: "-=" + cellDisplacement, // move right
    });

    $("#empty").animate({
      right: "+=" + cellDisplacement, // move left
    });

    emptyTileCol -= 1;
    $(this).attr("data-col", posCol + 1);
  }

  // Move tile left
  if (posRow == emptyTileRow && posCol - 1 == emptyTileCol) {
    $(this).animate({
      right: "+=" + cellDisplacement,
    });

    $("#empty").animate({
      right: "-=" + cellDisplacement,
    });

    emptyTileCol += 1;
    $(this).attr("data-col", posCol - 1);
  }

  $("#empty").attr("data-row", emptyTileRow);
  $("#empty").attr("data-col", emptyTileCol);
  sendLayout(getCurrentTileState());

  if (parent.attr("data-mode") == "quiz") {
    checkQuizComplete();
  } else {
    checkStepComplete();
  }

  // party.confetti(grid)
  if (!isShuffle) checkWinState();
}
function checkQuizComplete() {
  $("#success").text("");
  let question = $("#success").attr("data-step");
  let layout = getCurrentTileState();
  switch (parseInt(question)) {
    case 1:
      if (layout[0][0] == 1 && layout[0][1] == 2 && layout[0][2] == 3) {
        puzzleCompleted = true;
        stopTimer();
        const timeRemaining = totalSeconds;
        sendSuccessAttempt(timeRemaining, 1);
        $("#success").text("Success");
        $(".cell:contains('1')").css("background-color", "green");
        $(".cell:contains('2')").css("background-color", "green");
        $(".cell:contains('3')").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;
    case 2:
      if (
        layout[0][0] == 1 &&
        layout[0][1] == 2 &&
        layout[0][2] == 3 &&
        layout[1][0] == 4 &&
        layout[2][0] == 7
      ) {
        puzzleCompleted = true;
        stopTimer();
        const timeRemaining = totalSeconds;
        sendSuccessAttempt(timeRemaining, 2);
        $("#success").text("Success");
        $(".cell:contains('1')").css("background-color", "green");
        $(".cell:contains('4')").css("background-color", "green");
        $(".cell:contains('7')").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;
    case 3:
      if (
        layout[0][0] == 1 &&
        layout[0][1] == 2 &&
        layout[0][2] == 3 &&
        layout[1][0] == 4 &&
        layout[2][0] == 7 &&
        layout[1][1] == 5 &&
        layout[1][2] == 6 &&
        layout[2][1] == 8
      ) {
        puzzleCompleted = true;
        stopTimer();
        const timeRemaining = totalSeconds;
        sendSuccessAttempt(timeRemaining, 3);
        $("#success").text("Success");
        $(".cell").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;
  }
}
function startTimer() {
  totalSeconds = 0;
  timerOn = true;
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  if (!puzzleCompleted) {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
    document.getElementById("timer").textContent = formattedTime;

    if (totalSeconds >= 60) {
      stopTimer();
      sendFailedAttempt($("#success").attr("data-step"));
    }
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerOn = false;
}

function padZero(value) {
  return value < 10 ? "0" + value : value;
}
function sendSuccessAttempt(timeRemaining, question) {
  $.ajax({
    type: "POST",
    url: "/success-attempt",
    contentType: "application/json",
    data: JSON.stringify({ question: question, timeRemaining: timeRemaining }),
    success: function (response) {
      console.log("Success attempt sent:", response);
    },
    error: function (err) {
      console.error("Error sending success attempt:", err);
    },
  });
}

function sendFailedAttempt(question) {
  $.ajax({
    type: "POST",
    url: "/failed-attempt",
    contentType: "application/json",
    data: JSON.stringify({ question: question, timeTaken: totalSeconds }),
    success: function (response) {
      console.log("Failed attempt sent:", response);
    },
    error: function (err) {
      console.error("Error sending failed attempt:", err);
    },
  });
}
function sendLayout(layout) {
  // Send the layout data to Flask using AJAX
  $.ajax({
    type: "POST",
    url: "/send_layout", // Change the URL to your Flask endpoint
    contentType: "application/json",
    data: JSON.stringify({ layout: layout }),
    success: function (response) {},
    error: function (err) {
      console.error("Error sending layout:", err);
    },
  });
}
function checkStepComplete() {
  $("#success").text("");
  let step = $("#success").attr("data-step");
  let layout = getCurrentTileState();

  switch (parseInt(step)) {
    //steps to solve first row
    case 1:
      if (layout[0][0] == 1) {
        console.log("step 1 complete");
        $("#success").text("Success");
        // $(".cell:contains('1')").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;
    case 2:
      if (layout[0][0] == 1 && layout[0][1] == 3) {
        console.log("step 2 complete");
        $("#success").text("Success");
        return true;
      } else {
        return false;
      }
      break;
    case 3:
      if (layout[0][0] == 1 && layout[0][1] == 3 && layout[1][1] == 2) {
        console.log("step 3 complete");
        $("#success").text("Success");
        return true;
      } else {
        return false;
      }
      break;

    case 4:
      if (layout[0][0] == 1 && layout[0][1] == 2 && layout[0][2] == 3) {
        console.log("step 4 complete");
        $("#success").text("Success");
        $(".cell:contains('1')").css("background-color", "green");
        $(".cell:contains('2')").css("background-color", "green");
        $(".cell:contains('3')").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;

    // steps to solve forst column
    case 5:
      if (
        layout[0][0] == 1 &&
        layout[0][1] == 2 &&
        layout[0][2] == 3 &&
        layout[1][0] == 7
      ) {
        console.log("step 5 complete");
        $("#success").text("Success");
        return true;
      } else {
        return false;
      }
      break;

    case 6:
      if (
        layout[0][0] == 1 &&
        layout[0][1] == 2 &&
        layout[0][2] == 3 &&
        layout[1][0] == 7 &&
        layout[1][1] == 4
      ) {
        console.log("step 6 complete");
        $("#success").text("Success");
        return true;
      } else {
        return false;
      }
      break;

    case 7:
      if (
        layout[0][0] == 1 &&
        layout[0][1] == 2 &&
        layout[0][2] == 3 &&
        layout[1][0] == 4 &&
        layout[2][0] == 7
      ) {
        console.log("step 7 complete");
        $("#success").text("Success");
        $(".cell:contains('4')").css("background-color", "green");
        $(".cell:contains('7')").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;
    //last step that finishes puzzle

    case 8:
      if (
        layout[0][0] == 1 &&
        layout[0][1] == 2 &&
        layout[0][2] == 3 &&
        layout[1][0] == 4 &&
        layout[1][1] == 5 &&
        layout[1][2] == 6 &&
        layout[2][0] == 7 &&
        layout[2][1] == 8
      ) {
        console.log("step 8 complete");
        $("#success").text("Success");
        $(".cell").css("background-color", "green");
        return true;
      } else {
        return false;
      }
      break;
  }
}

function getCurrentTileState() {
  tileState = [[], [], []];

  $(".start .cell").each(function (i, obj) {
    // console.log(i,$(this).find("span").text())
    i = parseInt($(this).attr("data-row"));
    j = parseInt($(this).attr("data-col"));
    val_str =
      $(this).find("span").text() != ""
        ? parseInt($(this).find("span").text())
        : 0;
    // console.log(val_str)
    tileState[i][j] = val_str;
  });
  return tileState;
}

step = 0;

function checkWinCondition() {
  var tilePos = getCurrentTileState();
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (tilePos[i][j] != goal_arr[i][j]) return false;
    }
  }
  // console.log(tilePos)
  return true;
}

function checkWinState() {
  isWin = checkWinCondition();
  // if (isDebug) isWin = true
  if (isWin == true) {
    var winConfetti = confetti.create(grid, { resize: true });
    // grid.style.zIndex=2
    console.log("Win!!!");
    winConfetti({ spread: 180, ticks: 500 });
    setTimeout(() => {
      winConfetti.reset();
      grid.style.zIndex = -1;
    }, 2000);
  }
}
$(document).ready(function () {
  $(".start .cell").click(moveTile);
});
