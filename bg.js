var audioElement = document.createElement('audio');
audioElement.setAttribute("preload", "auto");
audioElement.autobuffer = true;

var source1 = document.createElement('source');
source1.type= 'audio/mpeg';
source1.src= 'timeIsPassing.mp3';
audioElement.appendChild(source1);

chrome.extension.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.action == "play"){
    audioElement.load;
    audioElement.play();
    }
});
