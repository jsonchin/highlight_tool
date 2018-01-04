var SHARE_BLOCK_HEADER = '********************************************Highlighter Values********************************************';
var SHARE_BLOCK_FOOTER = '*************************************Do not modify this block of text*************************************';
var SHARE_BLOCK_LEFT_SET_NAME = '<<<<<';
var SHARE_BLOCK_RIGHT_SET_NAME = '>>>>>';

var SHARE_BLOCK_HEADER_REGEX = '[*]{44}Highlighter Values[*]{44}';
var SHARE_BLOCK_FOOTER_REGEX = '[*]{37}Do not modify this block of text[*]{37}';
var SHARE_BLOCK_REGEX = /[*]{44}Highlighter Values[*]{44}(.|[\n\r])*?[*]{37}Do not modify this block of text[*]{37}/g;
//https://stackoverflow.com/questions/6323417/how-do-i-retrieve-all-matches-for-a-regular-expression-in-javascript

var SHARE_BLOCK_ATTRIBUTES = {};
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.FOREGROUND_COLOR] = null;
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.BACKGROUND_COLOR] = null;
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.FONT_SIZE] = 9;
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
SHARE_BLOCK_ATTRIBUTES[DocumentApp.Attribute.UNDERLINE] = false;

var SHARE_INSTRUCTIONS1 = 'Instructions:';
var SHARE_INSTRUCTIONS2 = 'Go to "Add-ons" -> "Highlight Tool" -> "Import Library" to add these highlighters to your library! Then go to "Highlighter Library" after starting the add-on to select this set as your current set.';
var SHARE_INSTRUCTIONS3 = 'Share this document with other users if you want them to import and use your set of highlighters. Alternatively, copy and paste the block of text between and including the *** s into another document and follow the same instructions.';
var SHARE_INSTRUCTIONS = [SHARE_INSTRUCTIONS1, SHARE_INSTRUCTIONS2, SHARE_INSTRUCTIONS3];

var InvalidShareBlockError = function (msg) {
  this.name = 'InvalidShareBlockError';
  this.message = msg;
}

/**
 * Share Highlighter Sets
 */

function showShareHighlightersDialogCurrentDoc() {
  showShareHighlightersDialog(CURRENT_DOC);
}

function showShareHighlightersDialogNewDoc() {
  showShareHighlightersDialog(NEW_DOC);
}

/**
 * Shows a dialog asking which highlighter sets in the library to share.
 * @param {String} destination Either CURRENT_DOC or NEW_DOC.
 */
function showShareHighlightersDialog(destination) {
  const dialogTemplate = HtmlService.createTemplateFromFile('ShareHighlighters');

  const hLibrary = loadHighlighterLibrary();
  const hLibraryJSON = hLibrary.toJSON();
  dialogTemplate.hLibrary = hLibraryJSON;
  dialogTemplate.destination = destination;

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(500)
    .setHeight(300);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Export Highlighter Library');
}

/**
 * Writes the shareable block representation of the highlighter set to the provided body.
 * @param {HighlighterSetJSON} hSet Without isMinimized property
 * @param {Body} body Google App Script Body object to write to
 */
function appendHighlighterSetBlock(hSet, body) {
  body.appendParagraph(SHARE_BLOCK_HEADER)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBackgroundColor(null);
  // no templating strings allowed in GAS
  // append setName
  body.appendParagraph(SHARE_BLOCK_LEFT_SET_NAME + hSet.setName + SHARE_BLOCK_RIGHT_SET_NAME)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  // append highlighters
  hSet.highlighters.forEach(function (highlighter) {
    body.appendParagraph('"' + highlighter.label + '" : "' + highlighter.color + '"')
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBackgroundColor(highlighter.color);
  });

  body.appendParagraph(SHARE_BLOCK_FOOTER)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBackgroundColor(null);
}

/**
 * Appends the chosen sets as blocks in the active document.
 * @param {List[HighlighterSetJSON]} chosenSets 
 * @param {String} destination Either CURRENT_DOC or NEW_DOC.
 */
function shareChosenSets(chosenSets, destination) {
  if (chosenSets.length === 0) {
    const ui = DocumentApp.getUi();
    ui.alert('No highlighter sets chosen', 'Please try again and select at least one highlighter set.', ui.ButtonSet.OK);
  } else {
    var doc;
    if (destination === CURRENT_DOC) {
      doc = DocumentApp.getActiveDocument();
    } else {
      doc = DocumentApp.create('Exported Highlighter Sets');
    }
    const body = doc.getBody();

    if (destination === NEW_DOC) {
      SHARE_INSTRUCTIONS.forEach(function (instructionLine) {
        body.appendParagraph(instructionLine)
          .setAttributes(SHARE_BLOCK_ATTRIBUTES)
          .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
          .editAsText()
            .setFontSize(11);
      });
    }

    const spacingParagraph = body.appendParagraph('\n\n');
    spacingParagraph.setAttributes(SHARE_BLOCK_ATTRIBUTES);

    chosenSets.forEach(function (hSet) {
      appendHighlighterSetBlock(hSet, body);
    });

    return doc.getUrl();
  }
}

function showExportLinkDialog(url) {
  const dialogTemplate = HtmlService.createTemplateFromFile('ShareHighlightersComplete');
  dialogTemplate.link = url;

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(300)
    .setHeight(80);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Highlighter Sets Exported');
}

function showExportCompleteDialog() {
  const ui = DocumentApp.getUi();
  ui.alert('Highlighter Sets Exported', 'The chosen highlighter sets have been appended to the end of this document.', ui.ButtonSet.OK);
}

/**
 * Import Highlighter Sets
 */

/**
 * Parses a share block string and returns a HighlighterSet and
 * null if there are no highlighters.
 * @param {String} block A string beginning with the header and ending with the footer (may be invalid)
 */
function parseShareBlock(block) {
  var blockBufferStr = block.replace(/\r/g, '\n');
  var blockBuffer = blockBufferStr.replace(SHARE_BLOCK_HEADER, '').replace(SHARE_BLOCK_FOOTER, '').trim().split('\n');

  if (blockBuffer.length === 0) {
    return null;
  }

  // check if there is a setName block
  var setName = '';
  var i = 0;
  if (blockBuffer[0].substring(0, SHARE_BLOCK_LEFT_SET_NAME.length) === SHARE_BLOCK_LEFT_SET_NAME) {
    // parse setName
    setName = blockBuffer[0].replace(SHARE_BLOCK_LEFT_SET_NAME, '').replace(SHARE_BLOCK_RIGHT_SET_NAME, '').trim();
    i += 1;
  }

  // parse each remaining line for a highlighter
  const highlighters = [];
  for (; i < blockBuffer.length; i += 1) {
    var highlighter = blockBuffer[i].split('" : "');
    if (highlighter.length !== 2) {
      throw new InvalidShareBlockError('Invalid highlighter line.');
    }
    var label = highlighter[0].substring(1).trim();
    var color = highlighter[1].substring(0, highlighter[1].length - 1).trim();
    var highlighterJSON = {};
    highlighterJSON[LABEL_KEY] = label;
    highlighterJSON[COLOR_KEY] = color;
    highlighters.push(highlighterJSON);
  }

  const isMinimized = false;
  return new HighlighterSet(setName, highlighters, isMinimized);
}

/**
 * Returns a list of share block string texts that are contained in the doc.
 * @param {Document} doc Google App Script Document object to be scanned
 */
function scanDocumentForShareBlocks(doc) {
  const body = doc.getBody();
  const bodyText = body.getText(); // string

  const shareBlocks = []; // list of strings

  var match;
  do {
    match = SHARE_BLOCK_REGEX.exec(bodyText);
    if (match) {
      shareBlocks.push(match[0]);
    }
  } while (match);

  return shareBlocks;
}

/**
 * Returns HighlighterSets founds corresponding to share blocks found
 * in the document. This list may be empty.
 */
function scanDocumentForSharedHighlighterSets() {
  const doc = getActiveDocument();
  const shareBlocks = scanDocumentForShareBlocks(doc);
  const highlighterSets = [];

  shareBlocks.forEach(function (shareBlock) {
    try {
      highlighterSets.push(parseShareBlock(shareBlock));
    } catch (error) {
      if (error.name !== 'InvalidShareBlockError') {
        throw error;
      }
    }
  });

  return highlighterSets;
}

/**
 * Shows a dialog asking which found share block/highlighter sets to save.
 */
function showFoundSharedHighlighterSetsDialog() {
  const sharedHighlighterSets = scanDocumentForSharedHighlighterSets();

  if (sharedHighlighterSets.length === 0) {
    const ui = DocumentApp.getUi();
    ui.alert(
      'No highlighter blocks found',
      'Please copy and paste highlighter blocks produced from this tool\'s export feature into this document.',
      ui.ButtonSet.OK
    );
    return;
  }

  // get set names that exist in the library to mark the found sets as duplicate set names
  const hLibrary = loadHighlighterLibrary();
  const seenSetNames = {}; // js set
  hLibrary.highlighterSets.forEach(function (highlighterSet) {
    seenSetNames[highlighterSet.setName] = true;
  });

  const dialogTemplate = HtmlService.createTemplateFromFile('ImportHighlighters');
  const hLibraryJSON = {};
  hLibraryJSON[HIGHLIGHTER_SETS_KEY] = sharedHighlighterSets;

  dialogTemplate.hLibrary = hLibraryJSON;
  dialogTemplate.seenSetNames = seenSetNames;
  dialogTemplate.additionalText = '';

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(500)
    .setHeight(300);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Import Highlighter Sets');
}


/**
 * Takes a HighlighterSet and returns a mapping from color:List[String] representing labels.
 * @param {HighlighterSet} hSet 
 */
function groupHighlighterSetHighlighters(hSet) {
  const labelsByColor = {};
  hSet.highlighters.forEach(function (highlighter) {
    const label = highlighter.label;
    const color = highlighter.color;
    if (!(color in labelsByColor)) {
      labelsByColor[color] = [];
    }
    labelsByColor[color].push(label);
  });

  return labelsByColor;
}

/**
 * Defines two HighlighterSets to be equal if they have the same Highlighters in any order
 * and same setName.
 * HighlighterSet.isMinimized do not affect equality.
 * @param {HighlighterSet} hSet1 
 * @param {HighlighterSet} hSet2 
 */
function isHighlighterSetsEqual(hSet1, hSet2) {
  const highlighterGroup1 = groupHighlighterSetHighlighters(hSet1);
  const highlighterGroup2 = groupHighlighterSetHighlighters(hSet2);

  const colors1 = Object.keys(highlighterGroup1);
  const colors2 = Object.keys(highlighterGroup2);

  if (colors1.length !== colors2.length || hSet1.setName !== hSet2.setName) {
    return false;
  }

  for (var i = 0; i < colors1.length; i += 1) {
    var color = colors1[i];
    var labels1 = highlighterGroup1[color].sort();
    var labels2 = highlighterGroup2[color].sort();

    if (labels1.length !== labels2.length) {
      return false;
    }

    for (var j = 0; j < labels1.length; j += 1) {
      if (labels1[j] !== labels2[j]) {
        return false;
      }
    }
  }

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
  const hLibrary = loadHighlighterLibrary();

  const foundHighlighterSets = [];
  highlighterSetsJSON.forEach(function (highlighterSet) {
    const isMinimized = false;
    foundHighlighterSets.push(new HighlighterSet(
      highlighterSet.setName,
      highlighterSet.highlighters,
      isMinimized
    ));
  });

  var alreadyChangedCurrentSet = false;
  foundHighlighterSets.forEach(function (hSet) {
    var isDuplicate = false;
    var i = 0;
    while (i < hLibrary.highlighterSets.length && !isDuplicate) {
      if (isHighlighterSetsEqual(hSet, hLibrary.highlighterSets[i])) {
        hLibrary.currentSetIndex = i;
        isDuplicate = true;
        alreadyChangedCurrentSet = true;
      }

      i += 1;
    }

    if (!isDuplicate) {
      hLibrary.addHighlighterSet(hSet);
      if (!alreadyChangedCurrentSet) {
        hLibrary.currentSetIndex = hLibrary.highlighterSets.length - 1;
      }
    }
  });

  hLibrary.save();

  showSidebar();
}
