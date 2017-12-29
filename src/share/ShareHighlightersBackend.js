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
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  const spacingParagraph = body.appendParagraph('\n\n');
  spacingParagraph.setAttributes(SHARE_BLOCK_ATTRIBUTES);

  chosenSets.forEach(function (hSet) {
    appendHighlighterSetBlock(hSet, body);
  });
}
