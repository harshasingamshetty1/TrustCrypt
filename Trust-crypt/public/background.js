async function getCurrentTab() {
  let queryOptions = { active: false, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
function sendWindowObjectFromContentScript() {
  // console.log("before timeout", window);
  // console.log("window.ether", window.ethereum);

  // Inform the background page that
  // this tab should have a page-action.
  chrome.runtime.sendMessage({
    from: "content",
    subject: "showPageAction",
  });

  // Listen for messages from the popup.
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if (msg.from === "popup" && msg.subject === "DOMInfo") {
      // Collect the necessary data.
      // (For your specific requirements `document.querySelectorAll(...)`
      //  should be equivalent to jquery's `$(...)`.)
      var domInfo = {
        total: document.querySelectorAll("*").length,
        inputs: document.querySelectorAll("input").length,
        buttons: document.querySelectorAll("button").length,
      };

      // Directly respond to the sender (popup),
      // through the specified callback.
      response(domInfo);
    }
  });
}

try {
  chrome.runtime.onMessage.addListener((msg, sender) => {
    // First, validate the message's structure.
    if (msg.from === "content" && msg.subject === "showPageAction") {
      // Enable the page-action for the requesting tab.
      chrome.pageAction.show(sender.tab.id);
    }
  });

  chrome.runtime.onInstalled.addListener(function () {
    //some other code here
    // console.log("Installed");
    const tab = getCurrentTab()
      .then((tab) => {
        // console.log("tab", tab);
        // console.log("tab.id", tab.id);

        return tab.id;
      })
      .then((tabId) => {
        chrome.scripting
          .executeScript({
            target: { tabId },
            world: "MAIN",
            func: sendWindowObjectFromContentScript,
          })
          .then(() => console.log("script injected"));
      });
  });
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    console.log(message);
    switch (message.key) {
      case "form_submit":
        sendResponse("Submitted");
        break;
      case "YES":
        //Save Password to IPFS OR BlockChain
        sendResponse("Saved");
        break;
      case "NO":
        //DO NOthing
        sendResponse("NotSaved");
        break;
      default:
        break;
    }
  });
} catch (error) {
  console.log(error);
}
