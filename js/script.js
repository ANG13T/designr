/*!
* designr, A Google Chrome Extension for fellow web developers, web designers, and hobbyists.
* https://github.com/ANG13T/designr
*/

let startButton = document.getElementById("startButton");
let homePage = document.getElementById("home");
let mainPage = document.getElementById("main");
let paletteBackButton = document.getElementById("back-palette-button");
let viewPalettePage = document.getElementById("view-palette");
let paletteTableNone = document.getElementById("none-palette");
let paletteTable = document.getElementById("paletteTable");
let paletteNameInput = document.getElementById("paletteNameInput");
let paletteTitle = document.getElementById("palette-title");
let viewSettingsButton = document.getElementById("view-settings");
let paletteTableContent = document.getElementById('paletteTable').getElementsByTagName('tbody')[0];

const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const createPaletteBtn = document.getElementById("create-palette");
const createPaletteBtnModal = document.getElementById("create-palette-modal");
const closeModalBtn = document.getElementById("btn-close");

const editModal = document.getElementById("edit-modal");
const editCloseModalButton = document.getElementById("btn-close-edit");
const editPaletteTextInput = document.getElementById("paletteNameEditInput");
let editPaletteButton = document.getElementById("edit-palette-button");
let confirmEditPaletteButton = document.getElementById("edit-palette-modal");
const editOverlay = document.getElementById("edit-overlay");

const deleteModal = document.getElementById("delete-modal");
const openDeleteModalButton = document.getElementById("delete-palette-button");
const deleteModalConfirmButton = document.getElementById("delete-palette-modal");
const deleteCloseModalButton = document.getElementById("btn-close-delete");
const deleteOverlay = document.getElementById("delete-overlay");

let paletteTableElementNone = document.getElementById("none-palette-element");
let selectElementButton = document.getElementById("select-element-button");

let palettes = [];
let selectedPalette = null;
let selectedPaletteIndex = 0;
let viewPalette = null;
let viewPaletteIndex = null;

function setViewHome() {
    chrome.storage.sync.set({ "viewHome": "true" }, () => console.log("done"));
}

async function getViewHome() {
    await chrome.storage.sync.get(["viewHome"], function (result) {
        if (result && result["viewHome"] == "true") {
            mainPage.hidden = false;
            homePage.hidden = true;
            viewPalettePage.hidden = true;
        }
    });
}

async function retreivePalettes() {
    chrome.storage.local.get({ palettes: [] }, function (result) {
        let resultPal = result.palettes;
        palettes = resultPal;

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
    if (selectedPal.length > 0) {
        paletteTableNone.hidden = true;
    }
    selectedPal.forEach((pa, index) => {
        let newRow = paletteTableContent.insertRow(index);
        newRow.innerHTML = `
            <tr>
                <td class="paletteTableRowBody index-${index} firstCol">${pa.name}</td>
                <td class="paletteTableRowBody index-${index}">${pa.createdDate}</td>
                <td class="paletteTableRowBody index-${index}">${pa.elements}</td>
            </tr>
        `;
    });

    document.querySelectorAll(".paletteTableRowBody").forEach((tabBody) => {
        tabBody.addEventListener("click", (el) => {
            let index = Number(el.srcElement.classList[1].split('-')[1]);
            viewPalette = palettes[index];
            viewPaletteIndex = index;
            paletteTitle.innerText = viewPalette.name;
            renderViewPalettePage();
            closeEditModal();
            closeDeleteModal();
        })
    })
}

function renderViewPalettePage() {
    mainPage.hidden = true;
    viewPalettePage.hidden = false;
}

function setPalettes(selectedPal) {
    chrome.storage.local.set({ palettes: selectedPal }, function () {

    })
}


function removePaletteRows() {
    while (paletteTableContent.lastElementChild) {
        paletteTableContent.removeChild(paletteTableContent.lastElementChild);
    }
}

function openEditModal() {
    editPaletteTextInput.value = viewPalette.name;
    editModal.classList.remove('hidden');
    editOverlay.classList.remove('hidden');
}

const closeEditModal = function () {
    editModal.classList.add('hidden');
    editOverlay.classList.add('hidden');
}

function openDeleteModal() {
    deleteModal.classList.remove('hidden');
    deleteOverlay.classList.remove('hidden');
}

const closeDeleteModal = function () {
    deleteModal.classList.add('hidden');
    deleteOverlay.classList.add('hidden');
}

function selectPalette(palSel) {
    selectPalette = palSel;
}

const closeModal = function () {
    console.log(modal)
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};



function dateString() {
    var a = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

const createPalette = function (paletteName) {
    paletteNameInput.classList.remove("error");
    if (paletteName.length > 0 && paletteName.length < 15) {
        let formattedDate = dateString();
        let newPalette = {
            name: paletteName,
            elements: 0,
            createdDate: formattedDate,
            elementsData: []
        }
        palettes.push(newPalette);
        setPalettes(palettes);
        retreivePalettes();
        closeModal()
    } else {
        paletteNameInput.classList.add("error");
    }
}


const editPalette = function (paletteName) {
    editPaletteTextInput.classList.remove("error");
    if (paletteName.length > 0 && paletteName.length < 15) {
        viewPalette.name = paletteName;
        paletteTitle.innerText = paletteName;
        palettes[viewPaletteIndex] = viewPalette;
        setPalettes(palettes);
        closeEditModal()
    } else {
        editPaletteTextInput.classList.add("error");
    }
}


const deletePalette = function () {
    palettes = palettes.filter(function( pal ) {
        return pal.name !== viewPalette.name && pal.createdDate !== viewPalette.createdDate;
    });
    closeDeleteModal();
    viewPalettePage.hidden = true;
    mainPage.hidden = false;
    setPalettes(palettes);
    retreivePalettes();
}


getViewHome();
updatePaletteUI();
closeModal();
retreivePalettes();
mainPage.hidden = true;
homePage.hidden = false;
viewPalettePage.hidden = true;
closeEditModal()
closeDeleteModal()

async function updatePaletteUI() {
    await retreivePalettes();
}


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


startButton.addEventListener('click', function () {
    setViewHome();
    mainPage.hidden = false;
    homePage.hidden = true;
    paletteTableNone.hidden = true;
});


paletteBackButton.addEventListener("click", () => {
    mainPage.hidden = false;
    viewPalettePage.hidden = true;
    retreivePalettes()
})

editPaletteButton.addEventListener("click", () => {
    openEditModal();
})

editCloseModalButton.addEventListener("click", () => {
    closeEditModal();
})

confirmEditPaletteButton.addEventListener("click", () => {
    editPalette(editPaletteTextInput.value)
})

openDeleteModalButton.addEventListener("click", () => {
    openDeleteModal();
})

deleteCloseModalButton.addEventListener("click", () => {
    closeDeleteModal();
})

deleteModalConfirmButton.addEventListener("click", () => {
    deletePalette();
})

selectElementButton.addEventListener("click", () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.runtime.sendMessage({action: "initiateElementSelect", data: {tab: tabs[0], palette: viewPalette.name}})
    });
})

// Start of Context Code

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message, "yipee");
    
});
    