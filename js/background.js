/*!
* designr, A Google Chrome Extension for inspect CSS styles and save snapshots of web components and designs.
* https://github.com/ANG13T/designr
*/

var designrLoaded              = false; 
var cssCiewerContextMenusParent  = null;
var selectedPaletteName = "";

chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
		if (request.action == "initiateElementSelect") {
			iniateElementSelect(request.data.tab);
			selectedPaletteName = request.data.palette;
		}  
		
		if (request.action == "clickElement") {
			selectElementClick(request.data);
		}
    }
);

function iniateElementSelect(tab) {
	if(tab == null || tab.url.indexOf("https://chrome.google.com") == 0 || tab.url.indexOf("chrome://") == 0 )
	{
		console.log( "designr doesn't work on Google Chrome webstore!" );

		return;
	}

	chrome.scripting.executeScript({target: {tabId: tab.id}, files:['js/designr.js']});
	chrome.scripting.insertCSS({target: {tabId: tab.id}, files:['css/designr.css']});

	designrLoaded = true;
}

function selectElementClick(element) {
	chrome.storage.local.get({ palettes: [] }, function (result) {
		let resultPal = result.palettes;
		resultPal.forEach((pal) => {
			if(pal.name == selectedPaletteName) {
				if(pal.elementsData) {
					var contains = false;
					pal.elementsData.forEach((eData) => {
						if(eData.css == element.css) {
							contains = true;
						}
					})

					if (!contains) {
						pal.elementsData.push(element);
					}
				} else {
					pal.elementsData = [];
				}
			}
		});

		chrome.storage.local.set({ palettes: resultPal })
    });
}


function cssCiewerDebugEl( info, tab )
{
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func:'designrCopyCssToConsole("el")'
	})
}

function cssCiewerDebugElId( info, tab )
{
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func:'designrCopyCssToConsole("id")'
	})
}

function cssCiewerDebugElTagName( info, tab )
{
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: 'designrCopyCssToConsole("tagName")'
	})
}

function cssCiewerDebugElClassName( info, tab )
{
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: 'designrCopyCssToConsole("className")'
	})
}

function cssCiewerDebugElStyle( info, tab )
{	
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: 'designrCopyCssToConsole("style")'
	})
}

function cssCiewerDebugElCssText( info, tab )
{
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: 'designrCopyCssToConsole("cssText")'
	})
}
 
function cssCiewerDebugElGetComputedStyle( info, tab )
{
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: 'designrCopyCssToConsole("getComputedStyle")'
	})
}

function cssCiewerDebugElSimpleCssDefinition( info, tab )
{	
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: 'designrCopyCssToConsole("simpleCssDefinition")'
	})
}
