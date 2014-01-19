var spotifyTime = 30000;
var closeTabTime = 30000;
var soundTime = 30000
var closeTabTimer;
var timing = false;
var currentTabId;

//var isEnabled = true;
chrome.storage.sync.set({"timing": false});
chrome.storage.sync.set({"wastedTime": 0});


function didMatchURL(url, bannedURLS){
        for (var i = 0; i < bannedURLS.length; ++i){
                var didFind = url.search(bannedURLS[i]);
                if (didFind >= 0 && bannedURLS[i] != "") {
                        return true;
                }
        } return false;
};

function pauseSpotify(){
	chrome.tabs.query( 
        { "active" : true }, 
        function(tabs){
            chrome.tabs.query(
            {
                url: "https://play.spotify.com/*"
            }, 
            function(s_tab) {
            	if (!s_tab) {
            		return;
            	}
                var spotify = s_tab[0]; // assume we found it
                chrome.tabs.executeScript(
                    spotify.id, {file: "spotify_interface.js"}
                ); 
            });
            
    });
}

function playSound(){
	chrome.extension.sendMessage({action: "play"});
}

function closeTab(){
	chrome.tabs.remove(currentTabId);
}

function stopTimers(){
	var endTime = new Date().getTime() / 1000;
	chrome.storage.sync.set({"endTime" : endTime}); 
	chrome.storage.sync.get("startTime", function(st){
		startTime = st.startTime;
		var elapsed = endTime - startTime; 
		chrome.storage.sync.get("wastedTime", function(wt){
			chrome.storage.sync.set({"wastedTime": (wt.wastedTime + elapsed)});
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

function checkOnAct(tabs){
	console.log("Checking tabChange onActivated");
	checkTabChange();
}

function checkOnUpdate(tabId, changeInfo, tab){
	if (changeInfo.status == "complete"){
		console.log("Checking tabChange onUpdated");
		checkTabChange();
	}	
}

//if productivity mode is turned on, pay attention for bad activities
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	if(request.action == "stateOn"){
		console.log("State On");
        chrome.storage.sync.set({"wastedTime": 0});
		checkTabChange();
		chrome.tabs.onActivated.addListener( checkOnAct );	

		chrome.tabs.onUpdated.addListener( checkOnUpdate );
	}
	else if(request.action == "stateOff"){
		console.log("state off");
		chrome.tabs.onActivated.removeListener(checkOnAct);
		chrome.tabs.onUpdated.removeListener(checkOnUpdate);
	}
});


// Notifications
var notification;

chrome.extension.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.action == "stateOff"){
        stopTimers();
		chrome.storage.sync.get("wastedTime", function(wt){
            console.log("wasted time as app is turned off");
            console.log(wt.wastedTime);
            if( wt.wastedTime > 5) {
                notification = webkitNotifications.createHTMLNotifications(
                    'Total Time Wasted:',
                    wt.wastedTime
                );
                notification.show();
            }
        });
    }
});
        

