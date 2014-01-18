// chrome.tabs.onActivated.addListener(function(info){
// 	chrome.tabs.onUpdated.addListener(function())
// }); 

// chrome.tabs.onUpdated.addListener(function(tabs){
// 	alert("super");
// })
var urls = ["facebook.com", "reddit.com"];

function didMatchURL(url, bannedURLS){
	for (var i = 0; i < bannedURLS.length; ++i){
		var didFind = url.search(bannedURLS[i]);
		if (didFind >= 0) {
			return true;
		}
	} return false;
};

function stopTimers(){
	
};

function checkTabChange(){
	chrome.tabs.query( {"active" : true }, function(tabs){
			if (didMatchURL(tabs[0].url, urls)) {
				alert("You are at " + tabs[0].url);
			} else {
				stopTimers();
			}
	});
};

chrome.tabs.onActivated.addListener(function(tabs){
	checkTabChange();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (changeInfo.status == "complete"){
		checkTabChange();
	}
});





