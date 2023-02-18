let startButton = document.getElementById("startButton");
let homePage = document.getElementById("home");
let mainPage = document.getElementById("main");
let viewPalettePage = document.getElementById("view-palette");
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
let selectedPaletteIndex = 0;
let viewPalette = null;
let viewPaletteIndex = null;

function setViewHome() {
    chrome.storage.sync.set({ "viewHome": "true" }, () => console.log("done"));
}

// TODO: init view palette stuff

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
                <th>
                    <label class="customcheckbox">
                        <input type="checkbox" class="listCheckbox index-${index}" style="cursor: pointer">
                        <span class="checkmark"></span>
                    </label>
                </th>
                <td className="paletteTableRowBody index-${index}">${pa.name}</td>
                <td className="paletteTableRowBody index-${index}">${pa.createdDate}</td>
                <td className="paletteTableRowBody index-${index}">${pa.elements}</td>
            </tr>
        `;
    });

    document.querySelectorAll(".listCheckbox").forEach((checkListBox) => {
        checkListBox.addEventListener("click", (el) => {
            let index = Number(el.srcElement.classList[1].split('-')[1]);
            selectPalette = palettes[index];
            selectedPaletteIndex = index;
            reRenderCheckboxes();
        })
    })

    document.querySelectorAll(".paletteTableRowBody").forEach((tabBody) => {
        tabBody.addEventListener("click", (el) => {
            let index = Number(el.srcElement.classList[1].split('-')[1]);
            viewPalette = palettes[index];
            viewPaletteIndex = index;
            renderViewPalettePage();
        })
    })

    reRenderCheckboxes()
}

function renderViewPalettePage() {

}

function reRenderCheckboxes() {
    let checkboxes = document.querySelectorAll(".listCheckbox");
    console.log(checkboxes)
    checkboxes.forEach((checkbox, i) => {
        if(i == selectedPaletteIndex) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    })
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
    if (paletteName.length > 0 && paletteName.length < 20) {
        let formattedDate = dateString();
        let newPalette = {
            name: paletteName,
            elements: 0,
            createdDate: formattedDate
        }
        palettes.push(newPalette);
        setPalettes(palettes);
        retreivePalettes();
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

