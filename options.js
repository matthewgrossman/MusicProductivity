var currentTabId;

$(document).ready(function(){
    $("#save").click(function(){
      var text = $("#input").val();
      var sites = text.split(" ");
      chrome.storage.sync.set({'sites' : sites});

      var spotifyClicked = $("#spotify").prop('checked');
      var soundClicked = $("#sound").prop('checked');
      var tabClicked = $("#close").prop('checked');

      chrome.storage.sync.set({'enableSpotify': spotifyClicked});
      chrome.storage.sync.set({'enablePlaySound': soundClicked});
      chrome.storage.sync.set({'enableCloseTab': tabClicked});

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
  
}

document.addEventListener('DOMContentLoaded', restore_options);





