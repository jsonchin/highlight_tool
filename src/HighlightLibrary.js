class HighlighterLibrary {
    constructor() {
        this.highlighterSets = [];
        this.currentSetIndex = 0;
    }

    /**
     * A factory method to create a highlighter library from json.
     * @param {String} libraryJSONStr Represents the jsonified string of a library.
     */
    makeHighlighterLibrary(libraryJSONStr) {
        const hLibrary = new HighlighterLibrary();

        hLibrary.currentSetIndex = libraryJSONStr.currentSetIndex;
        libraryJSONStr.highlighterSets.forEach((highlighterSet) => {
            hLibrary.highlighterSets.push(new HighlighterSet(
                highlighterSet.setName,
                highlighterSet.highlighters
            ));
        });
        
        return hLibrary;
    }

    /**
     * Adds a highlighter set to the library.
     * @param {HighlighterSet} highlighterSet 
     */
    addHighlighterSet(highlighterSet) {
        if (!(highlighterSet instanceof HighlighterSet)) {
            throw 'HighlighterLibrary::addHighlighterSet expected a HighlighterSet object.'
        }

        this.highlighterSets.push(highlighterSet);
    }
    
    /**
     * Removes a HighlighterSet at the given index from the HighlighterLibrary.
     * @param {int} index
     */
    removeHighlighterSet(index) {
        if (index >= this.highlighterSets.length) {
            throw 'HighlighterLibrary::removeHighlighterSet index greater than highlighters length.'
        }

        this.highlighterSets.splice(index, 1);
    }
}

class HighlighterSet {
    
    /**
     * @param {String} setName 
     */
    constructor(setName, highlightersJSON = []) {
        this.setName = setName;
        this.highlighters = [];

        highlightersJSON.forEach((highlighter) => {
            this.highlighters.push(new Highlighter(
                highlighter.label,
                highlighter.setName
            ));
        });
    }


    /**
     * Adds a highlighter to the set.
     * @param {Highlighter} highlighter 
     */
    addHighlighter(highlighter) {
        if (!(highlighter instanceof Highlighter)) {
            throw 'HighlighterSet::addHighlighter expected a Highlighter object.'
        }

        this.highlighters.push(highlighter);
    }


    /**
     * Removes a highlighter at the given index from the HighlighterSet.
     * @param {int} index 
     */
    removeHighlighter(index) {
        if (index >= this.highlighters.length) {
            throw 'HighlighterSet::removeHighlighter index greater than highlighters length.'
        }

        this.highlighters.splice(index, 1);
    }

}

class Highlighter {

    /**
     * @param {String} label 
     * @param {String} color (in #RGB format, ex. "#3f0f10")
     */
    constructor(label, color) {
        this.label = label;
        this.color = color;
    }
}