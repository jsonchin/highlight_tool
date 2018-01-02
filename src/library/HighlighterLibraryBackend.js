var AssertionError = function (msg) {
  this.name = 'AssertionError';
  this.message = msg;
};

var assert = function (bool, msg) {
  if (!bool) {
    throw new AssertionError(msg);
  }
};

var assertEquals = function (predicate, truth, msg) {
  assert(predicate === truth, msg);
};

var LIBRARY_KEY = 'library';
var LABEL_KEY = 'label';
var COLOR_KEY = 'color';
var SET_NAME_KEY = 'setName';
var IS_SET_MINIMIZED_KEY = 'isSetMinimized';
var HIGHLIGHTERS_KEY = 'highlighters';
var CURRENT_SET_INDEX_KEY = 'currentSetIndex';
var HIGHLIGHTER_SETS_KEY = 'highlighterSets';


/**
 * Creates a highlighter library from the provided json.
 * @param {json} libraryJSON Must be in the correct library json format.
 */
var makeHighlighterLibrary = function makeHighlighterLibraryFromJSON(libraryJSON) {
  const hLibrary = new HighlighterLibrary();

  hLibrary.currentSetIndex = libraryJSON.currentSetIndex;
  libraryJSON.highlighterSets.forEach(function (highlighterSet) {
    hLibrary.highlighterSets.push(new HighlighterSet(
      highlighterSet.setName,
      highlighterSet.highlighters,
      highlighterSet.isSetMinimized
    ));
  });

  return hLibrary;
};

/**
 * Returns the current HighlighterSet or null if there are no HighlighterSets.
 */
var loadCurrentHighlighterSet = function () {
  const hLibrary = loadHighlighterLibrary();
  const highlighterSets = hLibrary.highlighterSets;
  if (highlighterSets.length !== 0) {
    return highlighterSets[hLibrary.currentSetIndex];
  }
  return null;
};

/**
 * Loads the user's highlighter library stored in user properties.
 * Returns a HighlighterLibrary object.
 */
var loadHighlighterLibrary = function () {
  const libraryJSON = loadHighlighterLibraryJSON();
  return makeHighlighterLibrary(libraryJSON);
};

function loadHighlighterLibraryJSON() {
  const userProps = PropertiesService.getUserProperties();
  const libraryJSONStr = userProps.getProperty(LIBRARY_KEY);
  const libraryJSON = JSON.parse(libraryJSONStr);

  return libraryJSON;
}

function logLibrary() {
  Logger.log(loadHighlighterLibraryJSON());
}


function showHighlighterLibraryDialog() {
  const dialogTemplate = HtmlService.createTemplateFromFile('HighlighterLibrary');

  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(450)
    .setHeight(600);

  DocumentApp.getUi()
    .showModalDialog(dialog, 'Highlighter Library');
}

function saveHighlighterLibraryFromDialog(libraryJSON) {
  const hLibrary = makeHighlighterLibrary(libraryJSON);
  hLibrary.save();

  showSidebar();
}


/**
 * @param {String} label
 * @param {String} color (in #RGB format, ex. "#3f0f10")
 */
function Highlighter (label, color) {
  this.label = label;
  this.color = color;

  this.setLabel = function (newLabel) {
    this.label = newLabel;
  };

  this.setColor = function (newColor) {
    this.color = newColor;
  };

  this.toJSON = function () {
    const json = {};
    json[LABEL_KEY] = this.label;
    json[COLOR_KEY] = this.color;

    return json;
  };
}


/**
 * @param {String} setName
 */
function HighlighterSet (setName, highlightersJSON, isSetMinimized) {
  if (highlightersJSON === undefined) {
    highlightersJSON = [];
  }

  this.setName = setName;
  const highlighters = [];
  highlightersJSON.forEach(function (highlighter) {
    highlighters.push(new Highlighter(highlighter.label, highlighter.color));
  });
  this.highlighters = highlighters;
  this.isSetMinimized = isSetMinimized;


  /**
   * Adds a highlighter to the set.
   * @param {Highlighter} highlighter
   */
  this.addHighlighter = function (highlighter) {
    assert(highlighter instanceof Highlighter, 'HighlighterSet::addHighlighter expected a Highlighter object.');

    this.highlighters.push(highlighter);
  };


  /**
   * Removes a highlighter at the given index from the HighlighterSet.
   * @param {int} index
   */
  this.removeHighlighter = function (index) {
    assert(index < this.highlighters.length, 'HighlighterSet::removeHighlighter index greater than highlighters length.');

    this.highlighters.splice(index, 1);
  };


  this.toJSON = function () {
    const highlightersListJSON = [];
    this.highlighters.forEach(function (highlighter) {
      highlightersListJSON.push(highlighter.toJSON());
    });

    const json = {};
    json[SET_NAME_KEY] = this.setName;
    json[HIGHLIGHTERS_KEY] = highlightersListJSON;
    json[IS_SET_MINIMIZED_KEY] = isSetMinimized;
    return json;
  };
}


/**
 * A factory method to create a highlighter library from json.
 * @param {String} libraryJSONStr Represents the jsonified string of a library.
 */
function HighlighterLibrary () {
  this.highlighterSets = [];
  this.currentSetIndex = 0;

  /**
   * Adds a highlighter set to the library.
   * @param {HighlighterSet} highlighterSet
   */
  this.addHighlighterSet = function (highlighterSet) {
    assert(highlighterSet instanceof HighlighterSet, 'HighlighterLibrary::addHighlighterSet expected a HighlighterSet object.');

    this.highlighterSets.push(highlighterSet);
  };

  /**
   * Removes a HighlighterSet at the given index from the HighlighterLibrary.
   * @param {int} index
   */
  this.removeHighlighterSet = function (index) {
    assert(index < this.highlighterSets.length, 'HighlighterLibrary::removeHighlighterSet index greater than highlighters length.');
   
    this.highlighterSets.splice(index, 1);
  };

  this.toJSON = function () {
    const highlighterSetsJSON = [];
    this.highlighterSets.forEach(function (highlighterSet) {
      highlighterSetsJSON.push(highlighterSet.toJSON());
    });

    const json = {};
    json[CURRENT_SET_INDEX_KEY] = this.currentSetIndex;
    json[HIGHLIGHTER_SETS_KEY] = highlighterSetsJSON;
    return json;
  };

  /**
   * Saves the library into user properties.
   */
  this.save = function () {
    const userProps = PropertiesService.getUserProperties();
    userProps.setProperty(LIBRARY_KEY, JSON.stringify(this.toJSON()));
  };
}
