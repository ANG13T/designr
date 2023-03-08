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

let viewElementPage = document.getElementById("view-element");
let paletteTableElementNone = document.getElementById("none-palette-element");
let selectElementButton = document.getElementById("select-element-button");
let backElementButton = document.getElementById("back-element-button");
let editElementButton = document.getElementById("edit-element-button");
let deleteElementButton = document.getElementById("delete-element-button");
let paletteElementsTable = document.getElementById("paletteElementsTable");
let paletteElementsTableContainer = document.getElementById("elmentTableContainer");
let elementTitle = document.getElementById("element-title");
let elementTableContent = document.getElementById('paletteElementsTable').getElementsByTagName('tbody')[0];

const editElementModal = document.getElementById("edit-element-modal");
const editElementCloseModalButton = document.getElementById("btn-close-edit-element");
const editElementTextInput = document.getElementById("elementNameEditInput");
let confirmEditElementButton = document.getElementById("edit-element-modal-confirm");
const editElementOverlay = document.getElementById("edit-element-overlay");

const deleteElementModal = document.getElementById("delete-element-modal");
const openDeleteElementModalButton = document.getElementById("delete-element-button");
const deleteElementModalConfirmButton = document.getElementById("delete-element-button-confirm");
const deleteElementCloseModalButton = document.getElementById("btn-close-delete-element");
const deleteElementOverlay = document.getElementById("delete-element-overlay");

let palettes = [];
let selectedPalette = null;
let selectedPaletteIndex = 0;
let viewPalette = null;
let viewPaletteIndex = null;

let viewElement = null;
let viewElementIndex = null;

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
    paletteTableNone.hidden = false;
    chrome.storage.local.get({ palettes: [] }, function (result) {
        let resultPal = result.palettes;
        palettes = resultPal;

        if (resultPal.length > 0) {
            renderPalettes(resultPal);
            paletteTableNone.hidden = true;
        } else {
            paletteTable.hidden = true;
        }
    });
}

function renderPalettes(selectedPal) {
    console.log("sek", selectedPal)
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
                <td class="paletteTableRowBody index-${index}">${pa.elementsData.length}</td>
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
    paletteElementsTableContainer.hidden = true;
    renderElementsPalette();
}

function renderElementsPalette() {
    removeElementRows();
    if (viewPalette.elementsData && viewPalette.elementsData.length > 0) {
        paletteElementsTableContainer.hidden = false;
       paletteTableElementNone.hidden = true;
    } else {
        paletteElementsTableContainer.hidden = true;
        paletteTableElementNone.hidden = false;
    }

    viewPalette.elementsData.forEach((pa, index) => {
        let newRow = elementTableContent.insertRow(index);
        let elementTitleText = pa.title;
        if(elementTitleText.length > 46) {
            elementTitleText = elementTitleText.substring(0, 46).concat('...')
        } 
        newRow.innerHTML = `
            <tr>
                <td class="elementTableRowBody index-${index} firstCol">${elementTitleText}</td>
            </tr>
        `;
    });

    document.querySelectorAll(".elementTableRowBody").forEach((tabBody) => {
        tabBody.addEventListener("click", (el) => {
            let index = Number(el.srcElement.classList[1].split('-')[1]);
            viewElement = viewPalette.elementsData[index];
            viewElementIndex = index;
            let displayText = viewElement.title;
            if(displayText.length > 23) {
                displayText = displayText.substring(0, 23).concat('...')
            } 
            elementTitle.innerText = displayText;
            viewElementPage.hidden = false;
            renderViewElementsPage();
            closeEditModal();
            closeDeleteModal();
        })
    })
}

function renderViewElementsPage() {
    viewPalettePage.hidden = true;
    viewElementPage.hidden = false;
    ready();
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

function removeElementRows() {
    while (elementTableContent.lastElementChild) {
        elementTableContent.removeChild(elementTableContent.lastElementChild);
    }
}

function openEditModal() {
    editPaletteTextInput.value = viewPalette.name;
    editModal.classList.remove('hidden');
    editOverlay.classList.remove('hidden');
}

function openEditElementModal() {
    editElementTextInput.value = viewElement.title;
    editElementModal.classList.remove('hidden');
    editElementOverlay.classList.remove('hidden');
}

function openDeleteElementModal () {
    deleteElementModal.classList.remove('hidden');
    deleteElementOverlay.classList.remove('hidden');
}

function closeEditElementModal() {
    editElementModal.classList.add('hidden');
    editElementOverlay.classList.add('hidden');
}

function closeDeleteElementModal () {
    deleteElementModal.classList.add('hidden');
    deleteElementOverlay.classList.add('hidden');
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
    if (min < 10) {
        min = "0" + a.getMinutes();
    }
    var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

const createPalette = function (paletteName) {
    paletteNameInput.classList.remove("error");
    if (paletteName.length > 0 && paletteName.length < 15) {
        let formattedDate = dateString();
        let newPalette = {
            name: paletteName,
            createdDate: formattedDate,
            elementsData: []
        }
        palettes.push(newPalette);
        setPalettes(palettes);
        paletteTable.hidden = false;
        renderPalettes(palettes);
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

const editElement = function (elementName) {
    editElementTextInput.classList.remove("error");
    if (elementName.length > 0 && elementName.length < 61) {
        viewElement.title = elementName;
        elementTitle.innerText = elementName;
        viewPalette.elementsData[viewElementIndex] = viewElement;
        palettes[viewPaletteIndex] = viewPalette;
        setPalettes(palettes);
        closeEditElementModal()
    } else {
        editElementTextInput.classList.add("error");
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

const deleteElement = function () {
    viewPalette.elementsData = viewPalette.elementsData.filter(function( elm ) {
        return elm.css !== viewElement.css && elm.title !== viewElement.title;
    });

    palettes[viewPaletteIndex] = viewPalette;
    closeDeleteElementModal();
    viewElementPage.hidden = true;
    viewPalettePage.hidden = false;
    setPalettes(palettes);
    renderElementsPalette();
}


getViewHome();
updatePaletteUI();
closeModal();
retreivePalettes();
mainPage.hidden = true;
homePage.hidden = false;
viewPalettePage.hidden = true;
viewElementPage.hidden = true;
closeEditModal()
closeDeleteModal()
closeEditElementModal()
closeDeleteElementModal()

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
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

createPaletteBtnModal.addEventListener("click", () => {
    let palName = paletteNameInput.value;
    createPalette(palName);
});

createPaletteBtn.addEventListener("click", () => {
    openModal();
})


startButton.addEventListener('click', function () {
    setViewHome();
    mainPage.hidden = false;
    homePage.hidden = true;
    paletteElementsTableContainer.hidden = true;
    paletteTableNone.hidden = false;
});


paletteBackButton.addEventListener("click", () => {
    mainPage.hidden = false;
    viewPalettePage.hidden = true;
    retreivePalettes()
})

backElementButton.addEventListener("click", () => {
    viewPalettePage.hidden = false;
    viewElementPage.hidden = true;
    renderElementsPalette();
})

editPaletteButton.addEventListener("click", () => {
    openEditModal();
})

editElementButton.addEventListener("click", () => {
    openEditElementModal();
})

deleteElementButton.addEventListener("click", () => {
    openDeleteElementModal();
})

confirmEditElementButton.addEventListener("click", () => {
    editElement(editElementTextInput.value)
})

editCloseModalButton.addEventListener("click", () => {
    closeEditModal();
})

deleteElementModalConfirmButton.addEventListener("click", () => {
    deleteElement();
})

deleteElementCloseModalButton.addEventListener("click", () => {
   closeDeleteElementModal();
})

confirmEditPaletteButton.addEventListener("click", () => {
    editPalette(editPaletteTextInput.value)
})

editElementCloseModalButton.addEventListener("click", () => {
    closeEditElementModal();
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
        window.close();
    });
})




function getUserCode() {
    return htmlEditor.getValue() + "\n" + "<style>" + "\n" + cssEditor.getValue() + "\n" + "</style>" + "\n" +  "<script>" + "\n" + jsEditor.getValue() + "\n" + "</script>";
}
function update() {
    //this is the content of iframe
    var code = document.getElementById('iframe').contentWindow.document;
    code.open();
    //getting value from editor and puts in the iframe
    code.write(getUserCode());
    code.close();
}
function loadHTMLEditor() {
    defaultHTMLValue = "<!DOCTYPE html>\n\n<html>\n\n    <!-- Your HTML code goes right here -->\n\n</html>"
    //tells ace editor to use editor element , window.editor makes it global in the javascript file
    window.htmlEditor = ace.edit("htmlEditor");
    //mode mode
    htmlEditor.setTheme("ace/theme/dracula");
    //html mode
    htmlEditor.getSession().setMode("ace/mode/html");
    //sample text
    htmlEditor.setValue(defaultHTMLValue,1); //1 = moves cursor to end
    // when something changed in editor update is called
    htmlEditor.getSession().on('change', function() {
        update();
    });
    // puts cursor in the editor
    htmlEditor.focus();
    
    //htmlEditor.setOption('showLineNumbers', true);
    htmlEditor.setOptions({
        fontSize: "12.5pt",
        showLineNumbers: true,
        vScrollBarAlwaysVisible:false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });

    htmlEditor.setShowPrintMargin(false);
    //htmlEditor.setBehavioursEnabled(false);
}
function loadCSSEditor() {
    defaultCSSValue = "/*        Your CSS Code Goes Here           */"
    //tells ace editor to use editor element , window.editor makes it global in the javascript file
    window.cssEditor = ace.edit("cssEditor");
    cssEditor.resize();
    cssEditor.renderer.updateFull();
    //mode mode
    cssEditor.setTheme("ace/theme/dracula");
    //html mode
    cssEditor.getSession().setMode("ace/mode/css");
    //sample text
    cssEditor.setValue(defaultCSSValue,1); //1 = moves cursor to end
    // when something changed in editor update is called
    cssEditor.getSession().on('change', function() {
        update();
    });
    // puts cursor in the editor
    cssEditor.focus();

    //htmlEditor.setOption('showLineNumbers', true);
    cssEditor.setOptions({
        fontSize: "12.5pt",
        showLineNumbers: true,
        vScrollBarAlwaysVisible:true,
        // enableBasicAutocompletion: true,
        // enableSnippets: true,
        // enableLiveAutocompletion: false
    });

    cssEditor.setShowPrintMargin(false);
    //cssEditor.setBehavioursEnabled(false);
}
function loadJSEditor() {
    defaultJSValue = "/*     Your JAVASCRIPT Code Goes Here       */"
    //tells ace editor to use editor element , window.editor makes it global in the javascript file
    window.jsEditor = ace.edit("jsEditor");
    //mode mode
    jsEditor.setTheme("ace/theme/dracula");
    //html mode
    jsEditor.getSession().setMode("ace/mode/javascript");
    //sample text
    jsEditor.setValue(defaultJSValue,1); //1 = moves cursor to end
    // when something changed in editor update is called
    jsEditor.getSession().on('change', function() {
        update();
    });
    // puts cursor in the editor
    jsEditor.focus();
    
    //htmlEditor.setOption('showLineNumbers', true);
    jsEditor.setOptions({
        fontSize: "12.5pt",
        showLineNumbers: true,
        vScrollBarAlwaysVisible:true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });

    jsEditor.setShowPrintMargin(false);
    //htmlEditor.setBehavioursEnabled(false);
}
function setupEditor() {
    loadHTMLEditor();
    loadCSSEditor();
    loadJSEditor();
}
function ready() {
    setupEditor();
}

function maximizeIFrame() {
    //First make Iframe height larger
    let iframe = document.getElementById("iframe");
    iframe.style.height = "98%";
    iframe.style.width = "100%";
    //Next equate all 3 editors dimensions to 0
    let htmlEditor = document.getElementById("htmlEditor");
    htmlEditor.style.height = "0%";
    htmlEditor.style.width = "0%";
    let cssEditor = document.getElementById("cssEditor");
    cssEditor.style.height = "0%";
    cssEditor.style.width = "0%";
    let jsEditor = document.getElementById("jsEditor");
    jsEditor.style.height = "0%";
    jsEditor.style.width = "0%";
    //Make editors height 5% which has labels and buttons
    let allEditors = document.getElementById("editors");
    allEditors.style.height = "5%";
    allEditors.style.width = "100%";
}
function minimizeIframe() {
    //Going in reverse order from maximizeFrame() to reset all elements to their original dimensions
    let editors = document.getElementById("editors");
    editors.style.height = "50%";
    editors.style.width = "100%";
    let htmlEditor = document.getElementById("htmlEditor");
    htmlEditor.style.height = "90%";
    htmlEditor.style.width = "32%";
    let cssEditor = document.getElementById("cssEditor");
    cssEditor.style.height = "90%";
    cssEditor.style.width = "32%";
    let jsEditor = document.getElementById("jsEditor");
    jsEditor.style.height = "90%";
    jsEditor.style.width = "32%";
    var iframe = document.getElementById("iframe");
    iframe.style.height = "50%";
    iframe.style.width = "100%";
}

//Download Code File
function downloadCode() {
     //1.Create a blob
     const userCode = getUserCode();
     const blob = new Blob([userCode], {type: "text/html"});
     downloadFile(blob,"index.html");
}
//2.function that accepts blob and file name
function downloadFile(blob,fileName) {
    //3.create url for blob
    const url = window.URL.createObjectURL(blob);
    //4.anchor tag to download
    const a = document.createElement('a');
    //Before click we need to add some properties to our anchorTag
    a.href = url;
    a.download = fileName;
    //click event
    a.click();
    //remove anchor tag
    a.remove();

    document.addEventListener("focus",w=>{window.URL.revokeObjectURL(url)})
}