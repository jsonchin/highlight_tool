function onOpen(e) {
  const ui = DocumentApp.getUi();
  ui.createAddonMenu()
    .addItem('Start', 'start')
    .addItem('Import Library', 'showFoundSharedHighlighterSetsDialog')
    .addSubMenu(ui.createMenu('Export Library')
      .addItem('To new document', 'showShareHighlightersDialogNewDoc')
      .addItem('To current document', 'showShareHighlightersDialogCurrentDoc'))
    .addSeparator()
    .addItem('Settings', 'showSettingsDialog')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function start() {
  checkVersion();
  autoImportHighlighterSets();
  showSidebar();
}
