// chrome.tabs.onActivated.addListener(function(info){
// 	chrome.tabs.onUpdated.addListener(function())
// }); 

// chrome.tabs.onUpdated.addListener(function(tabs){
// 	alert("super");
// })
var urls = ["https://www.facebook.com/", "https://www.google.com/", "http://www.reddit.com/"];

function didMatchURL(url, bannedURLS){
	for (var i = 0; i < bannedURLS.length; ++i){
		if (bannedURLS[i] == url) {
			return true;
		}
	} return false;
};

chrome.tabs.onActivated.addListener(function(tabs){
	chrome.tabs.query( {"active" : true }, function(tabs){
			if (didMatchURL(tabs[0].url, urls)) {
				alert("You are at " + tabs[0].url);
			}
		});
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (changeInfo.status == "complete"){
		chrome.tabs.query( {"active" : true }, function(tabs){
			if (didMatchURL(tabs[0].url, urls)) {
				alert("You are at " + tabs[0].url);
			}
		});
	}
});



