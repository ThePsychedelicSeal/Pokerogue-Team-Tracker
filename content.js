const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject-script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.remove();
};

window.addEventListener("message", function(event) {
    if (event.data) {
        chrome.runtime.sendMessage(event.data);
    };
});