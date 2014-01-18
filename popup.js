function saveOptions(state) {
    chrome.storage.sync.set({'state' : state});
};

function restoreOptions() {
    chrome.storage.sync.get("state", function( lastState) {
        console.log(lastState.state);
        if (lastState.state==0) {
            $("#off").prop('checked',true);
        } 
        else {
            $("#on").prop('checked',true);
        }
    });
};


function sendOptionsToTime( state) {

}

$(document).ready(function() {
    restoreOptions();
    $("input").click(function(e) {
        saveOptions( $(this).val() )
    });
});

