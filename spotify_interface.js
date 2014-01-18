var trigger = document.createEvent("MouseEvents");
trigger.initEvent("click", true, true);
//document.getElementById("play-pause").dispatchEvent(trigger); */
window.frames['app-player'].document.getElementById('play-pause').dispatchEvent(trigger);
//console.log(document.getElementById("play-pause"));


//Add the chrome.tabs.query() to wherever we want to call the pause Spotify function.

function checkTabChange(){
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
                    null, {file: "spotify_interface.js"}
                ); 
            });
            
        });
};
