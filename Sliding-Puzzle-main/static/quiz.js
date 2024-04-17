$(document).ready(function () {
  document.getElementById("startBtn").addEventListener("click", function () {
    startTimer();
    // Additional puzzle logic here

  });

  // Example puzzle completion logic (adjust as needed)

  function clickNextBut(){
    console.log("got her");
    // Click event handler for the next button
    let currentId = window.location.pathname.split('/').pop();
    let nextId = parseInt(currentId) + 1;
    nextId = nextId <= 3 ? nextId : 3;
    $('#nextButton').click(function() {
        window.location.href = '/quiz/' + nextId;
    }
    )}
      
    clickNextBut();
});