var EXTRACTED_TEXT_FONT_SIZE = 11;
var EXTRACTED_TEXT_FONT_FAMILY = 'Arial';
var TABLE_LABEL_CELL_WIDTH = 100;

var ORDER_COLOR = 'COLOR';
var ORDER_CHRONO = 'CHRONO';

var NEW_DOC = 'NEW';
var CURRENT_DOC = 'CURRENT';

var LUMINOSITY_WHITE_THRESHOLD = 230;

var getActiveDocument = function () {
  return DocumentApp.getActiveDocument();
  // return DocumentApp.openByUrl('https://docs.google.com/document/d/1S-QoWUdC07lOn6iijAhEOFNaFFWK6PHpQ_2AE6XfXe0/edit');
};

var extractHighlightedTextFromDoc = function extractHighlightedTextFromActiveDoc() {
  const doc = getActiveDocument();
  const body = doc.getBody();

  const numChildren = body.getNumChildren();

  const extractedTexts = [];

  for (var i = 0; i < numChildren; i += 1) {
    var childElementText = body.getChild(i).asText(); // var because it needs to be doc scoped
    var partialExtractedTexts = extractHighlightsFromText(childElementText);
    partialExtractedTexts.forEach(function (extractedText) {
      extractedTexts.push(extractedText);
    });
  }

  return extractedTexts;
};

/**
 * Extracts a list of ExtractedText from the active document
 * in chronological order.
 */
var extractHighlightsFromText = function extractHighlightedTextFromGASTextObject(text) {

  var prevColor = null;
  var prevIndex = null; // keeps track of the index in the attrChangeIndicies array

  const extractedHighlights = [];
  const attrChangeIndicies = text.getTextAttributeIndices();

  const textStr = text.getText();

  for (var i = 0; i < attrChangeIndicies.length; i += 1) {
    var changeIndex = attrChangeIndicies[i];
    var bgColor = text.getBackgroundColor(changeIndex);
    if (bgColor === null) {
      if (prevColor !== null) { // transition from color to no color
        var textSubstr = textStr.substring(prevIndex, changeIndex);
        extractedHighlights.push(new ExtractedText(textSubstr, prevColor));
      }

      prevIndex = null;
      prevColor = null;
    } else {
      if (prevColor === null) { // cold start of this color
        prevIndex = changeIndex;
        prevColor = bgColor;
      } else if (bgColor != prevColor) { // transition to a new color
        var textSubstr = textStr.substring(prevIndex, changeIndex).trim(); // trim the leading/ending whitespace
        extractedHighlights.push(new ExtractedText(textSubstr, prevColor));

        prevIndex = changeIndex;
        prevColor = bgColor;
      }
      // continuation of the previous color doesn't require any actions
    }
  }

  // add on the ExtractedText that hasn't been added on yet
  if (prevColor !== null) {
    var textSubstr = textStr.substring(prevIndex, textStr.length);
    extractedHighlights.push(new ExtractedText(textSubstr, prevColor));
  }

  return extractedHighlights;
};


/**
 * Appends a key separated by new lines of the label highlighted by the highlighter color.
 * If there is no current set, then this function does nothing.
 * @param {Document} doc Google App Script Document object
 */
var appendHighlighterKey = function appendCurrentHighlighterSetKey(doc, currentHSet) {
  const body = doc.getBody();
  const labelingKeyParagraph = body.appendParagraph('Labeling Key');
  if (currentHSet !== null) {
    // TODO for each highlighter, append the label name highlighted by the color.
    currentHSet.highlighters.forEach(function (highlighter) {
      var paragraph = body.appendParagraph(highlighter.label);
      paragraph.editAsText().setBackgroundColor(highlighter.color);
    });
  }
  labelingKeyParagraph.editAsText().setBold(true).setUnderline(true).setBackgroundColor(null);
  body.appendParagraph('\r\r');
};

/**
 * Returns a dictionary from color:label of the highlighters in the provided HighlighterSet.
 * Duplicate colors with differing labels chooses the last label that appears.
 * @param {HighlighterSet} currHSet 
 */
var getCurrentSetMap = function getCurrentSetMapFromColorToLabel(currHSet) {
  const colorToLabel = {};
  if (currHSet !== null) {
    currHSet.highlighters.forEach(function (highlighter) {
      colorToLabel[highlighter.color] = highlighter.label;
    });
  }

  return colorToLabel;
};

/**
 * Gets the luminosity of a hex string color.
 * @param {String} hexStr A string in the format "#ff00ff".
 */
var getLuminosity = function getLuminosityFromHex(hexStr) {
  //https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
  const c = hexStr.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b); // per ITU-R BT.709

  return luma;
};

/**
 * Appends the extracted text in the order they appeared in the original document.
 * @param {List[ExtractedText]} extractedTexts
 * @param {Document} doc Google App Script Document object
 */
var appendExtractedTextChrono = function appendExtractedTextToDocByChronological(extractedTexts, doc, currentHSet) {
  const body = doc.getBody();
  const table = body.appendTable([['Label Name', 'Extracted Text']]);

  table.setAttributes(TABLE_ATTRIBUTES);

  const colorToLabel = getCurrentSetMap(currentHSet);

  extractedTexts.forEach(function (extractedText) {
    var color = extractedText.color;

    // ignore the extracted text if its color is too white
    if (getLuminosity(color) < LUMINOSITY_WHITE_THRESHOLD) {
      var textStr = extractedText.text;

      var tableRow;
      var tableCell1;
      var tableCell2;
      // if adjacent extractedText have the same color, put them in the same row.
      if (table.getNumRows() > 0 && color === table.getRow(table.getNumRows() - 1).getCell(0).getBackgroundColor()) {
        tableRow = table.getRow(table.getNumRows() - 1);
        tableCell1 = tableRow.getCell(0);
        tableCell2 = tableRow.getCell(1);
        tableCell2.appendParagraph(textStr);
      } else {
        tableRow = table.appendTableRow();
        tableCell1 = tableRow.appendTableCell();
        // set the first column to be the label if there is a match
        if (color in colorToLabel) {
          tableCell1.setText(colorToLabel[color]);
          tableCell1.setBold(true);
          tableCell1.setWidth(TABLE_LABEL_CELL_WIDTH);
        }
        tableCell2 = tableRow.appendTableCell();
        tableCell2.setText(textStr);
        tableCell2.setBold(false);
      }

      // style the table cells with the correct color
      var colorAttributes = {};
      colorAttributes[DocumentApp.Attribute.BACKGROUND_COLOR] = color;
      tableCell1.setAttributes(colorAttributes);
      tableCell2.setAttributes(colorAttributes);

      // tableCell1.setBackgroundColor(color);
      // tableCell2.setBackgroundColor(color);
    }
  });

  // set the first header row of the table to be bold (doing this after so it doesn't transfer)
  const headerRowAttributes = {};
  headerRowAttributes[DocumentApp.Attribute.BOLD] = true;
  table.getRow(0).setAttributes(headerRowAttributes);
};

/**
 * Appends the extracted text grouped by color.
 * Try to append in order of the current set highlighters where unknown colors appear last.
 * @param {List[ExtractedText]} extractedTexts
 * @param {Document} doc Google App Script Document object
 */
var appendExtractedTextColor = function appendExtractedTextToDocByColor(extractedTexts, doc, currentHSet) {
  // first order the ExtractedTexts, then call appendExtractedTextChrono on the ordered list
  const extractedTextsByColor = {};
  extractedTexts.forEach(function (extractedText) {
    if (!(extractedText.color in extractedTextsByColor)) {
      extractedTextsByColor[extractedText.color] = [];
    }
    extractedTextsByColor[extractedText.color].push(extractedText);
  });

  const seenColors = {};
  const colorSortedExtractedTexts = [];
  if (currentHSet !== null) {
    // for each highlighter color in the current highlighter set
    currentHSet.highlighters.forEach(function (highlighter) {
      // if the color is in the current set
      var currColor = highlighter.color;
      seenColors[currColor] = true;
      if (currColor in extractedTextsByColor) {
        // add all the extracted text of this color
        extractedTextsByColor[currColor].forEach(function (extractedText) {
          colorSortedExtractedTexts.push(extractedText);
        });
      }
    });
  }

  Object.keys(extractedTextsByColor).forEach(function (color) {
    if (!(color in seenColors)) {
      extractedTextsByColor[color].forEach(function (extractedText) {
        colorSortedExtractedTexts.push(extractedText);
      });
      seenColors[color] = true;
    }
  });

  appendExtractedTextChrono(colorSortedExtractedTexts, doc, currentHSet);
};

/**
 * Returns a dictionary of color:List[ExtractedText] grouped by color.
 * @param {List[ExtractedText]} extractedTexts 
 */
var organizeByColor = function organizeExtractedTextByColor(extractedTexts) {
  const extractedTextsByColor = {};

  extractedTexts.forEach(function (extractedText) {
    var color = extractedText.color;
    var text = extractedText.text;

    if (color in extractedTextsByColor) {
      extractedTextsByColor[color].push(text);
    } else {
      extractedTextsByColor[color] = [];
    }
  });

  return extractedTextsByColor;
};

// set the style to be arial, font 11, no foreground or background color
// putting this here instead of the top for eslint warnings
var TABLE_ATTRIBUTES = {};
TABLE_ATTRIBUTES[DocumentApp.Attribute.FOREGROUND_COLOR] = null;
TABLE_ATTRIBUTES[DocumentApp.Attribute.BACKGROUND_COLOR] = null;
TABLE_ATTRIBUTES[DocumentApp.Attribute.FONT_SIZE] = EXTRACTED_TEXT_FONT_SIZE;
TABLE_ATTRIBUTES[DocumentApp.Attribute.FONT_FAMILY] = EXTRACTED_TEXT_FONT_FAMILY;
TABLE_ATTRIBUTES[DocumentApp.Attribute.UNDERLINE] = false;

/**
 * Shows the dialog to get the target document.
 * @param {String} order must either by 'COLOR' or CHRONO'
 */
function showExtractHighlightedTextTargetDocDialog(order) {
  const dialogTemplate = HtmlService.createTemplateFromFile('ExtractHighlightsTargetDocDialog');
  dialogTemplate.order = order;

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(300)
    .setHeight(150);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Extract Highlights');
}

/**
 * Extracts highlighted text to the target doc in the specified order.
 * If a URL is passed but is not a valid Google Document or permissions are not valid,
 * this will show an invalid URL dialog.
 * @param {String} target Either NEW_DOC, CURRENT_DOC, or a valid URL to a Google Document.
 * @param {String} order Either CHRONO or COLOR.
 */
function extractHighlightsToDoc(target, order) {
  // figure out the targetDoc
  var targetDoc;
  if (target === NEW_DOC) {
    const currDocName = getActiveDocument().getName();
    targetDoc = DocumentApp.create(currDocName + ' Extracted Highlights');
  } else if (target === CURRENT_DOC) {
    targetDoc = getActiveDocument();
  } else { // throws error if not a valid URL
    targetDoc = DocumentApp.openByUrl(target);
  }

  // extract the highlighted text BEFORE appending the highlighter key
  const extractedTexts = extractHighlightedTextFromDoc();

  // append the highlighter key to the targetDoc
  const currentHSet = loadCurrentHighlighterSet();
  appendHighlighterKey(targetDoc, currentHSet);

  // choose the function by which to append the extracted text (color/chrono)
  var appendExtractedTextByOrder;
  if (order === ORDER_COLOR) {
    appendExtractedTextByOrder = appendExtractedTextColor;
  } else if (order === ORDER_CHRONO) {
    appendExtractedTextByOrder = appendExtractedTextChrono;
  } else {
    appendExtractedTextByOrder = appendExtractedTextChrono;
  }

  // append the extracted text to the targetDoc
  appendExtractedTextByOrder(extractedTexts, targetDoc, currentHSet);
  const docURL = targetDoc.getUrl();
  showLinkToDocDialog(docURL, target === CURRENT_DOC);
}

function showLinkToDocDialog(link, isCurrentDoc) {
  const dialogTemplate = HtmlService.createTemplateFromFile('ExtractHighlightsLinkDialog');
  dialogTemplate.link = link;
  dialogTemplate.isCurrentDoc = isCurrentDoc;

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(300)
    .setHeight(80);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Highlights Extracted');
}

function showInvalidURLDialog(url) {
  const ui = DocumentApp.getUi();
  ui.alert(
    'Invalid URL to target document',
    'The provided URL to the target Google Document was invalid, please try again:\n' + url, ui.ButtonSet.OK
  );
}

/**
 * Represents extracted text from a document
 * @param {Text} textStr Google App Script Document's Text object 
 * @param {String} color in hex format Ex. '#ff00ff'
 */
function ExtractedText(textStr, color) {
  this.text = textStr;
  this.color = color;
}
