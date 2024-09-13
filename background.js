let executionCount = 0;
let tabId;
let isScriptRunning = false;
let popupPort;
let messageLimit = 0;


chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    popupPort = port;
    popupPort.onDisconnect.addListener(function() {
      popupPort = null;
    });
  }
});






chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "checkMessage") {
    chrome.storage.local.get(['executionCount'], function(result) {
      if (result.executionCount < messageLimit) { 
        checkMessage();
      } else{
        stop();
      }
    });
  }
});



function checkSite() {



        chrome.tabs.create({ url: "https://web.telegram.org/a/"}, function (tab) {
          tabId = tab.id;
          chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (changeInfo.status === "complete" && tab.url.startsWith("https://web.telegram.org/a/CHAT_ID_TO_WORK_WITH")) {  
              console.log("tab created");
          
          

            }
           
        });
          
          
        });
       

}

function checkMessage() {

    
console.log("Start of check");

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      let inputField = document.querySelector('.form-control.allow-selection');
      chrome.storage.local.get(['executionCount', 'messageLimit'], function(result) {
           if (result.executionCount < result.messageLimit) {
          inputField.textContent = "+";
        } 
      //}
          var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
          inputField.dispatchEvent(event);
      console.log("message search entry");
      });
      let messages = document.querySelectorAll('.message-content-wrapper.can-select-text');

      
      let lastMessage = messages[messages.length - 1];
      if (lastMessage){
      let messageText = lastMessage.innerText;

      let lines = messageText.split('\n');
      console.log("Next up is a row check");
      if (lines.length < 6) {
        console.log("false < 6");
        return false;
        
      }
      let phoneNumberPresent = false;
      let atSymbolPresent = false;
      let emptyLinesCount = 0;
        for (let line of lines) {
          if (/\d{6,}/.test(line)) {
            phoneNumberPresent = true;
            console.log("phone is here!");
          }

          if (/@/.test(line)) {
            atSymbolPresent = true;
            console.log("@ is here!");
          }

          if (!/.+/.test(line)) {
            emptyLinesCount++;
          }
        }
        if (emptyLinesCount < 0) {
          return false;
        }
        return phoneNumberPresent || atSymbolPresent;
      }
    },
  }).then((result) => {
    console.log("inspection is over");
    if (result[0].result) {
      chrome.storage.local.get(['executionCount'], function(result) {
        if (result.executionCount < messageLimit) { 
          console.log("less than I can do, I'm doing it");
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => {
              let sendButton = document.querySelector('.Button.send.main-button.default.secondary.round.click-allowed');
              if (sendButton) {
                chrome.storage.local.get(['executionCount'], function(result) {
                sendButton.click();
                let newCount = result.executionCount + 1;
                chrome.storage.local.set({ executionCount: newCount });
                console.log("Current number of executions: " + newCount);
                });
              }
            },
          });
          
        } else {
          console.log("The maximum number of executions has been reached: " + result.executionCount);
        }
      });
    }
  });
}
  




function start() {
	isScriptRunning = true;
    chrome.storage.local.set({ isScriptRunning});
    checkSite();
    chrome.alarms.clear("checkMessage");
    setTimeout(() => {
	chrome.alarms.create("checkMessage", {periodInMinutes: 0.0000000000000000000000000000001});
      }, 10000);

		

	

}


function stop() {
    isScriptRunning = false;
    chrome.storage.local.set({ isScriptRunning });
    chrome.alarms.clear("checkMessage");
    setTimeout(() => {
    if (tabId) {

        chrome.tabs.remove(tabId, function() { 
            console.log("Tab closed"); 
        });}
    tabId = null;
    }, 6000);
}








chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

      
      if (message.type) {
        switch (message.type) {
          case "START_SCRIPT":
          messageLimit = message.messageLimit;
          console.log("limit= " + messageLimit);
          executionCount = 0;
          chrome.storage.local.set({ executionCount, messageLimit });
            start();

    

          break;
            

          case "STOP_SCRIPT":
            stop();
            break;


          case "GET_SCRIPT_STATUS":
            sendResponse({ type: "SCRIPT_STATUS", isScriptRunning });
            break;

          default:
            console.log("Unknown command: " + message.command);
        }
      }
     
});







chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install" || details.reason == "update") {
    chrome.storage.local.set({
      version: chrome.runtime.getManifest().version,
      showModal: true
    });
  }
});
