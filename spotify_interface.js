var trigger = document.createEvent("MouseEvents");
trigger.initEvent("click", true, true);
window.frames['app-player'].document.getElementById('play-pause').dispatchEvent(trigger);

