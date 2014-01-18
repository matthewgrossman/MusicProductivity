// chrome.tabs.onActivated.addListener(function(info){
// 	chrome.tabs.onUpdated.addListener(function())
// }); 

// chrome.tabs.onUpdated.addListener(function(tabs){
// 	alert("super");
// })
var urls = ["facebook.com", "reddit.com"];

var wasted_time; 
var start_time; 
var end_time;
var interval = 4000;
var timer = setInterval(function(){timeElapsed()}, interval);

function didMatchURL(url, bannedURLS){
	for (var i = 0; i < bannedURLS.length; ++i){
		var didFind = url.search(bannedURLS[i]);
		if (didFind >= 0) {
			return true;
		}
	} return false;
};


function timeElapsed(){
	alert("time elapsed");

}
				

function stopTimers(){
	end_time = new Date().getTime() / 1000; 
	var elapsed = end_time - start_time;
	wasted_time += elapsed; 
	alert(elapsed);
	window.clearInterval(timer);
};

function checkTabChange(){
	chrome.tabs.query( {"active" : true }, function(tabs){
			if (didMatchURL(tabs[0].url, urls)) {
				start_time = new Date().getTime() / 1000;
				timer.setInterval(function(){timeElapsed()}, interval);
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





