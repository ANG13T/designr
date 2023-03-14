/*!
* designr, A Google Chrome Extension for inspect CSS styles and save snapshots of web components and designs.
* https://github.com/ANG13T/designr
*/

var designr_element

var designr_element_cssDefinition

var designr_container

var designr_current_element

// CSS Properties

var designr_pGeneral = new Array(
	'element',
	'class'
);

var designr_pFont = new Array(
	'font-family', 
	'font-size', 
	'font-style', 
	'font-variant', 
	'font-weight', 
	'letter-spacing', 
	'line-height', 
	'text-decoration', 
	'text-align', 
	'text-indent', 
	'text-transform', 
	'vertical-align', 
	'white-space', 
	'word-spacing'
);

var designr_pColorBg = new Array(
	'background-attachment', 
	'background-color', 
	'background-image',
	'background-position',
	'background-repeat',
	'color'
);

var designr_pBox = new Array(
	'height',
	'width',
	'border',
	'border-top',
	'border-right',
	'border-bottom', 
	'border-left',
	'margin',
	'padding',
	'max-height',
	'min-height',
	'max-width',
	'min-width'
);

var designr_pPositioning = new Array(
	'position', 
	'top', 
	'bottom', 
	'right', 
	'left', 
	'float', 
	'display', 
	'clear', 
	'z-index'
);

var designr_pList = new Array(
	'list-style-image', 
	'list-style-type', 
	'list-style-position'
);

var designr_pTable = new Array(
	'border-collapse',
	'border-spacing',
	'caption-side',
	'empty-cells',
	'table-layout'
);

var designr_pMisc = new Array(
	'overflow', 
	'cursor', 
	'visibility'
);

var designr_pEffect = new Array(
	'transform',
	'transition',
	'outline',
	'outline-offset',
	'box-sizing',
	'resize',
	'text-shadow',
	'text-overflow',
	'word-wrap',
	'box-shadow',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius'
);

// CSS Property categories
var designr_categories = { 
	'pGeneral'    : designr_pGeneral, 
	'pFontText'    : designr_pFont, 
	'pColorBg'     : designr_pColorBg, 
	'pBox'         : designr_pBox, 
	'pPositioning' : designr_pPositioning, 
	'pList'        : designr_pList, 
	'pTable'       : designr_pTable, 
	'pMisc'        : designr_pMisc, 
	'pEffect'      : designr_pEffect 
};

var designr_categoriesTitle = { 
	'pGeneral'    : 'Element & Class', 
	'pFontText'    : 'Font & Text', 
	'pColorBg'     : 'Color & Background', 
	'pBox'         : 'Box', 
	'pPositioning' : 'Positioning', 
	'pList'        : 'List', 
	'pTable'       : 'Table', 
	'pMisc'        : 'Miscellaneous', 
	'pEffect'      : 'Effects' 
};

// Table tagnames
var designr_tableTagNames = new Array(
	'TABLE',
	'CAPTION',
	'THEAD',
	'TBODY',
	'TFOOT',
	'COLGROUP',
	'COL',
	'TR',
	'TH',
	'TD'
);

var designr_listTagNames = new Array(
	'UL',
	'LI',
	'DD',
	'DT',
	'OL'
);

// Hexadecimal
var designr_hexa = new Array(
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F'
);

/*
** Utils
*/

function GetCurrentDocument()
{
	return window.document;
}

function IsInArray(array, name)
{
	for (var i = 0; i < array.length; i++) {
		if (name == array[i])
			return true;
	}

	return false;
}

function DecToHex(nb)
{
	var nbHexa = '';

	nbHexa += designr_hexa[Math.floor(nb / 16)];
	nb = nb % 16;
	nbHexa += designr_hexa[nb];
	
	return nbHexa;
}

function RGBToHex(str)
{
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var hexValues = str.split(', ');
	var hexStr = '#'; 

	for (var i = 0; i < hexValues.length; i++) {
		hexStr += DecToHex(hexValues[i]);
	}
	
	if( hexStr == "#00000000" ){
		hexStr = "#FFFFFF";
	}
	
	hexStr = '<span style="border: 1px solid #000000 !important;width: 8px !important;height: 8px !important;display: inline-block !important;background-color:'+ hexStr +' !important;"></span> ' + hexStr;

	return hexStr;
}

function GetFileName(str)
{
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var path = str.split('/');
	
	return path[path.length - 1];
}

function RemoveExtraFloat(nb)
{
	nb = nb.substr(0, nb.length - 2);

	return Math.round(nb) + 'px';
}

/*
* CSSFunc
*/

function GetCSSProperty(element, property)
{
	return element.getPropertyValue(property);
}

function SetCSSProperty(element, property, tagName = '', className = '', id = '')
{
	var document = GetCurrentDocument();
	var li = document.getElementById('designr_' + property);

	if (property == "element") {
		li.lastChild.innerHTML = " : " + tagName.toLowerCase();
	} else if(property == "class") {
		li.lastChild.innerHTML = " : " + (id == '' ? '' : ' #' + id) + (className == '' ? '' : ' .' + className) + "\n";
	} else {
		li.lastChild.innerHTML = " : " + element.getPropertyValue(property);
	}
}

function SetCSSPropertyIf(element, property, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('designr_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + element.getPropertyValue(property);
		li.style.display = 'block';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function SetCSSPropertyValue(element, property, value)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('designr_' + property);

	li.lastChild.innerHTML = " : " + value;
	li.style.display = 'block';
}

function SetCSSPropertyValueIf(element, property, value, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('designr_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + value;
		li.style.display = 'block';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function HideCSSProperty(property)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('designr_' + property);

	li.style.display = 'none';
}

function HideCSSCategory(category)
{
	var document = GetCurrentDocument();
	var div = document.getElementById('designr_' + category);

	div.style.display = 'none';
}

function ShowCSSCategory(category)
{
	var document = GetCurrentDocument();
	var div = document.getElementById('designr_' + category);

	div.style.display = 'block';
}

function UpdateGeneral(element, tagName, className, id) 
{
	SetCSSProperty(element, 'element', tagName, className, id);
	SetCSSProperty(element, 'class', tagName, className, id);
}

function UpdatefontText(element)
{
	// Font
	SetCSSProperty(element, 'font-family');
	SetCSSProperty(element, 'font-size');

	SetCSSPropertyIf(element, 'font-weight'    , GetCSSProperty(element, 'font-weight') != '400');
	SetCSSPropertyIf(element, 'font-variant'   , GetCSSProperty(element, 'font-variant') != 'normal');
	SetCSSPropertyIf(element, 'font-style'     , GetCSSProperty(element, 'font-style') != 'normal');
	
	// Text
	SetCSSPropertyIf(element, 'letter-spacing' , GetCSSProperty(element, 'letter-spacing') != 'normal');
	SetCSSPropertyIf(element, 'line-height'    , GetCSSProperty(element, 'line-height') != 'normal');
	SetCSSPropertyIf(element, 'text-decoration', GetCSSProperty(element, 'text-decoration') != 'none');
	SetCSSPropertyIf(element, 'text-align'     , GetCSSProperty(element, 'text-align') != 'start');
	SetCSSPropertyIf(element, 'text-indent'    , GetCSSProperty(element, 'text-indent') != '0px');
	SetCSSPropertyIf(element, 'text-transform' , GetCSSProperty(element, 'text-transform') != 'none');
	SetCSSPropertyIf(element, 'vertical-align' , GetCSSProperty(element, 'vertical-align') != 'baseline');
	SetCSSPropertyIf(element, 'white-space'    , GetCSSProperty(element, 'white-space') != 'normal');
	SetCSSPropertyIf(element, 'word-spacing'   , GetCSSProperty(element, 'word-spacing') != 'normal');
}

function UpdateColorBg(element)
{
	// Color
	SetCSSPropertyValue(element, 'color', RGBToHex(GetCSSProperty(element, 'color')));

	// Background
	SetCSSPropertyValueIf(element, 'background-color', RGBToHex(GetCSSProperty(element, 'background-color')), GetCSSProperty(element, 'background-color') != 'transparent');
	SetCSSPropertyIf(element, 'background-attachment', GetCSSProperty(element, 'background-attachment') != 'scroll');
	SetCSSPropertyValueIf(element, 'background-image', GetFileName(GetCSSProperty(element, 'background-image')), GetCSSProperty(element, 'background-image') != 'none');
	SetCSSPropertyIf(element, 'background-position'  , GetCSSProperty(element, 'background-position') != '');
	SetCSSPropertyIf(element, 'background-repeat'    , GetCSSProperty(element, 'background-repeat') != 'repeat');
}

function UpdateBox(element)
{
	// Width/Height
	SetCSSPropertyIf(element, 'height', RemoveExtraFloat(GetCSSProperty(element, 'height')) != 'auto');
	SetCSSPropertyIf(element, 'width', RemoveExtraFloat(GetCSSProperty(element, 'width')) != 'auto');

	// Border
	var borderTop    = RemoveExtraFloat(GetCSSProperty(element, 'border-top-width')) + ' ' + GetCSSProperty(element, 'border-top-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-top-color'));
	var borderBottom = RemoveExtraFloat(GetCSSProperty(element, 'border-bottom-width')) + ' ' + GetCSSProperty(element, 'border-bottom-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-bottom-color'));
	var borderRight  = RemoveExtraFloat(GetCSSProperty(element, 'border-right-width')) + ' ' + GetCSSProperty(element, 'border-right-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-right-color'));
	var borderLeft   = RemoveExtraFloat(GetCSSProperty(element, 'border-left-width')) + ' ' + GetCSSProperty(element, 'border-left-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-left-color'));

	if (borderTop == borderBottom && borderBottom == borderRight && borderRight == borderLeft && GetCSSProperty(element, 'border-top-style') != 'none') {
		SetCSSPropertyValue(element, 'border', borderTop);

		HideCSSProperty('border-top');
		HideCSSProperty('border-bottom');
		HideCSSProperty('border-right');
		HideCSSProperty('border-left');
	}
	else {
		SetCSSPropertyValueIf(element, 'border-top'   , borderTop   , GetCSSProperty(element, 'border-top-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-bottom', borderBottom, GetCSSProperty(element, 'border-bottom-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-right' , borderRight , GetCSSProperty(element, 'border-right-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-left'  , borderLeft  , GetCSSProperty(element, 'border-left-style') != 'none');

		HideCSSProperty('border');
	}
	
	// Margin
	var marginTop    = RemoveExtraFloat(GetCSSProperty(element, 'margin-top'));
	var marginBottom = RemoveExtraFloat(GetCSSProperty(element, 'margin-bottom'));
	var marginRight  = RemoveExtraFloat(GetCSSProperty(element, 'margin-right'));
	var marginLeft   = RemoveExtraFloat(GetCSSProperty(element, 'margin-left'));
	var margin       = (marginTop == '0px' ? '0' : marginTop) + ' ' + (marginRight == '0px' ? '0' : marginRight) + ' '  + (marginBottom == '0px' ? '0' : marginBottom) + ' '  + (marginLeft == '0px' ? '0' : marginLeft);

	SetCSSPropertyValueIf(element, 'margin', margin, margin != '0 0 0 0');

	// padding
	var paddingTop    = RemoveExtraFloat(GetCSSProperty(element, 'padding-top'));
	var paddingBottom = RemoveExtraFloat(GetCSSProperty(element, 'padding-bottom'));
	var paddingRight  = RemoveExtraFloat(GetCSSProperty(element, 'padding-right'));
	var paddingLeft   = RemoveExtraFloat(GetCSSProperty(element, 'padding-left'));
	var padding       = (paddingTop == '0px' ? '0' : paddingTop) + ' ' + (paddingRight == '0px' ? '0' : paddingRight) + ' '  + (paddingBottom == '0px' ? '0' : paddingBottom) + ' '  + (paddingLeft == '0px' ? '0' : paddingLeft);

	SetCSSPropertyValueIf(element, 'padding', padding, padding != '0 0 0 0');

	// Max/Min Width/Height
	SetCSSPropertyIf(element, 'min-height', GetCSSProperty(element, 'min-height') != '0px');
	SetCSSPropertyIf(element, 'max-height', GetCSSProperty(element, 'max-height') != 'none');
	SetCSSPropertyIf(element, 'min-width' , GetCSSProperty(element, 'min-width') != '0px');
	SetCSSPropertyIf(element, 'max-width' , GetCSSProperty(element, 'max-width') != 'none');
}

function UpdatePositioning(element)
{
	SetCSSPropertyIf(element, 'position', GetCSSProperty(element, 'position') != 'static');
	SetCSSPropertyIf(element, 'top'     , GetCSSProperty(element, 'top') != 'auto');
	SetCSSPropertyIf(element, 'bottom'  , GetCSSProperty(element, 'bottom') != 'auto');
	SetCSSPropertyIf(element, 'right'   , GetCSSProperty(element, 'right') != 'auto');
	SetCSSPropertyIf(element, 'left'    , GetCSSProperty(element, 'left') != 'auto');
	SetCSSPropertyIf(element, 'float'   , GetCSSProperty(element, 'float') != 'none');

	SetCSSProperty(element, 'display');

	SetCSSPropertyIf(element, 'clear'   , GetCSSProperty(element, 'clear') != 'none');
	SetCSSPropertyIf(element, 'z-index' , GetCSSProperty(element, 'z-index') != 'auto');
}

function UpdateTable(element, tagName)
{
	if (IsInArray(designr_tableTagNames, tagName)) {
		var nbProperties = 0;

		nbProperties += SetCSSPropertyIf(element, 'border-collapse', GetCSSProperty(element, 'border-collapse') != 'separate');
		nbProperties += SetCSSPropertyIf(element, 'border-spacing' , GetCSSProperty(element, 'border-spacing') != '0px 0px');
		nbProperties += SetCSSPropertyIf(element, 'caption-side'   , GetCSSProperty(element, 'caption-side') != 'top');
		nbProperties += SetCSSPropertyIf(element, 'empty-cells'    , GetCSSProperty(element, 'empty-cells') != 'show');
		nbProperties += SetCSSPropertyIf(element, 'table-layout'   , GetCSSProperty(element, 'table-layout') != 'auto');

		if (nbProperties > 0)
			ShowCSSCategory('pTable');
		else
			HideCSSCategory('pTable');
	}
	else {
		HideCSSCategory('pTable');
	}
}

function UpdateList(element, tagName)
{
	if (IsInArray(designr_listTagNames, tagName)) {
		ShowCSSCategory('pList');

		var listStyleImage = GetCSSProperty(element, 'list-style-image');

		if (listStyleImage == 'none') {
			SetCSSProperty(element, 'list-style-type');
			HideCSSProperty('list-style-image');
		}
		else {
			SetCSSPropertyValue(element, 'list-style-image', listStyleImage);
			HideCSSProperty('list-style-type');
		}

		SetCSSProperty(element, 'list-style-position');
	}
	else {
		HideCSSCategory('pList');
	}
}

function UpdateMisc(element)
{
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'overflow'  , GetCSSProperty(element, 'overflow') != 'visible');
	nbProperties += SetCSSPropertyIf(element, 'cursor'    , GetCSSProperty(element, 'cursor') != 'auto');
	nbProperties += SetCSSPropertyIf(element, 'visibility', GetCSSProperty(element, 'visibility') != 'visible'); 

	if (nbProperties > 0)
		ShowCSSCategory('pMisc');
	else
		HideCSSCategory('pMisc');
}

function UpdateEffects(element)
{
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'transform'                 , GetCSSProperty(element, 'transform') ); 
	nbProperties += SetCSSPropertyIf(element, 'transition'                , GetCSSProperty(element, 'transition') ); 
	nbProperties += SetCSSPropertyIf(element, 'outline'                   , GetCSSProperty(element, 'outline') ); 
	nbProperties += SetCSSPropertyIf(element, 'outline-offset'            , GetCSSProperty(element, 'outline-offset') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'box-sizing'                , GetCSSProperty(element, 'box-sizing') != 'content-box'); 
	nbProperties += SetCSSPropertyIf(element, 'resize'                    , GetCSSProperty(element, 'resize') != 'none'); 

	nbProperties += SetCSSPropertyIf(element, 'text-shadow'               , GetCSSProperty(element, 'text-shadow') != 'none'); 
	nbProperties += SetCSSPropertyIf(element, 'text-overflow'             , GetCSSProperty(element, 'text-overflow') != 'clip'); 
	nbProperties += SetCSSPropertyIf(element, 'word-wrap'                 , GetCSSProperty(element, 'word-wrap') != 'normal'); 
	nbProperties += SetCSSPropertyIf(element, 'box-shadow'                , GetCSSProperty(element, 'box-shadow') != 'none');  

	nbProperties += SetCSSPropertyIf(element, 'border-top-left-radius'    , GetCSSProperty(element, 'border-top-left-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-top-right-radius'   , GetCSSProperty(element, 'border-top-right-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-left-radius' , GetCSSProperty(element, 'border-bottom-left-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-right-radius', GetCSSProperty(element, 'border-bottom-right-radius') != '0px'); 

	if (nbProperties > 0)
		ShowCSSCategory('pEffect');
	else
		HideCSSCategory('pEffect');
}

/*
** Event Handlers
*/

function designrClick(e)
{
	var element = document.defaultView.getComputedStyle(this, null);
	console.log("click something", element)

	let result = {};

	var designr_element_title = this.tagName.toLowerCase() + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className);

	designr_element_cssDefinition = this.tagName.toLowerCase() + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className) + " {\n";

	designr_element_cssDefinition += "\t/* Font & Text */\n"; 
	for (var i = 0; i < designr_pFont.length; i++) {
		result[designr_pFont[i]] = element.getPropertyValue( designr_pFont[i] );
		designr_element_cssDefinition += "\t" + designr_pFont[i] + ': ' + element.getPropertyValue( designr_pFont[i] ) + ";\n";
	}
		
	designr_element_cssDefinition += "\n\t/* Color & Background */\n";

	for (var i = 0; i < designr_pColorBg.length; i++) {
		result[designr_pColorBg[i]] = element.getPropertyValue(  designr_pColorBg[i] );
		designr_element_cssDefinition += "\t" + designr_pColorBg[i] + ': ' + element.getPropertyValue( designr_pColorBg[i] ) + ";\n";
	}

	designr_element_cssDefinition += "\n\t/* Box */\n";

	for (var i = 0; i < designr_pBox.length; i++) {
		result[designr_pBox[i]] = element.getPropertyValue(  designr_pBox[i] );
		designr_element_cssDefinition += "\t" + designr_pBox[i] + ': ' + element.getPropertyValue( designr_pBox[i] ) + ";\n";
	}

	designr_element_cssDefinition += "\n\t/* Positioning */\n";

	for (var i = 0; i < designr_pPositioning.length; i++) {
		result[designr_pPositioning[i]] = element.getPropertyValue(  designr_pPositioning[i] );
		designr_element_cssDefinition += "\t" + designr_pPositioning[i] + ': ' + element.getPropertyValue( designr_pPositioning[i] ) + ";\n";
	}

	designr_element_cssDefinition += "\n\t/* List */\n";

	for (var i = 0; i < designr_pList.length; i++) {
		result[designr_pList[i]] = element.getPropertyValue(  designr_pList[i] );
		designr_element_cssDefinition += "\t" + designr_pList[i] + ': ' + element.getPropertyValue( designr_pList[i] ) + ";\n";
	}

	designr_element_cssDefinition += "\n\t/* Table */\n";

	for (var i = 0; i < designr_pTable.length; i++) {
		result[designr_pTable[i]] = element.getPropertyValue(  designr_pTable[i] );
		designr_element_cssDefinition += "\t" + designr_pTable[i] + ': ' + element.getPropertyValue( designr_pTable[i] ) + ";\n";
	}
		
	designr_element_cssDefinition += "\n\t/* Miscellaneous */\n";

	for (var i = 0; i < designr_pMisc.length; i++) {
		result[designr_pMisc[i] ] = element.getPropertyValue(  designr_pMisc[i]  );
		designr_element_cssDefinition += "\t" + designr_pMisc[i] + ': ' + element.getPropertyValue( designr_pMisc[i] ) + ";\n";
	}

	designr_element_cssDefinition += "\n\t/* Effects */\n"; 

	for (var i = 0; i < designr_pEffect.length; i++) {
		result[designr_pEffect[i]] = element.getPropertyValue(  designr_pEffect[i]  );
		designr_element_cssDefinition += "\t" + designr_pEffect[i] + ': ' + element.getPropertyValue( designr_pEffect[i] ) + ";\n";
	}
		
	designr_element_cssDefinition += "}";

	console.log( element.cssText ); 

	chrome.runtime.sendMessage({ data: {props: result, css: designr_element_cssDefinition, title: designr_element_title}, action: "clickElement" })

	designrInsertMessage( "Element saved into palette!" );
}

function designrMouseOver(e)
{
	// Block
	var document = GetCurrentDocument();
	var block = document.getElementById('designr_block');

	if( ! block ){
		return;
	}

	// Outline element
	if (this.tagName != 'body') {
		this.style.outline = '1.5px dashed #63a3eb';
		designr_current_element = this;
	}
	
	// Updating CSS properties
	var element = document.defaultView.getComputedStyle(this, null);

	UpdateGeneral(element, this.tagName, this.className, this.id);
	UpdatefontText(element);
	UpdateColorBg(element);
	UpdateBox(element);
	UpdatePositioning(element);
	UpdateTable(element, this.tagName);
	UpdateList(element, this.tagName);
	UpdateMisc(element);
	UpdateEffects(element);

	designr_element = this;

	designrRemoveElement("designrInsertMessage");

	e.stopPropagation();

	// generate simple css definition
	designr_element_cssDefinition = this.tagName.toLowerCase() + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className) + " {\n";

	designr_element_cssDefinition += "\t/* Font & Text */\n"; 
	for (var i = 0; i < designr_pFont.length; i++)
		designr_element_cssDefinition += "\t" + designr_pFont[i] + ': ' + element.getPropertyValue( designr_pFont[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* Color & Background */\n";
	for (var i = 0; i < designr_pColorBg.length; i++)
		designr_element_cssDefinition += "\t" + designr_pColorBg[i] + ': ' + element.getPropertyValue( designr_pColorBg[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* Box */\n";
	for (var i = 0; i < designr_pBox.length; i++)
		designr_element_cssDefinition += "\t" + designr_pBox[i] + ': ' + element.getPropertyValue( designr_pBox[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* Positioning */\n";
	for (var i = 0; i < designr_pPositioning.length; i++)
		designr_element_cssDefinition += "\t" + designr_pPositioning[i] + ': ' + element.getPropertyValue( designr_pPositioning[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* List */\n";
	for (var i = 0; i < designr_pList.length; i++)
		designr_element_cssDefinition += "\t" + designr_pList[i] + ': ' + element.getPropertyValue( designr_pList[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* Table */\n";
	for (var i = 0; i < designr_pTable.length; i++)
		designr_element_cssDefinition += "\t" + designr_pTable[i] + ': ' + element.getPropertyValue( designr_pTable[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* Miscellaneous */\n";
	for (var i = 0; i < designr_pMisc.length; i++)
		designr_element_cssDefinition += "\t" + designr_pMisc[i] + ': ' + element.getPropertyValue( designr_pMisc[i] ) + ";\n";

	designr_element_cssDefinition += "\n\t/* Effects */\n"; 
	for (var i = 0; i < designr_pEffect.length; i++)
		designr_element_cssDefinition += "\t" + designr_pEffect[i] + ': ' + element.getPropertyValue( designr_pEffect[i] ) + ";\n";

	designr_element_cssDefinition += "}";

	console.log( element.cssText ); 
}

function designrMouseOut(e)
{
	this.style.outline = '';

	e.stopPropagation();
}

function designrMouseMove(e)
{
	var document = GetCurrentDocument();
	var block = document.getElementById('designr_block');

	if( ! block ){
		return;
	}

	block.style.display = 'block';
	
	var pageWidth = window.innerWidth;
	var pageHeight = window.innerHeight;
	var blockWidth = 332;
	var blockHeight = document.defaultView.getComputedStyle(block, null).getPropertyValue('height');

	blockHeight = blockHeight.substr(0, blockHeight.length - 2) * 1;

	if ((e.pageX + blockWidth) > pageWidth) {
		if ((e.pageX - blockWidth - 10) > 0)
			block.style.left = e.pageX - blockWidth - 40 + 'px';
		else
			block.style.left = 0 + 'px';
	}
	else
		block.style.left = (e.pageX + 20) + 'px';

	if ((e.pageY + blockHeight) > pageHeight) {
		if ((e.pageY - blockHeight - 10) > 0)
			block.style.top = e.pageY - blockHeight - 20 + 'px';
		else
			block.style.top = 0 + 'px';
	}
	else
		block.style.top = (e.pageY + 20) + 'px';

	// adapt block top to screen offset
	inView = designrIsElementInViewport(block);

	if( ! inView )
		block.style.top = ( window.pageYOffset  + 20 ) + 'px';

	e.stopPropagation();
}

// http://stackoverflow.com/a/7557433
function designrIsElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/*
* designr Class
*/
function designr()
{
	// Create a block to display informations
	this.CreateBlock = function() {
		var document = GetCurrentDocument();
		var block;
		
		if (document) {
			// Create a div block
			block = document.createElement('div');
			block.id = 'designr_block';
			
			var header = document.createElement('h1');
			header.appendChild(document.createTextNode(''));
			block.appendChild(header);
			
			// Insert all properties
			var center = document.createElement('div');

			center.id = 'designr_center';

			for (var cat in designr_categories) {
				var div = document.createElement('div');

				div.id = 'designr_' + cat;
				div.className = 'designr_category';

				var h2 = document.createElement('h2');

				h2.appendChild(document.createTextNode(designr_categoriesTitle[cat]));

				var ul = document.createElement('ul');
				var properties = designr_categories[cat];

				for (var i = 0; i < properties.length; i++) {
					var li = document.createElement('li');

					li.id = 'designr_' + properties[i];

					var spanName = document.createElement('span');

					spanName.className = 'designr_property';

					var spanValue = document.createElement('span');

					spanName.appendChild(document.createTextNode(properties[i]));
					li.appendChild(spanName);
					li.appendChild(spanValue);
					ul.appendChild(li);
				}

				div.appendChild(h2);
				div.appendChild(ul);
				center.appendChild(div);
			}

			block.appendChild(center);

			// Insert a footer
			var footer = document.createElement('div');

			footer.id = 'designr_footer';

			//< 
			footer.appendChild( document.createTextNode('designr (1.0.0)      [Esc] Close out of popup') ); 
			block.appendChild(footer);
		}
		
		designrInsertMessage( "Hover over any element to inspect in the page and click on an element to save it." );

		return block;
	}
	
	// Get all elements within the given element
	this.GetAllElements = function(element)
	{
		var elements = new Array();

		if (element && element.hasChildNodes()) {
			elements.push(element);

			var childs = element.childNodes;

			for (var i = 0; i < childs.length; i++) {
				if (childs[i].hasChildNodes()) {
					elements = elements.concat(this.GetAllElements(childs[i]));
				}
				else if (childs[i].nodeType == 1) {
					elements.push(childs[i]);
				}
			}
		}

		return elements;
	}
	
	// Add bool for knowing all elements having event listeners or not
	this.haveEventListeners = false;

	// Add event listeners for all elements in the current document
	this.AddEventListeners = function()
	{
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);
		console.log("dasklsdajlksdjs")

		for (var i = 0; i < elements.length; i++)	{
			elements[i].addEventListener("mouseover", designrMouseOver, false);
			elements[i].addEventListener("click", designrClick, false);
			elements[i].addEventListener("mouseout", designrMouseOut, false);
			elements[i].addEventListener("mousemove", designrMouseMove, false);
		}	
		this.haveEventListeners = true;
	}
	
	// Remove event listeners for all elements in the current document
	this.RemoveEventListeners = function()
	{
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++){
			elements[i].removeEventListener("mouseover", designrMouseOver, false);
			elements[i].removeEventListener("click", designrClick, false);
			elements[i].removeEventListener("mouseout", designrMouseOut, false);
			elements[i].removeEventListener("mousemove", designrMouseMove, false);
		}	
		this.haveEventListeners = false;
	}

	// Set the title of the block
	this.SetTitle = function()
	{}
	
	// Add a stylesheet to the current document
	this.AddCSS = function(cssFile)
	{
		var document = GetCurrentDocument();
		var link = document.createElement("link");

		link.setAttribute("href", cssFile);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");

		var heads = document.getElementsByTagName("head");

		if(heads.length > 0)
		    heads[0].appendChild(link);
		else
		    document.documentElement.appendChild(link);
	}
	
	this.RemoveCSS = function(cssFile)
	{
		var document = GetCurrentDocument();
		var links = document.getElementsByTagName('link');

		for (var i = 0; i < links.length; i++) {
			if (links[i].rel == "stylesheet" && links[i].href == cssFile) {
				var heads = document.getElementsByTagName("head");

				if(heads.length > 0) {
					heads[0].removeChild(links[i]);
				}

				return;
			}
		}
	}
}

/*
* Check if designr is enabled
*/
designr.prototype.IsEnabled = function()
{
	var document = GetCurrentDocument();

	if (document.getElementById('designr_block')) {
		return true;
	}

	return false;
}

/*
* Enable designr
*/
designr.prototype.Enable = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('designr_block');

	if (!block){
		block = this.CreateBlock();
		document.body.appendChild(block);
		this.AddEventListeners();

		return true;
	}

	return false;
}

/*
* Disable designr
*/
designr.prototype.Disable = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('designr_block');
        var insertMessage = document.getElementById("designrInsertMessage");
        
	if (block || insertMessage) {
                if(block) document.body.removeChild(block);
                if(insertMessage) document.body.removeChild(insertMessage);
		this.RemoveEventListeners();

		return true;
	}

	return false;
}

/*
* Display the notification message
*/
function designrInsertMessage( msg )
{
	var oNewP = document.createElement("p");
	var oText = document.createTextNode( msg );

	oNewP.appendChild(oText);
	oNewP.id                    = 'designrInsertMessage';
	oNewP.style.backgroundColor = '#275e9d';
	oNewP.style.color           = '#ffffff';
	oNewP.style.position        = "fixed";
	oNewP.style.top             = '10px';
	oNewP.style.left            = '10px';
	oNewP.style.zIndex          = '9999';
	oNewP.style.fontSize        = '15px';
	oNewP.style.padding         = '3px';
	document.body.appendChild(oNewP);
}

/*
* Removes and element from the dom, used to remove the notification message
*/
function designrRemoveElement(divid)
{   
	var n = document.getElementById(divid);

	if(n){
		document.body.removeChild(n); 
	}
}

/*
* Copy current element css to chrome console
*/
function designrCopyCssToConsole(type)
{   
	if( 'el' == type ) return console.log( designr_element );
	if( 'id' == type ) return console.log( designr_element.id );
	if( 'tagName' == type ) return console.log( designr_element.tagName );
	if( 'className' == type ) return console.log( designr_element.className );
	if( 'style' == type ) return console.log( designr_element.style ); 
	if( 'cssText' == type ) return console.log( document.defaultView.getComputedStyle(designr_element, null).cssText );
	if( 'getComputedStyle' == type ) return console.log( document.defaultView.getComputedStyle(designr_element, null) );
	if( 'simpleCssDefinition' == type ) return console.log( designr_element_cssDefinition );
}

/*
*  Close css viewer on clicking 'esc' key
*  Freeze css viewer on clicking 'f' key
*/
function designrKeyMap(e) {
	if( ! designr.IsEnabled() )
		return;

	// ESC: Close the css viewer if the designr is enabled.
	if ( e.keyCode === 27 ){
		// Remove the red outline
		designr_current_element.style.outline = '';
		designr.Disable();
	}
	
	if( e.altKey || e.ctrlKey )
		return;

	// c: Show code css for selected element. 
	// window.prompt should suffice for now.
	if ( e.keyCode === 67 ){
		window.prompt("Simple Css Definition :\n\nYou may copy the code below then hit escape to continue.", designr_element_cssDefinition);
	}
}


/*
* designr entry-point
*/
designr = new designr();

if ( designr.IsEnabled() ){
	designr.Disable();  
}
else{
	designr.Enable(); 
}

// Set event handler for the designr 
document.onkeydown = designrKeyMap;
