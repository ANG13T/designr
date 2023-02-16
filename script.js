let startButton = document.getElementById("startButton");
let homePage = document.getElementById("home");
let mainPage = document.getElementById("main");

function setViewHome() {
    chrome.storage.sync.set({ "viewHome": "true" }, () => console.log("done"));
}

async function getViewHome() {
    await chrome.storage.sync.get(["viewHome"], function (result) {
        if (result && result["viewHome"] == "true") {
            mainPage.hidden = false;
            homePage.hidden = true;
        }
    });
}

async function retreievePalettes() {
    chrome.storage.local.get('palettes', function (result) {
        return result.palettes;
    });
}

function setPalettes(palettes) {
    chrome.storage.local.set({palettes: palettes}, function () {

    })
}


getViewHome();
mainPage.hidden = true;
homePage.hidden = false;

startButton.addEventListener('click', function () {
    setViewHome();
    mainPage.hidden = false;
    homePage.hidden = true;
});