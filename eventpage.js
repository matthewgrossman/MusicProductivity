var spotifyTime = 60000;
var closeTabTime = 600000;
var soundTime = 30000
var closeTabTimer;
var timing = false;
var currentTabId;

//var isEnabled = true;
chrome.storage.sync.set({"timing": false});
//chrome.storage.sync.set({"wastedTime": 0});
console.log("START");

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

function updateWastedTime(showN, clearWastedTime){
	console.log("Update Wasted Time");
	var endTime = new Date().getTime() / 1000;
	chrome.storage.sync.set({"endTime" : endTime}); 
	chrome.storage.sync.get("startTime", function(st){
		startTime = st.startTime;
		console.log("startTime: "+startTime);
		var elapsed = endTime - startTime; 
		console.log("Elapsed Time: " + elapsed);
		chrome.storage.sync.get("wastedTime", function(wt){
			chrome.storage.sync.set({"wastedTime": (wt.wastedTime + elapsed)});
			if(showN){
				console.log("Showing Notification from within UpdateWastedTime");
				showNotification(wt.wastedTime+elapsed);
				if(clearWastedTime){
					chrome.storage.sync.set({"wastedTime" : 0});
				}
			}
		});
	});
}

function stopTimers(showN, clearWastedTime){
	console.log("Stop Timer");
	updateWastedTime(showN, clearWastedTime);
	console.log("Set Timing To False");
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
	console.log("In CheckTabChange");
	chrome.tabs.query( {"active" : true }, function(tabs){
		chrome.storage.sync.get('sites', function(ret){
			var sites = ret.sites[0].split("\n");
			var currentURL = tabs[0].url;
			console.log(sites);
			console.log(currentURL);
			//console.log("did match: " + didMatchURL(currentURL, sites));
			if (didMatchURL(currentURL, sites)) {
				console.log(currentURL);
				console.log("On A Forbidden Site");
				chrome.storage.sync.get("timing", function(t){
					if(!t.timing){
						console.log("Start A New Timer");
						timer = setTimeout(function(){doSomething()}, spotifyTime);
						var st = new Date().getTime() / 1000;
						chrome.storage.sync.set({"startTime" : st});
						chrome.storage.sync.set({"timing" : true});	
					}
				});
				
				/*if(closeTabEnabled){
					closeTabTimer = setTimeout(function(){closeTab()}, closeTabTime);
				}*/	
			} else {
				console.log("Not On A Forbidden Site");
				chrome.storage.sync.get("timing", function(t){
				//if a timer was on, stop it because the user switched to a good tab
					if(t.timing){
						console.log("Timer Was On");
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

function showNotification(wastedTime){
	console.log("Inside Show Notification");
	console.log("Waste Time: "+wastedTime);
	var notification;
	if(wastedTime > 5) {
		notification = webkitNotifications.createNotification(
			"off.png",
			"Total Time Wasted:",
			wastedTime
		);
		notification.show();
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
		chrome.storage.sync.set({"wastedTime" : 0});
	}
	else if(request.action == "stateOff"){
		//chrome.storage.sync.set({"wastedTime" : 0});
		console.log("State Off");
		chrome.tabs.onActivated.removeListener(checkOnAct);
		chrome.tabs.onUpdated.removeListener(checkOnUpdate);
		//Account for the case where the user kills the app while on a bad page
		chrome.storage.sync.get("timing", function(t){
			var timing = t.timing; 
			console.log(timing);
			if(timing){
				console.log("Timer Was On");
				/*var endTime = new Date().getTime() / 1000;
				chrome.storage.sync.get("startTime", function(sT){
					startTime = sT.startTime;
					var elapsed = endTime - startTime;
					chrome.storage.sync.get("wastedTime", function(wT){
						var finalWastedTime = wT.wastedTime + elapsed;
						showNotification(finalWastedTime);
					})
				});*/
				stopTimers(true, true);
				//chrome.storage.sync.set({"wastedTime" : 0});
			}
			else {
				console.log("Timer Was Off");
				chrome.storage.sync.get("wastedTime", function(wT){
					console.log("Wasted time: " + wT.wastedTime);
					showNotification(wT.wastedTime);
				});
				chrome.storage.sync.set({"wastedTime" : 0});
			}
		});
	
	}
});


// Notifications
/*var notification;

function timeToHHMMSS( sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    else              {seconds = seconds | 0;}
    var time    = "Hours:"+hours+"  Minutes:"+minutes+"  Seconds:"+seconds;
    return time;
}


chrome.extension.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.action == "stateOff"){
        //updateWastedTime();
        var endTime = new Date().getTime() / 1000;
		chrome.storage.sync.set({"endTime" : endTime}); 
		chrome.storage.sync.get("startTime", function(st){
			startTime = st.startTime;
			console.log("startTime: "+startTime);
			var elapsed = endTime - startTime; 
			chrome.storage.sync.get("wastedTime", function(wt){
				chrome.storage.sync.set({"wastedTime": (wt.wastedTime + elapsed)});
				chrome.storage.sync.get("wastedTime", function(wt){
           		console.log("wasted time as app is turned off");
           	 	console.log(wt.wastedTime);
            	if( wt.wastedTime > 5) {
                    time = timeToHHMMSS( wt.wastedTime);
               		notification = webkitNotifications.createNotification(
                    'off.png',
                    'Total Time Wasted:',
                    time 
                );
                notification.show();
				setTimeout(function(){notification.cancel()}, 4000);
                }
                });
			});
		});
		
    }
});*/
        

