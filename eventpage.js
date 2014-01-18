// chrome.tabs.onActivated.addListener(function(info){
//         chrome.tabs.onUpdated.addListener(function())
// }); 

// chrome.tabs.onUpdated.addListener(function(tabs){
//         alert("super");
// })
var urls = ["facebook.com", "reddit.com"];

var wasted_time=0; 
var start_time; 
var end_time;
var interval = 4000;
var timer;
var extremeTimer;
var timing = false;
var currentTabId;
var extreme_enabled = false;

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
        end_time = new Date().getTime() / 1000; 
        var elapsed = end_time - start_time;
        wasted_time += elapsed; 
        alert(elapsed);
        alert(wasted_time);
        timing = false;
        clearTimeout(timer);
        clearTimeout(extremeTimer);
};

function extremeTimeElapsed(){
        chrome.tabs.remove(currentTabId);
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    currentTabId = activeInfo.tabId;
});

function checkTabChange(){
        //alert("call checkTabChange");
        chrome.tabs.query( {"active" : true }, function(tabs){
                        //alert("past active");
                        if (didMatchURL(tabs[0].url, urls)) {
                                start_time = new Date().getTime() / 1000;
                                timing = true; 
                                timer = setTimeout(function(){timeElapsed()}, interval);
                                if(extreme_enabled){
                                        extremeTimer = setTimeout(function(){extremeTimeElapsed()}, 5000);
                                }        
                        } else {
                                //alert("else");
                                //alert(timing);
                                if(timing){
                                        //alert("is timing");
                                        stopTimers();
                                }
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