
var urls = ["facebook.com", "reddit.com"];
var interval = 4000;
var closeTabTime = 40000;
var closeTabTimer;
var timing = false;
var currentTabId;
var closeTabEnabled = false;
var isEnabled = true;
chrome.storage.sync.set({"timing": false});
chrome.storage.sync.set({"wastedTime": 0});


function didMatchURL(url, bannedURLS){
        for (var i = 0; i < bannedURLS.length; ++i){
                var didFind = url.search(bannedURLS[i]);
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
                console.log(s_tab[0]);
                console.log(s_tab);
                var spotify = s_tab[0]; // assume we found it

                chrome.tabs.executeScript(
                    //code: 'console.log("fuck");'
                    spotify.id, {file: "spotify_interface.js"}
                ); 
            });
            
    });
}

function playSound(){
	chrome.extension.sendMessage({action: "play})"});
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
		console.log("elapsed: " + elapsed);
		chrome.storage.sync.get("wastedTime", function(wt){
			chrome.storage.sync.set({"wastedTime": (wt.wastedTime + elapsed)});
			console.log("wasted: " + wt.wastedTime);
		});
	});
	chrome.storage.sync.set({"timing" : false});
	clearTimeout(timer);
	clearTimeout(closeTabTimer);
};

chrome.tabs.onActivated.addListener(function(activeInfo) {
    currentTabId = activeInfo.tabId;
});

//called on new tab or change tab
function checkTabChange(){
	chrome.tabs.query( {"active" : true }, function(tabs){
			if (didMatchURL(tabs[0].url, urls)) {
				var st = new Date().getTime() / 1000;
				chrome.storage.sync.set({"startTime" : st});
				chrome.storage.sync.set({"timing" : true})	
				timer = setTimeout(function(){pauseSpotify()}, interval);
				if(closeTabEnabled){
					closeTabTimer = setTimeout(function(){closeTab()}, closeTabTime);
				}	
			} else {
				chrome.storage.sync.get("timing", function(t){
				//if a timer was on, stop it because the user switched to a good tab
					if(t.timing){
						stopTimers(); 
					}
				});
			}
	});
};

//if productivity mode is turned on, pay attention for bad activities
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


