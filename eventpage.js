var interval = 4000;
var closeTabTime = 6000;
var closeTabTimer;
var timing = false;
var currentTabId;

//var isEnabled = true;
chrome.storage.sync.set({"timing": false});
chrome.storage.sync.set({"wastedTime": 0});


function didMatchURL(url, bannedURLS){
        for (var i = 0; i < bannedURLS.length; ++i){
                var didFind = url.search(bannedURLS[i]);
                console.log("URL "+url);
                console.log("bannedURLS "+ bannedURLS);
                console.log("didFind: " + didFind);
                if (didFind >= 0) {
                        return true;
                }
        } return false;
};

function pauseSpotify(){
	console.log("pause");
	chrome.tabs.query( 
        { "active" : true }, 
        function(tabs){
            chrome.tabs.query(
            {
                url: "https://play.spotify.com/*"
            }, 
            function(s_tab) {
                console.log("running script");
                var spotify = s_tab[0]; // assume we found it
                chrome.tabs.executeScript(
                    //code: 'console.log("fuck");'
                    spotify.id, {file: "spotify_interface.js"}
                ); 
            });
            
    });
}

function playSound(){
	console.log("in play sound");
	chrome.extension.sendMessage({action: "play"});
}

function closeTab(){
	console.log("in closeTab");
	chrome.tabs.remove(currentTabId);
}

function stopTimers(){
	console.log("stop");
	var endTime = new Date().getTime() / 1000;
	chrome.storage.sync.set({"endTime" : endTime}); 
	chrome.storage.sync.get("startTime", function(st){
		startTime = st.startTime;
		var elapsed = endTime - startTime; 
		console.log("elapsed: " + elapsed);
		chrome.storage.sync.get("wastedTime", function(wt){
			chrome.storage.sync.set({"wastedTime": (wt.wastedTime + elapsed)});
			console.log("wasted: " + wt.wastedTime);
		});
	});
	chrome.storage.sync.set({"timing" : false});
	clearTimeout(timer);
	//clearTimeout(closeTabTimer);
};

chrome.tabs.onActivated.addListener(function(activeInfo) {
    currentTabId = activeInfo.tabId;
});


function doSomething(){
	console.log("do something");
	chrome.storage.sync.get("enableSpotify", function(eS){
		if(eS.enableSpotify){
			pauseSpotify();
		}
	});
	chrome.storage.sync.get("enablePlaySound", function(pS){
		if(pS.enablePlaySound){
			playSound();
		}
	});
	chrome.storage.sync.get("enableCloseTab", function(cT){
		if(cT.enableCloseTab){
			closeTab();
		}
	});

}

//called on new tab or change tab
function checkTabChange(){
	chrome.tabs.query( {"active" : true }, function(tabs){
		chrome.storage.sync.get('sites', function(ret){
			var sites = ret.sites[0].split("\n");
			var currentURL = tabs[0].url;
			console.log(sites);
			console.log(currentURL);
			//console.log("did match: " + didMatchURL(currentURL, sites));

			if (didMatchURL(currentURL, sites)) {
				console.log(currentURL);
				var st = new Date().getTime() / 1000;
				chrome.storage.sync.set({"startTime" : st});
				chrome.storage.sync.set({"timing" : true})	
				timer = setTimeout(function(){doSomething()}, interval);
				/*if(closeTabEnabled){
					closeTabTimer = setTimeout(function(){closeTab()}, closeTabTime);
				}*/	
			} else {
				chrome.storage.sync.get("timing", function(t){
				//if a timer was on, stop it because the user switched to a good tab
					if(t.timing){
						stopTimers(); 
					}
				});
			}
		});	
	});
};

//if productivity mode is turned on, pay attention for bad activities
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	if(request.action == "stateOn"){
		chrome.tabs.onActivated.addListener(function(tabs){
			console.log("Checking tabChange onActivated");
			checkTabChange();
		});	

		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
			if (changeInfo.status == "complete"){
				console.log("Checking tabChange onUpdated");
				checkTabChange();
			}	
		});
	}
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse)){
	if(request.action == "stateOff"){
		chrome.tabs.onActivated.removeListener();
		chrome.tabs.onUpdated.removeListener();
	}
});



