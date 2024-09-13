let isScriptRunning = false;
let messageLimit = 0;



document.getElementById("start-script").addEventListener("click", () => {
    isScriptRunning = true;
    messageLimit = document.getElementById("message-limit").value;
    updateScriptStatus();
    chrome.runtime.sendMessage({ type: "START_SCRIPT", messageLimit: messageLimit });
    saveSettings();
});
document.getElementById("stop-script").addEventListener("click", () => {
    isScriptRunning = false;
    updateScriptStatus();
    chrome.runtime.sendMessage({ type: "STOP_SCRIPT" });
    saveSettings();
});




function updateScriptStatus() {
    let scriptStatus = document.getElementById("script-status");
    if (isScriptRunning) {
        scriptStatus.textContent = "It's ON";
        scriptStatus.classList.remove("stopped");
        scriptStatus.classList.add("running");


        
    } else {
        scriptStatus.textContent = "It's OFF";
        scriptStatus.classList.remove("running");
        scriptStatus.classList.add("stopped");
    
        
    }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SCRIPT_STATUS") {
        isScriptRunning = message.isScriptRunning;
        updateScriptStatus();
        
    }
});

window.onload = () => {

var blackout = document.createElement('div');
blackout.style.position = 'fixed';
blackout.style.top = '0';
blackout.style.left = '0';
blackout.style.width = '100%';
blackout.style.height = '100%';
blackout.style.backgroundColor = 'black';
blackout.style.opacity = '1';
blackout.style.transition = 'opacity 1s';
document.body.appendChild(blackout);

setTimeout(function() {
    blackout.style.opacity = '0';
}, 1000);
setTimeout(function() {
    document.body.removeChild(blackout);
}, 1700);


    chrome.storage.local.get(["isScriptRunning", "messageLimit"], result => {
        isScriptRunning = result.isScriptRunning || false;
        messageLimit = result.messageLimit || 0;
        document.getElementById("message-limit").value = messageLimit;
        
        updateScriptStatus();
        saveSettings()
        

    });

   



};

function saveSettings() {
    chrome.storage.local.set({ 
        isScriptRunning: isScriptRunning, 
        messageLimit: messageLimit
        
    });
}
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
  chrome.storage.local.set({showModal: false});
}



chrome.storage.local.get(['version', 'showModal'], function(result) {
  if (result.showModal) {
   modal.querySelector('.modal-content p').innerHTML = 'Version: ' + result.version + '<br>— Created';
    modal.style.display = "block";
  }
});
let popupPort = chrome.runtime.connect({ name: "popup" });

popupPort.onMessage.addListener(function(message) {
  if (message.countdownValue) {
    if (countdownDisplay) {
      countdownDisplay.textContent = formatTime(message.countdownValue);
    }
  }
});






    

        