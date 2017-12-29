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
