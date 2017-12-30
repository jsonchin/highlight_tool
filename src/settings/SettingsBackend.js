var SETTING_AUTO_IMPORT_KEY = 'settingAutoImport'; // 'true' or 'false' as keys
var SETTING_AUTO_IMPORT_TRUE = 'true';
var SETTING_AUTO_IMPORT_FALSE = 'false';

/**
 * Shows a dialog asking which found share block/highlighter sets to save.
 */
function autoImportHighlighterSets() {
  const userProps = PropertiesService.getUserProperties();
  const isAutoScan = userProps.getProperty(SETTING_AUTO_IMPORT_KEY);
  if (isAutoScan === null) {
    userProps.setProperty(SETTING_AUTO_IMPORT_KEY, SETTING_AUTO_IMPORT_TRUE);
  }

  if (isAutoScan === SETTING_AUTO_IMPORT_TRUE || isAutoScan === null) {
    const sharedHighlighterSets = scanDocumentForSharedHighlighterSets();
    if (sharedHighlighterSets.length !== 0) {
      const dialogTemplate = HtmlService.createTemplateFromFile('ImportHighlighters');
      const hLibraryJSON = {};
      hLibraryJSON[HIGHLIGHTER_SETS_KEY] = sharedHighlighterSets;

      dialogTemplate.hLibrary = hLibraryJSON;
      dialogTemplate.additionalText = '(To disable this auto-scan feature, go to "Add-ons" > "Settings")';

      const dialog = dialogTemplate.evaluate();
      dialog.setWidth(500)
        .setHeight(300);

      DocumentApp.getUi()
        .showModalDialog(dialog, 'Highlighter Library Exporter');
    }
  }
}