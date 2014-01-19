$(document).ready(function(){
    $("#save").click(function(){
      var text = $("#input").val();
      var sites = text.split(" ");
      console.log(sites);
      chrome.storage.sync.set({'sites' : sites});
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
  
}

document.addEventListener('DOMContentLoaded', restore_options);