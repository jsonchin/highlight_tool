var SETTING_AUTO_IMPORT_KEY = 'settingAutoImport'; // 'true' or 'false' as keys
var SETTING_AUTO_IMPORT_TRUE = 'true';
var SETTING_AUTO_IMPORT_FALSE = 'false';

var SETTINGS_HTML_FILENAME = 'src/settings/Settings'

/**
 * Shows a dialog where the user can choose their settings.
 * Currently only:
 *  - autoImport
 */
function showSettingsDialog() {
  const dialogTemplate = HtmlService.createTemplateFromFile(SETTINGS_HTML_FILENAME);
  const userProps = PropertiesService.getUserProperties();

  // retrieve the settings from UserProperties and apply them to the scriplet
  const settings = {};
  settings[SETTING_AUTO_IMPORT_KEY] = userProps.getProperty(SETTING_AUTO_IMPORT_KEY) === SETTING_AUTO_IMPORT_TRUE;
  dialogTemplate.settings = settings;

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(300)
    .setHeight(80);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Settings');
}

/**
 * Saves the user's settings.
 * @param {Dictionary} inputSettings A dictionary of valid setting keys to value.
 */
function saveSettings(inputSettings) {
  const userProps = PropertiesService.getUserProperties();

  const settings = {};
  settings[SETTING_AUTO_IMPORT_KEY] = inputSettings[SETTING_AUTO_IMPORT_KEY] ?
    SETTING_AUTO_IMPORT_TRUE : SETTING_AUTO_IMPORT_FALSE;

  userProps.setProperties(settings);
}

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
      // get set names that exist in the library to mark the found sets as duplicate set names
      showFoundSharedHighlighterSetsDuplicateDialog('(To disable this auto-scan feature, go to "Add-ons" > "Settings")',
        sharedHighlighterSets);
    }
  }
}
