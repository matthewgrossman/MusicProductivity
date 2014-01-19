var currentTabId;

$(document).ready(function(){
    $("#save").click(function(){
      var text = $("#input").val();
      var sites = text.split(" ");
      chrome.storage.sync.set({'sites' : sites});

      var spotifyClicked = $("#spotify").prop('checked');
      var soundClicked = $("#sound").prop('checked');
      var tabClicked = $("#close").prop('checked');
      var rickRollClicked = $("#rickRoll").prop('checked');

      chrome.storage.sync.set({'enableSpotify': spotifyClicked});
      chrome.storage.sync.set({'enablePlaySound': soundClicked});
      chrome.storage.sync.set({'enableCloseTab': tabClicked});
      chrome.storage.sync.set({'enableRickRoll': rickRollClicked});
    });
});


// Restores select box state to saved value from localStorage.
function restore_options() {
  chrome.storage.sync.get("sites", function(retVal){
    var strings = retVal.sites;
    if (!retVal) {
      return;
    }
    var input = $("#input");
    for (var i = 0; i < strings.length; i++) {
      var temp = strings[i];
      input.append(temp + "\n");
    }
  });

  chrome.storage.sync.get('enableSpotify', function(ret){
    if (!ret) {
      return;
    }
    var spotifyClicked = ret.enableSpotify;
    $("#spotify").prop('checked', spotifyClicked);
  });
  chrome.storage.sync.get('enablePlaySound', function(ret){
    if (!ret) {
      return;
    }
    var soundClicked = ret.enablePlaySound;
    $("#sound").prop('checked', soundClicked);
  });
  chrome.storage.sync.get('enableCloseTab', function(ret){
    if (!ret) {
      return;
    }
    var tabClicked = ret.enableCloseTab;
    $("#close").prop('checked', tabClicked);
  });
  chrome.storage.sync.get('enableRickRoll', function(ret){
    if (!ret) {
      return;
    }
    var rickClicked = ret.enableRickRoll;
    $("#rickRoll").prop('checked', rickClicked);
  });
  
}

document.addEventListener('DOMContentLoaded', restore_options);





