$(document).ready(function() {
    $('#backButton').hide()
    showBackButton();
    $('#nextButton').hide()
    showNextButton();
    clickBack();
    clickNext();
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
        
        else {
        // Calculate the next ID 
        let nextId = parseInt(currentId) + 1;
        window.location.href = '/learn/' + nextId;
    }
        // Redirect to the next learn page
      
    });
}

