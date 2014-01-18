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
var isEnabled = true;
chrome.storage.sync.set({"timing": false});
chrome.storage.sync.set({"wastedTime": 0});
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
	console.log("in stopTimers");
	var endTime = new Date().getTime() / 1000;
	console.log("et: " + endTime);
	chrome.storage.sync.set({"endTime" : endTime}); 
	chrome.storage.sync.get("startTime", function(st){
		startTime = st.startTime;
		var elapsed = endTime - startTime; 
		console.log("elapsed: " + elapsed);
		chrome.storage.sync.get("wastedTime", function(wt){
			console.log("in get wasted time")
			chrome.storage.sync.set({"wastedTime": (wt.wastedTime + elapsed)});
			console.log("wasted time: " + wt.wastedTime);
		});
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

function test(){
	alert("TEST");
}

function checkTabChange(){
	console.log("in check tab");
	//alert("call checkTabChange");
	chrome.tabs.query( {"active" : true }, function(tabs){
			//alert("past active");
			if (didMatchURL(tabs[0].url, urls)) {
				console.log("on blocked site");
				var st = new Date().getTime() / 1000;
				chrome.storage.sync.set({"startTime" : st});
				chrome.storage.sync.set({"timing" : true})	
				chrome.storage.sync.get("timing", function(t){
					console.log("timing");
					console.log(t.timing);
				});
				timer = setTimeout(function(){timeElapsed()}, interval);
				console.log("timer started");
				if(extreme_enabled){
					extremeTimer = setTimeout(function(){extremeTimeElapsed()}, 5000);
				}	
			} else {
				var timing; 
				chrome.storage.sync.get("timing", function(t){
					timing = t.timing;
					console.log(t.timing);
					if(t.timing){
						console.log("called stop");
						//test();
						stopTimers();  //need to call in funtion so that timer has value; can't; figure out why
					}
				});
				//console.log("timing   " + timing);
				/*if(timing){
					console.log("In if");
					stopTimers();
				}*/
			}
	});
};

if(isEnabled){
	chrome.tabs.onActivated.addListener(function(tabs){
		checkTabChange();
	});	

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if (changeInfo.status == "complete"){
			checkTabChange();
		}	
	});
}




