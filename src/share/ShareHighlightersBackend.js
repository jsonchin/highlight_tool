var SHARE_BLOCK_HEADER = '******************************************** Highlighter Values ********************************************';
var SHARE_BLOCK_FOOTER = '*************************************Do not modify this block of text*************************************';
var SHARE_BLOCK_LEFT_SET_NAME = '<<<<<';
var SHARE_BLOCK_RIGHT_SET_NAME = '>>>>>';

var SHARE_BLOCK_ATTRIBUTES = {};
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.FOREGROUND_COLOR] = null;
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.BACKGROUND_COLOR] = null;
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.FONT_SIZE] = 9;
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.UNDERLINE] = false;

/**
 * Share Highlighter Sets
 */

/**
 * Shows a dialog asking which highlighter sets in the library to share.
 */
function showShareHighlightersDialog() {
  const dialogTemplate = HtmlService.createTemplateFromFile('ShareHighlighters');

  const hLibrary = loadHighlighterLibrary();
  const hLibraryJSON = hLibrary.toJSON();
  dialogTemplate.hLibrary = hLibraryJSON;

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(500)
    .setHeight(300);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Highlighter Library Exporter');
}

/**
 * Writes the shareable block representation of the highlighter set to the provided body.
 * @param {HighlighterSetJSON} hSet Without isMinimized property
 * @param {Body} body Google App Script Body object to write to
 */
function appendHighlighterSetBlock(hSet, body) {
  body.appendParagraph(SHARE_BLOCK_HEADER)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  // no templating strings allowed in GAS
  // append setName
  body.appendParagraph(SHARE_BLOCK_LEFT_SET_NAME + hSet.setName + SHARE_BLOCK_RIGHT_SET_NAME)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  // append highlighters
  hSet.highlighters.forEach(function (highlighter) {
    body.appendParagraph('"' + highlighter.label + '" : "' + highlighter.color + '"')
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  });

  body.appendParagraph(SHARE_BLOCK_FOOTER)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
}

/**
 * Appends the chosen sets as blocks in the active document.
 * @param {List[HighlighterSetJSON]} chosenSets 
 */
function shareChosenSets(chosenSets) {
  if (chosenSets.length === 0) {
    const ui = DocumentApp.getUi();
    ui.alert('No highlighter sets chosen', 'Please try again and select at least one highlighter set.', ui.ButtonSet.OK);
  } else {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();

    const spacingParagraph = body.appendParagraph('\n\n');
    spacingParagraph.setAttributes(SHARE_BLOCK_ATTRIBUTES);

    chosenSets.forEach(function (hSet) {
      appendHighlighterSetBlock(hSet, body);
    });
  }
}

/**
 * Import Highlighter Sets
 */

/**
 * Parses a share block string and returns a HighlighterSet.
 * @param {String} block A string beginning with the header and ending with the footer (may be invalid)
 */
function parseShareBlock(block) {
  const isMinimized = false;
  // TODO implement
  return new HighlighterSet(setName, highlightersJSON, isMinimized);
}

/**
 * Returns a list of share block string texts that are contained in the doc.
 * @param {Document} doc Google App Script Document object to be scanned
 */
function scanDocumentForShareBlocks(doc) {
  // TODO implement
}

/**
 * Shows a dialog asking which found share block/highlighter sets to save.
 * @param {List[HighlighterSets]} highlighterSets 
 */
function showFoundShareBlocks(highlighterSets) {
  // TODO implement
}

/**
 * Defines two HighlighterSets to be equal if they have the same Highlighters in any order.
 * HighlighterSet.setName and HighlighterSet.isMinimized do not affect equality.
 * @param {HighlighterSet} hSet1 
 * @param {HighlighterSet} hSet2 
 */
function isHighlighterSetsEqual(hSet1, hSet2) {
  // TODO implement
  return true;
}

/**
 * Saves non-duplicate highlighter sets into the user's library (UserProperties).
 * If there are duplicate highlighter set(s), a randomly chosen duplicate
 * highlighter set is set as currently selected set and the sidebar is reopened.
 * Duplicate highlighter sets is defined by isHighlighterSetsEqual
 * @param {List[HighlighterSetJSON]} highlighterSetsJSON A list of chosen highlighter set json.
 */
function saveChosenShareBlocks(highlighterSetsJSON) {
  // TODO implement
}
