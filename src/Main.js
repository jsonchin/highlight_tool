function onOpen(e) {
  const ui = DocumentApp.getUi();
  ui.createAddonMenu()
    .addItem('Start', 'start')
    .addItem('Import Library', 'mainShowFoundSharedHighlighterSetsDialog')
    .addSubMenu(ui.createMenu('Export Library')
      .addItem('To new document', 'mainShowShareHighlightersDialogNewDoc')
      .addItem('To current document', 'mainShowShareHighlightersDialogCurrentDoc'))
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
