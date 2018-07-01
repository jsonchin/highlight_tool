function onOpen(e) {
  const ui = DocumentApp.getUi();
  ui.createAddonMenu()
    .addItem('Start', 'start')
    .addItem('Import Library', 'mainShowFoundSharedHighlighterSetsDialog')
    .addItem('Export Library', 'mainShowShareHighlightersDialogNewDoc')
    .addItem('Associate', 'mainShowShareHighlightersDialogCurrentDoc')
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

function mainShowFoundSharedHighlighterSetsDialog() {
  checkVersion();
  showFoundSharedHighlighterSetsDialog();
}

function mainShowShareHighlightersDialogNewDoc() {
  checkVersion();
  showShareHighlightersDialogNewDoc();
}

function mainShowShareHighlightersDialogCurrentDoc() {
  checkVersion();
  showShareHighlightersDialogCurrentDoc();
}
