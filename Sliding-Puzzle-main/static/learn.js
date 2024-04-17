$(document).ready(function() {

    $('#strategyButton').hide()
    show_strategy_Button();
    clickStrategy()

    $('#backButton').hide()
    showBackButton();
    clickBack();

    $('#nextButton').hide()
    showNextButton();
    clickNext();
    
    $('#quizButton').hide()
    showQuizButton();
    clickQuiz();
    
});
// Hide the view item button initially



// Show the next button when the page is loaded


function showBackButton(){
    var currentId = window.location.pathname.split('/').pop();
    if (currentId != 1){
        $('#backButton').show()
    }
}
function showNextButton(){
    var currentId = window.location.pathname.split('/').pop();
    if (currentId != 8){
        $('#nextButton').show()
    }
}   

function showQuizButton(){
    var currentId = window.location.pathname.split('/').pop();
    if (currentId == 8){
        $('#quizButton').show()
    }
}

function show_strategy_Button(){
    var currentId = window.location.pathname.split('/').pop();
    if (currentId == 5 || currentId == 6 ||currentId == 7 ||currentId == 2){
        $('#strategyButton').show()
    }
}

function clickBack(){
    // Click event handler for the next button
    var currentId = window.location.pathname.split('/').pop();
    $('#backButton').click(function() {
        // Calculate the  prev ID
        let prevId = parseInt(currentId) -1;
        // Redirect to the next learn page
        window.location.href = '/learn/' + prevId;
    });
}

function clickNext(){
    // Click event handler for the next button
    let currentId = window.location.pathname.split('/').pop();
    $('#nextButton').click(function() {
        if(currentId == 1){
            window.location.href = '/strategy/' + 1;
        }

        else if(currentId == 4){
            window.location.href = '/col';
        }
        
        else {
        // Calculate the next ID 
        let nextId = parseInt(currentId) + 1;
        window.location.href = '/learn/' + nextId;
    }
        // Redirect to the next learn page
      
    });
}

function clickStrategy(){
    // Click event handler for the next button
    let origin_page = window.location.pathname.split('/').pop();
    $('#strategyButton').click(function() {
        window.location.href = '/strategy/' + origin_page;
        // passing in the origin_page
        })
}

function clickQuiz(){
    // Click event handler for the next button
    $('#quizButton').click(function() {
        window.location.href = '/quiz/1';
        })
}


