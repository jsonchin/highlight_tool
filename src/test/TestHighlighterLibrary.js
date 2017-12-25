var H1COLOR = '#23f02f';
var H2COLOR = '#e34242';
var H1LABEL = 'label_name2';
var H2LABEL = 'label_name1';
var SET1NAME = 'set_name';


function runTests() {
  testLibraryInit();
  testLibraryRetrieve();
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


// try {
//   hLib.removeHighlighterSet(2);
// } catch (error) {
//   return;
// }

// throw {
//   'name': 'TestError',
//   'message': 'HighlighterLibrary::removeHighlighterSet did not fail for index out of bounds.'
// };
