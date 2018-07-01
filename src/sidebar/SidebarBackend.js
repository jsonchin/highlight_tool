var SIDEBAR_HTML_FILENAME = 'src/sidebar/Sidebar';

function showSidebar() {
  const sidebarTemplate = HtmlService.createTemplateFromFile(SIDEBAR_HTML_FILENAME);

  const currentHSet = loadCurrentHighlighterSet();
  if (currentHSet === null) {
    const DEFAULT_HIGHLIGHTER_SET = {};
    DEFAULT_HIGHLIGHTER_SET[SET_NAME_KEY] = 'Example Set Name';
    DEFAULT_HIGHLIGHTER_SET[IS_SET_MINIMIZED_KEY] = false;
    const DEFAULT_HIGHLIGHTERS = [];
    const DEFAULT_HIGHLIGHTER = {};
    DEFAULT_HIGHLIGHTER[LABEL_KEY] = 'Example label';
    DEFAULT_HIGHLIGHTER[COLOR_KEY] = '#42f44b';
    DEFAULT_HIGHLIGHTERS.push(DEFAULT_HIGHLIGHTER);
    DEFAULT_HIGHLIGHTER_SET[HIGHLIGHTERS_KEY] = DEFAULT_HIGHLIGHTERS;
    sidebarTemplate.hSet = DEFAULT_HIGHLIGHTER_SET;
  } else {
    sidebarTemplate.hSet = currentHSet.toJSON();
  }

  const sidebar = sidebarTemplate.evaluate();
  sidebar.setTitle('Highlight Tool');
  DocumentApp.getUi().showSidebar(sidebar);
}

function highlightSelection(color) {
  const doc = DocumentApp.getActiveDocument();
  const range = doc.getSelection();
  if (range) {
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
  } else {
    showRequireSelectionError();
  }
}

function unhighlightSelection() {
  highlightSelection(null);
}

function showRequireSelectionError() {
  const ui = DocumentApp.getUi();
  ui.alert('No text selected', 'Please try again and select some text before clicking a highlighter.', ui.ButtonSet.OK);
}
