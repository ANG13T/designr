let startButton = document.getElementById("startButton");
let homePage = document.getElementById("home");
let mainPage = document.getElementById("main");
let paletteTableNone = document.getElementById("none-palette");
let paletteTable = document.getElementById("paletteTable");
let paletteNameInput = document.getElementById("paletteNameInput");
let viewSettingsButton = document.getElementById("view-settings");
let paletteTableContent = document.getElementById('paletteTable').getElementsByTagName('tbody')[0];

const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const createPaletteBtn = document.getElementById("create-palette");
const createPaletteBtnModal = document.getElementById("create-palette-modal");
const closeModalBtn = document.getElementById("btn-close");

let palettes = [];
let selectedPalette = null;

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

async function retreivePalettes() {
    chrome.storage.local.get({ palettes: [] }, function (result) {
        let resultPal = result.palettes;
        palettes = resultPal;
        console.log("palettes", resultPal);

        if (resultPal.length > 0) {
            renderPalettes(resultPal);
        } else {
            paletteTable.hidden = true;
            paletteTableNone.hidden = false;
        }
    });
}

function renderPalettes(selectedPal) {
    removePaletteRows();
    if(selectedPal.length > 0) {
        paletteTableNone.hidden = true;
    }
    selectedPal.forEach((pa, index) => {
        let newRow = paletteTableContent.insertRow(index);
        newRow.innerHTML = `
            <tr>
                <th>
                    <label class="customcheckbox">
                        <input type="checkbox" class="listCheckbox">
                        <span class="checkmark"></span>
                    </label>
                </th>
                <td>${pa.name}</td>
                <td>${pa.createdDate}</td>
                <td>${pa.elements}</td>
            </tr>
        `;
    })
}

function setPalettes(selectedPal) {
    chrome.storage.local.set({ palettes: selectedPal }, function () {

    })
}

function removePaletteRows() {
    while(paletteTableContent.lastElementChild) {
        paletteTableContent.removeChild(paletteTableContent.lastElementChild);
    }
}

function selectPalette(palSel) {
    selectPalette = palSel;
}

const closeModal = function () {
    console.log(modal)
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

const createPalette = function(paletteName) {
    paletteNameInput.classList.remove("error");
    if(paletteName.length > 0 && paletteName.length < 20) {
        let date = new Date();
        let formattedDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        let newPalette = {
            name: paletteName,
            elements: 0,
            createdDate: formattedDate
        }
        palettes.push(newPalette);
        setPalettes(palettes);
        renderPalettes(palettes);
        closeModal()
    } else {
        paletteNameInput.classList.add("error");
    }
}


getViewHome();
updatePaletteUI();
closeModal();
retreivePalettes();
mainPage.hidden = true;
homePage.hidden = false;

async function updatePaletteUI() {
    await retreivePalettes();
}

startButton.addEventListener('click', function () {
    setViewHome();
    mainPage.hidden = false;
    homePage.hidden = true;
    paletteTableNone.hidden = true;
});


closeModal()
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);


document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});


const openModal = function () {
    console.log("open modal")
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

createPaletteBtnModal.addEventListener("click", () => {
    let palName = paletteNameInput.value;
    console.log("palName", palName)
    createPalette(palName);
});

createPaletteBtn.addEventListener("click", () => {
    openModal();
})

document.querySelector(".listCheckbox").addEventListener((el) => {
    console.log(el.target.parent.parent);
    selectPalette();
})