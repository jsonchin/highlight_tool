function showSidebar() {
  const sidebarTemplate = HtmlService.createTemplateFromFile('Sidebar');

  const hLib = loadHighlighterLibrary();
  const currentHSet = hLib.highlighterSets[hLib.currentSetIndex];
  const hSetJSON = currentHSet.toJSON();
  sidebarTemplate.hSet = hSetJSON;

  const sidebar = sidebarTemplate.evaluate();
  sidebar.setTitle('Highlight Tool');
  DocumentApp.getUi().showSidebar(sidebar);

  autoImportHighlighterSets();
}

function highlightSelection(color) {
  const doc = DocumentApp.getActiveDocument();
  const range = doc.getSelection();
  const rangeElements = range.getRangeElements();
  rangeElements.forEach(function (rangeElement) {
    if (rangeElement.isPartial()) {
      rangeElement.getElement().asText().setBackgroundColor(
        rangeElement.getStartOffset(),
        rangeElement.getEndOffsetInclusive(),
        color
      );
    } else {
      rangeElement.getElement().asText().setBackgroundColor(color);
    }
  });
}

function showRequireSelectionError() {
  const ui = DocumentApp.getUi();
  ui.alert('No text selected', 'Please try again and select some text before clicking a highlighter.', ui.ButtonSet.OK);
}
