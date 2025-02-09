document.addEventListener("DOMContentLoaded", function () {
  const siteInput = document.getElementById("siteInput");
  const addSiteButton = document.getElementById("addSite");
  const blockedSitesList = document.getElementById("blockedSites");

  // Load blocked sites from storage
  chrome.storage.local.get(["blockedSites"], function (data) {
    let sites = data.blockedSites || [];
    renderSites(sites);
  });

  // Add site to block list
  addSiteButton.addEventListener("click", function () {
    const site = siteInput.value.trim();
    if (site) {
      chrome.storage.local.get(["blockedSites"], function (data) {
        let sites = data.blockedSites || [];
        if (!sites.includes(site)) {
          sites.push(site);
          chrome.storage.local.set({ blockedSites: sites }, function () {
            renderSites(sites);
            saveToMongoDB(sites);
          });
        }
      });
    }
  });

  // Render site list
  function renderSites(sites) {
    blockedSitesList.innerHTML = "";
    sites.forEach(site => {
      let li = document.createElement("li");
      li.textContent = site;
      blockedSitesList.appendChild(li);
    });
  }

  // Sync data to MongoDB
  function saveToMongoDB(sites) {
    fetch("http://localhost:5000/api/saveBlockedSites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sites })
    });
  }
});
