var isEnabaled = false;
var state = 0;



function saveOptions(state) {
    chrome.storage.sync.set({'state' : state});
};

function restoreOptions() {
    chrome.storage.sync.get("state", function( lastState) {
        state = lastState.state;
        if ( state==0) {
            chrome.browserAction.setIcon({path:"off.png"}); 
        } 
        else {
            chrome.browserAction.setIcon({path:"on.png"}); 
        }
    });
};


$(document).ready(function() {
    restoreOptions();
    chrome.browserAction.onClicked.addListener(function () {
        if ( state == 0) {
            state = 1;
        }
        else {
            state = 0;
        }
        saveOptions( state);
        isEnabled = state;
        if (state == 0) {
            chrome.browserAction.setIcon({path:"off.png"}); 
            chrome.extension.sendMessage({action: "stateOff"});
        } 
        else {
            chrome.browserAction.setIcon({path:"on.png"}); 
            chrome.extension.sendMessage({action: "stateOn"});
        }
    });
});

