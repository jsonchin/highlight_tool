function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Start', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  const sidebarTemplate = HtmlService.createTemplateFromFile('Sidebar');
  // TODO: scripletts
  const hLib = loadHighlighterLibrary();
  const currentHSet = hLib.highlighterSets[hLib.currentSetIndex];
  const hSetJSON = currentHSet.toJSON();
  sidebarTemplate.hSet = hSetJSON;

  const sidebar = sidebarTemplate.evaluate();
  sidebar.setTitle('Highlight Tool');
  DocumentApp.getUi().showSidebar(sidebar);
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
