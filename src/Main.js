function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Start', 'showSidebar')
    .addItem('Export Library', 'showShareHighlightersDialog')
    .addItem('Import Library', 'showFoundSharedHighlighterSetsDialog')
    .addSeparator()
    .addItem('Settings', 'showSettingsDialog')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}
