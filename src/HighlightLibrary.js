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

/**
 * Loads the user's highlighter library stored in user properties.
 * Returns a HighlighterLibrary object.
 */
var loadHighlighterLibrary = function () {
  const userProps = PropertiesService.getUserProperties();
  const libraryJSONStr = userProps.getProperty(LIBRARY_KEY);
  const libraryJSON = JSON.parse(libraryJSONStr);

  const hLibrary = new HighlighterLibrary();

  hLibrary.currentSetIndex = libraryJSON.currentSetIndex;
  libraryJSON.highlighterSets.forEach(function (highlighterSet) {
    hLibrary.highlighterSets.push(new HighlighterSet(
      highlighterSet.setName,
      highlighterSet.highlighters
    ));
  });

  return hLibrary;
};


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
    return {
      label: this.label,
      color: this.color
    };
  };
}


/**
 * @param {String} setName
 */
function HighlighterSet (setName, highlightersJSON) {
  if (highlightersJSON === undefined) {
    highlightersJSON = [];
  }

  this.setName = setName;
  const highlighters = [];
  highlightersJSON.forEach(function (highlighter) {
    highlighters.push(new Highlighter(highlighter.label, highlighter.color));
  });
  this.highlighters = highlighters;


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

    return {
      setName: this.setName,
      highlighters: highlightersListJSON
    };
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

    return {
      currentSetIndex: this.currentSetIndex,
      highlighterSets: highlighterSetsJSON
    };
  };

  /**
   * Saves the library into user properties.
   */
  this.save = function () {
    const userProps = PropertiesService.getUserProperties();
    userProps.setProperty(LIBRARY_KEY, JSON.stringify(this.toJSON()));
  };
}
