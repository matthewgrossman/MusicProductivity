function pauseSpotify() {
	var trigger = document.createEvent("Event");
	trigger.initEvent("click", true, true);
	document.getElementById("play-pause").dispatchEvent(trigger);
}

function lookForSpotify() {
	chrome.tabs.query({}, function(tabs) {
	for (var i = 0; i < tabs.length; i++) {
		chrome.tabs.sendMessage(tabs[i].id, {action: "xxx"})
		if (document.getElementById('play-pause')) {
			pauseSpotify();
		}
	}
})
};
