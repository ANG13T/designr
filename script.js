let startButton = document.getElementById("startButton");
let homePage = document.getElementById("home");
let mainPage = document.getElementById("main");
let paletteTableNone = document.getElementById("none-palette");
let paletteTable = document.getElementById("paletteTable");
let paletteTableContent = document.getElementById('paletteTable').getElementsByTagName('tbody')[0];

const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const openModalBtn = document.getElementById("create-palette");
const closeModalBtn = document.getElementById("btn-close");

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
        console.log("palettes", resultPal);

        if (resultPal.length > 0) {
            resultPal.forEach((pa) => {
                let newRow = paletteTableContent.insertRow(1);
                newRow.innerHTML = `
                    <tr>
                        <th>
                            <label class="customcheckbox">
                                <input type="checkbox" class="listCheckbox">
                                <span class="checkmark"></span>
                            </label>
                        </th>
                        <td>${pa.name}</td>
                        <td>${pa.createdAt}</td>
                        <td>${pa.elements}</td>
                    </tr>
                `;
            })
        } else {
            paletteTable.hidden = true;
            paletteTableNone.hidden = false;
        }
    });
}

function setPalettes(palettes) {
    chrome.storage.local.set({ palettes: palettes }, function () {

    })
}

const closeModal = function () {
    modal.hidden = true;
    overlay.hidden = true;
  };


getViewHome();
updatePaletteUI();
closeModal();
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


// Modal Stuff
// close modal function

  
  // close the modal when the close button and overlay is clicked
  closeModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  
  // close modal when the Esc key is pressed
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
  
  // open modal function
  const openModal = function () {
    modal.hidden = false;
    overlay.hidden = false;
  };
  // open modal event
  openModalBtn.addEventListener("click", openModal);