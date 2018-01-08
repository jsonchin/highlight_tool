var H1COLOR = '#23f02f';
var H2COLOR = '#e34242';
var H1LABEL = 'label_name1';
var H2LABEL = 'label_name2';
var SET1NAME = 'set_name1';
var SET2NAME = 'set_name2';

function runTests() {
  testIsHighlighterEqualSameNumDiffHighlighters();
  testIsHighlighterEqualSameNumDiffHighlightersReversedSets();
  testIsHighlighterEqualDiffNum();
  testIsHighlighterEqualPositive();
  testIsHighlighterEqualPositiveDiffOrder();
  Logger.log('Tests successful.');
}

function testIsHighlighterEqualSameNumDiffHighlighters() {
  const h1 = new Highlighter(H1LABEL, H1COLOR);
  const h2 = new Highlighter(H2LABEL, H2COLOR);
  const hSet1 = new HighlighterSet(SET1NAME, [], false);
  hSet1.addHighlighter(h1);
  hSet1.addHighlighter(h2);

  const hSet2 = new HighlighterSet(SET1NAME, [], false);
  hSet2.addHighlighter(h1);
  hSet2.addHighlighter(h1);

  assertFalse(isHighlighterSetsEqual(hSet1, hSet2), 'Highlighter Sets have different highlighters.');
}

function testIsHighlighterEqualSameNumDiffHighlightersReversedSets() {
  const h1 = new Highlighter(H1LABEL, H1COLOR);
  const h2 = new Highlighter(H2LABEL, H2COLOR);
  const hSet1 = new HighlighterSet(SET1NAME, [], false);
  hSet1.addHighlighter(h1);
  hSet1.addHighlighter(h1);

  const hSet2 = new HighlighterSet(SET1NAME, [], false);
  hSet2.addHighlighter(h2);
  hSet2.addHighlighter(h1);

  assertFalse(isHighlighterSetsEqual(hSet1, hSet2), 'Highlighter Sets have different highlighters.');
}

function testIsHighlighterEqualDiffNum() {
  const h1 = new Highlighter(H1LABEL, H1COLOR);
  const h2 = new Highlighter(H2LABEL, H2COLOR);
  const hSet1 = new HighlighterSet(SET1NAME, [], false);
  hSet1.addHighlighter(h1);
  hSet1.addHighlighter(h1);

  const hSet2 = new HighlighterSet(SET1NAME, [], false);
  hSet2.addHighlighter(h1);
  hSet2.addHighlighter(h1);
  hSet2.addHighlighter(h1);
  hSet2.addHighlighter(h1);

  assertFalse(isHighlighterSetsEqual(hSet1, hSet2), 'Highlighter sets have different number of highlighters.');
}

function testIsHighlighterEqualPositive() {
  const h1 = new Highlighter(H1LABEL, H1COLOR);
  const h2 = new Highlighter(H2LABEL, H2COLOR);
  const hSet1 = new HighlighterSet(SET1NAME, [], false);
  hSet1.addHighlighter(h1);
  hSet1.addHighlighter(h2);

  const hSet2 = new HighlighterSet(SET1NAME, [], false);
  hSet2.addHighlighter(h1);
  hSet2.addHighlighter(h2);

  assert(isHighlighterSetsEqual(hSet1, hSet2), 'Highlighter Sets are equal and in the same order.');
}

function testIsHighlighterEqualPositiveDiffOrder() {
  const h1 = new Highlighter(H1LABEL, H1COLOR);
  const h2 = new Highlighter(H2LABEL, H2COLOR);
  const hSet1 = new HighlighterSet(SET1NAME, [], false);
  hSet1.addHighlighter(h1);
  hSet1.addHighlighter(h2);

  const hSet2 = new HighlighterSet(SET1NAME, [], false);
  hSet2.addHighlighter(h2);
  hSet2.addHighlighter(h1);

  assert(isHighlighterSetsEqual(hSet1, hSet2), 'Highlighter Sets are equal and not in the same order but should be equal.');
}
