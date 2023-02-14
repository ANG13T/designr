function setViewHome() {
    chrome.storage.sync.set({ "viewHome": "true" });
}

async function getViewHome() {
    chrome.storage.sync.get(["viewHome"], function(items) {
        return items;
    });
}

function initiate() {
    console.log(getViewHome())
}

initiate();