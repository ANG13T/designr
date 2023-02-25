
var cssViewerLoaded              = false; 
var cssCiewerContextMenusParent  = null;


chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
		if (request.action == "initiateElementSelect") {
			iniateElementSelect(request.data);
		}
    }
);

function iniateElementSelect(tab) {
	console.log("click", tab)
	if(tab == null || tab.url.indexOf("https://chrome.google.com") == 0 || tab.url.indexOf("chrome://") == 0 )
	{
		console.log( "CSSViewer doesn't work on Google Chrome webstore!" );

		return;
	}

	if( ! cssViewerLoaded ) 
	{
		console.log("loading contexts")
		cssCiewerContextMenusParent  = chrome.contextMenus.create( { "title" : "CSSViewer console", contexts:["all"] } );

		chrome.contextMenus.create( { "title": "element"                    , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugEl } );
		chrome.contextMenus.create( { "title": "element.id"                 , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElId } );
		chrome.contextMenus.create( { "title": "element.tagName"            , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElTagName } );
		chrome.contextMenus.create( { "title": "element.className"          , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElClassName } );
		chrome.contextMenus.create( { "title": "element.style"              , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElStyle } );
		chrome.contextMenus.create( { "title": "element.cssText"            , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElCssText } );
		chrome.contextMenus.create( { "title": "element.getComputedStyle"   , contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElGetComputedStyle } );
		chrome.contextMenus.create( { "title": "element.simpleCssDefinition", contexts:["all"] , "parentId": cssCiewerContextMenusParent, "onclick": cssCiewerDebugElSimpleCssDefinition } );
	}

	chrome.tabs.executeScript(tab.id, {file:'js/cssviewer.js'});
	chrome.tabs.insertCSS(tab.id, {file:'css/cssviewer.css'});

	cssViewerLoaded = true;
}

function cssCiewerDebugEl( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("el")'});
}

function cssCiewerDebugElId( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("id")'});
}

function cssCiewerDebugElTagName( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("tagName")'});
}

function cssCiewerDebugElClassName( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("className")'});
}

function cssCiewerDebugElStyle( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("style")'});
}

function cssCiewerDebugElCssText( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("cssText")'});
}
 
function cssCiewerDebugElGetComputedStyle( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("getComputedStyle")'});
}

function cssCiewerDebugElSimpleCssDefinition( info, tab )
{
	chrome.tabs.executeScript(tab.id, {code:'cssViewerCopyCssToConsole("simpleCssDefinition")'});
}
