$(document).ready(function () {
  showNextButton();
  clickNextBut();

  //Hide results button until the end
  $("#resultsButton").hide();
  showResultsButton();

  document.getElementById("startBtn").addEventListener("click", function () {
    startTimer();
    // Additional puzzle logic here
  });

  // Example puzzle completion logic (adjust as needed)

  function showNextButton() {
    let currentId = window.location.pathname.split("/").pop();
    if (currentId == 3 || !checkQuizComplete()) {
      $("#nextButton").hide();
    }
  }

  function clickNextBut() {
    // Click event handler for the next button
    let currentId = window.location.pathname.split("/").pop();
    let nextId = parseInt(currentId) + 1;
    nextId = nextId <= 3 ? nextId : 3;
    $("#nextButton").click(function () {
      window.location.href = "/quiz/" + nextId;
    });
  }

  function showResultsButton() {
    let currentId = window.location.pathname.split("/").pop();
    if (currentId == 3) {
      $("#resultsButton").show();
    }
  }
});
