/**
 * @param {String} label
 * @param {String} color (in #RGB format, ex. "#3f0f10")
 */
const Highlighter = function (label, color) {
  this.label = label;
  this.color = color;
};


/**
 * @param {String} setName
 */
const HighlighterSet = function (setName, highlightersJSON) {
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
    if (!(highlighter instanceof Highlighter)) {
      throw 'HighlighterSet::addHighlighter expected a Highlighter object.';
    }

    this.highlighters.push(highlighter);
  };


  /**
     * Removes a highlighter at the given index from the HighlighterSet.
     * @param {int} index
     */
  this.removeHighlighter = function (index) {
    if (index >= this.highlighters.length) {
      throw 'HighlighterSet::removeHighlighter index greater than highlighters length.';
    }

    this.highlighters.splice(index, 1);
  };
};


/**
 * A factory method to create a highlighter library from json.
 * @param {String} libraryJSONStr Represents the jsonified string of a library.
 */
const HighlighterLibrary = function () {
  this.highlighterSets = [];
  this.currentSetIndex = 0;

  /**
     * Adds a highlighter set to the library.
     * @param {HighlighterSet} highlighterSet
     */
  this.addHighlighterSet = function (highlighterSet) {
    if (!(highlighterSet instanceof HighlighterSet)) {
      throw 'HighlighterLibrary::addHighlighterSet expected a HighlighterSet object.';
    }

    this.highlighterSets.push(highlighterSet);
  };

  /**
     * Removes a HighlighterSet at the given index from the HighlighterLibrary.
     * @param {int} index
     */
  this.removeHighlighterSet = function (index) {
    if (index >= this.highlighterSets.length) {
      throw 'HighlighterLibrary::removeHighlighterSet index greater than highlighters length.';
    }

    this.highlighterSets.splice(index, 1);
  };
};

const makeHighlighterLibrary = function (libraryJSONStr) {
  const hLibrary = new HighlighterLibrary();

  hLibrary.currentSetIndex = libraryJSONStr.currentSetIndex;
  libraryJSONStr.highlighterSets.forEach(function (highlighterSet) {
    hLibrary.highlighterSets.push(new HighlighterSet(
      highlighterSet.setName,
      highlighterSet.highlighters
    ));
  });

  return hLibrary;
};
