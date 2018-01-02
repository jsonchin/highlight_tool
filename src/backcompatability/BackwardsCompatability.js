var VERSION = '3.0.0';
var VERSION_KEY = 'version';

/**
 * Checks version and performs any actions that need to be done
 * across version changes.
 */
function checkVersion() {
  const userProperties = PropertiesService.getUserProperties();
  const appVersion = userProperties.getProperty(VERSION_KEY);
  // if version is not up to date, perform some sort of action
  if (appVersion === null || appVersion !== VERSION) {
    // in this case, if it's not 3.0.0 or greater, translate the library
    userProperties.setProperty(VERSION_KEY, VERSION);
    convertV2ToV3Library();
  }
}

/**
 * Converts v2 library to v3 library.
 */
function convertV2ToV3Library() {
  const hLibraryJSON = parsev2Library(PropertiesService.getUserProperties().getProperties());
  const hLibrary = makeHighlighterLibrary(hLibraryJSON);
  hLibrary.save();
}

/**
 * Parses the previous version of the tool's storage system and
 * returns HighlighterLibraryJSON format.
 * An example of the previous version's tool is listed in the corresponding test file.
 */
function parsev2Library(v2HighlighterLibrary) {
  const numSets = parseInt(v2HighlighterLibrary['setN']);

  const highlighterSets = [];
  const isMinimized = false;
  for (var i = 0; i < numSets; i += 1) {
    var setStr = 'set' + i;
    try {
      var numHighlighters = parseInt(v2HighlighterLibrary[setStr + 'N']);

      var highlighters = [];
      for (var j = 0; j < numHighlighters; j += 1) {
        try {
          var label = v2HighlighterLibrary[setStr + 'label' + j].trim();
          var color = v2HighlighterLibrary[setStr + 'color' + j].trim();
          var highlighter = {};
          highlighter[LABEL_KEY] = label;
          highlighter[COLOR_KEY] = color;
          highlighters.push(highlighter);
        } catch (error) {
          Logger.log(error);
        }
      }

      var setName = v2HighlighterLibrary[setStr].trim();
      var highlighterSet = {};
      highlighterSet[SET_NAME_KEY] = setName;
      highlighterSet[IS_SET_MINIMIZED_KEY] = isMinimized;
      highlighterSet[HIGHLIGHTERS_KEY] = highlighters;

      highlighterSets.push(highlighterSet);
    } catch (error) {
      Logger.log(error);
    }
  }

  const hLibraryJSON = {};
  hLibraryJSON[CURRENT_SET_INDEX_KEY] = 0;
  hLibraryJSON[HIGHLIGHTER_SETS_KEY] = highlighterSets;

  return hLibraryJSON;
}
