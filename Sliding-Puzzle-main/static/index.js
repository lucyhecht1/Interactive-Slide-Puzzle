let emptyTileRow = 0;
let emptyTileCol = 0;
let timerOn = false;
let cellDisplacement = "85px";
let cellDisp = "87px";

let timerInterval;
let totalSeconds = 0;
let puzzleCompleted = false;
let attemptFailed = false;
let step = 0;

let isWin = false;
let isShuffle = false;
let isDebug = false;

function checkStepComplete() {
  $("#success").text("");
  let step = $("#success").attr("data-step");
  let layout = getCurrentTileState();

  switch (parseInt(step)) {
    //steps to solve first row
    case 1:
      if (layout[0][0] == 1) {
        console.log("step 1 complete");
        $("#success").text("Success!");
        $("#success-card").show();
        // $(".cell:contains('1')").css("background-color", "#64e0ff");
        $("#nextButton").show();

        return true;
      } else {
        return false;
      }
      break;
    case 2:
      if (layout[0][0] == 1 && layout[0][1] == 3) {
        console.log("step 2 complete");
        $("#success").text("Success!");
        $("#nextButton").show();
        $("#success-card").show();
        return true;
      } else {
        return false;
      }
      break;
    case 3:
      if (layout[0][0] == 1 && layout[0][1] == 3 && layout[1][1] == 2) {
        console.log("step 3 complete");
        $("#success").text("Success!");
        $("#nextButton").show();
        $("#success-card").show();
        return true;
      } else {
        return false;
      }
      break;

    case 4:
      if (layout[0][0] == 1 && layout[0][1] == 2 && layout[0][2] == 3) {
        console.log("step 4 complete");
        $("#success").text("Success!");
        $(".cell:contains('1')").css("background-color", "#64e0ff");
        $(".cell:contains('2')").css("background-color", "#64e0ff");
        $(".cell:contains('3')").css("background-color", "#64e0ff");
        $("#nextButton").show();
        $("#success-card").show();
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
        $("#nextButton").show();
        $("#success-card").show();
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
        $("#nextButton").show();
        $("#success-card").show();
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
        $(".cell:contains('4')").css("background-color", "#64e0ff");
        $(".cell:contains('7')").css("background-color", "#64e0ff");
        $("#nextButton").show();
        $("#success-card").show();
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
        $("#success").text("Success!");
        $(".cell").css("background-color", "#64e0ff");
        $("#success-card").show();
        return true;
      } else {
        return false;
      }
      break;
  }
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
        $("#success").text("Success!").addClass("success-class");
        $(".cell:contains('1')").css("background-color", "#64e0ff");
        $(".cell:contains('2')").css("background-color", "#64e0ff");
        $(".cell:contains('3')").css("background-color", "#64e0ff");
        $("#nextButton").show();
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
        $("#success").text("Success!").addClass("success-class");
        $(".cell:contains('1')").css("background-color", "#64e0ff");
        $(".cell:contains('4')").css("background-color", "#64e0ff");
        $(".cell:contains('7')").css("background-color", "#64e0ff");
        $("#nextButton").show();
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
        $("#success").text("Success!").addClass("success-class");
        $(".cell").css("background-color", "#64e0ff");
        return true;
      } else {
        return false;
      }
      break;
  }
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
  attemptFailed = true;
  $("#success").text("Failed :(").addClass("failed-class");
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
  $("#nextButton").show();
}

function sendLayout(layout) {
  $.ajax({
    type: "POST",
    url: "/send_layout",
    contentType: "application/json",
    data: JSON.stringify({ layout: layout }),
    success: function (response) {},
    error: function (err) {
      console.error("Error sending layout:", err);
    },
  });
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
    if (attemptFailed) {
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
      top: "+=" + cellDisp,
    });

    $("#empty").animate({
      top: "-=" + cellDisp,
    });

    emptyTileRow -= 1;
    $(this).attr("data-row", posRow + 1);
  }

  // Move tile up
  if (posRow - 1 == emptyTileRow && posCol == emptyTileCol) {
    $(this).animate({
      top: "-=" + cellDisp,
    });

    $("#empty").animate({
      top: "+=" + cellDisp,
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
}

function buildPuzzList(layout) {
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid", "start");
  for (let i = 0; i < 3; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    for (let j = 0; j < 3; j++) {
      let index = i * 3 + j;
      let cellData = layout[index];
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.classList.add("solve");
      cellDiv.setAttribute("data-row", `${i}`);
      cellDiv.setAttribute("data-col", `${j}`);
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
    gridContainer.appendChild(rowDiv);
  }
  return gridContainer;
}

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
        cellDiv.style.backgroundColor = "#64e0ff";
      }
      if (
        gridArray[0][0] == 1 &&
        gridArray[1][0] == 4 &&
        gridArray[2][0] == 7
      ) {
        if (cellData == 1 || cellData == 4 || cellData == 7) {
          cellDiv.style.backgroundColor = "#64e0ff";
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

function solveStep(solution) {
  solution.forEach(function (step) {
    let cell = $(".cell:contains(" + step + ")");
    cell.click();
  });
}

function startTimer() {
  $("#clock").hide();
  $("#clock").addClass("slow-spin");
  $("#clock").show();
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

    if (totalSeconds >= 30) {
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

$(document).ready(function () {
  $(".start .cell").click(moveTile);
});
