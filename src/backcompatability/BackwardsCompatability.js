/**
 * Parses the previous version of the tool's storage system and
 * returns HighlighterLibraryJSON format.
 * An example of the previous version's tool is listed below.
 */
function parsev2Library() {
  const userProps = PropertiesService.getUserProperties().getProperties();
  const numSets = parseInt(userProps['setN']);

  const highlighterSets = [];
  const isMinimized = false;
  for (var i = 0; i < numSets; i += 1) {
    var setStr = 'set' + i;
    var numHighlighters = parseInt(userProps[setStr + 'N']);

    var highlighters = [];
    for (var j = 0; j < numHighlighters; j += 1) {
      var label = userProps[setStr + 'label' + j];
      var color = userProps[setStr + 'color' + j];
      var highlighter = {};
      highlighter[LABEL_KEY] = label;
      highlighter[COLOR_KEY] = color;
      highlighters.push(highlighter);
    }

    var setName = userProps[setStr];
    var highlighterSet = {};
    highlighterSet[SET_NAME_KEY] = setName;
    highlighterSet[IS_SET_MINIMIZED_KEY] = isMinimized;
    highlighterSet[HIGHLIGHTERS_KEY] = highlighters;

    highlighterSets.push(highlighterSet);
  }

  const hLibraryJSON = {};
  hLibraryJSON[CURRENT_SET_INDEX_KEY] = 0;
  hLibraryJSON[HIGHLIGHTER_SETS_KEY] = highlighterSets;

  return hLibraryJSON;
}
/**
{
   "set2label1":"Background Essay",
   "set2label0":"   Thesis",
   "set2color0":"#ffa6ff",
   "set2color1":"#ffff00",
   "set2label3":"Citation",
   "set2label2":"Evidence",
   "set2color2":"#00ff00",
   "set0N":"4.0",
   "set5label0":"pink",
   "set5label1":"teal",
   "set5label2":"_",
   "setN":"6.0",
   "set1N":"2.0",
   "set2label5":"Topic Sentence/Subclaim",
   "set2label4":"Argument",
   "set5N":"3.0",
   "set3color2":"#00d5ff",
   "set3color3":"#00ecff",
   "set3":"qqqqqq",
   "set3label3":"e",
   "set2":"DBQ",
   "set5":"debugme",
   "set4":"DefaultSetName",
   "set1color0":"#45817d",
   "set1color1":"#c3ff00",
   "set4color0":"#5aae51",
   "set3label0":"  numero",
   "set1":"Economics",
   "set2N":"6.0",
   "set3label1":"c",
   "set0":"History",
   "set3label2":"d",
   "set4color1":"#fcf503",
   "set4color2":"#ff0000",
   "set0label1":"Political",
   "set4label2":"Commentary",
   "set4color3":"#5686a9",
   "set0label0":"Military",
   "set4label3":"Conclusion",
   "set0label3":"Economic",
   "set0label2":"Social",
   "set0color3":"#00ceff",
   "set0color2":"#92e6c2",
   "set0color1":"#faff95",
   "set0color0":"#ff9a00",
   "set4label0":"Thesis",
   "set4label1":"Evidence",
   "set3N":"4.0",
   "set3color0":"#0079ff",
   "set3color1":"#00beff",
   "selectedSet":"4",
   "set1label1":"Stocks",
   "set1label0":"Downturn",
   "set5color2":"#ff0000",
   "set5color0":"#fec2f2",
   "set5color1":"#96e9e9",
   "set4N":"4.0",
   "set2color3":"#0000ff",
   "set2color4":"#a400a4",
   "set2color5":"#ff8000"
}
 */
