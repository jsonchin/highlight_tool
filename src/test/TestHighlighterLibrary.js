var H1COLOR = '#23f02f';
var H2COLOR = '#e34242';
var H1LABEL = 'label_name2';
var H2LABEL = 'label_name1';
var SET1NAME = 'set_name';


function runTests() {
  testLibraryInit();
  testLibraryRetrieve();
  testLibraryRemoveSet();
  testLibraryRemoveSetNegative();
  testSetRemoveHighlighter();
  testSetRemoveHighlighterNegative();
  Logger.log('Tests successful');
}

function testLibraryInit() {
  const h1 = new Highlighter(H1LABEL, H1COLOR);
  const h2 = new Highlighter(H2LABEL, H2COLOR);
  const hSet = new HighlighterSet(SET1NAME, []);
  hSet.addHighlighter(h1);
  hSet.addHighlighter(h2);
  const hLib = new HighlighterLibrary();
  hLib.addHighlighterSet(hSet);

  hLib.save();
}

function testLibraryRetrieve() {
  const hLib = loadHighlighterLibrary();
  assertEquals(hLib.highlighterSets.length, 1, 'Number of sets do not match.');
  const hSet = hLib.highlighterSets[0];
  assertEquals(hSet.setName, SET1NAME, 'Set names do not match.');
  assertEquals(hSet.highlighters.length, 2, 'Number of highlighters do not match.');
  const h1 = hSet.highlighters[0];
  assertEquals(h1.color, H1COLOR, 'Highlighter1 color does not match.');
  assertEquals(h1.label, H1LABEL, 'Highlighter1 label does not match.');
  const h2 = hSet.highlighters[1];
  assertEquals(h2.color, H2COLOR, 'Highlighter2 color does not match');
  assertEquals(h2.label, H2LABEL, 'Highlighter2 label does not match.');
}

function testLibraryRemoveSet() {
  const hLib = loadHighlighterLibrary();
  hLib.removeHighlighterSet(hLib.highlighterSets.length - 1); // valid index
}

function testLibraryRemoveSetNegative() {
  const hLib = loadHighlighterLibrary();
  var e = null;
  try {
    hLib.removeHighlighterSet(hLib.highlighterSets.length); // invalid index
  } catch (error) {
    e = error;
  }
  assert(e, 'HighlighterLibrary:removeHighlighterSet invalid argument did not error,');
}

function testSetRemoveHighlighter() {
  const hLib = loadHighlighterLibrary();
  const hSet = hLib.highlighterSets[0];
  hSet.removeHighlighter(hSet.highlighters.length - 1);
}

function testSetRemoveHighlighterNegative() {
  const hLib = loadHighlighterLibrary();
  const hSet = hLib.highlighterSets[0];

  var e = null;
  try {
    hSet.removeHighlighter(hSet.highlighters.length); // invalid index
  } catch (error) {
    e = error;
  }
  assert(e, 'HighlighterSet:removeHighlighter invalid argument did not error,');
}
