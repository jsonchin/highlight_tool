/**
 * Appends a key separated by new lines of the label highlighted by the highlighter color.
 * If there is no current set, then this function does nothing.
 * @param {Document} doc Google App Script Document object
 */
var appendHighlighterKey = function appendCurrentHighlighterSetKey(doc) {
  const currentHSet = loadCurrentHighlighterSet();
  if (currentHSet !== null) {
    // TODO for each highlighter, append the label name highlighted by the color.
  }
};

/**
 * Appends the extracted text in the order they appeared in the original document.
 * @param {List[ExtractedText]} extractedText 
 * @param {Document} doc Google App Script Document object
 */
var appendExtractedTextChrono = function appendExtractedTextToDocByChronological(extractedText, doc) {

};

/**
 * Appends the extracted text grouped by color.
 * Try to append in order of the current set highlighters where unknown colors appear last.
 * @param {List[ExtractedText]} extractedText
 * @param {Document} doc Google App Script Document object
 */
var appendExtractedTextColor = function appendExtractedTextToDocByColor(extractedText, doc) {

};

/**
 * Extracts a list of ExtractedText from the active document
 * in chronological order.
 */
var extractTextFromDoc = function extractTextFromActiveDoc() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  const extractedText = [];

  return extractedText;
};

/**
 * Represents extracted text from a document
 * @param {Text} text Google App Script Document's Text object 
 * @param {String} color in hex format Ex. '#ff00ff'
 */
function ExtractedText(text, color) {
  this.text = text;
  this.color = color;
}
