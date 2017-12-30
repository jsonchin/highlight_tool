function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Start', 'showSidebar')
    .addItem('Export', 'showShareHighlightersDialog')
    .addItem('Import', 'showFoundSharedHighlighterSetsDialog')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}
