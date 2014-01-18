// chrome.tabs.onActivated.addListener(function(info){
// 	chrome.tabs.onUpdated.addListener(function())
// }); 

// chrome.tabs.onUpdated.addListener(function(tabs){
// 	alert("super");
// })
var urls = ["facebook.com", "reddit.com"];

//localStorage["wastedTime"]; 
//localStorage["startTime"]; 
//localStorage["endTime"];
var interval = 4000;
//localStorage["timer"] = false; 
var extremeTimer;
var timing = false;
var currentTabId;
var extreme_enabled = false;
chrome.storage.sync.set({"timing": false});

//chrome.storage.local.set({"random" : 3});


function didMatchURL(url, bannedURLS){
	for (var i = 0; i < bannedURLS.length; ++i){
		var didFind = url.search(bannedURLS[i]);
		if (didFind >= 0) {
			return true;
		}
	} return false;
};

function timeElapsed(){
	//alert("time elapsed");

}

function stopTimers(){
	chrome.storage.sync.set({"endTime" : new Date().getTime() / 1000}); 
	var endTime;
	chrome.storage.sync.get("endTime", function(et){
		endTime = et.endTime;
	});
	var startTime;
	chrome.storage.sync.get("startTime", function(st){
		startTime = st.startTime;
	})
	var elapsed = endTime - startTime;
	console.log(elapsed);
	chrome.storage.get("wastedTime", function(wt){
		chrome.storage.sync.set({"wastedTime" : wt.wastedTime + elapsed});
		console.log(wt.wastedTime);
	});

	chrome.storage.sync.set({"timing" : false});
	clearTimeout(timer);
	clearTimeout(extremeTimer);
};

function extremeTimeElapsed(){
	chrome.tabs.remove(currentTabId);
}
console.log("HI");

chrome.tabs.onActivated.addListener(function(activeInfo) {
    currentTabId = activeInfo.tabId;
});

function checkTabChange(){
	//alert("call checkTabChange");
	chrome.tabs.query( {"active" : true }, function(tabs){
			//alert("past active");
			if (didMatchURL(tabs[0].url, urls)) {
				chrome.storage.sync.set({"startTime" : new Date().getTime() / 1000});
				chrome.storage.sync.set({"timing" : true})		
				timer = setTimeout(function(){timeElapsed()}, interval);
				if(extreme_enabled){
					extremeTimer = setTimeout(function(){extremeTimeElapsed()}, 5000);
				}	
			} else {
				chrome.storage.sync.get("timing", function(t){
					if(t.timing){
						stopTimers();
					}
				})
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





