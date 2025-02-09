chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get(["blockedSites"], function (data) {
      let blockedSites = data.blockedSites || [];
      let currentUrl = new URL(tab.url).hostname;

      if (blockedSites.includes(currentUrl)) {
        chrome.tabs.update(tabId, { url: "blocked.html" });
      }
    });
  }
});
