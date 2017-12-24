var AssertionError = function (msg) {
  this.name = 'AssertionError';
  this.message = msg;
};

var assert = function (bool, msg) {
  if (!bool) {
    throw new AssertionError(msg);
  }
};

var LIBRARY_KEY = 'library';


/**
 * @param {String} label
 * @param {String} color (in #RGB format, ex. "#3f0f10")
 */
var Highlighter = function (label, color) {
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
};


/**
 * @param {String} setName
 */
var HighlighterSet = function (setName, highlightersJSON) {
  if (highlightersJSON === undefined) {
    highlightersJSON = [];
  }

  this.setName = setName;
  this.highlighters = [];

  highlightersJSON.forEach(function (highlighter) {
    this.highlighters.push(new Highlighter(
      highlighter.label,
      highlighter.setName
    ));
  });


  /**
     * Adds a highlighter to the set.
     * @param {Highlighter} highlighter
     */
  this.addHighlighter = function (highlighter) {
    assert(!(highlighter instanceof Highlighter), 'HighlighterSet::addHighlighter expected a Highlighter object.');

    this.highlighters.push(highlighter);
  };


  /**
     * Removes a highlighter at the given index from the HighlighterSet.
     * @param {int} index
     */
  this.removeHighlighter = function (index) {
    assert((index >= this.highlighters.length), 'HighlighterSet::removeHighlighter index greater than highlighters length.');

    this.highlighters.splice(index, 1);
  };


  this.toJSON = function () {
    return {
      setName: this.setName,
      highlighters: this.highlighters.forEach(function (highlighter) {
        return highlighter.toJSON();
      })
    };
  };
};


/**
 * A factory method to create a highlighter library from json.
 * @param {String} libraryJSONStr Represents the jsonified string of a library.
 */
var HighlighterLibrary = function () {
  this.highlighterSets = [];
  this.currentSetIndex = 0;

  /**
     * Adds a highlighter set to the library.
     * @param {HighlighterSet} highlighterSet
     */
  this.addHighlighterSet = function (highlighterSet) {
    assert(!(highlighterSet instanceof HighlighterSet), 'HighlighterLibrary::addHighlighterSet expected a HighlighterSet object.');

    this.highlighterSets.push(highlighterSet);
  };

  /**
     * Removes a HighlighterSet at the given index from the HighlighterLibrary.
     * @param {int} index
     */
  this.removeHighlighterSet = function (index) {
    assert(index >= this.highlighterSets.length, 'HighlighterLibrary::removeHighlighterSet index greater than highlighters length.');
   
    this.highlighterSets.splice(index, 1);
  };

  this.toJSON = function () {
    return {
      currentSetIndex: this.currentSetIndex,
      highlighterSets: this.highlighterSets.forEach(function (highlighterSet) {
        return highlighterSet.toJSON();
      })
    }
  };

  this.save = function () {
    const userProps = PropertiesService.getUserProperties();
    userProps.setProperty(LIBRARY_KEY, JSON.stringify(this.toJSON()));
  };
};

var makeHighlighterLibrary = function (libraryJSON) {
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

var loadHighlighterLibrary = function () {
  const userProps = PropertiesService.getUserProperties();
  const libraryJSONStr = userProps.getProperty(LIBRARY_KEY);
  const libraryJSON = JSON.parse(libraryJSONStr);

  return makeHighlighterLibrary(libraryJSON);
};
