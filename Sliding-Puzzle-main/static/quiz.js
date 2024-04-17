$(document).ready(function () {
  document.getElementById("startBtn").addEventListener("click", function () {
    startTimer();
    // Additional puzzle logic here

  });

  // Example puzzle completion logic (adjust as needed)

  

  function clickNextBut(){
    // Click event handler for the next button
    let currentId = window.location.pathname.split('/').pop();
    let nextId = parseInt(currentId) + 1;
    nextId = nextId <= 3 ? nextId : 3;
    $('#nextButton').click(function() {
        window.location.href = '/quiz/' + nextId;
    }
    )}
  
  function startOverBut(){
    // Click event handler for the start over button
    $('#startOver').click(function() {
        window.location.href = '/quiz/1';
    }
    )}
  function showQuizButton(){
    let currentId = window.location.pathname.split('/').pop();
    if (currentId == 3){
        $('#startOver').show()
    }
  }

    $('#startOver').hide()
    showQuizButton();
    clickNextBut();
    startOverBut();

});